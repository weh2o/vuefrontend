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
              <el-button>修改資料</el-button>
            </el-col>
          </el-row>

          <el-row class="info-row">
            <el-col :span="8">
              <div class="info-column">性別:</div>
            </el-col>
            <el-col :span="12">
              <div>{{ gender }}</div>
            </el-col>
          </el-row>

          <el-row class="info-row">
            <el-col :span="8">
              <div class="info-column">{{ noName }}</div>
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
              <div>{{ id }}</div>
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
          <h3 style="margin-bottom: 10px;">更改密碼</h3>
          <el-form :model="form" ref="formRef" :rules="rules">
            <div style="width: 80%">
              <el-form-item prop="oldPassword">
                <el-input prefix-icon="Lock" v-model="form.oldPassword" show-password placeholder="舊密碼"/>
              </el-form-item>
              <el-form-item prop="newPassword">
                <el-input prefix-icon="Lock" v-model="form.newPassword" show-password placeholder="新密碼"/>
              </el-form-item>
              <el-form-item prop="newPasswordCheck">
                <el-input prefix-icon="Lock" v-model="form.newPasswordCheck" show-password
                          placeholder="再次輸入新密碼"/>
              </el-form-item>
            </div>
            <el-form-item style="text-align: right">
              <el-button type="primary" style="width: 40%" @click="changePsw(formRef)">修改密碼</el-button>
            </el-form-item>
          </el-form>
        </div>

      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import {computed, onBeforeMount, reactive, ref, toRefs} from 'vue'
import http from "@/util/request";
import {ElMessage, type FormInstance} from "element-plus";


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
})

const gender = computed(() => {
  if ('1' == sex.value) {
    return '男'
  } else if ('0' == sex.value) {
    return '女'
  } else {
    return '未知'
  }
})

const formRef = ref()

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

const form = reactive({
  oldPassword: '',
  newPassword: '',
  newPasswordCheck: '',
})

// 第二次密碼確認
const validateNewPass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('請輸入新密碼'))
  } else {
    if (form.newPasswordCheck !== form.newPassword) {
      callback(new Error('新密碼輸入不一致'))
      return
    }
    callback()
  }
}

// 更改密碼驗證
const rules = reactive({
  oldPassword: [{required: true, message: '請輸入密碼', trigger: 'blur'},],
  newPassword: [{required: true, message: '請輸入新密碼', trigger: 'blur'},],
  newPasswordCheck: [{validator: validateNewPass, trigger: 'blur'},],
})


// 掛載前執行
onBeforeMount(() => {
  getInfo()
})

// 獲取使用者資料
async function getInfo() {
  const {data: res} = await http.get("/user/info")
  Object.assign(userInfo, res.data)

}

// 修改密碼事件
async function changePsw(formEl: FormInstance | undefined) {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      modifyPassword()
    }
  })
}

async function modifyPassword() {
  const jsonData = JSON.stringify(form);
  const {data: res} = await http.patch('/user/' + id.value, jsonData)
  if ('200' == res.code) {
    ElMessage.success(res.msg)
  }
  // 清空資料
  formRef.value.resetFields()
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
