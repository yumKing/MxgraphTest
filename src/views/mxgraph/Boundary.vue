<template>
  <div class="graph-test">
    <div class="title">{{ title }}</div>
    <div ref="graphContainer" class="graph"></div>
  </div>
</template>

<script lang="ts">
import { mxgraph, mxgraphFactory } from "ts-mxgraph-factory";
const {
  mxGraph,
  mxClient,
  mxUtils,
  mxEvent,
  mxConstants,
  mxPoint,
  mxGraphHandler,
  mxRubberband,
} = mxgraphFactory({
  mxBasePath: "mxgraph",
});

import { defineComponent, onBeforeUnmount, onMounted, ref } from "vue";

export default defineComponent({
  name: "Boundary",
  setup() {
    console.log("create Boundary");
    const graphContainer = ref<Element>();

    const title = ref("边界");
    let graph: mxgraph.mxGraph = {} as mxgraph.mxGraph;

    onMounted(() => {
      initContainer();
    });

    onBeforeUnmount(() => {
      console.log("destroy Boundary");
    });

    const initContainer = () => {
      if (!mxClient.isBrowserSupported()) {
        mxUtils.error("Browser is not supported!", 200, false);
      } else {
        const container = graphContainer.value;
        mxEvent.disableContextMenu(container);

        graph = new mxGraph(container);

        // 设置所有顶点的基本样式
        const style = graph.getStylesheet().getDefaultVertexStyle();
        style[mxConstants.STYLE_ROUNDED] = true;
        style[mxConstants.STYLE_FILLCOLOR] = "#ffffff";
        style[mxConstants.STYLE_STROKECOLOR] = "#000000";
        style[mxConstants.STYLE_STROKEWIDTH] = "2";
        style[mxConstants.STYLE_FONTCOLOR] = "#000000";
        style[mxConstants.STYLE_FONTSIZE] = "12";
        style[mxConstants.STYLE_FONTSTYLE] = 1;
        graph.getStylesheet().putDefaultVertexStyle(style);

        // 删除折叠图标
        graph.isCellFoldable = (
          cell: mxgraph.mxCell,
          collapse: any
        ): boolean => {
          const childCount = graph.model.getChildCount(cell);
          for (let i = 0; i < childCount; i++) {
            const child = graph.model.getChildAt(cell, i);
            let geo = graph.getCellGeometry(child);
            if (geo != null && geo.relative) {
              return false;
            }
          }
          return childCount > 0;
        };

        // 返回子顶点的相对位置
        const getRelativePosition = (
          state: any,
          dx: any,
          dy: any
        ): mxgraph.mxPoint | null => {
          if (state != null) {
            const model = graph.getModel();
            const geo = model.getGeometry(state.cell);

            if (geo != null && geo.relative && !model.isEdge(state.cell)) {
              const parent = model.getParent(state.cell);
              if (model.isVertex(parent)) {
                const pstate = graph.view.getState(parent);
                if (pstate != null) {
                  const scale = graph.view.scale;
                  let x = state.x + dx;
                  let y = state.y + dy;

                  if (geo.offset != null) {
                    x -= geo.offset.x * scale;
                    y -= geo.offset.y * scale;
                  }

                  x = (x - pstate.x) / pstate.width;
                  y = (y - pstate.y) / pstate.height;

                  if (Math.abs(y - 0.5) <= Math.abs((x - 0.5) / 2)) {
                    x = x > 0.5 ? 1 : 0;
                    y = Math.min(1, Math.max(0, y));
                  } else {
                    x = Math.min(1, Math.max(0, x));
                    y = y > 0.5 ? 1 : 0;
                  }

                  return new mxPoint(x, y);
                }
              }
            }
          }

          return null;
        };

        // 替换相关的子顶点的转换
        graph.translateCell = (cell: any, dx: any, dy: any): void => {
          const rel = getRelativePosition(
            graph.view.getState(cell),
            dx * graph.view.scale,
            dy * graph.view.scale
          );

          if (rel != null) {
            let geo = graph.model.getGeometry(cell);
            if (geo != null && geo.relative) {
              geo = geo.clone();
              geo.x = rel.x;
              geo.y = rel.y;

              graph.model.setGeometry(cell, geo);
            } else {
              mxGraph.prototype.translateCell.apply(graph, arguments as any);
            }
          }
        };

        // 替换相对子顶点的移动预览
        graph.graphHandler.getDelta = (me: any): mxgraph.mxPoint => {
          const that = graph.graphHandler as any;
          let point = mxUtils.convertPoint(
            that.graph.container,
            me.getX(),
            me.getY()
          );
          let delta = new mxPoint(
            point.x - that.first.x,
            point.y - that.first.y
          );

          if (
            that.cells != null &&
            that.cells.length > 0 &&
            that.cells[0] != null
          ) {
            let state = that.graph.view.getState(that.cells[0]);
            let rel = getRelativePosition(state, delta.x, delta.y);

            if (rel != null) {
              let pstate = that.graph.view.getState(
                that.graph.model.getParent(state.cell)
              );
              if (pstate != null) {
                delta = new mxPoint(
                  pstate.x + pstate.width * rel.x - state.getCenterX(),
                  pstate.y + pstate.height * rel.y - state.getCenterY()
                );
              }
            }
          }

          return delta;
        };

        // 禁止从父顶点中删除相关子顶点
        graph.graphHandler.shouldRemoveCellsFromParent = (
          parent: any,
          cells: any,
          evt: any
        ): boolean => {
          const that = graph.graphHandler as any;
          return (
            cells.length == 0 &&
            !cells[0].geometry.relative &&
            mxGraphHandler.prototype.shouldRemoveCellsFromParent.apply(
              that,
              arguments as any
            )
          );
        };

        // 允许移动相对子顶点
        graph.isCellLocked = (cell: any): boolean => {
          return false;
        };

        new mxRubberband(graph);
        var parent = graph.getDefaultParent();

        graph.getModel().beginUpdate();
        try {
          var v1 = graph.insertVertex(parent, null, "Process", 60, 60, 90, 40);
          var v2 = graph.insertVertex(
            v1,
            null,
            "in",
            0,
            0.5,
            20,
            20,
            "fontSize=9;shape=ellipse;resizable=0;"
          );
          v2.geometry.offset = new mxPoint(-10, -10);
          v2.geometry.relative = true;
          var v3 = graph.insertVertex(
            v1,
            null,
            "out",
            1,
            0.5,
            20,
            20,
            "fontSize=9;shape=ellipse;resizable=0;"
          );
          v3.geometry.offset = new mxPoint(-10, -10);
          v3.geometry.relative = true;
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
