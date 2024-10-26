<script setup>
    import treeMenu from './treeMenu.vue';
    import { useRouter, useRoute } from 'vue-router';
    import { reactive } from 'vue';
    import { useMenuStore } from '../stores/menu.js';
    const menuStore = useMenuStore();

    const handleOpen = () => {};
    const handleClose = () => {};

    const router = useRouter();
    const route = useRoute();
    // 路由数据获取
    // const menuData = reactive(router.options.routes[0].children);
    // 动态菜单数据
    const menuData = menuStore.routerList;
</script>

<template>
    <el-menu
        :style="{ width: !menuStore.isCollapse ? '230px' : '64px' }"
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="menu-container"
        :default-active="menuStore.pageActiva"
        text-color="#fff"
        @open="handleOpen"
        @close="handleClose"
        :collapse="menuStore.isCollapse"
    >
        <p class="logo-content">
            {{ !menuStore.isCollapse ? 'DIDI - 陪诊' : 'DIDI' }}
        </p>
        <treeMenu :index="1" :menuData="menuData"></treeMenu>
    </el-menu>
</template>

<style lang="less" scoped>
    .menu-container {
        height: 100%;
    }
    .logo-content {
        font-size: 25px;
        text-align: center;
        height: 80px;
        line-height: 80px;
        color: #fff;
    }
</style>
