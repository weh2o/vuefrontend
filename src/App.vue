<template>
  <el-config-provider :locale="locale">
    <RouterView v-if="isRouter"/>
  </el-config-provider>
</template>

<script setup lang="ts">
import {nextTick, provide, ref} from "vue";
import {ElConfigProvider} from 'element-plus'
import zhTw from 'element-plus/es/locale/lang/zh-tw'

let locale = ref(zhTw)

const isRouter = ref(true);

// 刷新頁面
const reload = () => {
  isRouter.value = false;
  nextTick(() => {
    isRouter.value = true;
  });
};
provide("reload", reload);

</script>

<style>
body, html, h3, p {
  margin: 0;
  padding: 0;
}

</style>
