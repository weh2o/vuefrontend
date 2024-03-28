<template>
  <el-row>
    <el-col :span="8">
      <el-card style="max-width: 480px">

        <div class="user">
          <img src="@/assets/imgs/user.jpg" alt="">
          <div class="user-title">
            <p class="name">新之助</p>
            <p class="user-role">管理員</p>
          </div>
        </div>

        <div class="login-info">
          <p class="last-login-time">上次登入時間: <span>2024/03/28</span></p>
        </div>

      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">

</script>

<style scoped>
.user{
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;
  img{
    width: 150px;
    height: 150px;
    border-radius: 50%;
    margin-right: 40px;
  }
  .user-title{
    .name{
      font-size: 32px;
      margin-bottom: 10px;
    }
    .user-role{
      color: #999999;
    }
  }
}
.login-info{
  .last-login-time{
    font-weight: bold;
  }
}

</style>
