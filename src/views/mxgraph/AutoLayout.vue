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

        // 2此光滑贝塞尔曲线
        // (mi.mxAbstractCanvas2D.prototype as any).scurveTo = () => {

        // }

        // mi.mxPolyline.prototype.paintCurvedLine = (c, pts) => {
        //   c.begin();

        //   const pt = pts[0];
        //   let n = pts.length;

        //   c.moveTo(pt.x, pt.y);

        //   const p0 = pts[n - 2];
        //   const p1 = pts[n - 1];

        //   c.curveTo(pt.x, pt.y, p0.x, p0.y, p1.x, p1.y);
        //   c.stroke();
        // };

        // mi.mxSvgCanvas2D.prototype.plainText = function (
        //   x,
        //   y,
        //   w,
        //   h,
        //   str,
        //   align,
        //   valign,
        //   wrap,
        //   overflow,
        //   clip,
        //   rotation,
        //   dir
        // ) {
        //   rotation = rotation != null ? rotation : 0;
        //   var s = this.state;
        //   var size = s.fontSize;
        //   var node = this.createElement('g');
        //   var tr = (s as any).transform || '';
        //   this.updateFont(node);

        //   // Ignores pointer events
        //   if (!this.pointerEvents && (this as any).originalRoot == null) {
        //     node.setAttribute('pointer-events', 'none');
        //   }

        //   // Non-rotated text
        //   if (rotation != 0) {
        //     tr +=
        //       'rotate(' +
        //       rotation +
        //       ',' +
        //       this.format((x * s.scale).toString()) +
        //       ',' +
        //       this.format((y * s.scale).toString()) +
        //       ')';
        //   }

        //   if (dir != null) {
        //     node.setAttribute('direction', dir);
        //   }

        //   if (clip && w > 0 && h > 0) {
        //     let cx = x;
        //     let cy = y;

        //     if (align == mi.mxConstants.ALIGN_CENTER) {
        //       cx -= w / 2;
        //     } else if (align == mi.mxConstants.ALIGN_RIGHT) {
        //       cx -= w;
        //     }

        //     if (overflow != 'fill') {
        //       if (valign == mi.mxConstants.ALIGN_MIDDLE) {
        //         cy -= h / 2;
        //       } else if (valign == mi.mxConstants.ALIGN_BOTTOM) {
        //         cy -= h;
        //       }
        //     }

        //     // LATER: Remove spacing from clip rectangle
        //     var c = this.createClip(
        //       cx * s.scale - 2,
        //       cy * s.scale - 2,
        //       w * s.scale + 4,
        //       h * s.scale + 4
        //     );

        //     if (this.defs != null) {
        //       this.defs.appendChild(c);
        //     } else {
        //       // Makes sure clip is removed with referencing node
        //       this.root.appendChild(c);
        //     }

        //     if (
        //       !mi.mxClient.IS_CHROMEAPP &&
        //       !mi.mxClient.IS_IE &&
        //       !mi.mxClient.IS_IE11 &&
        //       !mi.mxClient.IS_EDGE &&
        //       this.root.ownerDocument == document
        //     ) {
        //       // Workaround for potential base tag
        //       var base = this.getBaseUrl().replace(/([()])/g, '\\$1');
        //       node.setAttribute(
        //         'clip-path',
        //         'url(' + base + '#' + c.getAttribute('id') + ')'
        //       );
        //     } else {
        //       node.setAttribute(
        //         'clip-path',
        //         'url(#' + c.getAttribute('id') + ')'
        //       );
        //     }
        //   }

        //   // Default is left
        //   var anchor =
        //     align == mi.mxConstants.ALIGN_RIGHT
        //       ? 'end'
        //       : align == mi.mxConstants.ALIGN_CENTER
        //       ? 'middle'
        //       : 'start';

        //   // Text-anchor start is default in SVG
        //   if (anchor != 'start') {
        //     node.setAttribute('text-anchor', anchor);
        //   }

        //   if (!this.styleEnabled || size != mi.mxConstants.DEFAULT_FONTSIZE) {
        //     node.setAttribute('font-size', size * s.scale + 'px');
        //   }

        //   if (tr.length > 0) {
        //     node.setAttribute('transform', tr);
        //   }

        //   if (s.alpha < 1) {
        //     node.setAttribute('opacity', s.alpha.toString());
        //   }

        //   let lines = str.split('\n');
        //   let lh = Math.round(size * mi.mxConstants.LINE_HEIGHT);
        //   let textHeight = size + (lines.length - 1) * lh;

        //   let cy = y + size - 1;

        //   if (valign == mi.mxConstants.ALIGN_MIDDLE) {
        //     if (overflow == 'fill') {
        //       cy -= h / 2;
        //     } else {
        //       let dy =
        //         (this.matchHtmlAlignment && clip && h > 0
        //           ? Math.min(textHeight, h)
        //           : textHeight) / 2;
        //       cy -= dy;
        //     }
        //   } else if (valign == mi.mxConstants.ALIGN_BOTTOM) {
        //     if (overflow == 'fill') {
        //       cy -= h;
        //     } else {
        //       var dy =
        //         this.matchHtmlAlignment && clip && h > 0
        //           ? Math.min(textHeight, h)
        //           : textHeight;
        //       cy -= dy + 1;
        //     }
        //   }

        //   for (var i = 0; i < lines.length; i++) {
        //     // Workaround for bounding box of empty lines and spaces
        //     if (
        //       lines[i].length > 0 &&
        //       (mi.mxUtils.trim(lines[i], '') as any).length > 0
        //     ) {
        //       var text = this.createElement('text');
        //       // LATER: Match horizontal HTML alignment
        //       text.setAttribute(
        //         'x',
        //         (
        //           this.format((x * s.scale).toString()) + this.textOffset
        //         ).toString()
        //       );
        //       text.setAttribute(
        //         'y',
        //         (
        //           this.format((cy * s.scale).toString()) + this.textOffset
        //         ).toString()
        //       );

        //       mi.mxUtils.write(text, lines[i]);
        //       node.appendChild(text);
        //     }

        //     cy += lh;
        //   }

        //   this.root.appendChild(node);
        //   this.addTextBackground(
        //     node,
        //     str,
        //     x,
        //     y,
        //     w,
        //     overflow == 'fill' ? h : textHeight,
        //     align,
        //     valign,
        //     overflow
        //   );
        // };

        // graph.getChildOffsetForCell = (cell):number => {
        //     return 0
        // }
        // graph.view.updateFloatingTerminalPoint = () => {

        // }
        // graph.view.updateEdgeLabelOffset = () => {

        // }
        // graph.view.getPoint = () => {

        // }

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
