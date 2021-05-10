<template>
  <div class="graph-test">
    <div class="title">{{ title }}</div>
    <div ref="graphContainer" class="graph"></div>
    <!-- <div :ref="graphContainerFunc" class="graph"></div> -->
  </div>
</template>

<script lang="ts">
import { mxgraph, mxgraphFactory } from "ts-mxgraph-factory";
const {
  mxGraph,
  mxClient,
  mxUtils,
  mxEvent,
  mxRubberband,
  mxPolyline,
  mxShape,
  mxConnectionConstraint,
  mxPoint,
  mxCellState,
} = mxgraphFactory({
  mxBasePath: "mxgraph",
});

import {
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
} from "vue";

export default defineComponent({
  name: "Anchors",
  setup() {
    console.log("create GraphTest");
    const graphContainer = ref<Element>();

    const title = ref("锚点");
    let graph: mxgraph.mxGraph = {} as mxgraph.mxGraph;

    onMounted(() => {
      console.dir(graphContainer.value);
      initContainer();
    });

    onBeforeUnmount(() => {
      console.log("destroy Anchors");
    });

    mxGraph.prototype.getAllConnectionConstraints = (
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
    (mxShape.prototype as any).constraints = [
      new mxConnectionConstraint(new mxPoint(0.25, 0), true),
      new mxConnectionConstraint(new mxPoint(0.5, 0), true),
      new mxConnectionConstraint(new mxPoint(0.75, 0), true),
      new mxConnectionConstraint(new mxPoint(0, 0.25), true),
      new mxConnectionConstraint(new mxPoint(0, 0.5), true),
      new mxConnectionConstraint(new mxPoint(0, 0.75), true),
      new mxConnectionConstraint(new mxPoint(1, 0.25), true),
      new mxConnectionConstraint(new mxPoint(1, 0.5), true),
      new mxConnectionConstraint(new mxPoint(1, 0.75), true),
      new mxConnectionConstraint(new mxPoint(0.25, 1), true),
      new mxConnectionConstraint(new mxPoint(0.5, 1), true),
      new mxConnectionConstraint(new mxPoint(0.75, 1), true),
    ];

    (mxPolyline.prototype as any).constraints = null;

    const initContainer = () => {
      if (!mxClient.isBrowserSupported()) {
        mxUtils.error("Browser is not supported!", 200, false);
      } else {
        const container = graphContainer.value;
        mxEvent.disableContextMenu(container);

        graph = new mxGraph(container);

        // config graph
        graph.setAllowDanglingEdges(false);
        graph.setConnectable(true);
        graph.connectionHandler.createEdgeState = (me: any) => {
          const edge = graph.createEdge(
            {} as mxgraph.mxCell,
            "",
            null,
            {} as mxgraph.mxCell,
            {} as mxgraph.mxCell
          );
          return new mxCellState(graph.view, edge, graph.getCellStyle(edge));
        };
        graph.getStylesheet().getDefaultEdgeStyle()["edgeStyle"] =
          "orthogonalEdgeStyle";

        new mxRubberband(graph);
        var parent = graph.getDefaultParent();

        graph.getModel().beginUpdate();
        try {
          var v1 = graph.insertVertex(parent, null, "Hello,", 20, 20, 80, 30);
          var v2 = graph.insertVertex(parent, null, "World!", 200, 150, 80, 30);
          graph.insertEdge(parent, "", "", v1, v2, "noLabel=1;strokeColor=red");
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
