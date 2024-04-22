<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-title">{{ title }}</div>

      <!--  註冊的身分    -->
      <div v-if="pageStatus" style="margin-bottom: 20px; text-align: center;">
        <el-radio-group v-model="data.form.identity" size="large" fill="cadetblue" @change="changeIdentity">
          <el-radio-button label="學生" value="3"/>
          <el-radio-button label="老師" value="2"/>
        </el-radio-group>
      </div>

      <el-form :model="data.form" ref="formRef" :rules="rules">
        <el-form-item prop="account">
          <el-input prefix-icon="User" v-model="data.form.account" placeholder="使用者帳號"/>
        </el-form-item>

        <el-form-item prop="password">
          <el-input prefix-icon="Lock" show-password v-model="data.form.password" placeholder="密碼"/>
        </el-form-item>

        <div style="margin-bottom: 5px">
          <el-checkbox v-model="data.form.rememberMe" label="記住我" size="default"/>
        </div>

        <el-form-item v-if="pageStatus" prop="no">
          <div>
            <div>{{ noTextInfo }}</div>
          </div>
          <el-input prefix-icon="Lock" v-model="data.form.no" :placeholder="noTextInnerInfo"/>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="subForm(formRef)">{{ btnName }}</el-button>
        </el-form-item>

        <!-- 下方: 註冊、登入、忘記密碼 -->
        <el-row class="bottom-content">
          <el-col :span="12">
            <span v-if="!pageStatus">
              忘記密碼
            </span>
          </el-col>
          <!-- 註冊 or 登入 -->
          <el-col :span="12" class="rightContent">
            <span style="color: #999999">{{ pageStatus ? loginInfo : registerInfo }} </span>
            <el-button @click="changeContent">{{ bottomBtnName }}</el-button>
          </el-col>
        </el-row>

      </el-form>
    </div>
  </div>

</template>

<script setup lang="ts">
import {computed, inject, reactive, ref} from "vue";
import type {FormInstance} from "element-plus";
import {ElMessage} from "element-plus";
import router from "@/router";
import {setToken} from "@/util/tokenUtil"
import http from "@/util/request";
import {useUserStore} from '@/store/user'

const userStore: any = useUserStore()

// 刷新頁面用
const reload: any = inject("reload");

let title = ref('登入')
let btnName = ref('登入')

// 網頁狀態: true 註冊 false 登入
let pageStatus = ref(false)
const registerInfo = ref('校園新朋友? ')
const loginInfo = ref('已是校園一員 ')
const bottomBtnName = ref('註冊')
const noTextInfo = ref('【選填】 輸入學生證進行資料同步。')
const noTextInnerInfo = ref('學生證')

// 學生身分
let isStudent = computed(() => {
  return '3' == data.form.identity
})
// 教師身分
let isTeacher = computed(() => {
  return '2' == data.form.identity
})


// 表單資料
const data = reactive({
  form: {
    account: '',
    name: '',
    password: '',
    no: '',
    identity: '3',
    rememberMe: '',
  }
})

// 用戶輸入驗證
const rules = reactive({
  account: [{required: true, message: '請輸入使用者帳號', trigger: 'blur'},],
  password: [{required: true, message: '請輸入密碼', trigger: 'blur'},],
  no: [{required: false, message: '請輸入教師證', trigger: 'blur'},],
})

const formRef = ref()

// 登入函數
async function loginHandle() {
  const {data: res} = await http.post('/login', data.form)
  if ('200' == res.code) {
    ElMessage.success(res.msg)
    // 將token保存到Cookies
    setToken(JSON.stringify(res.data.token), 7)
    // 使用者資料:
    userStore.$patch({
      // 使用者名稱
      name: res.data.name,
      // 識別碼
      id: res.data.id,
      // 角色
      roles: res.data.roles,
      // 身分
      identity: res.data.identity,
      // 清單
      menu: res.data.menus,
    })
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

// 修改註冊、登入提示文字
function changeContent() {
  formRef.value.clearValidate()
  pageStatus.value = !pageStatus.value
  if (pageStatus.value) {
    title.value = '選擇身分'
    btnName.value = '註冊'
    bottomBtnName.value = '登入'
  } else {
    title.value = '登入'
    btnName.value = '登入'
    bottomBtnName.value = '註冊'
  }
}

// 註冊時身分選擇
function changeIdentity() {
  if (isStudent.value) {
    noTextInfo.value = '【選填】 輸入學生證進行資料同步。'
    noTextInnerInfo.value = '學生證'
    rules.no[0].required = false
  }
  if (isTeacher.value) {
    noTextInfo.value = '【必填】 輸入教師證進行註冊。'
    noTextInnerInfo.value = '教師證'
    rules.no[0].required = true
  }
  // 清除驗證後的錯誤提示
  formRef.value.clearValidate()
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

.bottom-content {
  margin-top: 10px;

  .rightContent {
    text-align: right;
  }
}

</style>
