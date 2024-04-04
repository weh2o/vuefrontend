<template class="menu-container">

  <el-menu
      :default-active="router.currentRoute.value.fullPath"
      class="el-menu-vertical-demo"
      style="min-height: 100vh; border-right: none"
      router
      active-text-color="#ffd04b"
      background-color="beige"
      :collapse="menuCollapse"
  >
    <h3 class="menu-title">{{ menuCollapse ? '系統' : '校園系統' }}</h3>
    <el-menu-item ref="home" @click="giveTitle" index="/home">
      <el-icon>
        <House/>
      </el-icon>
      <span>首頁</span>
    </el-menu-item>

    <el-menu-item index="/studentManagement">
      <el-icon>
        <User/>
      </el-icon>
      <span>學生管理</span>
    </el-menu-item>

    <el-menu-item index="/login">
      <el-icon>
        <icon-menu/>
      </el-icon>
      <span>我是登入頁面</span>
    </el-menu-item>

    <el-sub-menu index="/">
      <template #title>
        <el-icon>
          <location/>
        </el-icon>
        <span>很多東西的</span>
      </template>

      <el-menu-item-group title="Group One">
        <el-menu-item index="1-1">item one</el-menu-item>
        <el-menu-item index="1-2">item two</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="Group Two">
        <el-menu-item index="1-3">item three</el-menu-item>
      </el-menu-item-group>
      <el-sub-menu index="1-4">
        <template #title>item four</template>
        <el-menu-item index="1-4-1">item one</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>


  </el-menu>
</template>

<script setup lang="ts">
import {House, Location, Menu as IconMenu, User} from '@element-plus/icons-vue'
import router from "@/router";
import {useTagStore} from "@/store/tag";
import {computed, ref} from "vue";

const tagStore = useTagStore()

// 控制菜單折疊的屬性
const menuCollapse = computed(() => {
  return tagStore.menuCollapse
})

function giveTitle() {
  const home = ref()
}

</script>

<style scoped>

.menu-container {
  background-color: beige;
}

.menu-title {
  text-align: center;
  margin: 0;
  line-height: 48px;

}

* {
  text-decoration: none;
}

</style>
