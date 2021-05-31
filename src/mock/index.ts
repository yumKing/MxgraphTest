import Mock from 'mockjs';
import NodeApi from './node';

Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send;
Mock.XHR.prototype.send = function () {
  if (this.custom.xhr) {
    this.custom.xhr.withCredentials = this.withCredentials || false;
    if (this.responseType) {
      this.custom.xhr.responseType = this.responseType;
    }
  }
  this.proxy_send(...arguments);
};

Mock.mock(/\/getNodeList/, 'post', NodeApi.getNodeList);

export default Mock;
