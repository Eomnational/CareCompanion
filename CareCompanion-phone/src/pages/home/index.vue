<script setup>
    import { onMounted, reactive, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import http from '../../api/index';

    // 常量、变量创建区域
    const searchValue = ref();
    const router = useRouter();
    const indexData = reactive({
        hospitals: [],
        nav2s: [],
        navs: [],
        slides: [],
        now: 0,
    });

    // 数据获取方法区域
    // 获取首页相关数据
    const getIndexData = async () => {
        const { code, data } = await http.getIndex();
        if (code === 10000) {
            Object.assign(indexData, data);
        }
    };
    // 快捷入口按钮
    const gotoOrder = (index) => {
        router.push(`/createOrder?id=${indexData.hospitals[index].id}`);
    };
    // 点击医院跳转按钮
    const handleGoOrder = (id) => {
        router.push(`/createOrder?id=${id}`);
    };

    onMounted(() => {
        getIndexData();
    });
</script>

<template>
    <van-nav-bar>
        <template #left>
            <div class="leftMain">
                <span>中部地区</span>
                <van-icon name="arrow" />
            </div>
        </template>
        <template #right>
            <div class="rightMain">
                <van-search v-model="searchValue" placeholder="找医院" />
            </div>
        </template>
    </van-nav-bar>
    <div class="vanSwipeBox">
        <van-swipe :autoplay="3000" indicator-color="white" height="170">
            <van-swipe-item v-for="(item, index) in indexData.slides" :key="index">
                <van-image width="100%" height="100%" :src="item.pic_image_url" />
            </van-swipe-item>
        </van-swipe>
    </div>
    <div class="nav2sBox">
        <van-row gutter="20" justify="space-between" align="center">
            <van-col span="12" v-for="(item, index) in indexData.nav2s" :key="index" @click="gotoOrder(index)">
                <van-image width="100%" height="100%" fit="cover" :src="item.pic_image_url" />
            </van-col>
        </van-row>
    </div>
    <van-row
        @click="handleGoOrder(item.id)"
        v-for="(item, index) in indexData.hospitals"
        :key="index"
        justify="space-around"
        align="center"
        class="yy-list"
    >
        <van-col span="6">
            <van-image width="100" height="90" fit="cover" :src="item.avatar_url" />
        </van-col>
        <van-col class="yy" span="14">
            <div class="yy-name">{{ item.name }}</div>
            <div class="yy-type">
                <span>{{ item.rank }}</span>
                &nbsp;
                <span>{{ item.label }}</span>
            </div>
            <div class="yy-text">{{ item.intro }}</div>
        </van-col>
    </van-row>
</template>

<style lang="less" scoped>
    .leftMain {
        font-size: 20px;
        span {
            margin: 0 5px;
        }
        .van-icon {
            color: #000000;
        }
    }

    .rightMain {
        width: 200px;
        height: 100%;

        :deep(.van-icon) {
            color: #959595;
        }
        .van-search {
            height: 100%;
        }
    }
    .vanSwipeBox {
        margin: 5px;
    }

    .nav2sBox {
        margin: 5px;
    }

    .yy-list {
        padding-bottom: 10px;
        margin: 20px 0;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.04), 0 1px 6px 0 rgba(0, 0, 0, 0.04);

        .yy {
            .yy-name {
                font-size: 20px;
                line-height: 30px;
                font-weight: bold;
            }

            .yy-type {
                font-weight: bold;
                line-height: 25px;
                font-size: 15px;
                color: #0ca7ae;
            }

            .yy-text {
                font-size: 14px;
                color: #999;
            }
        }
    }
</style>
