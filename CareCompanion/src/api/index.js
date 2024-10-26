import http from '../utils/request.js';

// 获取验证码
// https:/v3pz.itndedu.com/v3pz/get/code
export const getCode = (data) => {
    return http.post('/get/code', data);
};

// 注册账号
// https:/v3pz.itndedu.com/v3pz/user/authentication
export const userRegistration = (data) => {
    return http.post('/user/authentication', data);
};

// 登录账号
// https:/v3pz.itndedu.com/v3pz/login
export const userLogin = (data) => {
    return http.post('/login', data);
};

// 账号管理列表
// https:/v3pz.itndedu.com/v3pz/auth/admin
export const userManageList = (params) => {
    return http.get('/auth/admin', { params });
};

// 菜单权限数据
// https:/v3pz.itndedu.com/v3pz/user/getmenu
export const userGetmenu = () => {
    return http.get('/user/getmenu');
};

// 菜单权限修改
// https:/v3pz.itndedu.com/v3pz/user/setmenu
export const userSetmenu = (data) => {
    return http.post('/user/setmenu', data);
};

// 菜单权限列表
// https:/v3pz.itndedu.com/v3pz/menu/list
export const menuList = (params) => {
    return http.get('/menu/list', { params });
};

// 菜单权限下拉
// https:/v3pz.itndedu.com/v3pz/menu/selectlist
export const menuSelectlist = () => {
    return http.get('/menu/selectlist');
};

// 用户信息修改
// https:/v3pz.itndedu.com/v3pz/update/user
export const updateUser = (data) => {
    return http.post('/update/user', data);
};

// 用户菜单权限
// https:/v3pz.itndedu.com/v3pz/menu/permissions
export const menuPermissions = () => {
    return http.get('/menu/permissions');
};

// 陪护师头像
// https:/v3pz.itndedu.com/v3pz/photo/list
export const photoList = () => {
    return http.get('/photo/list');
};

// 陪护师创建
// https:/v3pz.itndedu.com/v3pz/companion
export const addCompanion = (data) => {
    return http.post('/companion', data);
};

// 陪护师列表
// https:/v3pz.itndedu.com/v3pz/companion/list
export const companionList = (params) => {
    return http.get('/companion/list', { params });
};

// 陪护师删除
// https:/v3pz.itndedu.com/v3pz/delete/companion
export const deleteCompanion = (data) => {
    return http.post('/delete/companion', data);
};

// 订单列表
// https:/v3pz.itndedu.com/v3pz/admin/order
export const adminOrder = (params = {}) => {
    return http({
        method: 'get',
        url: '/admin/order',
        params: params,
    });
};

// 服务状态完成
// https:/v3pz.itndedu.com/v3pz/update/order
export const updateUrder = (data = {}) => {
    return http({
        method: 'post',
        url: '/update/order',
        data: data,
    });
};
