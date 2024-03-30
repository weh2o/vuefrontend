<template>
  <RouterView v-if="isRouter"/>
</template>

<script setup lang="ts">
import {nextTick, provide, ref} from "vue";

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
