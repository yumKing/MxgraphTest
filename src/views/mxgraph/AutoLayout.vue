<template>
  <div class="graph-test">
    <div class="title">{{ title }}</div>
    <div ref="graphContainer" class="graph"></div>
  </div>
</template>

<script lang="ts">
import * as mx from 'mxgraph';
import mi from './util/mxgraph';
import { createBezierPoints } from './custom/MyEdgeStyle';

import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'AutoLayout',
  setup() {
    console.log('create AutoLayout');
    const graphContainer = ref<Element>();

    const title = ref('自动布局');
    let graph: mx.mxGraph = {} as mx.mxGraph;

    onMounted(() => {
      initContainer();
    });

    onBeforeUnmount(() => {
      console.log('destroy AutoLayout');
    });

    const initContainer = () => {
      if (!mi.mxClient.isBrowserSupported()) {
        mi.mxUtils.error('Browser is not supported!', 200, false);
      } else {
        const container = graphContainer.value as HTMLElement;
        mi.mxEvent.disableContextMenu(container);

        // mxCellRenderer: save origin class method
        const originInstallCellOverlayListeners =
          mi.mxCellRenderer.prototype.installCellOverlayListeners;
        // mxCellRenderer: override class method
        mi.mxCellRenderer.prototype.installCellOverlayListeners = (
          state,
          overlay,
          shape
        ) => {
          originInstallCellOverlayListeners.call(this, state, overlay, shape);

          mi.mxEvent.addListener(
            shape.node,
            mi.mxClient.IS_POINTER ? 'pointerdown' : 'mousedown',
            (evt: mx.mxEvent) => {
              overlay.fireEvent(
                new mi.mxEventObject(
                  'pointerdown',
                  'event',
                  evt,
                  'state',
                  state
                ),
                null
              );
            }
          );
          if (mi.mxClient.IS_POINTER && mi.mxClient.IS_TOUCH) {
            mi.mxEvent.addListener(
              shape.node,
              'touchstart',
              (evt: mx.mxEvent) => {
                overlay.fireEvent(
                  new mi.mxEventObject(
                    'pointerdown',
                    'event',
                    evt,
                    'state',
                    state
                  ),
                  null
                );
              }
            );
          }
        };

        // 自定义添加图层
        const addOverlay = (cell: mx.mxCell) => {
          // 创建一个新的图层: 图片+提示
          let overlay = new mi.mxCellOverlay(
            new mi.mxImage('mxgraph/images/add.png', 24, 24),
            'Add outgoing'
          );
          // 图层鼠标显示: 手
          overlay.cursor = 'hand';
          // 安装一个点击本图层的处理器
          overlay.addListener(mi.mxEvent.CLICK, (sender, evt) => {
            graph.clearSelection();
            const geo = graph.getCellGeometry(cell);
            let v2 = {} as mx.mxCell;
            executeLayout(
              () => {
                v2 = graph.insertVertex(
                  parent,
                  null,
                  'insertText',
                  geo.x,
                  geo.y,
                  80,
                  30
                );
                addOverlay(v2);
                graph.view.refresh();
                let e1 = graph.insertEdge(parent, null, 'connect', cell, v2);
              },
              () => {
                graph.scrollCellToVisible(v2);
              }
            );
          });
          // 指定 CMS 事件
          overlay.addListener('pointerdown', (sender, eo) => {
            let evt2 = eo.getProperty('event');
            let state = eo.getProperty('state');

            graph.popupMenuHandler.hideMenu();
            graph.stopEditing(false);
            const pt = mi.mxUtils.convertPoint(
              graph.container,
              mi.mxEvent.getClientX(evt2),
              mi.mxEvent.getClientY(evt2)
            );
            graph.connectionHandler.start(state, pt.x, pt.y, state);
            graph.isMouseDown = true;
            (graph as any).isMouseTrigger = mi.mxEvent.isMouseEvent(evt2);
          });

          // 给指定的单元添加图层
          graph.addCellOverlay(cell, overlay);
        };

        graph = new mi.mxGraph(container);
        // 设置结点形状
        const vertexStyle = graph.getStylesheet().getDefaultVertexStyle();
        // vertexStyle[mi.mxConstants.STYLE_SHAPE] = mi.mxConstants.;
        vertexStyle[mi.mxConstants.STYLE_ROUNDED] = '1';

        // 设置边为曲线，且设置边的label放在曲线上
        const edgeStyle = graph.getStylesheet().getDefaultEdgeStyle();
        edgeStyle[mi.mxConstants.STYLE_EDGE] = mi.mxConstants.STYLE_ORTHOGONAL;
        edgeStyle[mi.mxConstants.STYLE_CURVED] = '1';
        graph.view.getPoint = (state, geo) => {
          const points = createBezierPoints(state.absolutePoints, 5);
          return new mi.mxPoint(points[2].x, points[2].y);
        };
        // 允许平移
        graph.setPanning(true);
        // 使用left 按钮平移
        graph.panningHandler.useLeftButtonForPanning = true;
        // 不允许拖拽边
        graph.setAllowDanglingEdges(false);
        // 连接点不允许选择
        graph.connectionHandler.select = false;
        // 设置平移量
        const dx =
          (graph.container.clientWidth - graph.container.offsetLeft) / 2;
        graph.view.setTranslate(dx, 20);

        // new mi.mxRubberband(graph);
        const parent = graph.getDefaultParent();

        // this.graph.getModel()
        graph.getModel().beginUpdate();
        let v1 = {} as mx.mxCell;
        try {
          v1 = graph.insertVertex(parent, null, '开头语', 20, 20, 80, 30);
          addOverlay(v1);
        } finally {
          graph.getModel().endUpdate();
        }

        // 创建分层布局  mxCompactTreeLayout
        let layout = new mi.mxHierarchicalLayout(
          graph,
          mi.mxConstants.DIRECTION_NORTH
        );
        // let layout = new mi.mxHierarchicalLayout(
        //   graph,
        //   mi.mxConstants.DIRECTION_NORTH
        // );
        // 执行自定义布局逻辑
        const executeLayout = (change: any, post: any) => {
          graph.getModel().beginUpdate();
          try {
            if (change != null) {
              change();
            }
            layout.execute(graph.getDefaultParent());
          } catch (e) {
            throw e;
          } finally {
            let morph = new mi.mxMorphing(graph);
            morph.addListener(
              mi.mxEvent.DONE,
              mi.mxUtils.bind(this, () => {
                graph.getModel().endUpdate();
                if (post != null) {
                  post();
                }
              })
            );
            morph.startAnimation();
          }
        };
        // mxEdgeHander: save origin class method
        const originEdgeHandleConnect = mi.mxEdgeHandler.prototype.connect;
        // mxEdgeHander: overrdie class method
        mi.mxEdgeHandler.prototype.connect = (
          edge,
          terminal,
          isSource,
          isClone,
          me
        ) => {
          const cell = originEdgeHandleConnect.apply(this, [
            edge,
            terminal,
            isSource,
            isClone,
            me,
          ]);
          executeLayout(null, null);
          return cell;
        };

        graph.resizeCell = (cell, bounds, recurse) => {
          const cells = mi.mxGraph.prototype.resizeCell.apply(graph, [
            cell,
            bounds,
            recurse,
          ]);
          executeLayout(null, null);
          return cells;
        };
        graph.connectionHandler.addListener(mi.mxEvent.CONNECT, () => {
          executeLayout(null, null);
        });
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
