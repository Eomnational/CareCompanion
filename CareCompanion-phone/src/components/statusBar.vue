<script setup>
    const { item } = defineProps(['item']);
</script>

<template>
    <div class="od-banner">
        <div class="progress">
            <van-progress
                :percentage="item"
                stroke-width="10px"
                :show-pivot="false"
                color="linear-gradient(to right,#A8FFF2,#1FFFDD)"
            />
            <div class="progress-text">
                <span>填写订单</span>
                <span>在线支付</span>
                <span>专人服务</span>
                <span>服务完成</span>
            </div>
        </div>
        <div class="banner-icon">
            <van-icon name="newspaper" />
        </div>
    </div>
</template>

<style lang="less" scoped>
    .od-banner {
        height: 100px;
        position: relative;
        overflow: hidden;
        background: linear-gradient(to right, #4cb694, #308e70);
    }

    .progress {
        position: absolute;
        z-index: 999;
        width: 80vw;
        left: 10%;
        top: 30%;

        .progress-text {
            overflow: hidden;
            text-align: center;
            font-size: 12px;
            color: #fff;
            font-weight: bold;
            margin-top: 8px;

            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    }
    .banner-icon {
        position: absolute;
        right: -30px;
        font-size: 80px;
        opacity: 0.4;
        color: #c2c2c2;
    }
</style>
