<template>
  <el-row>
    <el-col :span="8">
      <el-card style="max-width: 480px">

        <div class="user">
          <img src="@/assets/imgs/user.jpg" alt="">
          <div class="user-title">
            <div class="name">{{ name }}</div>
            <div class="user-role">我是誰</div>
            <div class="last-time">上次登入時間: <span>{{ lastLoginTime }}</span></div>
          </div>
        </div>

        <div class="login-info">
          <el-row class="info-row">
            <el-col :span="24"><h3>個人資料</h3></el-col>
          </el-row>

          <el-row class="info-row">
            <el-col :span="8">
              <div class="info-column">性別:</div>
            </el-col>
            <el-col :span="12">
              <div>{{ sex }}</div>
            </el-col>
          </el-row>

          <el-row class="info-row">
            <el-col :span="8">
              <div class="info-column">學生證:</div>
            </el-col>
            <el-col :span="12">
              <div>{{ no }}</div>
            </el-col>
          </el-row>

          <el-row class="info-row">
            <el-col :span="8">
              <div class="info-column">生日:</div>
            </el-col>
            <el-col :span="12">
              <div>{{ birth }}</div>
            </el-col>
          </el-row>

          <el-row class="info-row">
            <el-col :span="8">
              <div class="info-column">年齡:</div>
            </el-col>
            <el-col :span="12">
              <div>{{ age }}</div>
            </el-col>
          </el-row>

          <el-row class="info-row">
            <el-col :span="8">
              <div class="info-column">信箱:</div>
            </el-col>
            <el-col :span="12">
              <div>{{ mail }}</div>
            </el-col>
          </el-row>

          <el-row class="info-row">
            <el-col :span="8">
              <div class="info-column">電話:</div>
            </el-col>
            <el-col :span="12">
              <div>{{ phone }}</div>
            </el-col>
          </el-row>

          <el-row class="info-row">
            <el-col :span="8">
              <div class="info-column">地址:</div>
            </el-col>
            <el-col :span="12">
              <div>{{ address }}</div>
            </el-col>
          </el-row>


        </div>

        <div>
          <h2>更改密碼</h2>
        </div>

      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import {onBeforeMount, reactive, toRefs} from 'vue'
import http from "@/util/request";

let userInfo = reactive({
  name: '',
  age: '',
  sex: '',
  no: '',
  phone: '',
  mail: '',
  birth: '',
  lastLoginTime: '',
  address: '',
})

let {name, age, sex, no, phone, mail, birth, lastLoginTime, address} = toRefs(userInfo)

// 掛載前執行
onBeforeMount(() => {
  getInfo()
})

async function getInfo() {
  const {data: res} = await http.get("/user/info")
  console.log(res)
  Object.assign(userInfo, res.data)
}


</script>

<style scoped>
.user {
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;

  img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    margin-right: 40px;
  }

  .user-title {
    .name {
      font-size: 32px;
      margin-bottom: 10px;
    }

    .user-role {
      color: #999999;
    }

    .last-time {
      margin-top: 50px;
    }
  }
}

.login-info {
  .info-column {

    font-size: 18px;
  }

  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
}

.info-row {
  margin-top: 10px;
  margin-bottom: 10px;
}

</style>
