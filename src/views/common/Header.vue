<template>
  <div class="header-container">
    <!-- 左邊 -->
    <div class="l-content">
      <el-button :icon="Menu" size="small" @click="handleMenu"></el-button>
      <!-- 麵包屑 -->
      <span class="text">首頁</span>
    </div>
    <!-- 右邊 -->
    <div class="r-content">
      <el-dropdown>
        <span class="el-dropdown-link">
          <img class="user" src="@/assets/imgs/user.jpg" alt="">
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>個人資料</el-dropdown-item>
            <el-dropdown-item divided>登出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

  </div>
</template>

<script setup lang="ts">
import {Menu} from '@element-plus/icons-vue'
import {useTagStore} from "@/store/tag";

const tagStore = useTagStore()
function handleMenu(){
  tagStore.changeTag()
}
</script>

<style scoped>
.header-container {
  padding: 0 20px;
  background-color: antiquewhite;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .text {
    font-size: 14px;
    margin-left: 10px;
  }
  .r-content{
    .user{
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }
}
</style>
