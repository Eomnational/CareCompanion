<script setup>
    import { reactive } from 'vue';
    import http from '../../api/index';
    import { useRouter } from 'vue-router';

    const router = useRouter();

    const onClickRight = () => {
        console.log('马上跳转注册页面');
    };
    const onSubmit = async () => {
        try {
            const { code, data } = await http.login(formData);
            if (code === 10000) {
                showNotify({ type: 'success', message: '登录成功' });
                localStorage.setItem('pzH5_token', data.token);
                localStorage.setItem('pzH5_userInfo', JSON.stringify(data.userInfo));
                router.push('/home');
            }
        } catch (err) {
            console.log(err);
        }
    };

    // 账号密码：13797053405 826523
    const formData = reactive({
        userName: '13797053405',
        passWord: '826523',
    });
</script>

<template>
    <van-nav-bar title="登录模块" right-text="立即注册" @click-right="onClickRight" />
    <div class="container">
        <van-form @submit="onSubmit">
            <van-cell-group inset>
                <van-field
                    v-model="formData.userName"
                    name="手机号"
                    label="手机号"
                    placeholder="请输入手机号"
                    :rules="[{ required: true, message: '请填写手机号' }]"
                />
                <van-field
                    v-model="formData.passWord"
                    type="password"
                    name="密码"
                    label="密码"
                    placeholder="请输入密码"
                    :rules="[{ required: true, message: '请填写密码' }]"
                />
            </van-cell-group>
            <div style="margin: 20px">
                <van-button round block type="primary" native-type="submit">登录</van-button>
            </div>
        </van-form>
    </div>
</template>

<style lang="less" scoped>
    .container {
        margin: 30px 0;
    }
    .van-nav-bar {
        height: 50px;
        line-height: 50px;
        text-align: center;
        width: 100%;

        :deep(.van-nav-bar__content) {
            height: 100%;
        }

        :deep(.van-nav-bar__title) {
            font-size: 30px;
        }
    }
</style>
