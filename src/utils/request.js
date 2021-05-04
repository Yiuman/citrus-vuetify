import axios from 'axios'
import store from "../store";
import {API_BASE_PATH} from "@/config";
import qs from 'qs';

axios.defaults.withCredentials = true;
const request = axios.create({
    baseURL: API_BASE_PATH, // url = base url + request url
    // send cookies when cross-domain requests
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
    if (config.method === 'get') {
        config.paramsSerializer = function (params) {
            return qs.stringify(params, {arrayFormat: 'repeat'})
        }
    }
    return config
}, function (err) {
    return Promise.reject(err)
});

/**
 * 处理响应
 */
request.interceptors.response.use(function (res) {
    //如果是下载文件，则直接返回
    if (res.request.responseType === 'blob') {
        return res;
    }
    if (res.data.code !== 0) {
        return Promise.reject(res.data)
    }
    return res.data.data
}, function (err) {
    return Promise.reject(err)
});

export default request;

export const download = (url, filename = '') => {
    request.get(`${url}?fileName=${filename}`, {responseType: 'blob'}).then(response => {
        const blob = new Blob([response.data]);
        const tempLink = document.createElement('a');     // 创建a标签
        const href = window.URL.createObjectURL(blob);       // 创建下载的链接
        //filename
        const fileName = decodeURI(response.headers['content-disposition'].split('filename=')[1]);
        tempLink.href = href;
        tempLink.target = "_blank";
        tempLink.download = fileName;
        document.body.appendChild(tempLink);
        tempLink.click();     // 点击下载
        document.body.removeChild(tempLink); // 下载完成移除元素
        window.URL.revokeObjectURL(href) // 释放掉blob对象
    })
};
