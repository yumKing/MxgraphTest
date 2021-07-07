<template>
  <div class="process">
    <!-- <h1>流程画布</h1>
    <div class="title">
      {{ title }}
      <el-button type="primary" @click="showNodeInfo()">展示结点信息</el-button>
      <el-button type="primary" @click="saveNodeInfo()">保存结点信息</el-button>
    </div> -->
    <div ref="graphContainer" class="graph"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref, onBeforeMount, getCurrentInstance, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { Types } from '@/store/modules/type';

import mi, { createGraph, createNode, createRelation, graphConstants, Graph } from '@/views/mxgraph/util/mxgraph';
import * as mx from 'mxgraph';
import * as rx from 'rxjs';
import * as op from 'rxjs/operators';

import ProcessApi from '@/api/process';
import { NodeInfo, RelationInfo } from '@/views/mxgraph/model/node.model';

import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'Process',

  setup() {
    console.log('create Process');
    const graphContainer = ref<Element>();

    const title = ref('话术流程图');
    let graph: Graph = {} as Graph;

    // 结点信息
    const nodesList = ref<{ [id: string]: NodeInfo }>({});
    // 关系信息
    const nodeRelations = ref<{ [id: string]: RelationInfo }>({});
    const graphNodes = ref<Array<mx.mxCell>>([]);
    const graphRelations = ref<Array<mx.mxCell>>([]);

    let refNode = ref<mx.mxCell | null>(null);

    // 判断路由过来是否有参数，有则说明是加载已有的画布，否则是新的画布
    // 有参数则调用获取画布数据接口，返回节点和节点关系信息数据，并将节点绘制在画布中
    // 无参数，则在空白画布上创建一个空白的节点
    // const cc = getCurrentInstance();
    // console.log('当前实例: ', cc);
    // 获取store
    const store = useStore();
    // 获取路由信息
    // const route = useRoute();
    // let rp = route.params;

    // onBeforeRouteUpdate((guard) => {
    //   console.log('路由发生变化', guard);

    //   rp = guard.params;
    //   clearNodes();
    //   getData(true);
    // });
    let processId = 0;
    onMounted(() => {
      getData();
    });

    onBeforeUnmount(() => {
      // 重置 vuex
      store.dispatch(Types.SET_PROCESS_DETAIL, 0);

      console.log('destroy MyFlow');
    });

    const getData = () => {
      rx.of(processId)
        .pipe(
          op.map((p) => {
            if (p == 0) {
              initGraph();
              defaultCanvas();
              return false;
            } else {
              clearNodes();
              return true;
            }
          }),
          op.filter((x) => x),
          op.take(1),
          op.switchMap(() => ProcessApi.getProcessDetail({ id: processId })),
          op.catchError((err) => rx.of('error')),
          op.map<any, any>((res) => res.data),
          op.tap((data) => {
            nodesList.value = data.nodes;
            nodeRelations.value = data.nodeRels;
            dataInit();
          })
        )
        .subscribe();
    };

    const initGraph = () => {
      if (!mi.mxClient.isBrowserSupported()) {
        mi.mxUtils.error('Browser is not supported!', 200, false);
      } else {
        const container = graphContainer.value as HTMLElement;
        // const xmlDoc = mi.mxUtils.createXmlDocument()
        // const sourceNode = xmlDoc.createElement("Source");

        graph = createGraph(container);

        // 添加一个连结监听器，监听到连接的节点和边的信息
        graph.connectionHandler.addListener(mi.mxEvent.CONNECT, (sender, evt) => {
          const edge = evt.getProperty('cell');
          edge.setValue(graphConstants.defaultIntent);
          const source = graph.getModel().getTerminal(edge, true);
          const target = graph.getModel().getTerminal(edge, false);

          // 判断target的内容是否为空，为空则设置为下面的提示，否则不修改
          if (target.getValue() === graphConstants.defaultPrologue) {
            target.setValue(graphConstants.defaultQuestion);
          }
          // const edgeStyle = graph.getCellStyle(edge);
          nodesList.value[target.getId()] = {
            id: target.getId(),
            xpos: target.getGeometry().x,
            ypos: target.getGeometry().y,
            content: target.getValue(),
            soundRecordable: false,
            hasVariable: false,
            isNew: true,
          };
          nodeRelations.value[edge.getId()] = {
            id: edge.getId(),
            sourceId: source.getId().slice(4),
            targetId: target.getId(),
            intentId: edge.getValue(),
            isNew: true,
          };

          target.setId('node' + target.getId());

          target.collapsed = true;
          edge.setId('rel' + edge.getId());
          graphNodes.value.push(target);
          graphRelations.value.push(edge);
        });

        const originValueCC = graph.model.valueForCellChanged;
        const originStyleCC = graph.model.styleForCellChanged;
        const originTerminalCC = graph.model.terminalForCellChanged;
        const originGeoCC = graph.model.geometryForCellChanged;
        const originVisibleSCC = graph.model.visibleStateForCellChanged;
        graph.model.valueForCellChanged = function (cell, value) {
          console.log(cell.getValue(), value);
          originValueCC.call(this, cell, value);

          if (cell.edge) {
            // 是边
            const selectedRel = nodeRelations.value[cell.getId().slice(3)];
            selectedRel.intentId = cell.getValue();
          } else {
            // 是结点
            const selectedNode = nodesList.value[cell.getId().slice(4)];
            selectedNode.content = cell.getValue();
          }
        };
        graph.model.geometryForCellChanged = function (cell, geo) {
          const geos = originGeoCC.call(this, cell, geo);
          if (cell.vertex) {
            // 是结点
            const selectedNode = nodesList.value[cell.getId().slice(4)];
            selectedNode.xpos = cell.getGeometry().x;
            selectedNode.ypos = cell.getGeometry().y;
          }
          return geos;
        };

        graph.getSelectionModel().addListener(mi.mxEvent.CHANGE, (sender, evt) => {
          if (sender.cells && sender.cells.length == 1 && sender.cells[0]) {
            const temp = (refNode.value = sender.cells[0]);
            if (temp.isVertex()) {
              store.dispatch(Types.SHOW_NODE, { nodeId: temp.getId(), content: nodesList.value[temp.getId().slice(4)].content });
            } else {
              store.dispatch(Types.SHOW_REL, { nodeId: temp.getId(), intentId: nodeRelations.value[temp.getId().slice(3)].intentId });
            }
          } else {
            store.dispatch(Types.SHOW_GLOBAL, { globalData: '全局数据' });
          }
        });

        // 添加放大缩小
        // var btn1 = mi.mxUtils.button('+', function()
        // {
        // 	graph.zoomIn();
        // });
        // btn1.setAttribute("style", "margin-left: 20px")
        // // btn1.style.marginLeft = '20px';
        // document.body.appendChild(btn1);
        // document.body.appendChild(mi.mxUtils.button('-', function()
        // {
        // 	graph.zoomOut();
        // }));
      }
    };

    const dataInit = () => {
      // 将获取的结点和边初始化
      for (let key in nodesList.value) {
        graphNodes.value.push(createNode(graph, nodesList.value[key]));
      }

      for (let key in nodeRelations.value) {
        graphRelations.value.push(createRelation(graph, nodeRelations.value[key]));
      }

      // rx.of(nodesList.value).pipe(

      //   op.tap( nodes => {

      //   })
      // ).subscribe();
    };

    const defaultCanvas = () => {
      const parent = graph.getDefaultParent();
      graph.getModel().beginUpdate();
      try {
        const date = new Date();
        // 初始化时 就得添加一个结点，并返回id设置到结点id中
        const v1 = graph.insertVertex(parent, null, graphConstants.defaultPrologue, 400, 20, graphConstants.vertexWidth, graphConstants.vertexHeight);
        // v1.geometry.alternateBounds = new mi.mxRectangle(
        //   0,
        //   0,
        //   graphConstants.vertexWidth,
        //   graphConstants.vertexHeight
        // );
        // 这里的id是不含有node开头，所以可以作为辨别

        nodesList.value[v1.getId()] = {
          id: v1.getId(),
          xpos: v1.getGeometry().x,
          ypos: v1.getGeometry().y,
          content: v1.getValue(),
          soundRecordable: false,
          hasVariable: false,
          isNew: true,
        };

        v1.setId('node' + v1.getId());
        graphNodes.value.push(v1);
      } finally {
        graph.getModel().endUpdate();
      }
    };

    const clearNodes = () => {
      graph.removeCells(graphNodes.value, true);
      nodesList.value = {};
      graphNodes.value = [];
    };

    // vuex 创建
    watch(
      () => store.getters.processCreate,
      (cur, pre) => {
        clearNodes();
        defaultCanvas();

        // 重置 vuex
        store.dispatch(Types.SET_PROCESS_DETAIL, 0);
      }
    );

    // 监听流程详情
    watch(
      () => store.getters.processId,
      (cur, pre) => {
        // 查询流程详情
        processId = cur;
        getData();
      }
    );

    // vuex 监听保存
    watch(
      () => store.getters.processSave,
      (cur, pre) => {
        // 保存操作开始
        // 防止没有停止编辑导致直接保存
        if (graph.isEditing()) {
          graph.stopEditing(false);
        }
        console.log('info: ', nodesList.value, nodeRelations.value);
        console.log('graph: ', graphNodes.value, graphRelations.value);

        const param: { nodes: Array<any>; nodeRels: Array<any> } = {
          nodes: [],
          nodeRels: [],
        };
        for (let k in nodesList.value) {
          param.nodes.push(nodesList.value[k]);
        }
        for (let k in nodeRelations.value) {
          param.nodeRels.push(nodeRelations.value[k]);
        }
        ProcessApi.saveProcessDetail(param)
          .pipe(
            op.tap(
              (res) => {
                console.log(res);
                ElMessage.success({
                  message: res.data.msg,
                  type: 'success',
                });
              },
              (err) => console.log(err)
            ),
            op.catchError((err) => {
              console.log(err);
              return rx.of('err');
            })
          )
          .subscribe();
      }
    );
    watch(
      () => store.getters.processPublish,
      (cur, pre) => {
        // 发布操作开始
      }
    );

    // 同步更新结点数据 结点关系数据
    watch(
      () => store.getters.nodeData,
      (cur, pre) => {
        if (cur.nodeId) {
          if (cur.nodeId.indexOf('node') > -1) {
            const nodeInfo = nodesList.value[cur.nodeId.slice(4)];
            nodeInfo.content = cur.content;

            const node = graphNodes.value.filter((n) => n.getId() === cur.nodeId).pop();
            node?.setValue(cur.content);
            graph.refresh();
          } else {
            const relInfo = nodeRelations.value[cur.nodeId.slice(3)];
            relInfo.intentId = cur.intentId;

            const rel = graphRelations.value.filter((n) => n.getId() === cur.nodeId).pop();
            rel?.setValue(cur.intentId);
            graph.refresh();
          }
        }
      }
    );

    return {
      graphContainer,
      title,
      nodesList,
      nodeRelations,
    };
  },
});
</script>

<style></style>
