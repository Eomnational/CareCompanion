<script setup>
import { nextTick, onMounted, reactive, ref } from "vue";
import { userGetmenu, userSetmenu, menuList } from "../../../api/index.js";

// 对话框显示/隐藏状态  默认：隐藏
const dialogFormVisible = ref(false);
// 对话框关闭方法回调
const beforeClose = () => {
  // 关闭对话框
  dialogFormVisible.value = false;
  // 重置表单 将表单重置为初始值，并移除校验结果
  formRef.value.resetFields();
  // 重新设置选中状态 空数组就是清空全选 当前为恢复成默认选中数组状态
  treeRef.value.setCheckedKeys(defaultCheckedKeys);
};

// 打开对话框回调
const openDialogForm = (rowData = {}) => {
  // 打开对话框
  dialogFormVisible.value = true;

  // 如果是编辑模式 数据进行复现但是需要等待form创建完成才可以
  nextTick(() => {
    if (rowData) {
      Object.assign(formData, { id: rowData.id, name: rowData.name });
      treeRef.value.setCheckedKeys(rowData.permission);
    }
  });
};

// 菜单权限树形数据
const treePermissionData = ref([]);

// 表单数据
const formData = reactive({
  name: "",
  permissions: "",
  id: "",
});

// 挂载完毕 - 生命周期
onMounted(() => {
  // 获取菜单权限树形数据接口
  userGetmenu().then((res) => {
    if (res.data.code === 10000) {
      treePermissionData.value = res.data.data;
    }
  });

  // 获取菜单权限列表数据
  getMenuList(pageData);
});

// 默认选中的权限数组
const defaultCheckedKeys = [4, 5];

// 树形元素DOM
const treeRef = ref();

// 表单元素DOM
const formRef = ref();

// 表单验证
const rules = reactive({
  name: [{ required: true, message: "权限规则名称不得为空", trigger: "blur" }],
});

// 提交表单
const onsubmit = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      formData.permissions = JSON.stringify(treeRef.value.getCheckedKeys());
      userSetmenu({
        name: formData.name,
        permissions: formData.permissions,
        id: formData.id,
      }).then((res) => {
        if (res.data.code === 10000) {
          ElMessage({
            message: "提交数据成功",
            type: "success",
          });
          // 添加成功后 自动关闭对话框与初始化表单
          beforeClose();
          // 重新获取表格数据
          getMenuList(pageData);
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

// 获取菜单权限列表数量
const pageData = reactive({
  pageNum: 1,
  pageSize: 10,
});

const tableData = reactive({
  list: [],
  total: 0,
});

// 表格加载数据动画
const tableLoading = ref(false);

// 获取菜单权限列表
const getMenuList = async (val) => {
  tableLoading.value = true;
  const { data } = await menuList(val);
  if (data.code === 10000) {
    tableData.list = data.data.list;
    tableData.total = data.data.total;
    tableLoading.value = false;
  }
};

const handleEdit = (index, data) => {
  openDialogForm(data);
};

// 分页组件方法
const handleSizeChange = (val) => {
  // 每页获取多少数据
  console.log(`handleSizeChange - ${val} items per page`);
  pageData.pageSize = val;
  getMenuList(pageData);
};
const handleCurrentChange = (val) => {
  // 当前页
  console.log(`handleCurrentChange - current page: ${val}`);
  pageData.pageNum = val;
  getMenuList(pageData);
};
</script>

<template>
  <!-- 对话框 -->
  <el-dialog
    v-model="dialogFormVisible"
    :before-close="beforeClose"
    title="菜单管理"
    width="500"
  >
    <el-form
      :model="formData"
      :rules="rules"
      ref="formRef"
      style="max-width: 360px; margin: 0 auto"
    >
      <!-- 使用IF会出现表单初始化后当前数据格式化失败，新增就会变成更新的问题 -->
      <el-form-item v-show="false" prop="id">
        <el-input v-model="formData.id" />
      </el-form-item>
      <el-form-item prop="name" size="large">
        <el-input
          v-model="formData.name"
          prefix-icon="EditPen"
          placeholder="请填写权限名称 *必填"
        />
      </el-form-item>
      <el-form-item>
        <el-card style="width: 100%">
          <template #header>
            <div class="card-header">
              <span>权限详细列表</span>
            </div>
          </template>
          <el-tree
            ref="treeRef"
            :data="treePermissionData"
            node-key="id"
            :show-checkbox="true"
            :default-checked-keys="defaultCheckedKeys"
            :default-expand-all="true"
          ></el-tree>
        </el-card>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="onsubmit(formRef)">提交数据</el-button>
    </template>
  </el-dialog>

  <!-- 头部详细内容显示 -->
  <panelHead></panelHead>

  <!-- 添加按钮 -->
  <el-button type="primary" @click="openDialogForm(null)">
    <el-icon style="margin: 0 3px"><Plus /></el-icon>
    新增
  </el-button>

  <!-- 数据表格 -->
  <el-table
    v-loading="tableLoading"
    :data="tableData.list"
    height="530"
    style="width: 100%; margin-top: 20px"
  >
    <el-table-column prop="id" label="编号" width="160" />
    <el-table-column prop="name" label="昵称" width="160" />
    <el-table-column
      prop="permissionName"
      label="权限规则"
      flex="1"
      min-width="500"
    />
    <el-table-column label="操作工具" width="200" align="center">
      <template #default="scope">
        <el-button type="primary" @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button
        >
        <el-button type="danger">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
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
.card-header {
  font-size: 18px;
}

.pagination {
  margin: 15px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
