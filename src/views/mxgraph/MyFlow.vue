<template>
  <div class="graph-test">
    <div class="title">
      {{ title }}
      <div @click="showNodeInfo()">展示结点信息</div>
      <div @click="saveNodeInfo()">保存结点信息</div>
    </div>
    <div ref="graphContainer" class="graph"></div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onBeforeUnmount,
  onMounted,
  ref,
  onBeforeMount,
  getCurrentInstance,
} from 'vue';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
import { useStore, mapState } from 'vuex';

import mi, {
  createGraph,
  createNode,
  createRelation,
  graphConstants,
} from './util/mxgraph';
import * as mx from 'mxgraph';
import * as rx from 'rxjs';
import * as op from 'rxjs/operators';

import TestApi from '@/api/test';
import { NodeInfo, RelationInfo } from './model/node.model';

export default defineComponent({
  name: 'MyFlow',

  // NOTE: this是定义函数的上线文，setup内部使用箭头函数注入的this 是 setup定义的this(void)
  // NOTE: 所以内部的函数重定义用到了this，需要使用function去定义
  setup() {
    console.log('create MyFlow');
    const graphContainer = ref<Element>();

    const title = ref('话术流程图');
    let graph: mx.mxGraph = {} as mx.mxGraph;

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
    const cc = getCurrentInstance();
    console.log('当前实例: ', cc);

    // 获取路由信息
    const route = useRoute();
    // const router = useRouter()
    // console.log("当前路由: ", route, "路由实例: ", router);
    console.log(
      'path: ',
      route.fullPath,
      'param: ',
      route.params,
      'query: ',
      route.query
    );
    // const flowId = route.params.id
    const flowId = route.query.id;

    onBeforeRouteUpdate((guard) => {
      console.log('路由发生变化', guard);
    });

    onMounted(() => {
      rx.of(flowId)
        .pipe(
          op.tap(() => initGraph()),
          op.map((fid) => {
            if (!fid) {
              defaultCanvas();
              return false;
            } else {
              return true;
            }
          }),
          op.filter((x) => x),
          op.take(1),
          op.switchMap(() => TestApi.getNodeInfoList(route.params)),
          op.catchError((err) => rx.of('error')),
          op.map<any, any>((res) => res.data),
          op.tap((data) => {
            nodesList.value = data.nodesList;

            // for (let key in nls) {
            //   nodesList.value[key] = ref<any>(nls[key]);
            // }

            nodeRelations.value = data.nodeRelations;
            // for (let key in nrl) {
            // nodeRelations.value[key] = ref<any>(nrl[key]);
            // }
            dataInit();
          })
        )
        .subscribe();
    });

    onBeforeUnmount(() => {
      console.log('destroy MyFlow');
    });

    const initGraph = () => {
      if (!mi.mxClient.isBrowserSupported()) {
        mi.mxUtils.error('Browser is not supported!', 200, false);
      } else {
        const container = graphContainer.value as HTMLElement;
        // const xmlDoc = mi.mxUtils.createXmlDocument()
        // const sourceNode = xmlDoc.createElement("Source");

        graph = createGraph(container);

        // 添加一个连结监听器，监听到连接的节点和边的信息
        graph.connectionHandler.addListener(
          mi.mxEvent.CONNECT,
          (sender, evt) => {
            const edge = evt.getProperty('cell');
            edge.setValue(graphConstants.defaultIntent);
            const source = graph.getModel().getTerminal(edge, true);
            const target = graph.getModel().getTerminal(edge, false);
            target.collapsed = true;
            edge.setId(source.getId() + '_' + target.getId());

            // 判断target的内容是否为空，为空则设置为下面的提示，否则不修改
            if (target.getValue() === graphConstants.defaultPrologue) {
              target.setValue(graphConstants.defaultQuestion);
            }
            // const edgeStyle = graph.getCellStyle(edge);

            graphNodes.value.push(target);
            graphRelations.value.push(edge);

            nodesList.value[target.getId()] = {
              id: target.getId(),
              xpos: target.getGeometry().x,
              ypos: target.getGeometry().y,
              content: target.getValue(),
              soundRecordable: false,
              hasVariable: false,
            };
            nodeRelations.value[edge.getId()] = {
              id: edge.getId(),
              sourceId: source.getId(),
              targetId: target.getId(),
              intent: edge.getValue(),
            };
          }
        );

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
            const selectedRel = nodeRelations.value[cell.getId()];
            selectedRel.intent = cell.getValue();
          } else {
            // 是结点
            const selectedNode = nodesList.value[cell.getId()];
            selectedNode.xpos = cell.getGeometry().x;
            selectedNode.ypos = cell.getGeometry().y;
            selectedNode.content = cell.getValue();
          }
        };
        graph.model.geometryForCellChanged = function (cell, geo) {
          const geos = originGeoCC.call(this, cell, geo);
          if (cell.vertex) {
            // 是结点
            const selectedNode = nodesList.value[cell.getId()];
            selectedNode.xpos = cell.getGeometry().x;
            selectedNode.ypos = cell.getGeometry().y;
          }
          return geos;
        };

        graph
          .getSelectionModel()
          .addListener(mi.mxEvent.CHANGE, (sender, evt) => {
            if (sender.cells && sender.cells[0]) {
              refNode.value = sender.cells[0];
              console.log('chage:', refNode.value);
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
        graphRelations.value.push(
          createRelation(graph, nodeRelations.value[key])
        );
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
        const v1 = graph.insertVertex(
          parent,
          null,
          graphConstants.defaultPrologue,
          400,
          20,
          graphConstants.vertexWidth,
          graphConstants.vertexHeight
        );
        // v1.geometry.alternateBounds = new mi.mxRectangle(
        //   0,
        //   0,
        //   graphConstants.vertexWidth,
        //   graphConstants.vertexHeight
        // );
        nodesList.value[v1.getId()] = {
          id: v1.getId(),
          xpos: v1.getGeometry().x,
          ypos: v1.getGeometry().y,
          content: v1.getValue(),
          soundRecordable: false,
          hasVariable: false,
        };

        graphNodes.value.push(v1);
      } finally {
        graph.getModel().endUpdate();
      }
    };

    const showNodeInfo = () => {
      // 防止没有停止编辑导致直接保存
      if (graph.isEditing()) {
        graph.stopEditing(false);
      }
      console.log('info: ', nodesList.value, nodeRelations.value);
    };
    const saveNodeInfo = () => {
      // 防止没有停止编辑导致直接保存
      if (graph.isEditing()) {
        graph.stopEditing(false);
      }
      console.log('graph: ', graphNodes.value, graphRelations.value);
    };
    return {
      graphContainer,
      title,
      nodesList,
      nodeRelations,
      graphNodes,
      graphRelations,
      showNodeInfo,
      saveNodeInfo,
    };
  },

  methods: {},
});
</script>

<style></style>
