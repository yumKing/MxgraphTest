import factory, {
  mxGraph,
  mxCell,
  mxPoint,
  mxRectangle,
  mxAbstractCanvas2D,
  mxCellState,
} from 'mxgraph';

// (window as any)['mxBasePath'] = 'assets/mxgraph';
const mi = factory({
  mxBasePath: 'mxgraph',
});

export default mi;

/**
 * 创建一个基本的graph
 * @param container
 * @returns
 */
export function createGraph(container: HTMLElement): mxGraph {
  // 不允许内置的上下文菜单
  mi.mxEvent.disableContextMenu(container);

  mi.mxConnectionHandler.prototype.connectImage = new mi.mxImage(
    'mxgraph/images/connector.gif',
    16,
    16
  );

  const graph = new mi.mxGraph(container);
  // config graph
  // 设置结点样式
  const vertexStyle = graph.getStylesheet().getDefaultVertexStyle();
  // 端口约束
  vertexStyle[mi.mxConstants.STYLE_PORT_CONSTRAINT] = 'northsouth';
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
  // 和enableHtmlLabel 配合使用
  vertexStyle[mi.mxConstants.STYLE_WHITE_SPACE] = 'wrap';
  vertexStyle[mi.mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = '#ffffff';
  vertexStyle[mi.mxConstants.STYLE_FONTCOLOR] = 'rgba(0,0,0,.65)';
  vertexStyle[mi.mxConstants.STYLE_FONTFAMILY] =
    'Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Arial,sans-serif;';

  // 设置 连线样式为曲线
  const edgeStyle = graph.getStylesheet().getDefaultEdgeStyle();
  edgeStyle[mi.mxConstants.STYLE_EDGE] = mi.mxConstants.EDGESTYLE_ORTHOGONAL;
  edgeStyle[mi.mxConstants.STYLE_CURVED] = '1';
  // 设置曲线上的label位置
  graph.view.getPoint = (state, geo) => {
    const ponits = createBezierPoints(state.absolutePoints, 5);
    return new mi.mxPoint(ponits[2].x, ponits[2].y);
  };
  // 设置边的终端箭头样式
  edgeStyle[mi.mxConstants.STYLE_ENDARROW] = mi.mxConstants.ARROW_OPEN_THIN;
  // 边线条粗细
  edgeStyle[mi.mxConstants.STYLE_STROKECOLOR] = 'rgb(170, 183, 196)';
  edgeStyle[mi.mxConstants.STYLE_STROKEWIDTH] = 2;
  // 边连接时显示颜色
  edgeStyle[mi.mxConstants.EDGE_SELECTION_COLOR] = 'red';
  // 边端点与结点的距离
  edgeStyle[mi.mxConstants.STYLE_PERIMETER_SPACING] = 4;
  // 边label样式
  edgeStyle[mi.mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = '#ffffff';
  edgeStyle[mi.mxConstants.STYLE_FONTCOLOR] = 'rgb(68,98,153)';
  // edgeStyle[mi.mxConstants.STYLE_LABEL_WIDTH] = 16
  edgeStyle[mi.mxConstants.STYLE_FONTSTYLE] = '1';
  // 和enableHtmlLabel 配合使用
  // edgeStyle[mi.mxConstants.STYLE_WHITE_SPACE] = 'wrap';

  // 设置容器画布大小
  // Optional disabling of sizing
  // graph.setCellsResizable(false);
  // Configures the graph contains to resize and
  // add a border at the bottom, right
  // graph.setResizeContainer(true);
  // graph.minimumContainerSize = new mxRectangle(0, 0, 500, 380);
  // graph.setBorder(60);

  // 结点允许连线
  graph.setConnectable(true);
  // 允许移动边上的连接点
  graph.setConnectableEdges(false);
  // 不允许边移动
  graph.setAllowDanglingEdges(false);
  // cell中的文本提示
  graph.setTooltips(true);
  // 边和结点上的label不允许移动
  graph.edgeLabelsMovable = false;
  graph.vertexLabelsMovable = false;
  // 不允许重设结点宽高
  graph.setCellsResizable(false);
  // 不允许从父结点中移除cells
  graph.graphHandler.removeCellsFromParent = false;
  // 禁用浮动链接, (只使用在无连接图像上)
  if (graph.connectionHandler.connectImage == null) {
    graph.connectionHandler.isConnectableCell = (cell) => false;
    mi.mxEdgeHandler.prototype.isConnectableCell = (cell) => {
      // 这里直接使用外部的对象，不用 this(mxEdgeHandler).graph
      return graph.connectionHandler.isConnectableCell(cell);
    };
  }
  // 允许HTML label
  graph.setHtmlLabels(true);

  // 将节点约束在父节点内，不允许跑到父节点范围外
  graph.constrainChildren = true;

  // 配套使用，当连线没有指向目标结点，则创建目标结点, 默认是copy边的源作为目地结点
  graph.connectionHandler.createTarget = true;
  // const originCreateTargetVertex =
  //   graph.connectionHandler.createTargetVertex;
  // graph.connectionHandler.createTargetVertex = function (evt, source) {
  //   const target = originCreateTargetVertex.call(this, evt, source);

  //   // ports.push({ id: 'st' ,x: 0.75, y: 1, perimeter: true, constraint: 'southt' });
  //   target.setValue('请输入文本');
  //   return target;
  // };

  // const originSelectionCells = graph.connectionHandler.selectCells;
  // graph.connectionHandler.selectCells = function (edge, target) {
  //   edge.setValue('请设置意图');
  //   graph.refresh();
  //   console.log('edge: ', edge, target);
  //   originSelectionCells.call(this, edge, target);
  // };

  // 鼠标键盘事件处理
  new mi.mxKeyHandler(graph);
  // 矩形区域选框及事件处理
  new mi.mxRubberband(graph);

  // 边的标签不可编辑
  graph.isCellEditable = function (cell) {
    return !this.getModel().isEdge(cell);
  };

  // // 将标签截断为结点大小
  graph.getLabel = (cell) => {
    let label = graph.labelsVisible ? graph.convertValueToString(cell) : '';
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
        style[mi.mxConstants.STYLE_FONTSIZE] || mi.mxConstants.DEFAULT_FONTSIZE;
      let max = geometry.width / (fontSize * 0.625);
      if (max < label.length) {
        return label.substring(0, max) + '...';
      }
    }
    return label;
  };
  // 如果没有定义偏移量 使能 剪辑
  graph.isLabelClipped = (cell: mxCell): boolean => {
    let geo = graph.model.getGeometry(cell);
    return (
      geo != null &&
      !geo.relative &&
      (geo.offset == null || (geo.offset.x == 0 && geo.offset.y == 0))
    );
  };

  // // 设置动态样式改变标记
  graph.getView().updateStyle = true;

  // 鼠标左键按住平移整个图形
  graph.setAutoSizeCells(true);
  graph.setPanning(true);
  graph.panningHandler.useLeftButtonForPanning = true;

  //设置节点可以折叠
  graph.isCellFoldable = function (cell) {
    return this.model.getOutgoingEdges(cell).length > 0;
  };

  return graph;
}

/**
 * 自定义节点形状，折叠功能
 * @param graph
 */
class TreeNodeShape extends mi.mxCylinder {
  segment = 20;

  public constructor() {
    super(null as any, '', '');
  }

  public apply(state: mxCellState) {
    super.apply(state);
    this.state = state;
  }

  public redrawPath(
    path: mxAbstractCanvas2D,
    x: number,
    y: number,
    w: number,
    h: number,
    isForeground: boolean
  ) {
    if (this.state != null) {
      const graph = this.state.view.graph;
      const hasChildren =
        graph.model.getOutgoingEdges(this.state.cell).length > 0;

      if (isForeground) {
        if (hasChildren) {
          // Painting outside of vertex bounds is used here
          path.moveTo(w / 2, h + this.segment);
          path.lineTo(w / 2, h);
          path.end();
        }
      } else {
        path.moveTo(0, 0);
        path.lineTo(w, 0);
        path.lineTo(w, h);
        path.lineTo(0, h);
        path.close();
      }
    }
  }
}

export function setTreeNodeShape(graph: mxGraph) {
  mi.mxCellRenderer.registerShape('treeNodeShape', TreeNodeShape);

  // Defines a custom perimeter for the nodes in the tree
  mi.mxGraphView.prototype.updateFloatingTerminalPoint = function (
    edge,
    start,
    end,
    source
  ) {
    var pt = null;

    if (source) {
      pt = new mi.mxPoint(
        start.x + start.width / 2,
        start.y + start.height + TreeNodeShape.prototype.segment
      );
    } else {
      pt = new mi.mxPoint(start.x + start.width / 2, start.y);
    }

    edge.setAbsoluteTerminalPoint(pt, source);
  };

  // 配置自定义形状
  const style = graph.getStylesheet().getDefaultVertexStyle();
  style[mi.mxConstants.STYLE_SHAPE] = 'treeNodeShape';
  // 设置折叠图标
  mi.mxGraph.prototype.collapsedImage = new mi.mxImage(
    'mxgraph/images/collapsed.gif',
    9,
    9
  );
  mi.mxGraph.prototype.expandedImage = new mi.mxImage(
    'mxgraph/images/expanded.gif',
    9,
    9
  );
  // 定义折叠图标的位置
  graph.cellRenderer.getControlBounds = function (state) {
    if (state.control != null) {
      var oldScale = state.control.scale;
      var w = state.control.bounds.width / oldScale;
      var h = state.control.bounds.height / oldScale;
      var s = state.view.scale;

      return new mi.mxRectangle(
        state.x + state.width / 2 - (w / 2) * s,
        state.y +
          state.height +
          TreeNodeShape.prototype.segment * s -
          (h / 2) * s,
        w * s,
        h * s
      );
    }

    return {} as mxRectangle;
  };
  const toggleSubtree = function (
    graph: mxGraph,
    cell: mxCell,
    show?: boolean
  ) {
    show = show != null ? show : true;
    const cells: Array<mxCell> = [];

    graph.traverse(cell, true, (vertex: mxCell) => {
      if (vertex != cell) {
        cells.push(vertex);
      }

      // Stops recursion if a collapsed cell is seen
      return vertex == cell || !graph.isCellCollapsed(vertex);
    });

    graph.toggleCells(show, cells, true);
  };

  // 折叠图标点击折叠
  graph.foldCells = function (collapse, recurse, cells) {
    this.model.beginUpdate();
    try {
      toggleSubtree(this, cells[0], !collapse);
      this.model.setCollapsed(cells[0], collapse);

      // // Executes the layout for the new graph since
      // // changes to visiblity and collapsed state do
      // // not trigger a layout in the current manager.
      // layout.execute(graph.getDefaultParent());
    } finally {
      this.model.endUpdate();
    }

    return [];
  };
}

// 生成贝塞尔曲线点 ============================== START
const binomialBezier = (start: number, end: number): number => {
  let cs = 1;
  let bcs = 1;
  while (end > 0) {
    cs *= start;
    bcs *= end;
    start--;
    end--;
  }
  return cs / bcs;
};
const multiPointBezier = (basePoint: Array<mxPoint>, t: number): mxPoint => {
  const len = basePoint.length;
  let x = 0;
  let y = 0;
  for (let i = 0; i < len; i++) {
    const p = basePoint[i];
    x +=
      p.x *
      Math.pow(1 - t, len - 1 - i) *
      Math.pow(t, i) *
      binomialBezier(len - 1, i);
    y +=
      p.y *
      Math.pow(1 - t, len - 1 - i) *
      Math.pow(t, i) *
      binomialBezier(len - 1, i);
  }
  return new mi.mxPoint(Number(x.toFixed(2)), Number(y.toFixed(2)));
};

export const createBezierPoints = (
  basePoint: Array<mxPoint>,
  amountPoints: number
): Array<mxPoint> => {
  const points: Array<mxPoint> = [];
  for (let i = 0; i < amountPoints; i++) {
    points.push(multiPointBezier(basePoint, i / amountPoints));
  }

  return points;
};
// 生成贝塞尔曲线点 ============================== END
