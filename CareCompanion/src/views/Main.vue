<script setup>
    import Aside from '../components/Aside.vue';
    import navHeader from '../components/navHeader.vue';
</script>

<template>
    <div class="common-layout">
        <el-container>
            <Aside></Aside>
            <el-container>
                <el-header>
                    <navHeader></navHeader>
                </el-header>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<style lang="less" scoped>
    .common-layout {
        height: 100%;
        .el-container {
            height: 100%;
        }
    }
</style>
