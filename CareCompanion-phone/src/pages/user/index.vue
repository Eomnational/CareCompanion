<script setup>
    import { computed, ref } from 'vue';
    import { useRouter } from 'vue-router';
    const router = useRouter();

    const userInfo = computed(() => {
        return JSON.parse(localStorage.getItem('pzH5_userInfo')) || {};
    });

    const goOrder = (active) => {
        router.push(`/order?active=${active}`);
    };

    const showQuit = ref(false);
    const logout = () => {
        showQuit.value = false;
        localStorage.clear();
        router.push('/login');
    };
</script>

<template>
    <div class="container">
        <div class="user">
            <van-image class="img" :src="userInfo.avatar" width="100" height="100" />
            <div class="text">{{ userInfo.name }}</div>
        </div>

        <div class="order">
            <div class="top">
                <div class="text1">我的订单</div>
                <div class="text2" @click="goOrder(0)">全部</div>
            </div>
            <div class="button">
                <div @click="goOrder(1)" class="item">
                    <div class="icon">
                        <van-icon name="gold-coin-o" />
                    </div>
                    <div>待支付</div>
                </div>
                <div @click="goOrder(2)" class="item">
                    <div class="icon">
                        <van-icon name="thumb-circle-o" />
                    </div>
                    <div>待服务</div>
                </div>
                <div @click="goOrder(3)" class="item">
                    <div class="icon">
                        <van-icon name="passed" />
                    </div>
                    <div>已完成</div>
                </div>
                <div @click="goOrder(4)" class="item">
                    <div class="icon">
                        <van-icon name="close" />
                    </div>
                    <div>已取消</div>
                </div>
            </div>
        </div>

        <div class="foot">
            <div class="foot1">
                <div class="text1">服务对象管理</div>
                <div class="text1">
                    <van-icon name="arrow" />
                </div>
            </div>
            <div class="foot2">
                <div class="text1">分享转发</div>
                <div class="text1">
                    <van-icon name="arrow" />
                </div>
            </div>
        </div>

        <van-button @click="showQuit = true" class="quit" type="danger" size="large">退出登录</van-button>
        <!-- 退出对话框 -->
        <van-dialog v-model:show="showQuit" @cancel="showQuit = false" @confirm="logout" title="温馨提示" show-cancel-button>
            <div class="quit_text">是否确认退出登录</div>
        </van-dialog>
    </div>
</template>

<style lang="less" scoped>
    .container {
        height: 100%;
        overflow: hidden;

        .user {
            width: 95%;
            height: 200px;
            background-color: #fff;
            text-align: center;
            border-radius: 10px;
            margin: 10px;

            .img {
                margin-top: 30px;
            }

            .text {
                line-height: 30px;
                font-weight: bold;
            }
        }

        .order {
            margin: 10px;
            border-radius: 5px;
            background-color: #fff;
            padding: 10px;

            .top {
                margin: 10px;
                line-height: 50px;
                display: flex;
                justify-content: space-between;

                .text1 {
                    color: #333;
                }

                .text2 {
                    color: #999;
                }

                border-bottom: 0.5px solid #f5f5f5;
            }

            .button {
                padding: 10px;
                display: flex;
                justify-content: space-around;

                .item {
                    text-align: center;
                    font-size: 14px;
                    color: #999;

                    .icon {
                        font-size: 40px;
                        color: #329b7f;
                        margin-bottom: 10px;
                    }
                }
            }
        }

        .foot {
            margin: 0 10px;
            padding: 10px;
            line-height: 50px;
            background-color: #fff;

            .foot1,
            .foot2 {
                display: flex;
                justify-content: space-between;
                color: #555;
            }

            .foot1 {
                border-bottom: 0.5px solid #f5f5f5;
            }
        }

        .quit {
            width: 90%;
            margin: 20px;

            font-size: 22px;
        }

        .quit_text {
            margin: 20px 0;
            text-align: center;
        }
    }
</style>
