<script setup>
import { onMounted, reactive, ref } from "vue";
import panelHeader from "../../../components/panelHead.vue";
import { adminOrder, updateUrder } from "../../../api/index.js";
import dayjs from "dayjs";

const tableData = reactive({
  list: [],
  total: 0,
});
const pageData = reactive({
  pageNum: 1,
  pageSize: 5,
});
// 分页操作工具方法
const handleCurrentChange = (val) => {
  pageData.pageNum = val;
  getAdminOrder();
};
// 弹出对话框变量
const finishDialogVisible = ref(false);
const finishDialogData = ref([]);
// 查看订单按钮数据对话框
const selectOrder = (data) => {
  finishDialogVisible.value = true;
  finishDialogData.value = data;
};
// 关闭对话框方法
const handleClose = () => {
  finishDialogVisible.value = false;
};
// 搜索框操作区域
const SearchKey = reactive({
  out_trade_no: "",
});
const handleSearch = () => {
  getAdminOrder(SearchKey);
};
const clearSearchKey = () => {
  getAdminOrder();
};

// 完成订单按钮修改状态
const updateOrder = (id) => {
  updateUrder(id).then((res) => {
    if (res.data.code === 10000) {
      getAdminOrder();
    }
  });
};
// 获取订单列表接口
const getAdminOrder = (SearchKey = {}) => {
  adminOrder({ ...pageData, ...SearchKey }).then((res) => {
    // console.log(res.data.data.list);
    if (res.data.code === 10000) {
      res.data.data.list.forEach((item) => {
        item.order_start_time = dayjs(item.order_start_time).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        if (!item.companion) {
          item.companion = {
            age: 50,
            avatar: "http://159.75.169.224:5500/1.jpeg",
            id: 0,
            mobile: "15000000000",
            name: "测试人员",
            sex: "1",
          };
        }
      });
      tableData.list = res.data.data.list;
      tableData.total = res.data.data.total;
    }
  });
};

onMounted(() => {
  getAdminOrder();
});

const statusMap = (key) => {
  const obj = {
    已取消: "info",
    待支付: "warning",
    已完成: "success",
    待服务: "primary",
  };
  return obj[key];
};
</script>

<template>
  <div class="container">
    <panelHeader></panelHeader>
    <!-- 订单号搜索 -->
    <div style="margin: 10px 0">
      <el-input
        v-model="SearchKey.out_trade_no"
        clearable
        @clear="clearSearchKey"
        style="max-width: 300px"
        placeholder="请输入订单号"
      >
        <template #append>
          <el-button
            type="primary"
            icon="Search"
            style="display: flex; align-items: center; justify-content: center"
            @click="handleSearch"
          >
            搜索
          </el-button>
        </template>
      </el-input>
    </div>

    <el-table :data="tableData.list" style="width: 100%" height="410">
      <el-table-column
        prop="out_trade_no"
        label="订单号"
        width="130"
        align="center"
        fixed="left"
      />
      <el-table-column
        prop="hospital_name"
        label="就诊医院"
        align="center"
        min-width="130"
      />
      <el-table-column
        prop="service_name"
        label="陪护服务"
        align="center"
        min-width="150"
      />
      <el-table-column label="陪护师" align="center" width="80">
        <template #default="scope">
          <div class="companion">
            <el-image
              style="width: 50px; height: 50px"
              :src="scope.row?.companion?.avatar"
            >
              <template #error>
                <div class="image-slot">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="下单时间" align="center" min-width="150">
        <template #default="scope">
          {{ scope.row.order_start_time }}
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center" min-width="90">
        <template #default="scope">
          <el-tag :type="statusMap(scope.row.trade_state)">{{
            scope.row.trade_state
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作工具"
        align="center"
        min-width="220"
        fixed="right"
      >
        <template #default="scope">
          <el-button @click="selectOrder(scope.row)">查看订单</el-button>
          <el-button
            v-if="scope.row.trade_state === '待服务'"
            type="primary"
            @click="updateOrder(scope.row.out_trade_no)"
          >
            服务完成
          </el-button>
          <el-button v-else type="primary" disabled>暂无服务</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        v-model:current-page="pageData.pageNum"
        v-model:page-size="pageData.pageSize"
        :total="tableData.total"
        @current-change="handleCurrentChange"
        size="small"
        layout="total, prev, pager, next, jumper"
        :background="true"
      />
    </div>
  </div>
  <!-- 完成服务对话框 -->
  <el-dialog
    v-model="finishDialogVisible"
    title="订单详细数据"
    width="600"
    :before-close="handleClose"
  >
    <div class="dialogContainer">
      <el-image
        style="width: 100px; height: 100px; border-radius: 50%"
        :src="finishDialogData.companion.avatar"
      />
      <span class="companionName">
        <el-icon><User /></el-icon>
        {{ finishDialogData.companion.name }}
      </span>
      <div class="content">
        <label>订单号：</label>
        <el-input
          v-model="finishDialogData.out_trade_no"
          style="width: 370px"
          disabled
        />
      </div>
      <div class="content">
        <label>就诊医院：</label>
        <el-input
          v-model="finishDialogData.hospital_name"
          style="width: 370px"
          disabled
        />
      </div>
      <div class="content">
        <label>陪护服务：</label>
        <el-input
          v-model="finishDialogData.service_name"
          style="width: 370px"
          disabled
        />
      </div>
      <div class="content">
        <label>陪护师手机号：</label>
        <el-input
          v-model="finishDialogData.companion.mobile"
          style="width: 370px"
          disabled
        />
      </div>
      <div class="content">
        <label>订单总价：</label>
        <el-input
          v-model="finishDialogData.price"
          style="width: 370px"
          disabled
        />
      </div>
      <div class="content">
        <label>已付金额：</label>
        <el-input
          v-model="finishDialogData.paidPrice"
          style="width: 370px"
          disabled
        />
      </div>
      <div class="content">
        <label>下单时间：</label>
        <el-input
          v-model="finishDialogData.order_start_time"
          style="width: 370px"
          disabled
        />
      </div>
      <div class="content">
        <label>订单状态：</label>
        <el-input
          v-model="finishDialogData.trade_state"
          style="width: 370px"
          disabled
        />
      </div>
      <div class="content">
        <label>接单状态：</label>
        <el-input
          v-model="finishDialogData.service_state"
          style="width: 370px"
          disabled
        />
      </div>
      <div class="content">
        <label>联系人手机号：</label>
        <el-input
          v-model="finishDialogData.tel"
          style="width: 370px"
          disabled
        />
      </div>
    </div>
  </el-dialog>
</template>

<style lang="less" scoped>
.image-slot {
  width: 100%;
  height: 100%;
  border: 1px rgb(178, 178, 178) solid;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialogContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .companionName {
    margin: 15px 0;
    font-size: 22px;

    display: flex;
    align-items: center;
    justify-content: center;
    .el-icon {
      margin: 0 5px;
    }
  }
  .content {
    label {
      display: inline-block;
      width: 120px;
      padding: 0 5px;
      text-align: right;
    }
  }
  .el-input {
    margin: 5px 0;
  }
}

.pagination {
  margin: 15px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
