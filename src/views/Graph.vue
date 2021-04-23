<template>
  <div class="graph-test">
    <div class="title">{{ title }}</div>
    <div ref="graphContainer" class="graph"></div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
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

export default class GraphTest extends Vue {
  title = "默认标题";
  private graph: mxgraph.mxGraph | null = null;

  created(): void {
    this.title = "画图板";
    console.log("create GraphTest");
  }

  mounted(): void {
    this.initContainer();
  }

  initContainer(): void {
    const container = this.$refs.graphContainer as HTMLElement;

    if (!mxClient.isBrowserSupported()) {
      mxUtils.error("Browser is not supported!", 200, false);
    } else {
      mxEvent.disableContextMenu(container);

      this.graph = new mxGraph(container);
      new mxRubberband(this.graph);
      var parent = this.graph.getDefaultParent();

      // this.graph.getModel()
      this.graph.getModel().beginUpdate();
      try {
        var v1 = this.graph.insertVertex(
          parent,
          null,
          "Hello,",
          20,
          20,
          80,
          30
        );

        var v2 = this.graph.insertVertex(
          parent,
          null,
          "World!",
          200,
          150,
          80,
          30
        );
        this.graph.insertEdge(
          parent,
          "",
          "",
          v1,
          v2,
          "noLabel=1;strokeColor=red"
        );
      } finally {
        this.graph.getModel().endUpdate();
      }
    }
  }
}
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
