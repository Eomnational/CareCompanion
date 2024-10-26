import { createRouter, createWebHashHistory } from 'vue-router';
import { ref } from 'vue';
import { useMenuStore } from '../stores/menu.js';

import Layout from '../views/Main.vue';
import Login from '../views/login/index.vue';
import Dashboard from '../views/dashboard/index.vue';
import Admin from '../views/auth/admin/index.vue';
import Group from '../views/auth/group/index.vue';
import Staff from '../views/vppz/staff/index.vue';
import Order from '../views/vppz/order/index.vue';

const routes = [
    {
        path: '/',
        component: Layout,
        name: 'main',
        // children: [
        //     {
        //         path: 'dashboard',
        //         meta: {
        //             id: '1',
        //             name: '控制台',
        //             icon: 'Platform',
        //             path: '/dashboard',
        //             describe: '用于展示当前系统中的统计数据、统计报表及重要实时数据',
        //         },
        //         component: Dashboard,
        //     },
        //     {
        //         path: 'auth',
        //         meta: { id: '2', name: '权限管理', icon: 'Grid' },
        //         children: [
        //             {
        //                 path: '',
        //                 alias: ['admin'],
        //                 meta: {
        //                     id: '1',
        //                     name: '账号管理',
        //                     icon: 'Avatar',
        //                     path: '/auth/admin',
        //                     describe: '管理员可以进行编辑，权限修改后需要登出才会生效',
        //                 },
        //                 component: Admin,
        //             },
        //             {
        //                 path: 'group',
        //                 meta: {
        //                     id: '2',
        //                     name: '菜单管理',
        //                     icon: 'Menu',
        //                     path: '/auth/group',
        //                     describe: '菜单规则通常对应一个控制器的方法,同时菜单栏数据也从规则中获取',
        //                 },
        //                 component: Group,
        //             },
        //         ],
        //     },
        //     {
        //         path: 'vppz',
        //         meta: { id: '3', name: 'DIDI陪诊', icon: 'BellFilled' },
        //         children: [
        //             {
        //                 path: '',
        //                 alias: ['staff'],
        //                 meta: {
        //                     id: '1',
        //                     name: '陪护管理',
        //                     icon: 'Checked',
        //                     path: '/vppz/staff',
        //                     describe: '陪护师可以进行创建和修改，设置对应生效状态控制C端选择',
        //                 },
        //                 component: Staff,
        //             },
        //             {
        //                 path: 'order',
        //                 meta: {
        //                     id: '2',
        //                     name: '订单管理',
        //                     icon: 'List',
        //                     path: '/vppz/order',
        //                     describe: 'C端下单后可以查看所有订单状态，已支付的订单可以完成陪护状态修改',
        //                 },
        //                 component: Order,
        //             },
        //         ],
        //     },
        // ],
        children: [],
    },
    {
        path: '/login',
        component: Login,
        name: 'login',
    },
    {
        path: '/404',
        name: 'NotFound',
        component: () => import('../components/404.vue'),
        meta: { title: '404', path: '/404' },
    },
    // {
    //     这个配置已经不支持 vue3 了 使用下面的配置
    //     path: '*', //匹配未定义的路由
    //     redirect: '/404', //重定向
    // },
    // {
    //     path: '/:catchAll(.*)', // 不识别的path自动匹配404
    //     redirect: '/404',
    // },
    // 当什么都没有匹配到的时候，重定向页面到 404 页面
    // {
    //     path: '/:pathMatch(.*)',
    //     redirect: '/404',
    // },
];

const router = createRouter({
    routes,
    history: createWebHashHistory(),
});

// 路由动态获取
const registerFlag = ref(false);
const asyncRoutes = (menuStore) => {
    // 获取路由数据
    const data = menuStore.routerList;
    menuStore.setMenuPermissions(data);
    data.map((res) => {
        router.addRoute('main', res);
    });
    // 必须在最后添加 404 路由，不然会出现刷新页面获取动态路由时，出现 404 错误页面
    router.addRoute({
        path: '/:pathMatch(.*)',
        redirect: '/404',
    });
};

// 路由前置守卫
router.beforeEach(async (to, from, next) => {
    // console.log(router.getRoutes(), '查看现有路由');
    const token = localStorage.getItem('pz_token');
    if (!token && to.path != '/login') {
        // token不存在并且不是访问登录页面 转跳到登录页面
        next({ path: '/login' });
    } else if (token && to.path == '/login') {
        // token存在并且访问登录页面 转跳到主页
        next({ path: from.path });
    } else {
        const menuStore = useMenuStore();
        if (!registerFlag.value) {
            // console.log('registerFlag', registerFlag.value);
            asyncRoutes(menuStore); // 添加路由
            registerFlag.value = true;
            router.replace({ ...to });
            // console.log('registerFlag', registerFlag.value);
            // console.log(router.getRoutes(), '查看现有路由');
        }
        next();
    }
});

// 后置守卫
router.afterEach((to) => {
    const menuStore = useMenuStore();
    if (to.path === '/') {
        // 取消选中状态样式
        menuStore.setPageActiva('');
    }
});

export default router;
