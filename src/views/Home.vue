<template>
  <div class="block text-center" m="t-4">
    <el-carousel trigger="click" height="400px">
      <el-carousel-item>
        <img src="@/assets/imgs/carousel/1.jpg" alt="">
      </el-carousel-item>
      <el-carousel-item>
        <img src="@/assets/imgs/carousel/2.jpg" alt="">
      </el-carousel-item>
      <el-carousel-item>
        <img src="@/assets/imgs/carousel/3.jpg" alt="">
      </el-carousel-item>
    </el-carousel>
  </div>
  <div>
    <h1>公告</h1>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="發布日期" width="180" />
      <el-table-column prop="context" label="標題"/>
    </el-table>
  </div>
</template>

<script setup lang="ts">

const tableData = [
  {
    date: '2016-05-03',
    context: '狂賀~~ 我家狗狗生了三隻',
  },
  {
    date: '2016-05-03',
    context: '大熊靠這招考了滿分',
  },
]

</script>

<style scoped>

.demonstration {
  color: var(--el-text-color-secondary);
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
img {
  display: block;
  margin: 0 auto;
  max-width: 100%;
  max-height: 100%;
}


</style>
