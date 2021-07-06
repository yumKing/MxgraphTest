import api from './request';
import { AxiosObservable } from './myaxios/axios-observable.interface';

export default class ProcessApi {
  static getProcessPage(data: any): AxiosObservable<any> {
    return api.request({
      url: '/speechcraftProcess/getPage',
      method: 'post',
      data,
    });
  }

  static addProcess(data: any): AxiosObservable<any> {
    return api.request({
      url: '/speechcraftProcess/add',
      method: 'post',
      data,
    });
  }

  static updateProcess(data: any): AxiosObservable<any> {
    return api.request({
      url: '/speechcraftProcess/update',
      method: 'post',
      data,
    });
  }

  static deleteProcess(data: any): AxiosObservable<any> {
    return api.request({
      url: '/speechcraftProcess/update',
      method: 'post',
      data,
    });
  }

  static getProcessDetail(data: any): AxiosObservable<any> {
    return api.request({
      url: '/speechcraftProcess/get',
      method: 'post',
      data,
    });
  }

  static saveProcessDetail(data: any): AxiosObservable<any> {
    return api.request({
      url: '/speechcraftProcess/save_info',
      method: 'post',
      data,
    });
  }

  static publishProcess(data: any): AxiosObservable<any> {
    return api.request({
      url: '/speechcraftProcess/publish',
      method: 'post',
      data,
    });
  }

  static textSimuProcess(data: any): AxiosObservable<any> {
    return api.request({
      url: '/speechcraftProcess/text_simulate',
      method: 'post',
      data,
    });
  }
}
