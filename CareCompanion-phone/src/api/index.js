import request from '../utils/request';

export default {
    // 登录请求接口
    // https:/v3pz.itndedu.com/v3pz/login
    async login(data) {
        return await request.post('/login', data);
    },

    // 首页请求接口
    // https:/v3pz.itndedu.com/v3pz/Index/index
    getIndex() {
        return request.get('/Index/index');
    },

    // 陪护师列表请求接口
    // https:/v3pz.itndedu.com/v3pz/h5/companion
    h5Companion() {
        return request.get('/h5/companion');
    },

    // 创建订单请求接口
    // https:/v3pz.itndedu.com/v3pz/createOrder
    createOrder(data) {
        return request.post('/createOrder', data);
    },

    // 订单列表请求接口
    // https:/v3pz.itndedu.com/v3pz/order/list
    orderList(params) {
        return request.get('/order/list', { params });
    },

    // 订单详情请求接口
    // https:/v3pz.itndedu.com/v3pz/order/detail
    orderDetail(params) {
        return request.get('/order/detail', { params });
    },
};
