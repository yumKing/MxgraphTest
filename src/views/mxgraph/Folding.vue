<template>
  <div class="graph-test">
    <div class="title">{{ title }}</div>
    <div ref="graphContainer" class="graph"></div>
  </div>
</template>

<script lang="ts">
import * as mx from 'mxgraph';
import mi from './util/mxgraph';

import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'Folding',
  setup() {
    console.log('create Folding');
    const graphContainer = ref<Element>();

    const title = ref('折叠');
    let graph: mx.mxGraph = {} as mx.mxGraph;

    onMounted(() => {
      initContainer();
    });

    onBeforeUnmount(() => {
      console.log('destroy Folding');
    });

    const initContainer = () => {
      if (!mi.mxClient.isBrowserSupported()) {
        mi.mxUtils.error('Browser is not supported!', 200, false);
      } else {
        const container = graphContainer.value as HTMLElement;
        mi.mxEvent.disableContextMenu(container);

        graph = new mi.mxGraph(container);

        // config graph
        // 清晰渲染矩形框
        mi.mxConstants.ENTITY_SEGMENT = 20;
        // 允许子节点拖拽到其他父节点上
        graph.setDropEnabled(true);
        graph.collapseToPreferredSize = false;
        graph.extendParents = false;
        graph.cellsSelectable = false;
        graph.constrainChildren = false;
        graph.extendParentsOnAdd = false;
        graph.border = 10;

        let style = graph.getStylesheet().getDefaultVertexStyle();
        style[mi.mxConstants.STYLE_FILLCOLOR] = '#ffffff';
        style[mi.mxConstants.STYLE_SHAPE] = mi.mxConstants.SHAPE_SWIMLANE;
        style[mi.mxConstants.STYLE_STARTSIZE] = 30;

        style = graph.getStylesheet().getDefaultEdgeStyle();
        style[mi.mxConstants.STYLE_EDGE] =
          mi.mxConstants.EDGESTYLE_ENTITY_RELATION;
        style[mi.mxConstants.STYLE_ROUNDED] = true;

        // 自定vertex样式
        style = [];
        style[mi.mxConstants.STYLE_SHAPE] = mi.mxConstants.SHAPE_RECTANGLE;
        style[mi.mxConstants.STYLE_STROKECOLOR] = 'none';
        style[mi.mxConstants.STYLE_FILLCOLOR] = 'none';
        style[mi.mxConstants.STYLE_FOLDABLE] = false;
        graph.getStylesheet().putCellStyle('column', style);

        // 为所有的cell install 自动布局
        let layout = new mi.mxStackLayout(graph, true);
        layout.border = graph.border;
        let layoutMgr = new mi.mxLayoutManager(graph);
        layoutMgr.getLayout = (cell: mx.mxCell): mx.mxGraphLayout | null => {
          if (!cell.collapsed) {
            if (cell.parent != graph.model.root) {
              layout.resizeParent = true;
              layout.horizontal = false;
              layout.spacing = 10;
            } else {
              layout.resizeParent = true;
              layout.horizontal = true;
              layout.spacing = 40;
            }
            return layout;
          }

          return null;
        };

        // 重新设置容器尺寸
        graph.setResizeContainer(true);

        var parent = graph.getDefaultParent();
        // this.graph.getModel()
        graph.getModel().beginUpdate();
        try {
          let col1 = graph.insertVertex(
            parent,
            null,
            '',
            0,
            0,
            120,
            0,
            'column'
          );
          let v1 = graph.insertVertex(col1, null, '1', 0, 0, 100, 30, 'fsfeaf');
          v1.collapsed = true;

          let v11 = graph.insertVertex(v1, null, '1.1', 0, 0, 80, 30);
          v11.collapsedo = true;

          let v111 = graph.insertVertex(v11, null, '1.1.1', 0, 0, 60, 30);
          let v112 = graph.insertVertex(v11, null, '1.1.2', 0, 0, 60, 30);

          let v12 = graph.insertVertex(v1, null, '1.2', 0, 0, 80, 30);

          let col2 = graph.insertVertex(
            parent,
            null,
            '',
            0,
            0,
            120,
            0,
            'column'
          );
          let v2 = graph.insertVertex(col2, null, '2', 0, 0, 100, 30);
          v2.collapsed = true;

          let v21 = graph.insertVertex(v2, null, '2.1', 0, 0, 80, 30);
          v21.collapsed = true;

          let v211 = graph.insertVertex(v21, null, '2.1.1', 0, 0, 60, 30);
          let v212 = graph.insertVertex(v21, null, '2.1.2', 0, 0, 60, 30);

          let v22 = graph.insertVertex(v2, null, '2.2', 0, 0, 80, 30);

          let v3 = graph.insertVertex(col2, null, '3', 0, 0, 100, 30);
          v3.collapsed = true;

          let v31 = graph.insertVertex(v3, null, '3.1', 0, 0, 80, 30);
          v31.collapsed = true;

          let v311 = graph.insertVertex(v31, null, '3.1.1', 0, 0, 60, 30);
          let v312 = graph.insertVertex(v31, null, '3.1.2', 0, 0, 60, 30);

          let v32 = graph.insertVertex(col2, null, '3.2', 0, 0, 80, 30);

          graph.insertEdge(parent, null, '', v111, v211);
          graph.insertEdge(parent, null, '', v112, v212);
          graph.insertEdge(parent, null, '', v112, v22);

          graph.insertEdge(parent, null, '', v12, v311);
          graph.insertEdge(parent, null, '', v12, v312);
          graph.insertEdge(parent, null, '', v12, v32);
        } finally {
          graph.getModel().endUpdate();
        }
      }
    };

    return {
      graphContainer,
      title,
    };
  },
});
</script>

<style></style>
