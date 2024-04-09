<template>
  <el-row>
    <el-col :span="8">
      <el-card style="max-width: 480px">

        <div class="user">
          <img src="@/assets/imgs/user.jpg" alt="">
          <div class="user-title">
            <div class="name">{{ name }}</div>
            <div class="user-role">{{ identityStr }}</div>
            <div class="last-time">上次登入時間: <span>{{ lastLoginTime }}</span></div>
          </div>
        </div>

        <div class="login-info">
          <el-row class="info-row" style="margin-bottom: 5px">
            <el-col :span="12"><h3>個人資料</h3></el-col>
            <el-col style="text-align: right" :span="12">
              <el-button type="info" @click="openModify">修改資料</el-button>
            </el-col>
          </el-row>

          <el-form :model="userInfo" ref="userInfoRef" :rules="infoRules" :disabled="editDisable">

            <el-form-item prop="name" v-if="showModifyNameText">
              <el-col :span="4">
                <div class="info-column">姓名:</div>
              </el-col>
              <el-col :span="14">
                <el-input v-model="name" placeholder=""/>
              </el-col>
            </el-form-item>

            <!-- 性別-->
            <el-form-item prop="gender">
              <el-col :span="4">
                <div class="info-column">性別:</div>
              </el-col>
              <el-col :span="14">
                <el-select v-model="sex" placeholder="請選擇性別">
                  <el-option label="男" value="1"/>
                  <el-option label="女" value="2"/>
                  <el-option label="未知" value="3"/>
                </el-select>
              </el-col>
            </el-form-item>

            <!-- xx證 -->
            <el-form-item prop="gender" v-if="isShowNo">
              <el-col :span="4">
                <div class="info-column">{{ noName }}</div>
              </el-col>
              <el-col :span="14">
                <el-input :readonly="isEditNo" v-model="no" placeholder=""/>
              </el-col>
            </el-form-item>

            <el-form-item prop="birth">
              <el-col :span="4">
                <div class="info-column">生日:</div>
              </el-col>
              <el-col :span="14">
                <el-date-picker
                    v-model="birth"
                    type="date"
                    placeholder="請選擇日期"
                />
              </el-col>
            </el-form-item>

            <el-form-item prop="age">
              <el-col :span="4">
                <div class="info-column">年齡:</div>
              </el-col>
              <el-col :span="14">
                <el-input readonly v-model="age" placeholder=""/>
              </el-col>
            </el-form-item>

            <el-form-item prop="mail">
              <el-col :span="4">
                <div class="info-column">信箱:</div>
              </el-col>
              <el-col :span="14">
                <el-input v-model="mail" placeholder=""/>
              </el-col>
            </el-form-item>

            <el-form-item prop="phone">
              <el-col :span="4">
                <div class="info-column">電話:</div>
              </el-col>
              <el-col :span="14">
                <el-input v-model="phone" placeholder=""/>
              </el-col>
            </el-form-item>

            <el-form-item prop="address">
              <el-col :span="4">
                <div class="info-column">地址:</div>
              </el-col>
              <el-col :span="14">
                <el-input v-model="address" placeholder=""/>
              </el-col>
            </el-form-item>


            <el-row class="info-row" style="margin-bottom: 5px" v-if="showSubButton">
              <el-col :span="12"></el-col>
              <el-col style="text-align: right" :span="12">
                <el-button @click="closeModify">取消</el-button>
                <el-button type="primary" @click="changeInfo(userInfoRef)">
                  確定
                </el-button>
              </el-col>
            </el-row>

          </el-form>
        </div>

        <div>
          <h3 style="margin-bottom: 10px;">更改密碼</h3>
          <el-form :model="pwdForm" ref="pwdFormRef" :rules="pwdRules">
            <div style="width: 80%">
              <el-form-item prop="oldPassword">
                <el-input prefix-icon="Lock" v-model="pwdForm.oldPassword" show-password placeholder="舊密碼"/>
              </el-form-item>
              <el-form-item prop="newPassword">
                <el-input prefix-icon="Lock" v-model="pwdForm.newPassword" show-password placeholder="新密碼"/>
              </el-form-item>
              <el-form-item prop="newPasswordCheck">
                <el-input prefix-icon="Lock" v-model="pwdForm.newPasswordCheck" show-password
                          placeholder="再次輸入新密碼"/>
              </el-form-item>
            </div>
            <el-form-item style="text-align: right">
              <el-button type="primary" style="width: 40%" @click="changeInfo(pwdFormRef, 'pwd')">修改密碼</el-button>
            </el-form-item>
          </el-form>
        </div>

      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import {computed, inject, onBeforeMount, reactive, ref, toRefs} from 'vue'
import http from "@/util/request";
import {ElMessage, type FormInstance} from "element-plus";
import {validateMail} from "@/util/regExpUtil"


// 掛載前執行
onBeforeMount(() => {
  getInfo()
})

// 刷新頁面用
const reload: any = inject("reload");

const noName = computed(() => {
  if ('3' == identity.value) {
    return '學生證:'
  }
  if ('2' == identity.value) {
    return '教師證:'
  }
})

const identityStr = computed(() => {
  if ('3' == identity.value) {
    return '學生'
  }
  if ('2' == identity.value) {
    return '老師'
  }
  if ('1' == identity.value) {
    return '系統管理員'
  }
})

const isShowNo = computed(() => {
  if ('3' == identity.value) {    // 學生
    return true
  } else if ('2' == identity.value) {  // 老師
    return true
  } else {
    return false
  }
})
// xx證(編號)是否可編輯， true: 只讀, false: 可修改
const isEditNo = computed(() => {
  if ('2' == identity.value) {    // 老師
    return true
  } else {
    return false
  }
})

const userInfoRef = ref()
const pwdFormRef = ref()

let showSubButton = ref(false)
let showModifyNameText = ref(false)
let editDisable = ref(true)

let userInfo = reactive({
  id: '',
  name: '',
  age: '',
  sex: '',
  no: '',
  phone: '',
  mail: '',
  birth: '',
  lastLoginTime: '',
  address: '',
  identity: '',
})

let {name, age, sex, no, phone, mail, birth, lastLoginTime, address, identity, id} = toRefs(userInfo)

const pwdForm = reactive({
  oldPassword: '',
  newPassword: '',
  newPasswordCheck: '',
})

// 第二次密碼確認
const validateNewPass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('請輸入新密碼'))
  } else {
    if (pwdForm.newPasswordCheck !== pwdForm.newPassword) {
      callback(new Error('新密碼輸入不一致'))
      return
    }
    callback()
  }
}

// 更改密碼驗證
const pwdRules = reactive({
  oldPassword: [{required: true, message: '請輸入密碼', trigger: 'blur'},],
  newPassword: [{required: true, message: '請輸入新密碼', trigger: 'blur'},],
  newPasswordCheck: [{validator: validateNewPass, trigger: 'blur'},],
})

// 使用者資料驗證
const infoRules = reactive({
  mail: [{validator: validateMail, trigger: 'blur'},],
})

// 獲取使用者資料
async function getInfo() {
  const {data: res} = await http.get("/user/info")
  Object.assign(userInfo, res.data)

}

// 修改密碼事件
async function changeInfo(formEl: FormInstance | undefined, type?: string) {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      modifyPassword(type)
    }
  })
}

// 修改密碼函數
async function modifyPassword(type?: string) {

  let jsonData = ''
  if (type == 'pwd') {
    jsonData = JSON.stringify(pwdForm)
  } else {
    jsonData = JSON.stringify(userInfo);
  }

  const {data: res} = await http.patch('/user/' + id.value, jsonData)
  if ('200' == res.code) {
    ElMessage.success(res.msg)
  }

  if (type == 'pwd') {
    // 清空資料
    pwdFormRef.value.resetFields()
  }
  reload()
}

// 開啟修改個人資料
function openModify() {
  showSubButton.value = true
  editDisable.value = false
  showModifyNameText.value = true

}

// 關閉修改個人資料
function closeModify() {
  showSubButton.value = false
  editDisable.value = true
  showModifyNameText.value = false
  reload()
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
