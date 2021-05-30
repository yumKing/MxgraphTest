<template>
  <div class="graph-test">
    <div class="title">
      {{ title }}
      <div @click="showNodeInfo()">展示结点信息</div>
    </div>
    <div ref="graphContainer" class="graph"></div>
  </div>
</template>

<script lang="ts">
import mi, { createGraph } from './util/mxgraph';
import * as mx from 'mxgraph';

import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';

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
    const nodesList = ref<Array<any>>([]);
    // 关系信息
    const nodeRelation = ref<Array<any>>([]);

    // 判断是否地址有参数，有则说明是加载已有的画布，否则是新的画布
    // 有参数则调用获取画布数据接口，返回节点和节点关系信息数据，并将节点绘制在画布中
    // 无参数，则在空白画布上创建一个空白的节点

    // validate.html : 校验节点不能连接到已有的源上

    onMounted(() => {
      initContainer();
    });

    onBeforeUnmount(() => {
      console.log('destroy MyFlow');
    });

    const initContainer = () => {
      if (!mi.mxClient.isBrowserSupported()) {
        mi.mxUtils.error('Browser is not supported!', 200, false);
      } else {
        const container = graphContainer.value as HTMLElement;
        graph = createGraph(container);

        var parent = graph.getDefaultParent();
        graph.getModel().beginUpdate();
        try {
          var v1 = graph.insertVertex(
            parent,
            null,
            '你好，请问你是金先生吗?',
            400,
            20,
            180,
            30,
            'fillColor=white'
          );
          v1.collapsed = true;
          nodesList.value.push({
            id: v1.getId(),
            xpos: v1.getGeometry().x,
            ypos: v1.getGeometry().y,
            content: v1.getValue(),
            soundRecordable: false,
            hasVariable: false,
          });
        } finally {
          graph.getModel().endUpdate();
        }

        // 添加一个连结监听器，监听到连接的节点和边的信息
        graph.connectionHandler.addListener(
          mi.mxEvent.CONNECT,
          (sender, evt) => {
            const edge = evt.getProperty('cell');
            edge.setValue('请设置意图');
            const source = graph.getModel().getTerminal(edge, true);
            const target = graph.getModel().getTerminal(edge, false);
            target.collapsed = true;

            // 判断target的内容是否为空，为空则设置为下面的提示，否则不修改
            if (target.getValue() == null || target.getValue() === '') {
              target.setValue('请输入文本');
            }
            // const edgeStyle = graph.getCellStyle(edge);

            const targetNode = {
              id: target.getId(),
              xpos: target.getGeometry().x,
              ypos: target.getGeometry().y,
              content: target.getValue(),
              soundRecordable: false,
              hasVariable: false,
            };
            const relation = {
              sourceId: source.getId(),
              targetId: target.getId(),
              intent: edge.getValue(),
            };

            nodesList.value.push(targetNode);
            nodeRelation.value.push(relation);
          }
        );
      }
    };

    return {
      graphContainer,
      title,
      nodesList,
      nodeRelation,
    };
  },

  methods: {
    showNodeInfo() {
      console.log('info: ', this.nodesList, this.nodeRelation);
    },
  },
});
</script>

<style></style>
