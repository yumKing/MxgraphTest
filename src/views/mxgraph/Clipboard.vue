<template>
  <div class="graph-test">
    <div class="title">{{ title }}</div>
    <div ref="graphContainer" class="graph"></div>
  </div>
</template>

<script lang="ts">
import * as mx from 'mxgraph';
import mi from './util/mxgraph';

import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'Clipboard',
  setup() {
    console.log('create Clipboard');
    const graphContainer = ref<Element>();

    const title = ref('粘贴板');
    let graph: mx.mxGraph = {} as mx.mxGraph;

    onMounted(() => {
      initContainer();
    });

    onBeforeUnmount(() => {
      console.log('destroy Clipboard');
    });

    const initContainer = () => {
      if (!mi.mxClient.isBrowserSupported()) {
        mi.mxUtils.error('Browser is not supported!', 200, false);
      } else {
        const container = graphContainer.value as HTMLElement;
        mi.mxEvent.disableContextMenu(container);

        graph = new mi.mxGraph(container);

        // 公共方法 for 粘贴板
        (mi.mxClipboard as any).cellsToString = (cells: any): string => {
          let codec = new mi.mxCodec();
          let model = new mi.mxGraphModel(graph.getDefaultParent());
          let parent = model.getChildAt(model.getRoot(), 0);
          for (let i = 0; i < cells.length; i++) {
            model.add(parent, cells[i]);
          }

          return mi.mxUtils.getXml(codec.encode(model));
        };

        //  在 ctrl 或者 元的按键事件 期间 聚焦可见的文本域
        let textInput = document.createElement('textarea');
        mi.mxUtils.setOpacity(textInput, 0);
        textInput.style.width = '1px';
        textInput.style.height = '1px';
        let restoreFocus = false;
        let gs = graph.gridSize;
        let lastPaste = '';
        let dx = 0;
        let dy = 0;
        textInput.value = ' ';

        // 当 ctrl 被压下处理本地粘贴行为时展示 文本
        mi.mxEvent.addListener(document, 'keydown', (evt: any) => {
          // no dialog visible
          let source = mi.mxEvent.getSource(evt);
          if (
            graph.isEnabled() &&
            !graph.isMouseDown &&
            !graph.isEditing() &&
            source.nodeName != 'INPUT'
          ) {
            if (
              evt.keyCode == 224 /* FF */ ||
              (!mi.mxClient.IS_MAC && evt.keyCode == 17) /* Control */ ||
              (mi.mxClient.IS_MAC &&
                (evt.keyCode == 91 || evt.keyCode == 93)) /* Left/Right Meta */
            ) {
              if (!restoreFocus) {
                textInput.style.position = 'absolute';
                textInput.style.left = graph.container.scrollLeft + 10 + 'px';
                textInput.style.top = graph.container.scrollTop + 10 + 'px';
                graph.container.appendChild(textInput);

                restoreFocus = true;
                textInput.focus();
                textInput.select();
              }
            }
          }
        });

        // 恢复容器的聚焦 并从DOM中移除 textinput
        mi.mxEvent.addListener(document, 'keyup', (evt: any) => {
          if (
            (restoreFocus && evt.keyCode == 224) ||
            evt.keyCode == 17 ||
            evt.keyCode == 91 ||
            evt.keyCode == 93
          ) {
            restoreFocus = false;
            if (!graph.isEditing()) {
              graph.container.focus();
            }

            textInput.parentNode?.removeChild(textInput);
          }
        });

        // 将给定单元格的XML插入textinput 为了复制的目的
        const copyCells = (graph: mx.mxGraph, cells: any): void => {
          if (cells.length > 0) {
            let clones = graph.cloneCells(cells);

            for (let i = 0; i < clones.length; i++) {
              let state = graph.view.getState(cells[i]);
              if (state != null) {
                let geo = graph.getCellGeometry(clones[i]);
                if (geo != null && geo.relative) {
                  geo.relative = false;
                  geo.x = state.x / state.view.scale - state.view.translate.x;
                  geo.y = state.y / state.view.scale - state.view.translate.y;
                }
              }
            }

            textInput.value = (mi.mxClipboard as any).cellsToString(clones);
          }

          textInput.select();
          lastPaste = textInput.value;
        };

        // 通过放置选择的XML到textInput 处理copy事件
        mi.mxEvent.addListener(
          textInput,
          'copy',
          mi.mxUtils.bind(this, (evt: any) => {
            if (graph.isEnabled() && !graph.isSelectionEmpty()) {
              copyCells(
                graph,
                mi.mxUtils.sortCells(
                  graph.model.getTopmostCells(graph.getSelectionCells())
                )
              );
              dx = 0;
              dy = 0;
            }
          })
        );

        // 处理 cut 事件
        mi.mxEvent.addListener(
          textInput,
          'cut',
          mi.mxUtils.bind(this, (evt: any) => {
            if (graph.isEnabled() && !graph.isSelectionEmpty()) {
              copyCells(graph, graph.removeCells([]));
              dx = -gs;
              dy = -gs;
            }
          })
        );

        // 合并XML 到存在的graph 和layers中
        const importXml = (xml: any, dx: any, dy: any) => {
          dx = dx != null ? dx : 0;
          dy = dy != null ? dy : 0;
          let cells: Array<mx.mxCell> = [];
          try {
            const doc = mi.mxUtils.parseXml(xml);
            const node = doc.documentElement;
            if (node != null) {
              let model = new mi.mxGraphModel(graph.getDefaultParent());
              let codec = new mi.mxCodec(node.ownerDocument);
              codec.decode(node, model);

              let childCount = model.getChildCount(model.getRoot());
              let targetChildCount = graph.model.getChildCount(
                graph.model.getRoot()
              );

              graph.model.beginUpdate();
              try {
                for (let i = 0; i < childCount; i++) {
                  let parent = model.getChildAt(model.getRoot(), i);
                  if (targetChildCount > i) {
                    let target =
                      childCount == 1
                        ? graph.getDefaultParent()
                        : graph.model.getChildAt(graph.model.getRoot(), i);
                    if (!graph.isCellLocked(target)) {
                      let children = model.getChildren(parent);
                      cells = cells.concat(
                        graph.importCells(children, dx, dy, target)
                      );
                    }
                  } else {
                    parent = graph.importCells(
                      [parent],
                      0,
                      0,
                      graph.model.getRoot()
                    )[0];
                    let children = graph.model.getChildren(parent);
                    graph.moveCells(children, dx, dy, false);
                    cells = cells.concat(children);
                  }
                }
              } finally {
                graph.model.endUpdate();
              }
            }
          } catch (e) {
            alert(e);
            throw e;
          }

          return cells;
        };

        // 解析 和插入 xml 到 graph
        const pasteText = (text: string): void => {
          const xml = mi.mxUtils.trim(text, '');
          let x =
            graph.container.scrollLeft / graph.view.scale -
            graph.view.translate.x;
          let y =
            graph.container.scrollTop / graph.view.scale -
            graph.view.translate.y;

          if (xml != null && xml.length > 0) {
            if (lastPaste != xml) {
              lastPaste = xml;
              dx = 0;
              dy = 0;
            } else {
              dx += gs;
              dy += gs;
            }

            if (xml.substring(0, 14) == '<mxGraphModel>') {
              graph.setSelectionCells(importXml(xml, dx, dy));
              graph.scrollCellToVisible(graph.getSelectionCell());
            }
          }
        };

        // 跨浏览器函数从粘贴事件获取文本
        const extractGraphModelFromEvent = (evt: any): any => {
          let data = null;
          if (evt != null) {
            const provider =
              evt.dataTransfer != null ? evt.dataTransfer : evt.clipboardData;
            if (provider != null) {
              if (
                (document as any).documentMode == 10 ||
                (document as any).documentMode == 11
              ) {
                data = provider.getData('Text');
              } else {
                data =
                  mi.mxUtils.indexOf(provider.types, 'text/html') >= 0
                    ? provider.getData('text/html')
                    : null;
                if (
                  mi.mxUtils.indexOf(provider.types, 'text/plain') &&
                  (data == null || data.length == 0)
                ) {
                  data = provider.getData('text/plain');
                }
              }
            }
          }
          return data;
        };

        // 处理粘贴事件 在解析和插入xml时
        mi.mxEvent.addListener(textInput, 'paste', (evt: any) => {
          textInput.value = '';
          if (graph.isEnabled()) {
            let xml = extractGraphModelFromEvent(evt);
            if (xml != null && xml.length > 0) {
              pasteText(xml);
            } else {
              window.setTimeout(
                mi.mxUtils.bind(this, () => {
                  pasteText(textInput.value);
                }),
                0
              );
            }
          }
          textInput.select();
        });

        new mi.mxRubberband(graph);
        var parent = graph.getDefaultParent();

        // this.graph.getModel()
        graph.getModel().beginUpdate();
        try {
          var v1 = graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30);
          var v2 = graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30);
          graph.insertEdge(parent, '', '', v1, v2, 'noLabel=1;strokeColor=red');
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
