<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-title">{{ title }}</div>
      <el-form :model="data.form" ref="formRef" :rules="rules">
        <el-form-item prop="account">
          <el-input prefix-icon="User" v-model="data.form.account" placeholder="使用者帳號"/>
        </el-form-item>

        <el-form-item prop="password">
          <el-input prefix-icon="Lock" show-password v-model="data.form.password" placeholder="密碼"/>
        </el-form-item>

        <el-form-item v-if="pageStatus" prop="no">
          <div>
            <div>【選填】 輸入學生證進行資料同步。</div>
          </div>
          <el-input prefix-icon="Lock" v-model="data.form.no" placeholder="學生證"/>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="subForm(formRef)">{{ title }}</el-button>
        </el-form-item>

        <div style="margin-top: 30px; text-align: right">
          <span style="color: #999999">{{ pageStatus ? loginInfo : registerInfo }} </span>
          <el-button @click="changeContent">{{ bottomBtnName }}</el-button>
        </div>
      </el-form>
    </div>
  </div>

</template>

<script setup lang="ts">
import {inject, reactive, ref} from "vue";
import type {FormInstance} from "element-plus";
import {ElMessage} from "element-plus";
import router from "@/router";
import {setToken} from "@/util/tokenUtil"
import http from "@/util/request";

// 刷新頁面用
const reload: any = inject("reload");

let title = ref('登入')
// true 註冊 false 登入
let pageStatus = ref(false)
const registerInfo = ref('校園新朋友? ')
const loginInfo = ref('已是校園一員 ')
const bottomBtnName = ref('註冊')

// 表單資料
const data = reactive({
  form: {
    account: '',
    name: '',
    password: '',
    no: '',
  }
})

// 用戶輸入驗證
const rules = reactive({
  name: [{required: true, message: '請輸入使用者帳號', trigger: 'blur'},],
  password: [{required: true, message: '請輸入密碼', trigger: 'blur'},]
})

const formRef = ref()

// 登入函數
async function loginHandle() {
  const {data: res} = await http.post('/login', data.form)
  if ('200' == res.code) {
    ElMessage.success(res.msg)
    setToken(JSON.stringify(res.data), 7)
    router.push({name: 'Home'})
  }
}

// 註冊
async function registerHandle() {
  const {data: res} = await http.post('/register', data.form)
  if ('200' == res.code) {
    ElMessage.success(res.msg)
    reload()
  }
}

// 表單提交事件
const subForm = async (formEl: FormInstance | undefined) => {
  // 驗證輸入
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      // 分辨是註冊或登入功能
      if (pageStatus.value) {
        registerHandle()
      } else {
        loginHandle()
      }
    }
  })
}

function changeContent() {
  if (title.value == '登入') {
    title.value = '註冊'
  } else {
    title.value = '登入'
  }

  if (bottomBtnName.value == '註冊') {
    bottomBtnName.value = '登入'
  } else {
    bottomBtnName.value = '註冊'
  }
  pageStatus.value = !pageStatus.value
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
