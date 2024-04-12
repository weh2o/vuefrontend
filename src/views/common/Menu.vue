<template class="menu-container">

  <el-menu
      :default-active="router.currentRoute.value.fullPath"
      class="el-menu-vertical-demo"
      style="min-height: 100vh; border-right: none"
      router
      active-text-color="#1e90ff"
      background-color="beige"
      :collapse="menuCollapse"
  >
    <h3 class="menu-title">{{ menuCollapse ? '系統' : '校園系統' }}</h3>

    <el-menu-item v-for="menu in menuInfo" :key="menu.label" :index="menu.path">
      <el-icon>
        <component :is="menu.icon"></component>
      </el-icon>
      <span>{{ menu.label }}</span>
    </el-menu-item>

    <!--      <el-sub-menu index="/">-->
    <!--        <template #title>-->
    <!--          <el-icon>-->
    <!--            <location/>-->
    <!--          </el-icon>-->
    <!--          <span>很多東西的</span>-->
    <!--        </template>-->

    <!--        <el-menu-item-group title="Group One">-->
    <!--          <el-menu-item index="1-1">item one</el-menu-item>-->
    <!--          <el-menu-item index="1-2">item two</el-menu-item>-->
    <!--        </el-menu-item-group>-->
    <!--        <el-menu-item-group title="Group Two">-->
    <!--          <el-menu-item index="1-3">item three</el-menu-item>-->
    <!--        </el-menu-item-group>-->
    <!--        <el-sub-menu index="1-4">-->
    <!--          <template #title>item four</template>-->
    <!--          <el-menu-item index="1-4-1">item one</el-menu-item>-->
    <!--        </el-sub-menu>-->
    <!--      </el-sub-menu>-->

  </el-menu>
</template>

<script setup lang="ts">
import router from "@/router";
import {useTagStore} from "@/store/tag";
import {computed, onBeforeMount, reactive, ref} from "vue";
import {useUserStore} from '@/store/user'
import http from "@/util/request";

const userStore: any = useUserStore()
const tagStore: any = useTagStore()

// 菜單資料
let menuInfo: any = ref([])

// 掛載前執行
onBeforeMount(() => {
  getMenu()
})

// 獲取清單
async function getMenu() {
  const {data: res} = await http.get("/menu/" + userStore.roles)

  if ('200' == res.code) {
    menuInfo.value = res.data
  }
}

// 控制菜單折疊的屬性
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
