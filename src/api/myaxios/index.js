import axios from 'axios';
import { createObservable } from './create-observable';
class Axios {
    constructor(axiosInstance) {
        this.axiosInstance = axiosInstance;
    }
    get defaults() {
        return this.axiosInstance.defaults;
    }
    get interceptors() {
        return this.axiosInstance.interceptors;
    }
    static request(config) {
        return createObservable(axios.request, config);
    }
    static get(url, config) {
        return createObservable(axios.get, url, config);
    }
    static post(url, data, config) {
        return createObservable(axios.post, url, data, config);
    }
    static put(url, data, config) {
        return createObservable(axios.put, url, data, config);
    }
    static patch(url, data, config) {
        return createObservable(axios.patch, url, data, config);
    }
    static delete(url, config) {
        return createObservable(axios.delete, url, config);
    }
    static head(url, config) {
        return createObservable(axios.head, url, config);
    }
    static create(config) {
        return new Axios(axios.create(config));
    }
    request(config) {
        return createObservable(this.axiosInstance.request, config);
    }
    get(url, config) {
        return createObservable(this.axiosInstance.get, url, config);
    }
    head(url, config) {
        return createObservable(this.axiosInstance.head, url, config);
    }
    post(url, data, config) {
        return createObservable(this.axiosInstance.post, url, data, config);
    }
    put(url, data, config) {
        return createObservable(this.axiosInstance.put, url, data, config);
    }
    patch(url, data, config) {
        return createObservable(this.axiosInstance.patch, url, data, config);
    }
    delete(url, config) {
        return createObservable(this.axiosInstance.delete, url, config);
    }
}
Axios.defaults = axios.defaults;
Axios.interceptors = axios.interceptors;
export default Axios;
// export { Axios }
//# sourceMappingURL=index.js.map