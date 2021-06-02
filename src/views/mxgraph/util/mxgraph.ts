import factory, { mxGraph, mxCell } from 'mxgraph';
import { createBezierPoints } from '../custom/MyEdgeStyle';

// (window as any)['mxBasePath'] = 'assets/mxgraph';
const mi = factory({
  mxBasePath: 'mxgraph',
});

export default mi;

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
  edgeStyle[mi.mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = '#f0f6fe';
  edgeStyle[mi.mxConstants.STYLE_FONTFAMILY] =
    'Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Arial,sans-serif;';
  edgeStyle[mi.mxConstants.STYLE_FONTCOLOR] = 'rgb(31, 140, 236)';
  // edgeStyle[mi.mxConstants.STYLE_LABEL_WIDTH] = 16
  // edgeStyle[mi.mxConstants.STYLE_FONTSTYLE] = '1';
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

  // // 只允许结点可以折叠
  // graph.isCellFoldable = function(cell: mxCell,collapse:boolean){
  //   return this.getModel().isVertex(cell)
  // }
  // // 折叠的结点不允许连接
  // graph.isCellConnectable = function(cell){
  //   return !this.isCellCollapsed(cell);
  // }

  // 将无周长的边的连接点设置为固定点
  // graph.view.updateFixedTerminalPoint = (
  //   edge,
  //   terminal,
  //   source,
  //   constraints
  // ) => {
  //   mi.mxGraphView.prototype.updateFixedTerminalPoint.call(
  //     graph.view,
  //     edge,
  //     terminal,
  //     source,
  //     constraints
  //   );
  //   let pts = edge.absolutePoints;
  //   let pt = pts[source ? 0 : pts.length - 1];
  //   if (
  //     terminal != null &&
  //     // pt == null &&
  //     graph.view.getPerimeterFunction(terminal) == null
  //   ) {
  //     edge.setAbsoluteTerminalPoint(
  //       new mi.mxPoint(
  //         graph.view.getRoutingCenterX(terminal),
  //         graph.view.getRoutingCenterY(terminal)
  //       ),
  //       source
  //     );
  //   }
  // };

  // const originSelectionCells = graph.connectionHandler.selectCells;
  // graph.connectionHandler.selectCells = function (edge, target) {
  //   edge.setValue('请设置意图');
  //   graph.refresh();
  //   console.log('edge: ', edge, target);
  //   originSelectionCells.call(this, edge, target);
  // };

  // 鼠标键盘事件处理
  const keyHandler = new mi.mxKeyHandler(graph);
  const originSelectCells = graph.getSelectionCells;
  graph.getSelectionCells = function () {
    const selectCells = originSelectCells.call(this);
    if (selectCells != null && selectCells.length > 0) {
      return selectCells.filter((cell) => !cell.getAttribute('root', false));
    }
    return selectCells;
  };
  keyHandler.bindKey(46, (evt) => {
    if (graph.isEnabled()) {
      graph.removeCells(null as any, true);
    }

    console.log('evt: ', evt);
  });
  const originKeyDown = mi.mxKeyHandler.prototype.keyDown;
  keyHandler.keyDown = function (evt) {
    console.log(
      'keydown, code: ',
      evt.keyCode,
      evt.key, // 一般键
      evt.metaKey, // windows键
      evt.shiftKey, // shift
      evt.ctrlKey, // ctrl
      evt.altKey // alt
    );
    return originKeyDown.call(this, evt);
  };

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

  // 校验连线
  // graph.multiplicities.push(new mi.mxMultiplicity(true, 'Source', '','',1,1,['Source'], '数量测试校验', '类型测试校验', false))
  // graph.getModel().addListener(mi.mxEvent.CHANGE, (sender, evt) => graph.validateGraph(null as any, null))

  return graph;
}
