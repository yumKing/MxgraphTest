<template>
  <div class="graph-test">
    <div class="title">{{ title }}</div>
    <div ref="graphContainer" class="graph"></div>
  </div>
</template>

<script lang="ts">
import mi from './util/mxgraph';
import * as mx from 'mxgraph';
import { createBezierPoints } from './custom/MyEdgeStyle';

import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'MyFlow',
  setup() {
    console.log('create MyFlow');
    const graphContainer = ref<Element>();

    const title = ref('话术流程图');
    let graph: mx.mxGraph = {} as mx.mxGraph;

    onMounted(() => {
      initContainer();
    });

    onBeforeUnmount(() => {
      console.log('destroy MyFlow');
    });

    const initContainer = () => {
      if (!mi.mxClient.isBrowserSupported()) {
        mi.mxUtils.error('Browser is not supported!', 200, false);
      } else {
        const container = graphContainer.value as HTMLElement;
        mi.mxEvent.disableContextMenu(container);

        graph = new mi.mxGraph(container);
        // config graph
        // 设置结点样式
        const vertexStyle = graph.getStylesheet().getDefaultVertexStyle();
        vertexStyle[mi.mxConstants.STYLE_ROUNDED] = '1';
        vertexStyle[mi.mxConstants.STYLE_SHADOW] = true;
        vertexStyle[mi.mxConstants.STYLE_STROKECOLOR] = '#cdcdcd';
        mi.mxConstants.SHADOWCOLOR = '#cdcdcd';
        mi.mxConstants.SHADOW_OFFSET_X = 3;
        mi.mxConstants.SHADOW_OFFSET_Y = 3;
        mi.mxConstants.SHADOW_OPACITY = 0.3;

        // 设置 连线样式为曲线
        const edgeStyle = graph.getStylesheet().getDefaultEdgeStyle();
        edgeStyle[mi.mxConstants.STYLE_EDGE] =
          mi.mxConstants.EDGESTYLE_ORTHOGONAL;
        edgeStyle[mi.mxConstants.STYLE_CURVED] = '1';
        graph.view.getPoint = (state, geo) => {
          const ponits = createBezierPoints(state.absolutePoints, 5);
          return new mi.mxPoint(ponits[1].x, ponits[1].y);
        };
        edgeStyle[mi.mxConstants.STYLE_ENDARROW] =
          mi.mxConstants.ARROW_OPEN_THIN;

        // 结点不允许连线
        graph.setConnectable(false);
        // 允许移动边上的连接点
        graph.setConnectableEdges(true);
        // 不允许边移动
        graph.setAllowDanglingEdges(false);
        // cell中的文本提示
        graph.setTooltips(true);
        // 边和结点上的label不允许移动
        graph.edgeLabelsMovable = false;
        graph.vertexLabelsMovable = false;

        new mi.mxKeyHandler(graph);
        new mi.mxRubberband(graph);

        // 不允许从父结点中移除cells
        graph.graphHandler.removeCellsFromParent = false;
        // 在添加cell时自动size
        graph.autoSizeCellsOnAdd = true;

        // 解除cell 锁定， 允许移动 相关的cells
        graph.isCellLocked = (cell: any): boolean => {
          return graph.isCellsLocked();
        };
        graph.isCellResizable = (cell: any): boolean => {
          let geo = graph.model.getGeometry(cell);
          return geo == null || geo.relative;
        };
        // 将标签截断为顶点大小
        graph.getLabel = (cell) => {
          let label = graph.labelsVisible
            ? graph.convertValueToString(cell)
            : '';
          let geometry = graph.model.getGeometry(cell);
          if (
            !graph.model.isCollapsed(cell) &&
            geometry != null &&
            (geometry.offset == null ||
              (geometry.offset.x == 0 && geometry.offset.y == 0)) &&
            graph.model.isVertex(cell) &&
            geometry.width >= 2
          ) {
            let style = graph.getCellStyle(cell);
            let fontSize =
              style[mi.mxConstants.STYLE_FONTSIZE] ||
              mi.mxConstants.DEFAULT_FONTSIZE;
            // let max = geometry.width / (fontSize * 0.625);
            let max = geometry.width - 10;
            if (max < label.length) {
              return label.substring(0, max) + '...';
            }
          }
          return label;
        };
        // 使能包装 顶点标签
        graph.isWrapping = (cell: any) => {
          return graph.model.isCollapsed(cell);
        };
        // 如果没有定义偏移量 使能 剪辑
        graph.isLabelClipped = (cell: mx.mxCell): boolean => {
          let geo = graph.model.getGeometry(cell);
          return (
            geo != null &&
            !geo.relative &&
            (geo.offset == null || (geo.offset.x == 0 && geo.offset.y == 0))
          );
        };

        // 设置动态样式改变标记
        graph.getView().updateStyle = true;
        // 覆盖 mxGraphModel.getStyle 以返回指定样式(连线结束的结点样式颜色)
        graph.model.getStyle = (cell: any): string | null => {
          const that = graph.model as any;
          if (cell != null) {
            let style = mi.mxGraphModel.prototype.getStyle.call(that, cell);
            if (that.isEdge(cell)) {
              let target = that.getTerminal(cell, false);
              if (target != null) {
                let targetStyle = (graph as any).getCurrentCellStyle(target);
                let fill = mi.mxUtils.getValue(
                  targetStyle,
                  mi.mxConstants.STYLE_FILLCOLOR,
                  ''
                );

                // if (fill != null) {
                //   style += ';strokeColor=' + fill;
                // } else {
                style += ';strokeColor=rgb(170, 183, 196)';
                // }
              }
            } else if (that.isVertex(cell)) {
              let geomotry = that.getGeometry(cell);
              if (geomotry != null && geomotry.width > 200) {
                style += ';fillColor=green';
              }
            }

            return style;
          }
          return null;
        };

        var parent = graph.getDefaultParent();

        // this.graph.getModel()
        graph.getModel().beginUpdate();
        try {
          var v1 = graph.insertVertex(
            parent,
            'v1',
            '你好，请问你是金先生吗?',
            400,
            20,
            180,
            30,
            'fillColor=white'
          );
          var v2 = graph.insertVertex(
            parent,
            'v2',
            '那就不打扰您了，再见!',
            600,
            150,
            180,
            30,
            'fillColor=white'
          );
          var v3 = graph.insertVertex(
            parent,
            'v3',
            '您好，我们是上海你我贷的，您之前在我们你我贷平台认购过， 您还有印象吗?',
            200,
            150,
            180,
            30,
            'fillColor=white'
          );
          var v4 = graph.insertVertex(
            parent,
            'v4',
            '新的回答',
            800,
            150,
            180,
            30,
            'fillColor=rgb(170,183,196)'
          );

          graph.insertEdge(
            parent,
            'e1',
            '不是',
            v1,
            v2,
            'perimeterSpacing=4;strokeWidth=2;labelBackgroundColor=white;fontStyle=1'
          );
          graph.insertEdge(
            parent,
            'e2',
            '是的',
            v1,
            v3,
            'perimeterSpacing=4;strokeWidth=2;labelBackgroundColor=white;fontStyle=1'
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
