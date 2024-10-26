<script setup>
    import { ref, watch } from 'vue';
    import { useRouter, useRoute } from 'vue-router';

    const active = ref(0);
    const router = useRouter();
    const route = useRoute();

    const routerList = router.options.routes[0];
    active.value = routerList.children.findIndex((item) => `/${item.path}` === route.path);

    watch(
        () => route.path,
        (newVal, oldVal) => {
            active.value = routerList.children.findIndex((item) => `/${item.path}` === route.path);
        }
    );
</script>

<template>
    <router-view></router-view>
    <!-- 防止被遮挡数据 使用div顶起来 -->
    <div style="height: 50px"></div>
    <van-tabbar v-model="active">
        <van-tabbar-item
            v-for="(item, index) in routerList.children"
            :key="item.path"
            :icon="item.meta.icon"
            :to="`${item.path}`"
        >
            {{ item.meta.name }}
        </van-tabbar-item>
    </van-tabbar>
</template>

<style lang="less" scoped></style>
