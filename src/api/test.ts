import api from './request'
import { AxiosObservable } from './myaxios/axios-observable.interface'
// import { Observable } from 'rxjs';
import {ajax} from 'rxjs/ajax'

export default class TestApi {

    static getNodeInfoList(data: any): AxiosObservable<any>{
        return api.request({
            url: '/getNodeInfoList',
            method: 'post',
            data
        });
    }
}