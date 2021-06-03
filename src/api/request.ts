import axios from "./myaxios";

const service = axios.create({
    timeout: 10000,
    withCredentials: true,
    baseURL: process.env.VUE_APP_BASE_URL
})

const downloadUrl = (url:string) => {
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.src = url;
    iframe.onload = function(){
        document.body.removeChild(iframe)
    }
    document.body.appendChild(iframe)
}

service.interceptors.request.use(
    config => {
        // config.headers = {
        //     ...config.headers,
        // }
        return config
    },
    error => {
        Promise.reject(error);
    }
)

service.interceptors.response.use(
    (response:any) => {
        const res = response.data
        if(response.headers && (response.headers['content-type'] === 'application/x-msdownload;charset=utf-8')|| response.headers['content-type'] === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'){
            downloadUrl(response.request.responseURL);
            return res;
        }
        
        //正常的状态码
        if(response.status === 200 || response.status === 201 || response.status === 204){
            // 可以继续细分，哪些允许通过， 哪些不允许通过
            // window.location 跳转
            // store方式调用其他接口
            // window.href 跳转
            return res;

        }else{
            // 异常状态码
            return Promise.reject("error:"+res.msg);
        }
    },
    error => {
        // 可以对错误信息进行处理，提示
        // const errorResponseData = error && error.response && error.response.data;
        
        return Promise.reject(error);
    }
)

export default service;