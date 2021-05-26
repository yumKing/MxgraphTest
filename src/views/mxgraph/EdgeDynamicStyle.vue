<template>
  <div class="graph-test">
    <div class="title">{{ title }}</div>
    <div ref="graphContainer" class="graph"></div>
  </div>
</template>

<script lang="ts">
import * as mx from 'mxgraph';
import mi from './util/mxgraph';
import { createBezierPoints } from './custom/MyEdgeStyle';

import {
  defineComponent,
  onBeforeUnmount,
  onMounted,
  ref,
  getCurrentInstance,
} from 'vue';

export default defineComponent({
  name: 'EdgeDynamicStyle',
  setup() {
    console.log('create EdgeDynamicStyle');
    const graphContainer = ref<Element>();

    const title = ref('连线动态样式');
    let graph: mx.mxGraph = {} as mx.mxGraph;

    const curThis = getCurrentInstance();

    onMounted(() => {
      initContainer();
    });

    onBeforeUnmount(() => {
      console.log('destroy EdgeDynamicStyle');
    });

    const initContainer = () => {
      if (!mi.mxClient.isBrowserSupported()) {
        mi.mxUtils.error('Browser is not supported!', 200, false);
      } else {
        const container = curThis?.refs.graphContainer as HTMLElement;
        // const container = graphContainer.value as HTMLElement;
        mi.mxEvent.disableContextMenu(container);

        graph = new mi.mxGraph(container);

        // config graph
        const edgeStyle = graph.getStylesheet().getDefaultEdgeStyle();
        edgeStyle[mi.mxConstants.STYLE_EDGE] =
          mi.mxConstants.EDGESTYLE_ORTHOGONAL;
        edgeStyle[mi.mxConstants.STYLE_CURVED] = '1';
        graph.view.getPoint = (state, geo) => {
          const points = createBezierPoints(state.absolutePoints, 5);
          return new mi.mxPoint(points[2].x, points[2].y);
        };

        graph.getView().updateStyle = true;

        graph.model.getStyle = (cell: mx.mxCell): string | null => {
          const that = graph.model;
          if (cell != null) {
            let style = mi.mxGraphModel.prototype.getStyle.call(that, cell);
            if (that.isEdge(cell)) {
              let target = that.getTerminal(cell, false);
              if (target != null) {
                let targetStyle = graph.getCurrentCellStyle(target);
                let fill = mi.mxUtils.getValue(
                  targetStyle,
                  mi.mxConstants.STYLE_FILLCOLOR,
                  ''
                );
                if (fill != null) {
                  style += ';strokeColor=' + fill;
                }
              }
            } else if (that.isVertex(cell)) {
              let geo = that.getGeometry(cell);
              if (geo != null && geo.width > 80) {
                style += ';fillColor=green';
              }
            }
            return style;
          }

          return '';
        };

        new mi.mxRubberband(graph);
        var parent = graph.getDefaultParent();

        // this.graph.getModel()
        graph.getModel().beginUpdate();
        try {
          var v1 = graph.insertVertex(
            parent,
            'v1',
            'Hello,',
            20,
            20,
            80,
            30,
            'fillColor=red'
          );
          var v2 = graph.insertVertex(
            parent,
            'v2',
            'World!',
            200,
            150,
            80,
            30,
            'fillColor=blue'
          );
          graph.insertEdge(
            parent,
            'e1',
            'Connect',
            v1,
            v2,
            'perimeterSpacing=4;strokeWidth=4;labelBackgroundColor=white;fontStyle=1'
          );
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
