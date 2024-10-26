import axios from 'axios';
import { ElMessage } from 'element-plus';

const instance = axios.create({
    baseURL: 'https:/v3pz.itndedu.com/v3pz',
    timeout: 5000,
});

// 添加请求拦截器
instance.interceptors.request.use(
    function (config) {
        // 获取登录token
        const token = localStorage.getItem('pz_token');
        // 设置白名单接口
        const WhitelistUrl = ['/get/code', '/user/authentication', '/login'];
        if (token && !WhitelistUrl.includes(config.url)) {
            config.headers['x-token'] = token;
        }
        // 在发送请求之前做些什么
        return config;
    },
    function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 添加响应拦截器
instance.interceptors.response.use(
    function (response) {
        switch (response.data.code) {
            case -1:
                ElMessage.error(response.data.message);
                break;
            case -2:
                ElMessage.error(response.data.message + '，两秒后转跳登录页面');
                localStorage.clear(); //清除全部缓存
                // 刷新页面 或者 直接跳转到登录页面
                // window.location.href = window.location.origin; // 跳转当前页 (刷新？)
                // 倒计时 2秒后跳转登录页面
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
                break;
        }
        // 2xx 范围内的状态码都会触发该函数。
        // 对响应数据做点什么
        return response;
    },
    function (error) {
        // 超出 2xx 范围的状态码都会触发该函数。
        // 对响应错误做点什么
        return Promise.reject(error);
    }
);

export default instance;
