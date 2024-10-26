<script setup>
    import { onMounted, ref } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import http from '../../api/index';
    import counter from '../../components/counter.vue';
    const router = useRouter();
    const route = useRoute();
    const orderLists = ref([]);

    // 标签页相关
    const colorMap = {
        待支付: '#ff9900',
        待服务: '#e96aa9',
        已完成: '#5eff5e',
        已取消: '#999',
    };
    const tabActive = ref('');
    const onClickTab = (tabsData) => {
        getOrderList(tabsData.name);
    };
    // 前往当前点击订单的详细页面
    const gotoDetailed = (data) => {
        router.push(`/detail?oid=${data.out_trade_no}`);
    };

    // 请求接口相关
    const getOrderList = (state) => {
        http.orderList({ state }).then((res) => {
            if (res.code === 10000) {
                res.data.forEach((item) => {
                    // 获取两小时后的时间
                    item.timer = item.order_start_time + 7200000 - Date.now();
                });
                orderLists.value = res.data;
                // console.log(res.data);
            }
        });
    };

    // 生命周期自动申请获取数据
    onMounted(() => {
        const active = route.query.active;
        switch (active) {
            case '0':
                getOrderList('');
                tabActive.value = '';
                break;
            case '1':
                getOrderList('1');
                tabActive.value = '1';
                break;
            case '2':
                getOrderList('2');
                tabActive.value = '2';
                break;
            case '3':
                getOrderList('3');
                tabActive.value = '3';
                break;
            case '4':
                getOrderList('4');
                tabActive.value = '4';
                break;
            default:
                getOrderList('');
                tabActive.value = '';
                break;
        }
    });
</script>

<template>
    <div class="container">
        <van-nav-bar title="我的订单" />
        <van-tabs v-model:active="tabActive" @click-tab="onClickTab">
            <van-tab title="全部" name="" />
            <van-tab title="待支付" name="1" />
            <van-tab title="待服务" name="2" />
            <van-tab title="已完成" name="3" />
            <van-tab title="已取消" name="4" />
        </van-tabs>

        <van-row @click="gotoDetailed(item)" v-for="(item, index) in orderLists" :key="item.out_trade_no" class="van-rows">
            <van-col span="5">
                <van-image width="50" height="50" radius="5" :src="item.serviceImg" />
            </van-col>
            <van-col span="14">
                <div class="text1">
                    {{ item.service_name }}
                </div>
                <div class="text2">
                    <div>{{ item.hospital_name }}</div>
                    <div>预约时间:{{ item.starttime }}</div>
                </div>
                <div></div>
            </van-col>

            <van-col :style="{ color: colorMap[item.trade_state] }" span="5">
                <div style="margin-bottom: 5px">{{ item.trade_state }}</div>
                <counter :second="item.timer" v-if="item.trade_state === '待支付'" />
            </van-col>
        </van-row>
        <div class="bottom-text">没有更多了</div>
    </div>
</template>

<style lang="less" scoped>
    .van-rows {
        background-color: #fff;
        padding: 10px;
        margin: 5px;
        border-radius: 5px;

        .text1 {
            font-size: 16px;
            line-height: 25px;
            font-weight: bold;
        }

        .text2 {
            font-size: 14px;
            line-height: 20px;
            color: #999;
        }
    }

    .bottom-text {
        line-height: 50px;
        text-align: center;
        color: #999;
    }
</style>
