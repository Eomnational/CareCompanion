<script setup>
    import { getCode, userRegistration, userLogin, menuPermissions } from '../../api/index.js';
    import { reactive, ref, toRaw } from 'vue';
    import { useRouter } from 'vue-router';
    import { useMenuStore } from '../../stores/menu.js';
    const menuStore = useMenuStore();

    const imgUrl_1 = new URL('../../assets/01.jpg', import.meta.url).href;
    const imgUrl_2 = new URL('../../assets/07.jpg', import.meta.url).href;

    // 获取当前年份
    const date = new Date();
    const currentYear = date.getFullYear();

    // 路由转跳
    const router = useRouter();

    // 表单DOM元素
    const ruleFormRef = ref();

    //表单类型 登录(false) 注册(true)
    const formType = ref(false);

    // 登录表单数据
    const loginForm = reactive({
        username: '13797053405',
        password: '826523',
        verifica: '',
    });

    // 获取验证码数据
    const verificaData = reactive({
        loading: false,
        text: '获取验证码',
        time: 60,
    });

    const handleVerifica = () => {
        const phoneReg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
        if (!loginForm.username || !phoneReg.test(loginForm.username)) {
            return ElMessage({
                message: '请检查输入手机号是否正确',
                type: 'warning',
            });
        }
        // 按钮加载模式开启  开启转圈圈并且无法点击
        verificaData.loading = true;
        let interval = setInterval(() => {
            if (verificaData.time <= 0) {
                // 按钮加载模式关闭  关闭转圈圈并且恢复可点击
                verificaData.loading = false;
                verificaData.text = '获取验证码';
                verificaData.time = 60;
                // 清除定时器不然会一直执行
                clearInterval(interval);
            } else {
                verificaData.text = `剩余 ${verificaData.time} 秒`;
                verificaData.time -= 1;
            }
        }, 1000);

        // 获取验证码
        getCode({ tel: loginForm.username }).then((res) => {
            if (res.data.code === 10000) {
                // 账号密码：13797053405 826523
                ElMessage({
                    message: '验证码获取成功，已发送到手机',
                    type: 'success',
                });
            }
        });
    };

    // 自定义表单规则验证
    const usernameValidato = (rule, value, callback) => {
        const phoneReg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
        phoneReg.test(value) ? callback() : callback(new Error('请检查输入手机号是否正确'));
    };
    // 验证表单规则
    const rules = reactive({
        username: [
            { required: true, message: '请输入手机号,不得为空', trigger: 'blur' },
            { validator: usernameValidato, trigger: 'blur' },
        ],
        password: [
            { required: true, message: '请输入密码,不得为空', trigger: 'blur' },
            { min: 6, max: 512, message: '密码长度为 6 到 512 位字符', trigger: 'blur' },
        ],
        verifica: [{ required: true, message: '请输入验证码,不得为空', trigger: 'blur' }],
    });

    const onsubmits = async (formEl) => {
        if (!formEl) return;
        await formEl.validate((valid) => {
            if (valid) {
                switch (formType.value) {
                    case true: // 注册模式
                        const regData = {
                            userName: loginForm.username,
                            passWord: loginForm.password,
                            validCode: loginForm.verifica,
                        };
                        userRegistration(regData).then((res) => {
                            if (res.data.code === 10000) {
                                ElMessage({
                                    message: '注册成功，请进行登录',
                                    type: 'success',
                                });
                                // 转为登录类型
                                formType.value = false;
                            }
                        });
                        break;
                    case false: // 登录模式
                        const loginData = {
                            userName: loginForm.username,
                            passWord: loginForm.password,
                        };
                        userLogin(loginData).then((res) => {
                            if (res.data.code === 10000) {
                                ElMessage({
                                    message: '登录成功，欢迎主人回归！',
                                    type: 'success',
                                });
                                // 记录用户数据与登录凭证
                                localStorage.setItem('pz_token', res.data.data.token);
                                localStorage.setItem('pz_userInfo', JSON.stringify(res.data.data.userInfo));
                                // 获取用户拥有的菜单
                                menuPermissions().then((res) => {
                                    if (res.data.code === 10000) {
                                        menuStore.setMenuPermissions(res.data.data);
                                        const routerData = toRaw(menuStore.routerList);
                                        routerData.map((item) => {
                                            router.addRoute('main', item);
                                        });
                                        // 跳转到首页
                                        router.push('/');
                                    }
                                });
                            }
                        });
                        break;
                }
            } else {
                ElMessage({
                    message: '验证表单失败，请检查输入内容是否正确',
                    type: 'error',
                });
            }
        });
    };
</script>

<template>
    <el-row class="login-container" justify="center" align="middle">
        <el-col :lg="8" :md="10" :sm="14" :xs="18">
            <el-card>
                <template #header>
                    <div class="card-header">
                        <!-- {{ formType ? '注册模块' : '登录模块' }} -->
                        <img :src="formType ? imgUrl_1 : imgUrl_2" />
                    </div>
                </template>
                <!-- margin: 0 auto  自动剧中 -->
                <el-form :model="loginForm" :rules="rules" ref="ruleFormRef" style="max-width: 360px; margin: 0 auto">
                    <el-form-item prop="username">
                        <el-input v-model="loginForm.username" prefix-icon="iphone" clearable size="large" placeholder="手机号" />
                    </el-form-item>
                    <el-form-item prop="password" :class="{ clearMargin: !formType }">
                        <el-input
                            v-model="loginForm.password"
                            prefix-icon="lock"
                            clearable
                            size="large"
                            placeholder="密码"
                            type="password"
                        />
                    </el-form-item>
                    <el-form-item prop="verifica" class="clearMargin" v-if="formType">
                        <el-input
                            v-model="loginForm.verifica"
                            prefix-icon="Connection"
                            clearable
                            size="large"
                            placeholder="验证码"
                        >
                            <template #append>
                                <el-button
                                    @click="handleVerifica"
                                    :loading="verificaData.loading"
                                    style="width: 120px; display: flex; align-items: center; justify-content: center"
                                >
                                    {{ verificaData.text }}
                                </el-button>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item class="clearMargin">
                        <div class="tips-link">
                            <p><a href="javascript:void(0);">忘记密码?</a></p>
                            <p>
                                没有账号?
                                <a href="javascript:void(0);" @click="formType = !formType">
                                    {{ formType ? '立即登录' : '立即注册' }}
                                </a>
                            </p>
                        </div>
                        <el-button
                            type="primary"
                            size="large"
                            @click="onsubmits(ruleFormRef)"
                            style="width: 100%; font-size: 22px"
                        >
                            {{ formType ? '注册' : '登录' }}
                        </el-button>
                    </el-form-item>
                </el-form>

                <template #footer>
                    <p class="card-footer">Copyright © {{ currentYear }} 空洞未来科技有限公司</p>
                </template>
            </el-card>
        </el-col>
    </el-row>
</template>

<style lang="less" scoped>
    // 公共类 清除外边距
    .clearMargin {
        margin: 0;
    }

    .login-container {
        height: 100vh;

        .card-header {
            height: 180px;

            img {
                height: 100%;
                width: 100%;
                object-fit: cover;
            }
        }

        .card-footer {
            font-size: 15px;
            text-align: center;
        }

        .tips-link {
            margin: 10px 0 6px 0;
            width: 100%;
            display: flex;
            justify-content: space-between;

            a {
                color: #a0cfff;
                cursor: pointer;
                text-decoration: none;

                &:hover {
                    color: #337ecc;
                }
            }
        }

        :deep(.el-card__header) {
            padding: 0;
        }
    }
</style>
