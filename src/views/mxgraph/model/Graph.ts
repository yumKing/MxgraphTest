import mi from '../util/mxgraph';
import * as mx from 'mxgraph';
import { urlParams } from './Init';

class Graph extends mi.mxGraph {
  // 触屏UI是否被使用， 在FF中不能探测触屏UI，因此总是要在windows/linux
  touchStyle =
    mi.mxClient.IS_TOUCH ||
    (mi.mxClient.IS_FF && mi.mxClient.IS_WIN) ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0 ||
    (window as any).urlParams == null ||
    urlParams['touch'] == '1';

  // 文件支持
  fileSupport = window.File != null && window.FileReader != null && window.FileList != null && ((window as any).urlParams == null || urlParams['filesupport'] != '0');

  // 翻译图表
  TranslateDiagram = urlParams['translate-diagram'] == '1';

  // 图表语言
  diagramLanguage = urlParams['diagram-language'] != null ? urlParams['diagram-language'] : (mi.mxClient as any).language;

  // 换行的默认大小 使能
  lineJumpsEnabled = true;
  defaultJumpSize = 6;

  themes: any;

  constructor(container: HTMLElement, model: mx.mxGraphModel | undefined, renderHint?: string | undefined, stylesheet?: mx.mxStylesheet | undefined, themes?: any, standalone?: boolean | undefined) {
    super(container, model, renderHint, stylesheet);
  }

  createSvgImage(w: number, h: number, data: string, coordWidth?: number, coordHeight?: number) {
    const tmp = unescape(
      encodeURIComponent(
        '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' +
          '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' +
          w +
          'px" height="' +
          h +
          'px" ' +
          (coordWidth != null && coordHeight != null ? 'viewBox="0 0 ' + coordWidth + ' ' + coordHeight + '" ' : '') +
          'version ="1.1">' +
          data +
          '</svg>'
      )
    );
    return;
  }
}
