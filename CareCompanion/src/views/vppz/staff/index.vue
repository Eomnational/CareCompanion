<script setup>
    import dayjs from 'dayjs';
    import { ref, reactive, onMounted, nextTick } from 'vue';
    import { photoList, addCompanion, companionList, deleteCompanion } from '../../../api/index.js';

    // 对话框数据  创建陪护师
    const dialogFormVisible = ref(false);
    const beforeClose = () => {
        dialogFormVisible.value = false;
        formRef.value.resetFields();
    };
    const open = (data = {}) => {
        dialogFormVisible.value = true;

        if (data) {
            // 由于对话框异步的 表单创建也是异步的 有时候有可能会冲突 或者数据无法填充复现所以需要使用 nextTick 方法
            nextTick(() => {
                Object.assign(formData, {
                    id: data.id,
                    mobile: data.mobile,
                    active: data.active,
                    age: data.age,
                    avatar: data.avatar,
                    name: data.name,
                    sex: data.sex,
                });
            });
        }
    };

    // 对话框数据  选择头像
    const photoListData = ref([]);
    const selectIndex = ref(0);
    const dialogImgVisible = ref(false);
    const beforeImgClose = () => {
        dialogImgVisible.value = false;
    };
    const confirmImage = () => {
        formData.avatar = photoListData.value[selectIndex.value].url;
        dialogImgVisible.value = false;
    };

    // 表单数据
    const formData = reactive({
        id: '',
        mobile: '',
        active: 0,
        age: 0,
        avatar: '',
        name: '',
        sex: '',
    });
    // 自定义表单规则验证
    const phoneValidato = (rule, value, callback) => {
        const phoneReg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
        phoneReg.test(value) ? callback() : callback(new Error('请检查输入的手机号是否正确'));
    };
    const formRules = reactive({
        mobile: [
            { required: true, message: '手机号不得为空', trigger: 'blur' },
            { validator: phoneValidato, trigger: 'blur' },
        ],
        name: [{ required: true, message: '昵称不得为空', trigger: 'blur' }],
        sex: [{ required: true, message: '性别不得为空', trigger: 'blur' }],
        avatar: [{ required: true, message: '头像不得为空', trigger: 'blur' }],
    });
    const formRef = ref();
    const onsubmit = async (formEl) => {
        if (!formEl) return;
        await formEl.validate((valid, fields) => {
            if (valid) {
                addCompanion(formData).then((res) => {
                    if (res.data.code) {
                        ElMessage({
                            type: 'success',
                            message: '陪护师数据提交成功',
                        });
                        beforeClose();
                        getCompanionList();
                    }
                });
            } else {
                ElMessage({
                    type: 'error',
                    message: '表单验证失败',
                });
            }
        });
    };

    // 表格数据相关区域
    const tableLoading = ref(false);
    const tableData = reactive({
        list: [],
        total: 0,
    });
    const pageData = reactive({
        pageNum: 1,
        pageSize: 5,
    });
    // 选中数据
    const selectTabData = ref([]);
    const handleSelectionChange = (val) => {
        // 点击选择选框自动触发的回调
        selectTabData.value = val.map((item) => ({ id: item.id }));
        // console.log(selectTabData.value);
    };
    // 删除弹出层 对话框
    const dialogDelectVisible = ref(false);
    const beforeDelectClose = () => {
        dialogDelectVisible.value = false;
        selectTabData.value = [];
        getCompanionList();
    };
    const delectLoading = reactive({
        time: 5,
        title: '确认删除',
        loading: false,
    });
    // 删除陪护师按钮
    const handleDelect = () => {
        if (!selectTabData.value.length) {
            return ElMessage.warning('请选择至少一项数据');
        }
        dialogDelectVisible.value = true;
        delectLoading.loading = true;
        let interval = setInterval(() => {
            if (delectLoading.time <= 0) {
                // 按钮加载模式关闭  关闭转圈圈并且恢复可点击
                delectLoading.loading = false;
                delectLoading.title = '确认删除';
                delectLoading.time = 5;
                // 清除定时器不然会一直执行
                clearInterval(interval);
            } else {
                delectLoading.title = `剩余 ${delectLoading.time} 秒`;
                delectLoading.time -= 1;
            }
        }, 1000);
    };
    // 删除弹出层 确认按钮
    const delectEvent = () => {
        deleteCompanion({ id: selectTabData.value }).then((res) => {
            if (res.data.code === 10000) {
                ElMessage.success('删除陪护师成功');
            }
            dialogDelectVisible.value = false;
            selectTabData.value = [];
            getCompanionList();
        });
    };

    // 表格分页相关区域
    const handleSizeChange = () => {};
    const handleCurrentChange = (val) => {
        pageData.pageNum = val;
        getCompanionList();
    };

    // api接口请求区域
    onMounted(() => {
        photoList().then((res) => {
            photoListData.value = res.data.data;
        });
        getCompanionList();
    });

    // 获取陪护师相关数据列表
    const getCompanionList = async () => {
        try {
            tableLoading.value = true;
            const { data } = await companionList(pageData);
            if (data.code === 10000) {
                data.data.list.forEach((item) => {
                    item.create_time = dayjs(item.create_time).format('YYYY:MM:DD');
                });
                tableData.list = data.data.list;
                tableData.total = data.data.total;
            }
            tableLoading.value = false;
        } catch (err) {
            console.log(err);
        }
    };
</script>

<template>
    <!-- 头部详细内容显示 -->
    <panelHead></panelHead>

    <!-- 弹出对话框 创建陪护师 -->
    <el-dialog v-model="dialogFormVisible" :before-close="beforeClose" title="陪护管理" width="500">
        <el-form
            :model="formData"
            :rules="formRules"
            ref="formRef"
            label-width="auto"
            style="max-width: 360px; margin: 0 auto; padding-top: 20px"
        >
            <el-form-item v-show="false" prop="id">
                <el-input v-model="formData.id" disabled />
            </el-form-item>
            <el-form-item prop="name" label="陪护师昵称：">
                <el-input prefix-icon="User" v-model="formData.name" placeholder="请输入昵称" />
            </el-form-item>
            <el-form-item prop="avatar" label="陪护师头像：">
                <el-button type="primary" plain v-if="!formData.avatar" @click="dialogImgVisible = true">点击上传头像</el-button>
                <el-image
                    v-else
                    :src="formData.avatar"
                    style="width: 100px; height: 100px; cursor: pointer"
                    @click="dialogImgVisible = true"
                />
            </el-form-item>
            <el-form-item prop="sex" label="陪护师性别：">
                <el-select v-model="formData.sex" placeholder="请选择性别">
                    <el-option label="男" value="1"></el-option>
                    <el-option label="女" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="age" label="陪护师年龄：">
                <el-input-number v-model="formData.age" :min="18" :max="75" />
            </el-form-item>
            <el-form-item prop="mobile" label="陪护师手机：">
                <el-input prefix-icon="Iphone" v-model="formData.mobile" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item prop="active" label="陪护师状态：">
                <el-radio-group v-model="formData.active">
                    <el-radio :value="0" size="large">失效</el-radio>
                    <el-radio :value="1" size="large">生效</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="onsubmit(formRef)">提交数据</el-button>
        </template>
    </el-dialog>

    <!-- 弹出对话框 选择头像 -->
    <el-dialog v-model="dialogImgVisible" :before-close="beforeImgClose" title="选择头像" style="min-width: 350px">
        <div class="img-list">
            <div v-for="(item, index) in photoListData" :key="item.name" class="img-box" @click="selectIndex = index">
                <div v-if="selectIndex === index" class="select">
                    <el-icon color="#fff">
                        <Check />
                    </el-icon>
                </div>
                <el-image style="width: 100%; height: 100%; object-fit: cover" :src="item.url" />
            </div>
        </div>

        <template #footer>
            <el-button @click="beforeImgClose">取消</el-button>
            <el-button type="primary" @click="confirmImage">确认</el-button>
        </template>
    </el-dialog>

    <!-- 创建陪护师按钮 -->
    <el-button type="primary" size="large" icon="Plus" @click="open(null)">创建陪护师</el-button>
    <el-button type="danger" size="large" icon="Delete" @click="handleDelect">删除陪护师</el-button>

    <!-- 删除陪护师 提示对话框 -->
    <el-dialog
        v-model="dialogDelectVisible"
        :before-close="beforeDelectClose"
        title="删除陪护师 - 温馨提示"
        width="500"
        align-center
    >
        <span>是否删除所选陪护师，当前选择 {{ selectTabData.length }} 条数据，删除后无法恢复数据！</span>
        <template #footer>
            <el-button type="danger" @click="delectEvent" :loading="delectLoading.loading">{{ delectLoading.title }}</el-button>
        </template>
    </el-dialog>

    <!-- 陪护师详细列表明细 -->
    <el-table
        v-loading="tableLoading"
        :data="tableData.list"
        style="width: 100%; height: 410px; margin-top: 20px"
        @selection-change="handleSelectionChange"
    >
        <el-table-column type="selection" width="30" />
        <el-table-column prop="id" label="编号" sortable width="120" align="center" />
        <el-table-column prop="name" label="陪护师昵称" min-width="200" sortable align="center" />
        <el-table-column prop="mobile" label="陪护师手机号" width="200" align="center" />
        <el-table-column prop="avatar" label="头像" width="120" align="center">
            <template #default="scope">
                <el-image style="width: 50px; height: 50px" :src="scope.row.avatar" />
            </template>
        </el-table-column>
        <el-table-column prop="sex" label="性别" width="120" align="center">
            <template #default="scope">
                {{ scope.row.sex === '1' ? '男' : '女' }}
            </template>
        </el-table-column>
        <el-table-column prop="active" label="状态" width="120" align="center">
            <template #default="scope">
                <el-tag :type="scope.row.active ? 'success' : 'danger'">{{ scope.row.active ? '正常' : '失效' }}</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="200" align="center">
            <template #default="scope">
                <div style="display: flex; justify-content: center; align-items: center">
                    <el-icon><Clock /></el-icon>
                    <span style="margin-left: 5px">{{ scope.row.create_time }}</span>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="操作工具" width="120" align="center">
            <template #default="scope">
                <el-button ndoe-key="id" icon="Edit" type="primary" @click="open(scope.row)">编辑</el-button>
                <!-- <el-button ndoe-key="id" type="danger">删除</el-button> -->
            </template>
        </el-table-column>
    </el-table>

    <!-- 陪护师表格分页 -->
    <div class="pagination">
        <el-pagination
            v-model:current-page="pageData.pageNum"
            v-model:page-size="pageData.pageSize"
            :total="tableData.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            size="small"
            layout="total, prev, pager, next, jumper"
            :background="true"
        />
    </div>
</template>

<style lang="less" scoped>
    .img-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, 150px);
        grid-template-rows: auto;
        grid-gap: 20px;
        justify-items: center;
        align-items: center;
        place-content: center;

        .img-box {
            position: relative;
            width: 100%;
            height: 100%;

            .select {
                position: absolute;
                left: 0;
                top: 0;
                width: 24px;
                height: 24px;
                background-color: #67c23a;
                z-index: 999;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
    }

    .pagination {
        margin: 15px 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
