import * as mx from 'mxgraph';
import mi from '../util/mxgraph';

// 生成贝塞尔曲线点
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
const multiPointBezier = (
  basePoint: Array<mx.mxPoint>,
  t: number
): mx.mxPoint => {
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
  basePoint: Array<mx.mxPoint>,
  amountPoints: number
): Array<mx.mxPoint> => {
  const points: Array<mx.mxPoint> = [];
  for (let i = 0; i < amountPoints; i++) {
    points.push(multiPointBezier(basePoint, i / amountPoints));
  }

  return points;
};

/**
 * 贝塞尔连线
 *
 * @param state
 * @param source
 * @param target
 * @param points
 * @param result
 */
export const BezierEdgeStyle = (
  state: mx.mxCellState,
  source: mx.mxCellState,
  target: mx.mxCellState,
  points: Array<mx.mxPoint>,
  result: Array<mx.mxPoint>
): void => {
  if (source != null && target != null) {
    const pt = new mi.mxPoint(target.getCenterX(), source.getCenterY());
    if (mi.mxUtils.contains(source, pt.x, pt.y)) {
      pt.y = source.y + source.height;
    }

    const basePoints: Array<mx.mxPoint> = [];
    basePoints.push(new mi.mxPoint(source.getCenterX(), source.getCenterY()));
    basePoints.push(pt);
    basePoints.push(new mi.mxPoint(target.getCenterX(), target.getCenterY()));
    const bps = createBezierPoints(
      basePoints,
      Math.abs(source.x + source.width - target.x) <= 100 &&
        Math.abs(source.y + source.height - target.y) <= 100
        ? 20
        : 40 *
            Math.floor(
              Math.max(
                Math.abs(source.x + source.width - target.x),
                Math.abs(source.y + source.height - target.y)
              ) / 100
            )
    );

    bps.forEach((p) => {
      // 把在source 和 target中的点去掉
      if (
        !mi.mxUtils.contains(source, p.x, p.y) &&
        !mi.mxUtils.contains(target, p.x, p.y)
      ) {
        result.push(p);
      }
    });
  }
};
