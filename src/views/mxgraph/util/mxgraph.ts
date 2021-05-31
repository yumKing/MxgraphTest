import factory, { mxGraph } from 'mxgraph';

// (window as any)['mxBasePath'] = 'assets/mxgraph';
const mi = factory({
  mxBasePath: 'mxgraph',
});

// 创建一个基础的graph对象，并设置基础的样式
export function createGraph(container: HTMLElement): mxGraph {
  // 不允许内置的上下文菜单
  mi.mxEvent.disableContextMenu(container);

  // 添加边的连接点约束
  // mi.mxShape.prototype.constraints = [
  //   // left
  //   // new mi.mxConnectionConstraint(new mi.mxPoint(0, 0.25), true),
  //   // new mi.mxConnectionConstraint(new mi.mxPoint(0, 0.5), true),
  //   // new mi.mxConnectionConstraint(new mi.mxPoint(0, 0.75), true),

  //   // top
  //   // new mi.mxConnectionConstraint(new mi.mxPoint(0.25, 0), true),
  //   new mi.mxConnectionConstraint(new mi.mxPoint(0.5, 0), true),
  //   // new mi.mxConnectionConstraint(new mi.mxPoint(0.75, 0), true),

  //   // bottom
  //   new mi.mxConnectionConstraint(new mi.mxPoint(0.25, 1), true),
  //   new mi.mxConnectionConstraint(new mi.mxPoint(0.5, 1), true),
  //   new mi.mxConnectionConstraint(new mi.mxPoint(0.75, 1), true),

  //   // right
  //   // new mi.mxConnectionConstraint(new mi.mxPoint(1, 0.25), true),
  //   // new mi.mxConnectionConstraint(new mi.mxPoint(1, 0.5), true),
  //   // new mi.mxConnectionConstraint(new mi.mxPoint(1, 0.75), true),
  // ];
  // mi.mxPolyline.prototype.constraints = [];
  // // graph 处理获取所有连接点约束
  // mi.mxGraph.prototype.getAllConnectionConstraints = (
  //   terminal,
  //   source
  // ) => {
  //   if (terminal != null && terminal.shape != null) {
  //     if (terminal.shape.stencil != null) {
  //       // 如果该结点的形状是根据指定模板创建的，且模板里的约束点
  //       if (terminal.shape.stencil.constraints != null) {
  //         return terminal.shape.stencil.constraints;
  //       }
  //     } else if (terminal.shape.constraints != null) {
  //       // 返回结点本身的形状中的约束点
  //       return terminal.shape.constraints;
  //     }
  //   }

  //   return [];
  // };

  // 捕捉结点固定点，限定连线点只能是指定位置的端点
  // 如果 icon形状的矩形与mouse矩形有交叉，则返回true
  // mi.mxConstraintHandler.prototype.intersects = (
  //   icon,
  //   mouse,
  //   source,
  //   existingEdge
  // ) => {
  //   return (
  //     !source ||
  //     existingEdge != null ||
  //     mi.mxUtils.intersects(icon.bounds, mouse)
  //   );
  // };
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
  edgeStyle[mi.mxConstants.STYLE_EDGE] =
    mi.mxConstants.EDGESTYLE_ORTHOGONAL;
  edgeStyle[mi.mxConstants.STYLE_CURVED] = '1';
  // 设置曲线上的label位置
  graph.view.getPoint = (state, geo) => {
    const ponits = createBezierPoints(state.absolutePoints, 5);
    return new mi.mxPoint(ponits[2].x, ponits[2].y);
  };
  // 设置边的终端箭头样式
  edgeStyle[mi.mxConstants.STYLE_ENDARROW] =
    mi.mxConstants.ARROW_OPEN_THIN;
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

  // 动态生成连接点
  // const ports: Array<any> = [];
  // ports.push({
  //   id: 's',
  //   x: 0.5,
  //   y: 1,
  //   perimeter: true,
  //   constraint: 'south',
  // });
  // graph.getAllConnectionConstraints = function (terminal, source) {
  //   if (
  //     terminal != null &&
  //     terminal.shape != null &&
  //     terminal.shape.stencil != null
  //   ) {
  //     return terminal.shape.stencil.constraints;
  //   } else if (terminal != null && this.model.isVertex(terminal.cell)) {
  //     if (terminal.shape != null) {
  //       const cstrs: Array<mx.mxConnectionConstraint> = [];
  //       for (let index in ports) {
  //         const pt = ports[index];
  //         let cstr: any = new mi.mxConnectionConstraint(
  //           new mi.mxPoint(pt.x, pt.y),
  //           pt.perimeter
  //         );
  //         cstr.id = pt.id;
  //         cstrs.push(cstr);
  //       }
  //       return cstrs;
  //     }
  //   }
  //   return [];
  // };

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

  // 目标边界点
  // const originConnect = graph.connectionHandler.connect
  // graph.connectionHandler.connect = function(source, target, evt, dropTarget){

  //   console.log("source111: ", this.sourceConstraint)
  //   console.log("target111: ", this.constraintHandler.currentConstraint)

  //   originConnect.call(this,source, target, evt, dropTarget)
  // }
  // const originMouseDown = graph.connectionHandler.mouseDown;
  // graph.connectionHandler.mouseDown = function(sender, me){
  //   originMouseDown.call(this,sender, me)
  //   console.log("source: ", this.sourceConstraint)
  // }
  // const originMouseUp = graph.connectionHandler.mouseUp;
  // graph.connectionHandler.mouseUp = function(sender, me){
  //     originMouseUp.call(this, sender,me)

  //     console.log("source: ", this.sourceConstraint)
  // }
  // const originRest = graph.connectionHandler.reset;
  // graph.connectionHandler.reset = function () {
  //   console.log('connectHandle:', this);
  //   const that = this as any;
  //   console.log(
  //     that.previous,
  //     that.constraintHandler.currentConstraint,
  //     that.currentState != null ? that.currentState.cell: 'null'
  //   );
  //   originRest.call(this);
  // };
  
  // const originTragetPoint = graph.connectionHandler.getTargetPerimeterPoint;
  // graph.connectionHandler.getTargetPerimeterPoint = function(state, me){
  //     const point = originTragetPoint.call(this, state, me)
  //     console.log("target: ",point)
  //     return point
  // }
  // graph.connectionHandler.targetConnectImage;
  // graph.connectionHandler.getEdgeColor;
  // graph.connectionHandler.getEdgeWidth;
  // 源边界点
  // const originSourcePoint = graph.connectionHandler.getSourcePerimeterPoint;
  // graph.connectionHandler.getSourcePerimeterPoint = function(state, next,me){
  //   const point = originSourcePoint.call(this, state, next, me)
  //   console.log("source: ",point)
  //   return point
  // }
  // graph.connectionHandler.sourceConstraint;
  // graph.connectionHandler.constraintHandler.currentConstraint

  // 将无周长的边的连接点设置为固定点
  // const originUpdatePoints = graph.view.updatePoints;
  // graph.view.updatePoints = function(edge, points, source, target){
  //   originUpdatePoints.call(this, edge, points, source, target)
  //   console.log("edge: ", edge)
  // }
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

  return graph;
}



export default mi;


