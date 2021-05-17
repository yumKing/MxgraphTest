<template>
  <div class="graph-test">
    <div class="title">{{ title }}</div>
    <div ref="graphContainer" class="graph"></div>
    <!-- <div :ref="graphContainerFunc" class="graph"></div> -->
  </div>
</template>

<script lang="ts">
import * as mx from 'mxgraph';
import mi from './util/mxgraph';

import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'Anchors',
  setup() {
    console.log('create Anchors');
    const graphContainer = ref<Element>();

    const title = ref('锚点');
    let graph: mx.mxGraph = {} as mx.mxGraph;

    onMounted(() => {
      initContainer();
    });

    onBeforeUnmount(() => {
      console.log('destroy Anchors');
    });

    mi.mxGraph.prototype.getAllConnectionConstraints = (
      terminal: any,
      source: boolean
    ): any => {
      if (terminal != null && terminal.shape != null) {
        if (terminal.shape.stencil != null) {
          if (terminal.shape.stencil.constraints != null) {
            return terminal.shape.stencil.constraints;
          }
        } else if (terminal.shape.constraints != null) {
          return terminal.shape.constraints;
        }
      }
      return null;
    };

    (mi.mxShape.prototype as any).constraints = [
      new mi.mxConnectionConstraint(new mi.mxPoint(0.25, 0), true),
      new mi.mxConnectionConstraint(new mi.mxPoint(0.5, 0), true),
      new mi.mxConnectionConstraint(new mi.mxPoint(0, 0.25), true),
      new mi.mxConnectionConstraint(new mi.mxPoint(0, 0.5), true),
      new mi.mxConnectionConstraint(new mi.mxPoint(0.75, 0), true),
      new mi.mxConnectionConstraint(new mi.mxPoint(0, 0.75), true),
      new mi.mxConnectionConstraint(new mi.mxPoint(1, 0.25), true),
      new mi.mxConnectionConstraint(new mi.mxPoint(1, 0.5), true),
      new mi.mxConnectionConstraint(new mi.mxPoint(1, 0.75), true),
      new mi.mxConnectionConstraint(new mi.mxPoint(0.25, 1), true),
      new mi.mxConnectionConstraint(new mi.mxPoint(0.5, 1), true),
      new mi.mxConnectionConstraint(new mi.mxPoint(0.75, 1), true),
    ];

    (mi.mxPolyline.prototype as any).constraints = null;

    const initContainer = () => {
      if (!mi.mxClient.isBrowserSupported()) {
        mi.mxUtils.error('Browser is not supported!', 200, false);
      } else {
        const container = graphContainer.value as HTMLElement;
        mi.mxEvent.disableContextMenu(container);

        graph = new mi.mxGraph(container);

        // config graph
        graph.setAllowDanglingEdges(false);
        graph.setConnectable(true);
        graph.connectionHandler.createEdgeState = (me: any) => {
          const edge = graph.createEdge(
            {} as mx.mxCell,
            null,
            null,
            {} as mx.mxCell,
            {} as mx.mxCell
          );
          return new mi.mxCellState(graph.view, edge, graph.getCellStyle(edge));
        };
        graph.getStylesheet().getDefaultEdgeStyle()['edgeStyle'] =
          'orthogonalEdgeStyle';

        new mi.mxRubberband(graph);
        var parent = graph.getDefaultParent();

        graph.getModel().beginUpdate();
        try {
          var v1 = graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30);
          var v2 = graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30);
          graph.insertEdge(parent, '', '', v1, v2, 'noLabel=1;strokeColor=red');
        } finally {
          graph.getModel().endUpdate();
        }
      }
    };

    return {
      graphContainer,
      title,
      // graphContainerFunc
    };
  },
});
</script>

<style></style>
