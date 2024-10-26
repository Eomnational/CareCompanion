<script setup>
    import { computed } from 'vue';
    import { useMenuStore } from '../stores/menu.js';
    import { useRouter } from 'vue-router';
    const props = defineProps(['menuData', 'index']);
    const router = useRouter();
    const menuStore = useMenuStore();

    const handleClick = (itme, activa) => {
        // activa = el-menu-item 的 index 属性
        // 记录当前路由的对应 activa 用于显示默认选中样式处理
        itme.meta['activa'] = computed(() => activa);
        menuStore.addSelectMenu(itme.meta);
        menuStore.setPageActiva(activa);
        router.push(itme.meta.path);
    };
</script>

<template>
    <template v-for="(itme, index) in props.menuData">
        <el-menu-item
            @click="handleClick(itme, `${props.index}-${itme.meta.id}`)"
            v-if="!itme.children || itme.children.length == 0"
            :index="`${props.index}-${itme.meta.id}`"
            :key="`${props.index}-${itme.meta.id}`"
        >
            <el-icon size="20">
                <!-- 动态组件方式 会自动生成一个组件格式的代码 -->
                <component :is="itme.meta.icon"></component>
            </el-icon>
            <span>{{ itme.meta.name }}</span>
        </el-menu-item>
        <el-sub-menu v-else :index="`${props.index}-${itme.meta.id}`">
            <template #title>
                <el-icon size="20">
                    <!-- 动态组件方式 会自动生成一个组件格式的代码 -->
                    <component :is="itme.meta.icon"></component>
                </el-icon>
                <span>{{ itme.meta.name }}</span>
            </template>
            <!-- 使用递归方式获取菜单的子菜单  PS:组件递归模式 -->
            <!-- 对于vue3而言，能够递归的组件，只需要当前组件名称与代码中调用的名称一致即可进行递归，可以不引入 -->
            <treeMenu :index="`${props.index}-${itme.meta.id}`" :menuData="itme.children"></treeMenu>
        </el-sub-menu>
    </template>
</template>

<style lang="less" scoped></style>
