<template>
  <div class="common-layout">
    <el-container>

      <el-aside width="200px">
        <Menu/>
      </el-aside>

      <el-container>
        <el-header>
          <Header/>
        </el-header>

        <el-main>
          <router-view/>
        </el-main>

      </el-container>

    </el-container>
  </div>
</template>



<script setup>


import Menu from "@/views/common/Menu.vue";
import Navbar from "@/views/common/Header.vue";
import Header from "@/views/common/Header.vue";
</script>

<style scoped>
.el-header{
  padding: 0;
}
</style>
