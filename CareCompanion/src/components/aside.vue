
<template>
        <el-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="aside-container"
        default-active="2"
        text-color="#fff"
        @open="handleOpen"
        @close="handleClose"
        >
        <p class="logo-lg">DiDi陪诊</p>
        <treeMeau/>
        </el-menu>
</template>
<script setup>
import treeMeau from './treeMeau.vue';
const handleOpen=()=>{}
const handleClose=()=>{}

</script>
<style lang='less' scoped>
.aside-container{
   height: 100%;
   .logo-lg{
        font-size: 20px;
        text-align: center;
        height: 50px;
        line-height: 50px;
        color: #fff;
   }
}
</style>