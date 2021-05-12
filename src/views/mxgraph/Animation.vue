<template>
  <div class="graph-test">
    <div class="title">{{ title }}</div>
    <div ref="graphContainer" class="graph"></div>
  </div>
</template>

<script lang="ts">
import {
   mxGraph, mxClient, mxUtils, mxPoint
} from "./util/mxgraph";
import * as mx from "mxgraph";

import {
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
} from "vue";

export default defineComponent({
  name: "Animation",
  setup() {
    console.log("create Animation");
    const graphContainer = ref<Element>();

    const title = ref("动画基础");
    let graph: mx.mxGraph = {} as mx.mxGraph;

    onMounted(() => {
      console.dir(graphContainer.value);
      initContainer();
    });

    onBeforeUnmount(() => {
      console.log("destroy Animation");
    });

    const initContainer = () => {
      if (!mxClient.isBrowserSupported()) {
        mxUtils.error("Browser is not supported!", 200, false);
      } else {
        const container = graphContainer.value as HTMLElement;

        graph = new mxGraph(container);

        // config graph
        graph.setEnabled(false);

        const parent = graph.getDefaultParent();
        const vertexStyle =
          "shape=cylinder;strokeWidth=2;fillColor=#ffffff;strokeColor=black;" +
          "gradientColor=#a0a0a0;fontColor=black;fontStyle=1;spacingTop=14;";
        const edgeStyle =
          "strokeWidth=3;endArrow=block;endSize=2;endFill=1;strokeColor=black;rounded=1;";

        // this.graph.getModel()
        graph.getModel().beginUpdate();
        try {
          var v1 = graph.insertVertex(
            parent,
            null,
            "Pump",
            20,
            20,
            80,
            30,
            vertexStyle
          );
          var v2 = graph.insertVertex(
            parent,
            null,
            "Tank",
            200,
            150,
            80,
            30,
            vertexStyle
          );
          var e1 = graph.insertEdge(parent, "", "", v1, v2, edgeStyle);
          e1.geometry.points = [new mxPoint(230, 50)];
          graph.orderCells(true, [e1]);
        } finally {
          graph.getModel().endUpdate();
        }

        let state = graph.view.getState(e1);
        state.shape.node
          .getElementsByTagName("path")[0]
          .removeAttribute("visibility");
        state.shape.node
          .getElementsByTagName("path")[0]
          .setAttribute("stroke-width", "6");
        state.shape.node
          .getElementsByTagName("path")[0]
          .setAttribute("stroke", "lightGray");
        state.shape.node
          .getElementsByTagName("path")[1]
          .setAttribute("class", "flow");
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
