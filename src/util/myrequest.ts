import { RequestMethod } from '@/models/request-params'
import Axios from './myaxios/index'
import { Message } from 'element-ui'
import { parseRule } from '@/util/proxy-rule'
import store from '@/store'

const service = Axios.create({
  timeout: 10000,
  withCredentials: true //  允许携带cookie
})

//  http请求发送过滤器
service.interceptors.request.use(
  (config: any) => {
    config.headers = {
      ...config.headers,
      tenantId: store && store.getters.authInfo.tenantId,
      userId: store && store.getters.authInfo.userId,
      language: store && store.getters.language,
      groupId: 0
    }
    config.headers['Accept-Language'] = store && store.getters.language
    config.url = parseRule(config.url)
    return config
  },
  error => {
    //  Do something with request error
    Promise.reject(error)
  }
)
//  http请求回调过滤器
service.interceptors.response.use(
  (response: any) => {
    const res = response.data
    if (response.status === 200 || response.status === 201 || response.status === 204) {
      if (res && (res.code === undefined || res.code === 0 || res.code === '0')) {
        return res
      }

      if (res.code === '3002' || res.code === '3001') {
        window.location = res.data
      } else if (res.code === '3003') {
        //  this.$router.go(-1)
        Message({
          message: 'No operation permission',
          type: 'warning',
          duration: 5 * 1000
        })
      } else if (res.code !== '000000' && res.code !== '0') {
        Message({
          message: res.msg,
          type: 'warning',
          duration: 5 * 1000
        })
        //  return Promise.reject(response.data.msg);
      }

      switch (response.config && response.config.method) {
        //  删除接口处理
        case RequestMethod.DELETE:
          Message.success(res.msg || '处理成功.')
          return res
        //  更新接口处理
        case RequestMethod.PUT:
          Message.success(res.msg || '处理成功.')
          return res
        //  get、post请求处理
        default:
          if (response.headers.location) {
            return Object.assign(res, { location: response.headers.location })
          }
          return res
      }
    } else {
      Message.error(res.msg || '接口处理异常.')
      return Promise.reject(new Error('接口处理异常'))
    }
  },
  error => {
    const errorResponseData = error && error.response && error.response.data
    if (error && error.response && error.response.status) {
      if (error.response.status === 401) {
        location.href = '/api/login'
      } else if (error.response.status < 500) {
        Message({
          message: (errorResponseData && errorResponseData.message) || error.message,
          type: 'warning',
          duration: 5 * 1000,
          center: true
        })
      } else {
        Message({
          message: (errorResponseData && errorResponseData.message) || error.message,
          type: 'error',
          duration: 5 * 1000
        })
      }
    }

    return Promise.reject(error)
  }
)

export default service
