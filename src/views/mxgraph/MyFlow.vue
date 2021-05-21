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
        // 不允许内置的上下文菜单
        mi.mxEvent.disableContextMenu(container);

        graph = new mi.mxGraph(container);
        // config graph
        // 设置结点样式
        const vertexStyle = graph.getStylesheet().getDefaultVertexStyle();
        // 边缘为圆角
        vertexStyle[mi.mxConstants.STYLE_ROUNDED] = '1';
        // 启用结点阴影
        vertexStyle[mi.mxConstants.STYLE_SHADOW] = true;
        // 结点边框透明
        vertexStyle[mi.mxConstants.STYLE_STROKECOLOR] = 'transparent';
        // 阴影颜色
        mi.mxConstants.SHADOWCOLOR = '#cdcdcd';
        // 阴影相对结点右偏移
        mi.mxConstants.SHADOW_OFFSET_X = 3;
        // 阴影相对结点下偏移
        mi.mxConstants.SHADOW_OFFSET_Y = 3;
        // 阴影透明度
        mi.mxConstants.SHADOW_OPACITY = 0.3;
        // 结点label样式
        vertexStyle[mi.mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = '#ffffff'
        vertexStyle[mi.mxConstants.STYLE_FONTCOLOR] = 'rgba(0,0,0,.65)'
        vertexStyle[mi.mxConstants.STYLE_FONTFAMILY] = 'Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Arial,sans-serif;'

        // 设置 连线样式为曲线
        const edgeStyle = graph.getStylesheet().getDefaultEdgeStyle();
        edgeStyle[mi.mxConstants.STYLE_EDGE] =
          mi.mxConstants.EDGESTYLE_ORTHOGONAL;
        edgeStyle[mi.mxConstants.STYLE_CURVED] = '1';
        graph.view.getPoint = (state, geo) => {
          const ponits = createBezierPoints(state.absolutePoints, 5);
          return new mi.mxPoint(ponits[2].x, ponits[2].y);
        };
        edgeStyle[mi.mxConstants.STYLE_ENDARROW] =
          mi.mxConstants.ARROW_OPEN_THIN;
        // 连线线条粗细
        edgeStyle[mi.mxConstants.EDGE_SELECTION_STROKEWIDTH] = 2
        // 连线线条颜色
        edgeStyle[mi.mxConstants.EDGE_SELECTION_COLOR] = 'white'
        // 连线端点与结点的距离
        edgeStyle[mi.mxConstants.STYLE_PERIMETER_SPACING] = 4
        // 连线label样式
        edgeStyle[mi.mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = '#ffffff'
        edgeStyle[mi.mxConstants.STYLE_FONTCOLOR] = 'rgb(68,98,153)'
        edgeStyle[mi.mxConstants.STYLE_FONTSTYLE] = '1'

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
        // 不允许重设结点宽高
        graph.setCellsResizable(false)
        // 不允许从父结点中移除cells
        graph.graphHandler.removeCellsFromParent = false;

        new mi.mxKeyHandler(graph);
        new mi.mxRubberband(graph);

        
        // // 将标签截断为顶点大小
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
        // // 使能包装 顶点标签
        // graph.isWrapping = (cell: any) => {
        //   return graph.model.isCollapsed(cell);
        // };
        // // 如果没有定义偏移量 使能 剪辑
        graph.isLabelClipped = (cell: mx.mxCell): boolean => {
          let geo = graph.model.getGeometry(cell);
          return (
            geo != null &&
            !geo.relative &&
            (geo.offset == null || (geo.offset.x == 0 && geo.offset.y == 0))
          );
        };

        // // 设置动态样式改变标记
        // graph.getView().updateStyle = true;
        // // 覆盖 mxGraphModel.getStyle 以返回指定样式(连线结束的结点样式颜色)
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

        // 当鼠标移入结点时，高亮结点
        const highlight = new mi.mxCellTracker(graph, '#00ff00');
        // 给graph添加一个点击事件， 并判断点击的cell是否有图层，有则删除，无则添加一个图层，并给图层添加一个点击事件
        graph.addListener(mi.mxEvent.CLICK, (sender, evt) => {
          const cell = evt.getProperty('cell');
          if (cell != null) {
            const overlays = graph.getCellOverlays(cell);
            if (overlays == null) {
              // 创建一个图层
              let overlay = new mi.mxCellOverlay(
                new mi.mxImage('mxgraph/images/overlays/check.png', 16, 16),
                'Overlay Tooltip'
              );
              // 给图层添加一个点击事件
              overlay.addListener(mi.mxEvent.CLICK, (sender, evt2) => {
                mi.mxUtils.alert('overlay clicked');
              });

              // 将图层添加到cell中
              graph.addCellOverlay(cell, overlay);
            } else {
              graph.removeCellOverlays(cell);
            }
          }
        });

        // 给graph添加双击事件
        graph.addListener(mi.mxEvent.DOUBLE_CLICK, (sender, evt) => {
          const cell = evt.getProperty('cell');
          mi.mxUtils.alert('DoubleClick: ' + (cell != null ? 'Cell' : 'Graph'));
          evt.consume();
        });

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
