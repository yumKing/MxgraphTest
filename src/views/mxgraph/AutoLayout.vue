<template>
  <div class="graph-test">
    <div class="title">{{ title }}</div>
    <div ref="graphContainer" class="graph"></div>
  </div>
</template>

<script lang="ts">
import * as mx from 'mxgraph';
import mi from './util/mxgraph';
import { BezierEdgeStyle } from './custom/MyEdgeStyle';

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
        var parent = graph.getDefaultParent();

        // this.graph.getModel()
        graph.getModel().beginUpdate();
        try {
          var v1 = graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30);
          var v2 = graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30);

          var e1 = graph.insertEdge(
            parent,
            '',
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
