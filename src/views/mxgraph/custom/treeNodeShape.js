import mi from '../util/mxgraph';
class TreeNodeShape extends mi.mxCylinder {
    constructor() {
        super(null, '', '');
        this.segment = 20;
    }
    apply(state) {
        super.apply(state);
        this.state = state;
    }
    redrawPath(path, x, y, w, h, isForeground) {
        if (this.state != null) {
            const graph = this.state.view.graph;
            const hasChildren = graph.model.getOutgoingEdges(this.state.cell).length > 0;
            if (isForeground) {
                if (hasChildren) {
                    // Painting outside of vertex bounds is used here
                    path.moveTo(w / 2, h + this.segment);
                    path.lineTo(w / 2, h);
                    path.end();
                }
            }
            else {
                path.moveTo(0, 0);
                path.lineTo(w, 0);
                path.lineTo(w, h);
                path.lineTo(0, h);
                path.close();
            }
        }
    }
}
mi.mxCellRenderer.registerShape('treeNodeShape', TreeNodeShape);
// Defines a custom perimeter for the nodes in the tree
mi.mxGraphView.prototype.updateFloatingTerminalPoint = function (edge, start, end, source) {
    var pt = null;
    if (source) {
        pt = new mi.mxPoint(start.x + start.width / 2, start.y + start.height + TreeNodeShape.prototype.segment);
    }
    else {
        pt = new mi.mxPoint(start.x + start.width / 2, start.y);
    }
    edge.setAbsoluteTerminalPoint(pt, source);
};
export default TreeNodeShape;
//# sourceMappingURL=treeNodeShape.js.map