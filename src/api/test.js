import api from './request';
export default class TestApi {
    static getNodeList(data) {
        return api.request({
            url: '/getNodeList',
            method: 'post',
            data
        });
    }
}
//# sourceMappingURL=test.js.map