<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-title">登入</div>
      <el-form :model="data.form" ref="formRef" :rules="rules">
        <el-form-item prop="username">
          <el-input prefix-icon="User" v-model="data.form.name" placeholder="請輸入帳號"/>
        </el-form-item>

        <el-form-item prop="password">
          <el-input prefix-icon="Lock" show-password v-model="data.form.password" placeholder="請輸入密碼"/>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="login(formRef)">登入</el-button>
        </el-form-item>

        <div style="margin-top: 30px; text-align: right">
          <a href="">註冊</a>
        </div>
      </el-form>
    </div>
  </div>

</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import axios from "axios";
import type {FormInstance} from "element-plus";
import {ElAlert, ElMessage} from "element-plus";
import router from "@/router";

// 表單資料
const data = reactive({
  form: {
    name: '',
    password: '',
  }
})

// 用戶輸入驗證
const rules = reactive({
  name: [{required: true, message: '請輸入帳號', trigger: 'blur'},],
  password: [{required: true, message: '請輸入密碼', trigger: 'blur'},]
})

const formRef = ref()

// 登入函數
// 登入請求
async function loginAction(){
   const {data:res} = await axios.post('http://localhost:8081/login', data.form)

  if ('200' == res.code){
    ElMessage.success(res.msg)
    localStorage.setItem('user-Info', JSON.stringify(res.data))
    router.push({name: 'Home'})
  }else {
    ElMessage.error(res.msg)
  }
}

const login = async (formEl: FormInstance | undefined) => {
  // 驗證輸入
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      loginAction()
    }
  })
}


</script>

<style scoped>
.login-container {
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url("@/assets/imgs/school.jpg");
  background-size: cover;
}

.login-box {
  width: 350px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
  padding: 30px;
  border-radius: 5px;
}

.login-title {
  font-weight: bold;
  font-size: 24px;
  text-align: center;
  margin-bottom: 30px;
}

</style>
