<template>
  <div>
    <!-- 新增、編輯框-->
    <el-dialog
        v-model="dialogVisible"
        :title="dialogTitle"
        width="35%"
        :before-close="handleClose"
    >
      <!-- 表單內容 -->
      <el-form :model="form" ref="formRef" :rules="rules" :hide-required-asterisk="true">

        <el-row>
          <el-col :span="12">
            <el-form-item class="form-left-content" prop="name" label="姓名">
              <el-input v-model="form.name" placeholder="請輸入姓名"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="sex" label="性別" style="width: 50%">
              <el-select v-model="form.sex" placeholder="請選擇性別">
                <el-option label="男" value="1"/>
                <el-option label="女" value="2"/>
                <el-option label="未知" value="3"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item class="form-left-content" prop="no" label="學生證">
              <el-input v-model="form.no" placeholder="請輸入學生證"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="birth" label="生日">
              <el-date-picker
                  v-model="form.birth"
                  type="date"
                  placeholder="請選擇日期"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item class="form-left-content" prop="phone" label="電話">
              <el-input v-model="form.phone" placeholder="請輸入電話"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="mail" label="信箱">
              <el-input v-model="form.mail" placeholder="請輸入信箱"/>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>

      <!-- 表單提交的確認、取消按鈕 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="resetForm(form)">取消</el-button>
          <el-button type="primary" @click="saveStuValidate(formRef)">
            確定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {inject, reactive, ref, toRaw} from 'vue'
import {ElMessage, ElMessageBox, type FormInstance} from 'element-plus'
import http from "@/util/request";
import {validateMail} from "@/util/regExpUtil"

const BASE_URL = '/student'

// 刷新頁面用
const reload: any = inject("reload");
// 表單物件
const formRef = ref()

// 表單資料
let form = reactive({
  name: '',
  age: '',
  sex: '',
  no: '',
  phone: '',
  mail: '',
  birth: '',
})

/**
 * 清空表單並關閉彈出框
 * @param form 表單
 */
function resetForm(form: any) {
  Object.keys(form).forEach(key => {
    form[key] = ""
  })
  dialogVisible.value = false
}

// 控制彈出框顯示
const dialogVisible = ref(false)

// 彈出框標題(新增、修改)
let dialogTitle = ref('')
let dialogConfirm = ref('')

// 新增(修改)框 彈出
const dialogPop = ((index: number, row: any) => {
  if (row) {
    dialogTitle.value = '修改'
    dialogConfirm.value = '修改'
    // 將原本的資料放到表單中，JSON.parse(JSON.stringify(toRaw(row))) 深拷貝
    let originalForm = reactive(JSON.parse(JSON.stringify(toRaw(row))))
    Object.assign(form, originalForm)
  } else {
    dialogTitle.value = '新增'
    dialogConfirm.value = '新增'
  }
  dialogVisible.value = true
})

// 關閉提示方法
const handleClose = (done: () => void) => {
  ElMessageBox.confirm('確定要關閉嗎?', {
    confirmButtonText: '關閉',
    cancelButtonText: '繼續',
  }).then(() => {
    done()
    // 清空資料
    resetForm(form)
  }).catch(() => {
    // catch error
  })
}


// 新增確定提示、新增學生操作
function handleAdd() {
  ElMessageBox.confirm('確定要' + dialogConfirm.value + '嗎?', {
    confirmButtonText: '新增',
    cancelButtonText: '再想想',
  }).then(() => {
    saveStu()
    // 清空資料
    resetForm(form)
  }).catch(() => {
    // catch error
  })
}

// 新增學生函數
async function saveStu() {
  const json = JSON.stringify(form)
  const {data: res} = await http.post(BASE_URL, json)
  if ('200' == res.code) {
    ElMessage.success(res.msg)
    // 刷新頁面
    reload()
  }
}

// 用戶輸入驗證
const rules = reactive({
  name: [{required: true, message: '請輸入姓名', trigger: 'blur'},],
  sex: [{required: true, message: '請選擇性別', trigger: 'blur'},],
  mail: [{validator: validateMail, trigger: 'blur'},],
})

const saveStuValidate = async (formEl: FormInstance | undefined) => {
  // 驗證輸入
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      handleAdd()
    }
  })
}

defineExpose({dialogPop})

</script>

<style scoped>
.form-left-content {
  width: 90%;
}
</style>
