import request from './request'

export default class TestApi {

    static getNodeList(data: any){
        return request({
            url: '/getNodeList',
            method: 'post',
            data
        });
    }
}