<template>
  <div class="graph-test">
    <div class="title">
      <span>{{ title }}</span>
      <div class="testbut" @click="showNode">展示数据</div>
    </div>
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

  // NOTE: this是定义函数的上线文，setup内部使用箭头函数注入的this 是 setup定义的this(void)
  // NOTE: 所以内部的函数重定义用到了this，需要使用function去定义
  setup() {
    console.log('create MyFlow');
    const graphContainer = ref<Element>();

    const title = ref('话术流程图');
    let graph: mx.mxGraph = {} as mx.mxGraph;

    // 结点信息
    const nodesList = ref<Array<any>>([]);
    // 关系信息
    const nodeRelation = ref<Array<any>>([]);

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
        

        // 鼠标键盘事件处理
        new mi.mxKeyHandler(graph);
        // 矩形区域选框及事件处理
        new mi.mxRubberband(graph);

        // // 将标签截断为结点大小
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
            let max = geometry.width / (fontSize * 0.625);
            if (max < label.length) {
              return label.substring(0, max) + '...';
            }
          }
          return label;
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



        // // 设置动态样式改变标记
        graph.getView().updateStyle = true;
        // // 覆盖 mxGraphModel.getStyle 以返回指定样式(连线结束的结点样式颜色)
        // graph.model.getStyle = (cell: any): string | null => {
        //   const that = graph.model as any;
        //   if (cell != null) {
        //     let style = mi.mxGraphModel.prototype.getStyle.call(that, cell);
        //     if (that.isEdge(cell)) {
        //       let target = that.getTerminal(cell, false);
        //       if (target != null) {
        //         let targetStyle = (graph as any).getCurrentCellStyle(target);
        //         let fill = mi.mxUtils.getValue(
        //           targetStyle,
        //           mi.mxConstants.STYLE_FILLCOLOR,
        //           ''
        //         );

        //         // if (fill != null) {
        //         //   style += ';strokeColor=' + fill;
        //         // } else {
        //         style += ';strokeColor=rgb(170, 183, 196)';
        //         // }
        //       }
        //     } else if (that.isVertex(cell)) {
        //       let geomotry = that.getGeometry(cell);
        //       if (geomotry != null && geomotry.width > 200) {
        //         style += ';fillColor=green';
        //       }
        //     }

        //     return style;
        //   }
        //   return null;
        // };

        // 当鼠标移入结点时，高亮结点
        // const highlight = new mi.mxCellTracker(graph, '#00ff00');
        // 给graph添加一个点击事件， 并判断点击的cell是否有图层，有则删除，无则添加一个图层，并给图层添加一个点击事件
        // graph.addListener(mi.mxEvent.CLICK, (sender, evt) => {
        //   const cell = evt.getProperty('cell');
        //   if (cell != null) {
        //     const overlays = graph.getCellOverlays(cell);
        //     if (overlays == null) {
        //       // 创建一个图层
        //       let overlay = new mi.mxCellOverlay(
        //         new mi.mxImage('mxgraph/images/overlays/check.png', 16, 16),
        //         'Overlay Tooltip'
        //       );
        //       // 给图层添加一个点击事件
        //       // overlay.addListener(mi.mxEvent.CLICK, (sender, evt2) => {
        //       //   mi.mxUtils.alert('overlay clicked');
        //       // });

        //       // 将图层添加到cell中
        //       graph.addCellOverlay(cell, overlay);
        //     } else {
        //       graph.removeCellOverlays(cell);
        //     }
        //   }
        // });

        // 给graph添加双击事件
        // graph.addListener(mi.mxEvent.DOUBLE_CLICK, (sender, evt) => {
        //   const cell = evt.getProperty('cell');
        //   mi.mxUtils.alert('DoubleClick: ' + (cell != null ? 'Cell' : 'Graph'));
        //   evt.consume();
        // });

        const originSelectionCells = graph.connectionHandler.selectCells;
  graph.connectionHandler.selectCells = function (edge, target) {
    edge.setValue('请设置意图');
    originSelectionCells.call(this, edge, target);

    const source = edge.getTerminal(true);
    console.log('source:', source.getId(), source.getValue());
    const targ = edge.getTerminal(false);

    // TODO: 保存结点基本信息，返回结点id
    // 设置到结点的id中
    const date = new Date();
    targ.setId(date.getTime().toFixed());
    targ.setValue('请输入文本');
    edge.setId(source.getId() + 'To' + target.getId());

    const targNode = {
      id: targ.getId(),
      xpos: targ.getGeometry().x,
      ypos: targ.getGeometry().y,
      content: targ.getValue(),
      soundRecordable: false,
    };
    const relation = {
      edgeId: edge.getId(),
      sourceId: source.getId(),
      targetId: targ.getId(),
      intent: edge.getValue(),
    };

    nodesList.value.push(targNode);
    nodeRelation.value.push(relation);

    graph.refresh();
  };
  
        var parent = graph.getDefaultParent();

        // this.graph.getModel()
        graph.getModel().beginUpdate();
        try {
          const date = new Date();
          // 初始化时 就得添加一个结点，并返回id设置到结点id中
          var v1 = graph.insertVertex(
            parent,
            date.getTime().toFixed(),
            '开头语句填写',
            400,
            20,
            180,
            30,
            'fillColor=white'
          );
        } finally {
          graph.getModel().endUpdate();
        }
      }
    };

    const showNode = () => {
      console.log('结点列表', nodesList.value);
      console.log('关系列表', nodeRelation.value);
    };

    return {
      graphContainer,
      title,
      showNode,
    };
  },
});
</script>

<style></style>
