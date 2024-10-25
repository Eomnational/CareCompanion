import { createRouter,createWebHashHistory } from 'vue-router'
import Layout from '../views/Main.vue'
import Login from '../views/login/index.vue'
import Admin from '../views/auth/admin/index.vue'
import Group from '../views/auth/group/index.vue'
import Order from '../views/vppz/order/index.vue'
import Staff from '../views/vppz/staff/index.vue'
import Dashboard from '../views/dashboard/index.vue'


const routes=[
    {
        path:'/',
        component: Layout,
        name: 'main',
        children:[
        {
            path:'dashboard',
            meta:{
                id:'1',
                name:'控制台',
                icon:'Platform',
                path:'/dashboard',
                describe:'展示统计数据，统计报表'
            },
            component:Dashboard,
        },
        {
            path:'auth',
            meta:{
                id:'2',
                name:'权限管理',
                icon:'Grid'
            },
            children:[
                {
                    path:'',
                    alias:['admin'],
                    meta:{
                        id:'1',
                        name:'账号管理',
                        icon:'Avactar',
                        path:'/auth/admin',
                        describe:'管理员编辑，权限修改'
                    },
                    component: Admin
                },
                {
                    path:'group',
                    meta:{
                        id:'2',
                        name:'菜单管理',
                        icon:'auth/group',
                        describe: '菜单规则'
                    },
                    component:Group
                }
            ]
        },
        {
           path:'vppz',
           meta:{
            id:'3',
            name:'DIDI陪诊',
            icon:'BellFiled',
           },
           children: [
            {
                path:'',
                alias:['staff'],
                meta:{
                    id:'1',
                    name:'陪护管理',
                    icon:'checked',
                    path:'/vppz/staff',
                    describe:'陪护师进行创建和修改',
                    component: Staff
                },                
            },
            {
                path:'order',
                meta:{
                    id:'2',
                    name:'订单管理',
                    icon:'List',
                    path:'/vppz/order',
                    describe:'c端可以查看所有订单',
                    component:Order,
                }
            }
           ],
        },

       ]
    },
    {
        path:'/login',
        component: Login
    },

]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
  });

export default router;