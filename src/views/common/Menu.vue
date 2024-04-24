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
    <template v-for="menu in menuInfo" :key="menu.label">

      <!-- 有子菜單 -->
      <el-sub-menu v-if="hasChildren(menu)" :index="menu.path">
        <template #title>
          <el-icon>
            <component :is="menu.icon"></component>
          </el-icon>
          <span>{{ menu.label }}</span>
        </template>

        <el-menu-item-group>
          <el-menu-item v-for="children in menu.children" :key="menu.path" :index="children.path">
            <el-icon>
              <component :is="children.icon"></component>
            </el-icon>
            <span>{{ children.label }}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>

      <!-- 沒有子菜單 -->
      <el-menu-item v-else :index="menu.path" :key="menu.path">
        <el-icon>
          <component :is="menu.icon"></component>
        </el-icon>
        <span>{{ menu.label }}</span>
      </el-menu-item>

    </template>

  </el-menu>
</template>

<script setup lang="ts">
import router from "@/router";
import {useTagStore} from "@/store/tag";
import {computed, onBeforeMount, ref} from "vue";
import {useUserStore} from '@/store/user'

const userStore: any = useUserStore()
const tagStore: any = useTagStore()

// 菜單資料
let menuInfo: any = ref([])

// 掛載前執行
onBeforeMount(() => {
  menuInfo.value = userStore.menu
})

// 控制菜單折疊的屬性
const menuCollapse = computed(() => {
  return tagStore.menuCollapse
})

// 判断是否有子菜单
function hasChildren(menu: any) {
  if (menu.children && menu.children.length > 0) {
    return true;
  }
  return false;
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
