import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMenuStore = defineStore(
    'menu',
    () => {
        const isCollapse = ref(false);
        const selectMenu = ref([]);
        const pageActiva = ref('');
        const routerList = ref([]);

        const collapseMenu = () => {
            isCollapse.value = !isCollapse.value;
        };

        const addSelectMenu = (payload) => {
            if (selectMenu.value.findIndex((itme) => itme.path === payload.path) === -1) {
                selectMenu.value.push(payload);
            }
        };

        const subSelectMenu = (payload) => {
            // 找到对应数据在数组中的索引
            const index = selectMenu.value.findIndex((itme) => itme.name === payload.name);
            // 删除数组中指定索引的数据
            selectMenu.value.splice(index, 1);
        };

        const setPageActiva = (payload) => {
            pageActiva.value = payload;
        };

        const setMenuPermissions = (payload) => {
            // 通过 view 的 glob 方式获取系统本地的文件 * 代表通配符 模糊搜索
            // ** 文件夹  * 文件
            const modules = import.meta.glob('../views/**/**/*.vue');
            // 处理数据 获取组件对应路径 对payload数据进行加工
            function checkRouter(router) {
                router.forEach((item) => {
                    if (!item.children) {
                        // 获取对应url的路径
                        // 不可以这样 后台返回的子类数据没有 component 属性 会出现错误
                        // const url = `../views${item.component}/index.vue`;
                        const url = `../views${item.meta.path}/index.vue`;
                        item.component = modules[url];
                    } else {
                        // 递归
                        checkRouter(item.children);
                    }
                });
            }
            checkRouter(payload);
            routerList.value = payload;
        };

        return {
            isCollapse,
            selectMenu,
            pageActiva,
            routerList,
            collapseMenu,
            addSelectMenu,
            subSelectMenu,
            setPageActiva,
            setMenuPermissions,
        };
    },
    {
        persist: true,
    }
);
