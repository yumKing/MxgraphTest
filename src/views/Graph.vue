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
  mxConstants,
  mxEdgeStyle,
} = mxgraphFactory({
  //   mxLoadResources: false,
  //   mxLoadStylesheets: false,
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
  setup() {
    console.log("create GraphTest");
    const graphContainer = ref<Element>();

    const title = ref("默认标题");
    let graph: mxgraph.mxGraph | null = null;

    onMounted(() => {
      console.dir(graphContainer.value);
      initContainer();
    });

    onBeforeUnmount(() => {
      console.log("destroy GraphTest");
    });

    // let refs = ref<Element>()
    // const graphContainerFunc = (el:Element) => {
    //   refs.value = el
    // }

    // nextTick( () => {
    //   console.log(refs.value)
    // })

    const initContainer = () => {
      if (!mxClient.isBrowserSupported()) {
        mxUtils.error("Browser is not supported!", 200, false);
      } else {
        const container = graphContainer.value;
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
      // graphContainerFunc
    };
  },
});
</script>

<style scoped lang="scss">
.graph {
  position: relative;
  overflow: auto;
  margin: 5px auto;
  width: 70vw;
  height: 80vh;
  background: url("../assets/grid.gif");
  cursor: default;
}
</style>
