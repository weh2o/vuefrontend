<template class="menu-container">

  <el-menu
      :default-active="router.currentRoute.value.fullPath"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      style="min-height: 100vh"
      router
      active-text-color="#ffd04b"
      background-color="beige"
      :collapse="menuCollapse"
  >
    <h3 v-if="!menuCollapse" class="menu-title">學生系統</h3>
    <el-menu-item index="/demo2">
      <el-icon>
        <House/>
      </el-icon>
      <span>首頁</span>
    </el-menu-item>

    <el-menu-item index="/demo">
      <el-icon>
        <User/>
      </el-icon>
      <span>Demo</span>
    </el-menu-item>

    <el-menu-item index="/login">
      <el-icon>
        <icon-menu/>
      </el-icon>
      <span>安安</span>
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
import {computed} from "vue";

const tagStore = useTagStore()

const menuCollapse = computed(() => {
  return tagStore.menuCollapse
})

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
