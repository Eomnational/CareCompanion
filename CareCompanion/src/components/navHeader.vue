<script setup>
import userAvatar from "../assets/user-avatar.svg";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useMenuStore } from "../stores/menu.js";

const menuStore = useMenuStore();
const { selectMenu } = storeToRefs(useMenuStore());
const route = useRoute();
const router = useRouter();

const closeTab = (item, index) => {
  menuStore.subSelectMenu(item);
  if (route.path !== item.path) return;
  const selectMenuData = selectMenu.value;
  if (index === selectMenuData.length) {
    if (!selectMenuData.length) {
      router.push("/");
      menuStore.setPageActiva("");
    } else {
      router.push({
        path: selectMenuData[index - 1].path,
      });
      menuStore.setPageActiva(selectMenuData[index - 1].activa);
    }
  } else {
    router.push({
      path: selectMenuData[index].path,
    });
    menuStore.setPageActiva(selectMenuData[index].activa);
  }
};

const routerPush = (path, activa) => {
  menuStore.setPageActiva(activa);
  router.push(path);
};

const handleCommand = (command) => {
  switch (command) {
    case "signOut":
      localStorage.clear();
      window.location.href = window.location.origin;
      break;
  }
};

// 用户的相关数据显示
const userInfo = JSON.parse(localStorage.getItem("pz_userInfo"));
</script>

<template>
  <div class="elHeader-container">
    <div class="nav-left flex-box">
      <el-icon
        style="margin-right: 10px"
        size="26"
        @click="menuStore.collapseMenu"
      >
        <Expand />
      </el-icon>
      <ul class="flex-box">
        <li
          v-for="(item, index) in selectMenu"
          :key="`${index}-${item.path}`"
          class="tab flex-box"
          :class="{ selected: route.path === item.path }"
        >
          <el-icon size="20">
            <component :is="item.icon"></component>
          </el-icon>
          <!-- 在事件后面添加修饰符 native  @click.native="getClick"  这里使用这个 -->
          <!-- 使用编程式导航 router.push   -->
          <a class="text" @click="routerPush(item.path, item.activa)">
            {{ item.name }}
          </a>
          <el-icon size="20" class="close" @click="closeTab(item, index)">
            <Close />
          </el-icon>
        </li>
      </ul>
    </div>
    <div class="nav-right">
      <el-dropdown @command="handleCommand">
        <div class="el-dropdown-link">
          <el-avatar :src="userInfo.avatar || userAvatar" />
          <p class="userName">{{ userInfo.name || "九曲玉清" }}</p>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <el-icon><Unlock /></el-icon>
              修改密码
            </el-dropdown-item>
            <el-dropdown-item>
              <el-icon><User /></el-icon>
              个人信息
            </el-dropdown-item>
            <el-dropdown-item command="signOut">
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style lang="less" scoped>
.flex-box {
  display: flex;
  align-items: center;
}

.elHeader-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  background-color: #ffffff;

  .nav-left {
    height: 100%;

    .el-icon {
      padding: 0 3px;
    }

    .el-icon:hover {
      cursor: pointer;
    }

    ul {
      height: 100%;
    }

    .tab {
      height: 100%;
      padding: 0 5px;

      .text {
        padding: 0 5px;
      }

      .close {
        visibility: hidden;
      }

      &:hover {
        background-color: #f5f5f5;

        .close {
          visibility: inherit;
          color: #242424;
        }
      }

      &.selected {
        background-color: #f5f5f5;
        a,
        i {
          color: #409eff;
        }
      }
    }

    a {
      text-decoration: none;
      color: #242424;
      font-size: 13px;
      cursor: pointer;
    }
  }

  .nav-right {
    // 去除下拉框会出现蓝色的边框问题 设置outlin为unset/none
    .el-tooltip__trigger:focus-visible {
      outline: unset;
    }

    .el-dropdown-link {
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;

      p {
        margin-left: 10px;
        margin-right: 5px;
      }
    }
  }
}
</style>
