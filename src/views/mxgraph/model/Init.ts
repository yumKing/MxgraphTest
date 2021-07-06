export const urlParams: any = (function (url) {
  const result: { [key: string]: string } = {};
  let idx = url.lastIndexOf('?');

  if (idx > 0) {
    const params: Array<string> = url.substring(idx + 1).split('&');

    for (let i = 0; i < params.length; i++) {
      idx = params[i].indexOf('=');

      if (idx > 0) {
        result[params[i].substring(0, idx)] = params[i].substring(idx + 1);
      }
    }
  }

  return result;
})(window.location.href);

// urlParams is null when used for embedding
(window as any).urlParams = (window as any).urlParams || {};

// Public global variables
(window as any).MAX_REQUEST_SIZE = (window as any).MAX_REQUEST_SIZE || 10485760;
(window as any).MAX_AREA = (window as any).MAX_AREA || 15000 * 15000;

// URLs for save and export
(window as any).EXPORT_URL = (window as any).EXPORT_URL || '/export';
(window as any).SAVE_URL = (window as any).SAVE_URL || '/save';
(window as any).OPEN_URL = (window as any).OPEN_URL || '/open';
(window as any).RESOURCES_PATH = (window as any).RESOURCES_PATH || 'resources';
(window as any).RESOURCE_BASE = (window as any).RESOURCE_BASE || (window as any).RESOURCES_PATH + '/grapheditor';
(window as any).STENCIL_PATH = (window as any).STENCIL_PATH || 'stencils';
(window as any).IMAGE_PATH = (window as any).IMAGE_PATH || 'images';
(window as any).STYLE_PATH = (window as any).STYLE_PATH || 'styles';
(window as any).CSS_PATH = (window as any).CSS_PATH || 'styles';
(window as any).OPEN_FORM = (window as any).OPEN_FORM || 'open.html';

// Sets the base path, the UI language via URL param and configures the
// supported languages to avoid 404s. The loading of all core language
// resources is disabled as all required resources are in grapheditor.
// properties. Note that in this example the loading of two resource
// files (the special bundle and the default bundle) is disabled to
// save a GET request. This requires that all resources be present in
// each properties file since only one file is loaded.
(window as any).mxBasePath = (window as any).mxBasePath || '../../../src';
(window as any).mxLanguage = (window as any).mxLanguage || urlParams['lang'];
(window as any).mxLanguages = (window as any).mxLanguages || ['de', 'se'];
