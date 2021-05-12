<template>
  <div class="graph-test">
    <div class="title">{{ title }}</div>
    <div ref="graphContainer" class="graph"></div>
  </div>
</template>

<script lang="ts">
import {
  mxGraph,
  mxRubberband,
  mxGraphModel,
  mxClient,
  mxUtils,
  mxEvent,
  mxConstants,
  mxKeyHandler,
} from "./util/mxgraph";
import * as mx from "mxgraph";

import { defineComponent, onBeforeUnmount, onMounted, ref } from "vue";

export default defineComponent({
  name: "MyFlow",
  setup() {
    console.log("create MyFlow");
    const graphContainer = ref<Element>();

    const title = ref("话术流程图");
    let graph: mx.mxGraph = {} as mx.mxGraph;

    onMounted(() => {
      initContainer();
    });

    onBeforeUnmount(() => {
      console.log("destroy MyFlow");
    });

    const initContainer = () => {
      if (!mxClient.isBrowserSupported()) {
        mxUtils.error("Browser is not supported!", 200, false);
      } else {
        const container = graphContainer.value as HTMLElement;
        mxEvent.disableContextMenu(container);

        graph = new mxGraph(container);

        // config graph
        // 设置 连线为曲线
        const edgeStyle = graph.getStylesheet().getDefaultEdgeStyle();
        edgeStyle[mxConstants.STYLE_EDGE] = mxConstants.EDGESTYLE_ORTHOGONAL;
        edgeStyle[mxConstants.STYLE_CURVED] = "1";
        graph.edgeLabelsMovable = false;
        graph.setConnectable(true)
        graph.setAllowDanglingEdges(true);
        
        graph.setTooltips(true)
        graph.htmlLabels = true
        graph.vertexLabelsMovable = false

        new mxKeyHandler(graph)
        new mxRubberband(graph);

        // 不允许从父结点中移除cells
        graph.graphHandler.removeCellsFromParent = false
        // 在添加cell时自动size
        graph.autoSizeCellsOnAdd = true

        // 解除cell 锁定， 允许移动 相关的cells
        graph.isCellLocked = (cell: any):boolean => {
          return graph.isCellsLocked()
        }
        graph.isCellResizable = (cell:any):boolean => {
          let geo = graph.model.getGeometry(cell)
          return geo == null || geo.relative
        }
        // 将标签截断为顶点大小
        graph.getLabel = (cell: any): string|Node =>{
            let label = graph.labelsVisible ? graph.convertValueToString(cell):''
            let geometry = graph.model.getGeometry(cell)
            if(graph.model.isCollapsed(cell) && geometry != null && (geometry.offset == null || (geometry.offset.x == 0 && geometry.offset.y == 0)) && graph.model.isVertex(cell) && geometry.width >= 2){
              let style = graph.getCellStyle(cell)
              let fontSize = style[mxConstants.STYLE_FONTSIZE] || mxConstants.DEFAULT_FONTSIZE
              let max = geometry.width/(fontSize * 0.625)
              if(max < label.length){
                return label.substring(0, max) + '...'
              }
            }
            return label
        }
        // 使能包装 顶点标签
        graph.isWrapping = (cell:any) => {
          return graph.model.isCollapsed(cell)
        }
        // 如果没有定义偏移量 使能 剪辑
        graph.isLabelClipped = (cell: mx.mxCell):boolean => {
          let geo = graph.model.getGeometry(cell)
          return geo != null && !geo.relative && (geo.offset==null || geo.offset.x == 0 && geo.offset.y == 0)
        }

        // 设置动态样式改变标记
        graph.getView().updateStyle = true;
        // 覆盖 mxGraphModel.getStyle 以返回指定样式(连线结束的结点样式颜色)
        graph.model.getStyle = (cell: any): string|null => {
          const that = graph.model as any;

          if (cell != null) {
            let style = mxGraphModel.prototype.getStyle.call(that, cell);
            if (that.isEdge(cell)) {
              let target = that.getTerminal(cell, false);
              if (target != null) {
                let targetStyle = (graph as any).getCurrentCellStyle(target);
                let fill = mxUtils.getValue(
                  targetStyle,
                  mxConstants.STYLE_FILLCOLOR,
                  ""
                );
                if (fill != null) {
                  style += ";strokeColor=" + fill;
                }
              }
            } else if (that.isVertex(cell)) {
              let geomotry = that.getGeometry(cell);
              if (geomotry != null && geomotry.width > 80) {
                style += ";fillColor=green";
              }
            }

            return style;
          }
          return "";
        };

        var parent = graph.getDefaultParent();

        // this.graph.getModel()
        graph.getModel().beginUpdate();
        try {
          var v1 = graph.insertVertex(
            parent,
            "v1",
            "你好，请问你是金先生吗?",
            400,
            20,
            80,
            30,
            "fillColor=green"
          );
          var v2 = graph.insertVertex(
            parent,
            "v2",
            "那就不打扰您了，再见!",
            600,
            150,
            80,
            30,
            "fillColor=blue"
          );
          var v3 = graph.insertVertex(
            parent,
            "v3",
            "您好，我们是上海你我贷的，您之前在我们你我贷平台认购过， 您还有印象吗?",
            200,
            150,
            80,
            30,
            "fillColor=red"
          );
          var v4 = graph.insertVertex(
            parent,
            "v4",
            "新的回答",
            800,
            150,
            80,
            30,
            "fillColor=rgb(170,183,196)"
          );

          graph.insertEdge(
            parent,
            "e1",
            "不是",
            v1,
            v2,
            "perimeterSpacing=4;strokeWidth=4;labelBackgroundColor=white;fontStyle=1"
          );
          graph.insertEdge(
            parent,
            "e2",
            "是的",
            v1,
            v3,
            "perimeterSpacing=4;strokeWidth=4;labelBackgroundColor=white;fontStyle=1"
          );
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
