<script setup>
import dayjs from "dayjs";
import { onMounted, reactive, ref } from "vue";
import {
  userManageList,
  menuSelectlist,
  updateUser,
} from "../../../api/index.js";

// 表格数据加载动画
const tableLoading = ref(false);
// 获取账号管理数据列表数量
const pageData = reactive({
  pageNum: 1,
  pageSize: 10,
});
// 账号管理数据列表
const userList = reactive({
  list: [],
  options: [],
  total: 0,
});
// 获取账号管理数据列表
const getUserManageList = () => {
  tableLoading.value = true;
  userManageList(pageData).then((res) => {
    if (res.data.code === 10000) {
      const { list, total } = res.data.data;
      list.forEach((item) => {
        item.create_time = dayjs(item.create_time).format("YYYY:MM:DD");
      });
      userList.list = list;
      userList.total = total;
      tableLoading.value = false;
    }
  });
};
// 获取角色所属角色
const getMenuSelectlist = () => {
  menuSelectlist().then((res) => {
    if (res.data.code === 10000) {
      userList.options = res.data.data;
    }
  });
};
// 生命周期 页面挂载完毕
onMounted(() => {
  getUserManageList();
  getMenuSelectlist();
});

// 自定义方法获取当前用户的角色
const PermissionsName = (id) => {
  const data = userList.options.find((item) => item.id === id);
  const userRole = data ? data.name : "超级管理员";
  return userRole;
};

// 表格编辑按钮
const open = (row = {}) => {
  dialogFormVisible.value = true;
  Object.assign(formData, {
    mobile: row.mobile,
    name: row.name,
    permissions_id: row.permissions_id,
  });
};

// 分页组件方法
const handleSizeChange = (val) => {
  // 每页获取多少数据
  console.log(`handleSizeChange - ${val} items per page`);
  pageData.pageSize = val;
  getUserManageList();
};
const handleCurrentChange = (val) => {
  // 当前页
  console.log(`handleCurrentChange - current page: ${val}`);
  pageData.pageNum = val;
  getUserManageList();
};

// 对话框
const dialogFormVisible = ref(false);
const beforeClose = () => {
  dialogFormVisible.value = false;
  formRef.value.resetFields();
};
// 提交表单
const onsubmit = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      updateUser(formData).then((res) => {
        if (res.data.code === 10000) {
          ElMessage({
            message: "数据提交成功",
            type: "success",
          });
          beforeClose();
          getUserManageList();
        }
      });
    } else {
      ElMessage({
        message: "表单验证失败，无法进行提交",
        type: "error",
      });
    }
  });
};
const formRef = ref();
const formData = reactive({
  name: "",
  permissions_id: "",
});
const rules = reactive({
  mobile: [{ required: true, message: "手机号不得为空", trigger: "blur" }],
  name: [{ required: true, message: "名称不得为空", trigger: "blur" }],
  permissions_id: [
    { required: true, message: "权限ID不得为空", trigger: "blur" },
  ],
});
</script>

<template>
  <panelHead></panelHead>
  <!-- 数据表格 -->
  <el-table
    v-loading="tableLoading"
    :data="userList.list"
    height="530"
    style="width: 100%"
  >
    <el-table-column prop="id" label="编号" width="120" align="center" />
    <el-table-column prop="name" label="名称" align="center" />
    <el-table-column prop="mobile" label="手机号" align="center" />
    <el-table-column prop="permissions_id" label="所属角色" align="center">
      <template #default="scope">
        {{ PermissionsName(scope.row.permissions_id) }}
      </template>
    </el-table-column>
    <el-table-column prop="active" label="状态" width="120" align="center">
      <template #default="scope">
        <el-tag :type="scope.row.active ? 'success' : 'danger'">
          {{ scope.row.active ? "正常" : "禁用" }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      prop="create_time"
      label="创建时间"
      width="200"
      align="center"
    >
      <template #default="scope">
        <div
          style="display: flex; justify-content: center; align-items: center"
        >
          <el-icon><Clock /></el-icon>
          <span style="margin-left: 5px">{{ scope.row.create_time }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作工具" width="200" align="center">
      <template #default="scope">
        <el-button type="primary" @click="open(scope.row)">编辑</el-button>
        <el-button type="danger">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="pagination">
    <el-pagination
      v-model:current-page="pageData.pageNum"
      v-model:page-size="pageData.pageSize"
      :total="userList.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      size="small"
      layout="total, prev, pager, next, jumper"
      :background="true"
    />
  </div>

  <!-- 对话框 -->
  <el-dialog
    v-model="dialogFormVisible"
    :before-close="beforeClose"
    title="账号管理"
    width="500"
  >
    <el-form
      :model="formData"
      :rules="rules"
      ref="formRef"
      style="max-width: 360px; margin: 0 auto"
    >
      <el-form-item prop="mobile" size="large">
        <el-input v-model="formData.mobile" prefix-icon="Iphone" disabled />
      </el-form-item>
      <el-form-item prop="name" size="large">
        <el-input
          v-model="formData.name"
          prefix-icon="User"
          placeholder="请输入昵称"
        />
      </el-form-item>
      <el-form-item prop="permissions_id" size="large">
        <el-select
          v-model="formData.permissions_id"
          suffix-icon="ArrowDown"
          placeholder="请选择权限"
        >
          <el-option
            v-for="(item, index) in userList.options"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="onsubmit(formRef)">提交数据</el-button>
    </template>
  </el-dialog>
</template>

<style lang="less" scoped>
.pagination {
  margin: 15px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
