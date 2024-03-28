<template>
  <h1>我要登入才能看到</h1>

  <el-button class="add-button" type="success" plain @click="dialogVisible = true">
    新增
  </el-button>

  <el-dialog
      v-model="dialogVisible"
      title="新增"
      width="600"
      :before-close="handleClose"
  >
    <!-- 用inline select會失效    -->
    <el-form :model="form" ref="formRef" inline>
      <el-form-item prop="username" label="姓名">
        <el-input v-model="form.name" placeholder="請輸入姓名"/>
      </el-form-item>

      <el-form-item label="性別">
        <el-select v-model="form.sex" placeholder="請選擇性別">
          <el-option label="男" value="1"/>
          <el-option label="女" value="0"/>
        </el-select>
      </el-form-item>

      <el-form-item prop="password" label="年齡">
        <el-input v-model="form.age" placeholder="請輸入年齡"/>
      </el-form-item>

      <el-form-item label="生日">
        <el-date-picker
            v-model="form.birth"
            type="date"
            placeholder="請選擇日期"
        />
      </el-form-item>

      <el-form-item prop="password" label="電話">
        <el-input v-model="form.phone" placeholder="請輸入電話"/>
      </el-form-item>

      <el-form-item prop="password" label="信箱">
        <el-input v-model="form.mail" placeholder="請輸入信箱"/>
      </el-form-item>

    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAdd">
          確定
        </el-button>
      </div>
    </template>
  </el-dialog>


</template>

<script setup lang="ts">
import {reactive, ref} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import axios from "axios";
import router from "@/router";

const dialogVisible = ref(false)

// 關閉提示方法
const handleClose = (done: () => void) => {
  ElMessageBox.confirm('確定要關閉嗎?', {
    confirmButtonText: '關閉',
    cancelButtonText: '繼續',
  })
      .then(() => {
        done()
      })
      .catch(() => {
        // catch error
      })
}


const form = reactive({
  name: '',
  age: '',
  sex: '',
  phone: '',
  mail: '',
  birth: '',
})

// 新增確定提示
const handleAdd = (done: () => void) => {
  ElMessageBox.confirm('確定要新增嗎?', {
    confirmButtonText: '新增',
    cancelButtonText: '再想想',
  })
      .then(() => {
        console.log("handleAdd跑了")
        addStu()
        dialogVisible.value = false
        done()
      })
      .catch(() => {
        // catch error
      })
}

async function addStu() {
  console.log("addStu 跑了")
  const json = JSON.stringify(form)
  const {data:res} = await axios.post('http://localhost:8081/student', json,
      {headers: {'Content-Type': 'application/json'}}
  )
  if ('200' == res.code){
    ElMessage.success(res.msg)
  }else {
    ElMessage.error(res.msg)
  }
}


</script>

<style scoped>


</style>
