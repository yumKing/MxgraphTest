<template>
  <div class="graph-test">
    <div class="title">{{ title }}</div>
    <div ref="graphContainer" class="graph"></div>
  </div>
</template>

<script lang="ts">
import {
   mxGraph, mxClient, mxUtils, mxEvent, mxRubberband
} from "./util/mxgraph";
import * as mx from "mxgraph";

import {
  defineComponent,
  onBeforeUnmount,
  onMounted,
  ref,
} from "vue";

export default defineComponent({
  name: "BaseGraph",
  setup() {
    console.log("create GraphTest");
    const graphContainer = ref<Element>();

    const title = ref("基础例子");
    let graph: mx.mxGraph = {} as mx.mxGraph;

    onMounted(() => {
      console.dir(graphContainer.value);
      initContainer();
    });

    onBeforeUnmount(() => {
      console.log("destroy GraphTest");
    });

    const initContainer = () => {
      if (!mxClient.isBrowserSupported()) {
        mxUtils.error("Browser is not supported!", 200, false);
      } else {
        const container = graphContainer.value as HTMLElement;
        mxEvent.disableContextMenu(container);

        graph = new mxGraph(container);

        // config graph
        graph.setAllowDanglingEdges(false);

        new mxRubberband(graph);
        var parent = graph.getDefaultParent();

        // this.graph.getModel()
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
    };
  },
});
</script>

<style></style>
