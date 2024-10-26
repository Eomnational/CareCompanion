<script setup>
    import { useRouter, useRoute } from 'vue-router';
    import statusBar from '../../components/statusBar.vue';
    import counter from '../../components/counter.vue';
    import http from '../../api/index';
    import { computed, onMounted, reactive, ref } from 'vue';
    import Qrcode from 'qrcode';

    // 路由操作变量
    const router = useRouter();
    const route = useRoute();
    // 详情页数据
    const detailData = reactive({});
    // 状态进度条数据
    const stateMap = {
        待支付: 40,
        待服务: 65,
        已完成: 100,
        已取消: 0,
    };
    // 计算倒计时
    const second = computed(() => {
        return detailData.order_start_time ? detailData.order_start_time + 7200000 - Date.now() : 0;
    });
    // 对话框操作
    const showDialog = ref(false);
    const qrCodeImg = ref('');
    //预约信息
    const makeInfo = {
        service_name: '预约服务',
        hospital_name: '就诊医院',
        starttime: '期望就诊时间',
        'client.name': '就诊人',
        'client.mobile': '就诊人电话',
        receiveAddress: '接送地址',
        demand: '其他需求',
    };
    //订单信息
    const orderInfo = {
        tel: '联系电话',
        order_start_time: '下单时间',
        price: '订单金额',
        out_trade_no: '订单编号',
    };

    // 顶部返回按钮
    const onClickLeft = () => {
        router.go(-1);
    };

    // 请求接口相关区域
    const getOrderDetail = () => {
        http.orderDetail({ oid: route.query.oid }).then((res) => {
            Object.assign(detailData, res.data);
            Qrcode.toDataURL(res.data.code_url).then((url) => {
                qrCodeImg.value = url;
            });
        });
    };

    onMounted(() => {
        getOrderDetail();
    });

    // 自定义方法
    const formatData = (key) => {
        if (key.indexOf('.') === -1) {
            if (key === 'order_start_time') {
                return formatTimestamp(detailData[key]);
            }
            return detailData[key];
        }
        let arr = key.split('.').reduce((o, p) => {
            return (o || {})[p];
        }, detailData);
        return arr;
    };
    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
</script>

<template>
    <div class="container">
        <van-nav-bar title="订单详情" @click-left="onClickLeft">
            <template #left>
                <van-icon name="arrow-left" size="20" color="#000" />
            </template>
        </van-nav-bar>

        <div class="status-content">
            <statusBar :item="stateMap[detailData.trade_state]" />
        </div>

        <div class="tips">
            <div class="dzf" v-if="detailData.trade_state === '待支付'">
                <div class="text1">订单待支付</div>
                <div class="text2">
                    请在
                    <counter :second="second" />
                    内完成支付，超时自动取消订单
                </div>
                <div class="text3">
                    <van-button type="success" @click="showDialog = true">立即支付</van-button>
                </div>
            </div>
            <div class="dzf" v-else-if="detailData.trade_state === '待服务'">
                <div class="text1">订单待服务</div>
                <div class="text2">请保持通话畅通，等待服务人员上门服务</div>
            </div>
            <div class="dzf" v-else-if="detailData.trade_state === '已完成'">
                <div class="text1">服务已完成</div>
                <div class="text2">感谢您的使用，如有售后问题请联系客服</div>
            </div>
            <div class="dzf" v-else-if="detailData.trade_state === '已取消'">
                <div class="text1">订单已取消</div>
                <div class="text2">期待下次为您服务，如需帮助可咨询客服</div>
            </div>
        </div>

        <van-cell-group class="card">
            <div class="header-text">预约信息</div>
            <van-cell v-for="(item, index) in makeInfo" :key="index" :title="item" :value="formatData(index)" />
        </van-cell-group>

        <van-cell-group class="card">
            <div class="header-text">订单信息</div>
            <van-cell v-for="(item, index) in orderInfo" :key="index" :title="item" :value="formatData(index)" />
        </van-cell-group>
    </div>

    <!-- 显示支付二维码对话框 -->
    <div class="dialog-content">
        <van-dialog v-model:show="showDialog" show-cancel-button cancelButtonText="关闭" :showConfirmButton="false">
            <div class="images-box">
                <van-image width="150" height="150" fit="cover" :src="qrCodeImg" />
                <div class="images-text">
                    <van-icon name="wechat" color="#8CC25E" size="20" />
                    <span>请使用微信扫码支付</span>
                </div>
            </div>
        </van-dialog>
    </div>
</template>

<style lang="less" scoped>
    .dzf {
        padding: 20px;

        .text1 {
            text-align: left;
            font-size: 30px;
            font-weight: bold;
            line-height: 30px;
            color: #666;
            margin: 10px 0;
        }

        .text2 {
            text-align: left;
            font-size: 16px;
            color: #666;
            margin: 5px 0;
        }

        .text3 {
            text-align: center;

            .van-button {
                margin-top: 10px;
                margin-left: 10px;
                width: 80%;
                font-weight: bold;
                font-size: 20px;
            }
        }
    }

    .card {
        margin: 15px 0;
        padding: 10px;

        .header-text {
            padding-left: 5px;
            line-height: 30px;
            font-size: 16px;
            font-weight: bold;
            border-left: 4px solid red;
        }
    }

    .dialog-content {
        .images-box {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            margin: 10px;
        }
        .images-text {
            margin: 10px;
            font-size: 20px;
            .van-icon {
                margin: 0 5px;
            }
        }
    }
</style>
