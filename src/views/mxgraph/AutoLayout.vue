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

import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'AutoLayout',
  setup() {
    console.log('create AutoLayout');
    const graphContainer = ref<Element>();

    const title = ref('自动布局');
    let graph: mx.mxGraph = {} as mx.mxGraph;

    onMounted(() => {
      initContainer();
    });

    onBeforeUnmount(() => {
      console.log('destroy AutoLayout');
    });

    const initContainer = () => {
      if (!mi.mxClient.isBrowserSupported()) {
        mi.mxUtils.error('Browser is not supported!', 200, false);
      } else {
        const container = graphContainer.value as HTMLElement;
        mi.mxEvent.disableContextMenu(container);
        graph = new mi.mxGraph(container);

        // create new style
        let myStyle = graph.getStylesheet().getDefaultVertexStyle();
        // let myStyle: { [key: string]: number | string } = {};
        // myStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
        // myStyle[mxConstants.STYLE_OPACITY] = 50;
        // myStyle[mxConstants.STYLE_FONTCOLOR] = "#774400";

        myStyle[mi.mxConstants.STYLE_PERIMETER] =
          mi.mxConstants.PERIMETER_RECTANGLE;
        myStyle[mi.mxConstants.STYLE_GRADIENTCOLOR] = 'white';
        myStyle[mi.mxConstants.STYLE_PERIMETER_SPACING] = 6;
        myStyle[mi.mxConstants.STYLE_ROUNDED] = true;
        // myStyle[mxConstants.STYLE_SHADOW] = true;

        let edgeStyle = graph.getStylesheet().getDefaultEdgeStyle();
        // 方法一 自定义连线曲线
        // (mi.mxStyleRegistry as any).putValue('myEdgeStyle', BezierEdgeStyle);
        // edgeStyle[mi.mxConstants.STYLE_EDGE] = 'myEdgeStyle';
        // 方法二 使用内置的曲线
        edgeStyle[mi.mxConstants.STYLE_EDGE] =
          mi.mxConstants.EDGESTYLE_ORTHOGONAL;
        edgeStyle[mi.mxConstants.STYLE_CURVED] = '1';

        edgeStyle[mi.mxConstants.STYLE_LABEL_POSITION] =
          mi.mxConstants.ALIGN_CENTER;
        edgeStyle[mi.mxConstants.STYLE_VERTICAL_LABEL_POSITION] =
          mi.mxConstants.ALIGN_BOTTOM;
        edgeStyle[mi.mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = 'gray';

        // config graph
        graph.setAllowDanglingEdges(false);
        graph.setConnectable(false);
        graph.setCellsResizable(false);

        new mi.mxRubberband(graph);
        const parent = graph.getDefaultParent();

        // graph.view.updateEdgeLabelOffset = () => {

        // }
        graph.view.getPoint = (state, geo) => {
          let x = state.getCenterX();
          let y = state.getCenterY();

          // if (state.segments != null && (geo == null || geo.relative)) {
          //   let gx = geo != null ? geo.x / 2 : 0;
          //   let pointCount = state.absolutePoints.length;
          //   let dist = Math.round((gx + 0.5) * state.length);
          //   let segment = state.segments[0];
          //   let length = 0;
          //   let index = 1;

          //   while (
          //     dist >= Math.round(length + segment) &&
          //     index < pointCount - 1
          //   ) {
          //     length += segment;
          //     segment = state.segments[index++];
          //   }

          //   let factor = segment == 0 ? 0 : (dist - length) / segment;
          //   let p0 = state.absolutePoints[index - 1];
          //   let pe = state.absolutePoints[index];

          //   if (p0 != null && pe != null) {
          //     let gy = 0;
          //     let offsetX = 0;
          //     let offsetY = 0;

          //     if (geo != null) {
          //       gy = geo.y;
          //       let offset = geo.offset;

          //       if (offset != null) {
          //         offsetX = offset.x;
          //         offsetY = offset.y;
          //       }
          //     }

          //     let dx = pe.x - p0.x;
          //     let dy = pe.y - p0.y;
          //     let nx = segment == 0 ? 0 : dy / segment;
          //     let ny = segment == 0 ? 0 : dx / segment;

          //     x = p0.x + dx * factor + (nx * gy + offsetX) * graph.view.scale;
          //     y = p0.y + dy * factor - (ny * gy - offsetY) * graph.view.scale;
          //   }
          // } else if (geo != null) {
          //   let offset = geo.offset;

          //   if (offset != null) {
          //     x += offset.x;
          //     y += offset.y;
          //   }
          // }
          const ponits = createBezierPoints(state.absolutePoints, 5);
          return new mi.mxPoint(ponits[1].x, ponits[1].y);
        };

        // mi.mxEdgeHandler.prototype.moveLabel = () => {

        // }
        // this.graph.getModel()
        graph.getModel().beginUpdate();
        try {
          const v1 = graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30);
          const v2 = graph.insertVertex(
            parent,
            null,
            'World!',
            200,
            150,
            80,
            30
          );
          const e1 = graph.insertEdge(
            parent,
            null,
            'Connect',
            v1,
            v2,
            'strokeColor=red'
          );
          // const msCanvas = new mi.mxSvgCanvas2D(
          //   container.getElementsByTagName('svg')[0],
          //   true
          // );
          // const geo = e1.getGeometry();

          // msCanvas.foEnabled = true;
          // msCanvas.textEnabled = true;
          // msCanvas.text(
          //   geo.getCenterX(),
          //   geo.getCenterY(),
          //   100,
          //   10,
          //   'Connection',
          //   mi.mxConstants.ALIGN_CENTER,
          //   mi.mxConstants.ALIGN_BOTTOM,
          //   '',
          //   'html',
          //   'visible',
          //   '',
          //   0,
          //   ''
          // );
          // 方法三:  指定连线为曲线
          // graph.setCellStyles(mxConstants.STYLE_EDGE, mxConstants.EDGESTYLE_ORTHOGONAL, [e1])
          // graph.setCellStyles(mxConstants.STYLE_CURVED, '1', [e1])
          // graph.setCellStyles(mxConstants.STYLE_NOEDGESTYLE, null, [e1])
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
