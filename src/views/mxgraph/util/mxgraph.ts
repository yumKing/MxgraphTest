import factory, { mxGraph, mxCell, mxPoint, mxUtils, mxEvent } from 'mxgraph';
import { NodeInfo, RelationInfo } from '../model/node.model';

// (window as any)['mxBasePath'] = 'assets/mxgraph';
const mi = factory({
  mxBasePath: 'mxgraph',
});

export default mi;

export const graphConstants = {
  defaultPrologue: '请填写开头语',
  defaultIntent: '请设置意图',
  defaultQuestion: '请输入对话问题',
  vertexWidth: 180,
  vertexHeight: 30,
};

/**
 * 创建一个基本的graph
 * @param container
 * @returns
 */
export function createGraph(container: HTMLElement): mxGraph {
  // 不允许内置的上下文菜单
  mi.mxEvent.disableContextMenu(container);

  mi.mxConnectionHandler.prototype.connectImage = new mi.mxImage('mxgraph/images/dot.gif', 16, 16);

  const graph = new mi.mxGraph(container);

  setVertexInfo(graph);

  setEdgeInfo(graph);

  setGraphInfo(graph);

  setKeyHander(graph);

  setOverrideFunc(graph);

  // 矩形区域选框及事件处理
  new mi.mxRubberband(graph);

  return graph;
}

/**
 * 结点配置
 * @param graph
 */
export function setVertexInfo(graph: mxGraph) {
  // config graph
  // 设置结点样式
  const vertexStyle = graph.getStylesheet().getDefaultVertexStyle();
  // 结点填充
  vertexStyle[mi.mxConstants.STYLE_FILLCOLOR] = 'white';
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
  // 允许HTML label
  graph.setHtmlLabels(true);
  vertexStyle[mi.mxConstants.STYLE_WHITE_SPACE] = 'wrap';
  vertexStyle[mi.mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = '#ffffff';
  vertexStyle[mi.mxConstants.STYLE_FONTCOLOR] = 'rgba(0,0,0,.65)';
  vertexStyle[mi.mxConstants.STYLE_FONTFAMILY] = 'Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Arial,sans-serif;';
}

/**
 * 设置边信息
 * @param graph
 */
export function setEdgeInfo(graph: mxGraph) {
  // 设置 连线样式为曲线
  const edgeStyle = graph.getStylesheet().getDefaultEdgeStyle();
  edgeStyle[mi.mxConstants.STYLE_EDGE] = mi.mxConstants.EDGESTYLE_ORTHOGONAL;
  edgeStyle[mi.mxConstants.STYLE_CURVED] = '1';
  // 设置曲线上的label位置
  graph.view.getPoint = (state, geo) => {
    const ponits = createBezierPoints(state.absolutePoints, 5);
    return new mi.mxPoint(ponits[2].x, ponits[2].y);
  };
  // 禁止调整线条弯曲度
  graph.setCellsBendable(false);
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
  edgeStyle[mi.mxConstants.STYLE_FONTFAMILY] = 'Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Arial,sans-serif;';
  edgeStyle[mi.mxConstants.STYLE_FONTCOLOR] = 'rgb(31, 140, 236)';
  // edgeStyle[mi.mxConstants.STYLE_LABEL_WIDTH] = 16
  // edgeStyle[mi.mxConstants.STYLE_FONTSTYLE] = '1';
  // 和enableHtmlLabel 配合使用
  // edgeStyle[mi.mxConstants.STYLE_WHITE_SPACE] = 'wrap';
}

/**
 * graph 配置
 * @param graph
 */
export function setGraphInfo(graph: mxGraph) {
  // 设置容器画布大小
  // Optional disabling of sizing
  // graph.setCellsResizable(false);
  // Configures the graph contains to resize and
  // add a border at the bottom, right
  // graph.setResizeContainer(true);
  // graph.minimumContainerSize = new mi.mxRectangle(0, 0, 500, 380);
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

  // 将节点约束在父节点内，不允许跑到父节点范围外
  graph.constrainChildren = true;
  // graph.setResizeContainer(false);
  graph.centerZoom = false;
  // graph.extendParentsOnAdd = false

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
  // // 设置动态样式改变标记
  graph.getView().updateStyle = true;

  // 校验连线
  // graph.multiplicities.push(new mi.mxMultiplicity(true, 'Source', '','',1,1,['Source'], '数量测试校验', '类型测试校验', false))
  // 鼠标左键按住平移整个图形
  // Adds active border for panning inside the container
  // graph.createPanningManager = function () {
  //   var pm = new mi.mxPanningManager(this);
  //   pm.border = 30;

  //   return pm;
  // };
  // graph.allowAutoPanning = true;
  graph.setPanning(true);

  // graph.panningHandler.useLeftButtonForPanning = true;

  // graph.getModel().addListener(mi.mxEvent.CHANGE, (sender, evt) => {
  // console.log(sender, evt);
  // })
}

/**
 * 设置键盘鼠标事件处理
 * @param graph
 */
export function setKeyHander(graph: mxGraph) {
  // 鼠标键盘事件处理
  const keyHandler = new mi.mxKeyHandler(graph);
  keyHandler.bindKey(46, (evt) => {
    if (graph.isEnabled()) {
      graph.removeCells(null as any, true);
    }

    // console.log('evt: ', evt);
  });

  // 添加spance空格 加 滚轮 移动加放大缩小

  // Changes the zoom on mouseWheel events
  // mi.mxEvent.addMouseWheelListener(function (evt, up) {
  //   // 只能在画布内部才允许滚动

  //   if (!mi.mxEvent.isConsumed(evt)) {
  //     if (up) {
  //       graph.zoomIn();
  //       // editor.execute('zoomIn');
  //     } else {
  //       graph.zoomOut();
  //       // editor.execute('zoomOut');
  //     }

  //     mi.mxEvent.consume(evt);
  //   }
  // });

  // const originKeyDown = mi.mxKeyHandler.prototype.keyDown;
  // keyHandler.keyDown = function (evt) {
  // console.log(
  //   'keydown, code: ',
  //   evt.keyCode,
  //   evt.key, // 一般键
  //   evt.metaKey, // windows键
  //   evt.shiftKey, // shift
  //   evt.ctrlKey, // ctrl
  //   evt.altKey // alt
  // );
  // return originKeyDown.call(this, evt);
  // };
}

/**
 * 一些覆盖方法的重写
 * @param graph
 */
export function setOverrideFunc(graph: mxGraph) {
  // const originSelectCells = graph.getSelectionCells;
  // graph.getSelectionCells = function () {
  //   const selectCells = originSelectCells.call(this);
  //   if (selectCells != null && selectCells.length > 0) {
  //     return selectCells.filter((cell) => !cell.getAttribute('root', false));
  //   }
  //   return selectCells;
  // };

  // // 将标签截断为结点大小
  graph.getLabel = (cell) => {
    const label = graph.labelsVisible ? graph.convertValueToString(cell) : '';
    const geometry = graph.model.getGeometry(cell);
    if (!graph.model.isCollapsed(cell) && geometry != null && (geometry.offset == null || (geometry.offset.x == 0 && geometry.offset.y == 0)) && graph.model.isVertex(cell) && geometry.width >= 2) {
      const style = graph.getCellStyle(cell);
      const fontSize = style[mi.mxConstants.STYLE_FONTSIZE] || mi.mxConstants.DEFAULT_FONTSIZE;
      const max = geometry.width / (fontSize * 0.625);
      if (max < label.length) {
        return label.substring(0, max) + '...';
      }
    }
    return label;
  };

  // 边的标签不可编辑
  // graph.isCellEditable = function (cell) {
  //   return !this.getModel().isEdge(cell);
  // };
  // graph.autoSizeCellsOnAdd = true;
  // graph.isCellResizable = function (cell) {
  //   var geo = this.model.getGeometry(cell);

  //   return geo == null || !geo.relative;
  // };
  // // Enables wrapping for vertex labels
  // graph.isWrapping = function (cell) {
  //   return this.model.isCollapsed(cell);
  // };

  // 如果没有定义偏移量 使能 剪辑
  graph.isLabelClipped = (cell: mxCell): boolean => {
    const geo = graph.model.getGeometry(cell);
    return geo != null && !geo.relative && (geo.offset == null || (geo.offset.x == 0 && geo.offset.y == 0));
  };
}

/**
 * 创建结点
 * @param graph
 * @param info
 * @returns
 */
export function createNode(graph: mxGraph, info: NodeInfo): mxCell {
  const parent = graph.getDefaultParent();
  graph.getModel().beginUpdate();
  let cell = {} as mxCell;
  try {
    // 初始化时 就得添加一个结点，并返回id设置到结点id中
    cell = graph.insertVertex(parent, info.id, info.content, info.xpos, info.ypos, graphConstants.vertexWidth, graphConstants.vertexHeight);
    // cell.geometry.alternateBounds = new mi.mxRectangle(
    //   0,
    //   0,
    //   graphConstants.vertexWidth,
    //   graphConstants.vertexHeight
    // );
  } finally {
    graph.getModel().endUpdate();
  }
  return cell;
}

/**
 *
 * @param graph 创建结点关系
 * @param info
 * @returns
 */
export function createRelation(graph: mxGraph, info: RelationInfo): mxCell {
  const parent = graph.getDefaultParent();
  graph.getModel().beginUpdate();
  let cell = {} as mxCell;
  try {
    // 初始化时 就得添加一个结点，并返回id设置到结点id中
    cell = graph.insertEdge(parent, info.id, info.intent, graph.getModel().getCell(info.sourceId), graph.getModel().getCell(info.targetId));
  } finally {
    graph.getModel().endUpdate();
  }
  return cell;
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
    x += p.x * Math.pow(1 - t, len - 1 - i) * Math.pow(t, i) * binomialBezier(len - 1, i);
    y += p.y * Math.pow(1 - t, len - 1 - i) * Math.pow(t, i) * binomialBezier(len - 1, i);
  }
  return new mi.mxPoint(Number(x.toFixed(2)), Number(y.toFixed(2)));
};

export const createBezierPoints = (basePoint: Array<mxPoint>, amountPoints: number): Array<mxPoint> => {
  const points: Array<mxPoint> = [];
  for (let i = 0; i < amountPoints; i++) {
    points.push(multiPointBezier(basePoint, i / amountPoints));
  }

  return points;
};
// 生成贝塞尔曲线点 ============================== END
