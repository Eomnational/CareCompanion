<script setup>
    import { useRouter } from 'vue-router';
    import statusBar from '../../components/statusBar.vue';
    import http from '../../api/index';
    import { computed, onMounted, reactive, ref } from 'vue';
    import Qrcode from 'qrcode';

    const router = useRouter();
    const createInfo = reactive({
        companion: [],
        hospitals: [],
        service: {},
    });

    const onClickLeft = () => {
        router.go(-1);
    };
    const getH5Companion = async () => {
        const { data } = await http.h5Companion();
        Object.assign(createInfo, data);
    };

    // 表单数据 设置为空是为了动态添加数据  如：fromData.xxx = xx
    const fromData = reactive({});

    // 就诊医院 单元格操作
    const showHospital = ref(false);
    const showHospColumns = computed(() => {
        return createInfo.hospitals.map((item) => {
            return { text: item.name, value: item.id };
        });
    });
    const showHospConfirm = (data) => {
        fromData.hospital_id = data.selectedOptions[0].value;
        fromData.hospital_name = data.selectedOptions[0].text;
        showHospital.value = false;
    };

    // 就诊时间 单元格操作
    const showTimes = ref(false);
    const dateStrValue = ref(''); // 字符串时间
    const minDate = new Date(); // 今天时间
    const showTimesConfirm = (data) => {
        dateStrValue.value = data.selectedValues.join('-');
        fromData.starttime = new Date(dateStrValue.value).getTime();
        showTimes.value = false;
    };

    // 陪诊师 单元格操作
    const showCompanion = ref(false);
    const companionColumns = computed(() => {
        return createInfo.companion.map((item) => {
            return { text: item.name, value: item.id };
        });
    });
    const currentCompanion = ref(''); // 当前陪护师名字
    const companionConfirm = (data) => {
        fromData.companion_id = data.selectedOptions[0].value;
        currentCompanion.value = data.selectedOptions[0].text;
        showCompanion.value = false;
    };

    // 支付二维码 显示变量
    const showDialog = ref(false);
    const qrCodeImg = ref('');
    // 弹出框点击确认回调
    const confirmDialog = () => {
        showDialog.value = false;
        router.push('/order');
    };
    // 提交按钮
    const onSubmit = async () => {
        const params = ['hospital_id', 'hospital_name', 'demand', 'companion_id', 'receiveAddress', 'tel', 'starttime'];
        for (const v of params) {
            if (!fromData[v]) {
                showNotify({
                    message: '填写项目不得留空哦',
                });
                return;
            }
        }

        const { code, data } = await http.createOrder(fromData);
        Qrcode.toDataURL(data.wx_code).then((url) => {
            showDialog.value = true;
            qrCodeImg.value = url;
        });
    };

    onMounted(() => {
        getH5Companion();
    });
</script>

<template>
    <div class="container">
        <van-nav-bar title="填写服务订单" @click-left="onClickLeft">
            <template #left>
                <van-icon color="#000" size="18px" name="arrow-left" />
            </template>
        </van-nav-bar>
        <statusBar :item="10"></statusBar>
        <van-cell-group class="cell">
            <van-cell>
                <template #title>
                    <van-image width="25" height="25" :src="createInfo.service.serviceImg" />
                    <span class="server-name">{{ createInfo.service.serviceName }}</span>
                </template>
                <template #default>
                    <div class="service-text">
                        <van-icon name="medal-o" />
                        <span>服务内容</span>
                    </div>
                </template>
            </van-cell>
        </van-cell-group>
        <van-cell-group class="cell">
            <van-cell>
                <template #title>就诊医院</template>
                <template #default>
                    <div @click="showHospital = true">
                        {{ fromData.hospital_name || '请选择就诊医院' }}
                        <van-icon name="arrow" />
                    </div>
                </template>
            </van-cell>

            <van-cell>
                <template #title>就诊时间</template>
                <template #default>
                    <div @click="showTimes = true">
                        {{ dateStrValue || '请选择就诊时间' }}
                        <van-icon name="arrow" />
                    </div>
                </template>
            </van-cell>

            <van-cell>
                <template #title>陪诊师</template>
                <template #default>
                    <div @click="showCompanion = true">
                        {{ currentCompanion || '请选择陪护师' }}
                        <van-icon name="arrow" />
                    </div>
                </template>
            </van-cell>

            <van-cell>
                <template #title>接送地址</template>
                <template #default>
                    <van-field input-align="right" v-model="fromData.receiveAddress" placeholder="请输入接送地址" />
                </template>
            </van-cell>

            <van-cell>
                <template #title>联系电话</template>
                <template #default>
                    <van-field input-align="right" v-model="fromData.tel" placeholder="请输入联系电话" />
                </template>
            </van-cell>
        </van-cell-group>

        <van-cell-group title="服务需求" class="cell">
            <van-field
                v-model="fromData.demand"
                rows="5"
                type="textarea"
                maxlength="100"
                placeholder="请简单描述您的需求"
                show-word-limit
            />
        </van-cell-group>

        <!-- 提交按钮 -->
        <van-button type="primary" @click="onSubmit" size="large" class="submitBtn">提交订单</van-button>
    </div>

    <!-- 选择就诊医院弹窗 -->
    <van-popup v-model:show="showHospital" position="bottom" :style="{ height: '50%' }" style="overflow: hidden">
        <van-picker :columns="showHospColumns" @cancel="showHospital = false" @confirm="showHospConfirm" />
    </van-popup>

    <!-- 选择就诊时间弹窗 -->
    <van-popup v-model:show="showTimes" position="bottom" :style="{ height: '30%' }" style="overflow: hidden">
        <van-date-picker title="选择预约时间" :min-date="minDate" @cancel="showTimes = false" @confirm="showTimesConfirm" />
    </van-popup>

    <!-- 选择陪诊师弹窗 -->
    <van-popup v-model:show="showCompanion" position="bottom" :style="{ height: '50%' }" style="overflow: hidden">
        <van-picker :columns="companionColumns" @cancel="showCompanion = false" @confirm="companionConfirm" />
    </van-popup>

    <!-- 支付二维码显示弹出层 -->
    <div>
        <van-dialog v-model:show="showDialog" @confirm="confirmDialog" confirm-button-text="前往订单">
            <div class="content">
                <van-image width="200px" height="200px" :src="qrCodeImg" />
                <div class="content-text">
                    <van-icon name="wechat" color="#8CC25E" size="20" />
                    <span>请使用微信扫码支付</span>
                </div>
            </div>
        </van-dialog>
    </div>
</template>

<style lang="less" scoped>
    .cell {
        width: 95%;
        margin: 5px auto;
        background-color: #fff;

        ::v-deep(.van-field__control) {
            color: var(--van-cell-calue-color);
        }

        ::v-deep(.van-cell__title) {
            display: flex;
            align-items: center;
        }

        .server-name {
            margin-left: 10px;
        }

        .service-text {
            display: flex;
            align-items: center;
            justify-content: end;

            span {
                margin: 0 5px;
            }
        }
    }

    .container {
        .submitBtn {
            position: absolute;
            bottom: 0;
        }
    }

    :deep(.content) {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin: 20px;
    }
</style>
