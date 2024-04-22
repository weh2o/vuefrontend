<template>
  <div class="header-container">
    <!-- 左邊 -->
    <div class="l-content">
      <el-button :icon="Menu" size="small" @click="handleMenu"></el-button>
      <!-- 麵包屑 -->
      <span class="text" style="font-size: 15px; font-weight: bold">{{ title }}</span>
    </div>
    <!-- 右邊 -->
    <div class="r-content">
      <el-dropdown>
        <span class="el-dropdown-link">
          <img class="user" src="@/assets/imgs/user.jpg" alt="">
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item icon="User">{{ userStore.name }}</el-dropdown-item>
            <el-dropdown-item divided @click="toUserInfo">個人資料</el-dropdown-item>
            <el-dropdown-item>設定</el-dropdown-item>
            <el-dropdown-item divided @click="logout">登出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

  </div>
</template>

<script setup lang="ts">
import {Menu} from '@element-plus/icons-vue'
import {useTagStore} from "@/store/tag";
import router from "@/router";
import {delToken} from "@/util/tokenUtil"
import {useUserStore} from '@/store/user'
import {computed, onBeforeMount} from "vue";
import http from "@/util/request";
import {ElMessage} from "element-plus";

const userStore = useUserStore()
const tagStore = useTagStore()


const title = computed(() => {
  return tagStore.title
})

// 掛載前執行
onBeforeMount(() => {

})

// 左側導航欄收縮
function handleMenu() {
  tagStore.changeTag()
}

// 跳轉到個人資料
function toUserInfo() {
  router.push({name: 'UserInfo'})
}

// 登出
async function logout() {
  const {data: res} = await http.get("/leave")
  if ('200' == res.code) {
    delToken()
    ElMessage.success(res.msg)
    router.push({name: 'Login'})
  }
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

  .r-content {
    .user {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }
}
</style>
