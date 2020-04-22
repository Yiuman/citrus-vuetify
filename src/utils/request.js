import axios from 'axios'
import store from "../store";
import {API_BASE_PATH} from "../config";

const request = axios.create({
    baseURL: API_BASE_PATH, // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    // timeout: 5000 // request timeout
});

/**
 * 请求带上token
 */
request.interceptors.request.use(function (config) {
    config.headers = {
        ...(store.state.user.token ? {Authorization: 'Bearer ' + store.state.user.token} : {}),
        ...(config.headers || {})
    };
    return config
}, function (err) {
    return Promise.reject(err)
});

/**
 * 处理响应
 */
request.interceptors.response.use(function (res) {
    if (res.data.code !== 0) {
        return Promise.reject(res.data)
    }
    return res.data.data
}, function (err) {
    return Promise.reject(err)
});

export default request;
