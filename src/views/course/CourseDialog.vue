<template>
  <div>
    <el-dialog
        v-model="dialogVisible"
        :title="dialogTitle"
        width="600"
        :before-close="handleClose"
    >
      <el-form :model="form" ref="formRef" :rules="courseRules">
        <el-form-item prop="name" label="課程名稱" style="width: 500px">
          <el-input v-model="form.name" placeholder="請輸入課程名稱"/>
        </el-form-item>

        <div v-if="showTeacherOption">
          <el-form-item prop="teacherId" label="老師">
            <el-select v-model="form.teacherId" placeholder="請選擇老師">
              <div v-for="item in teachersData" :key="item.id">
                <el-option :label="item.name" :value="item.id"/>
              </div>
            </el-select>
          </el-form-item>
        </div>

        <el-form-item prop="maxCount" label="課程人數" style="width: 180px">
          <el-input v-model.number="form.maxCount" placeholder="課程人數"/>
        </el-form-item>

        <el-form-item prop="deadline" label="報名截止日期">
          <el-date-picker
              style="width: 150px; margin-right: 10px"
              v-model="form.deadline"
              type="date"
              placeholder="截止日期"
              value-format="YYYY-MM-DD"
              :disabled-date="disabledDateStart"
          />
        </el-form-item>

        <el-form-item prop="courseDate" label="課程日期">
          <el-date-picker
              style="width: 150px; margin-right: 10px"
              v-model="form.startDate"
              type="date"
              placeholder="課程開始日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :disabled-date="disabledDateStart"
          />
          <div> ~</div>
          <el-date-picker
              style="width: 150px; margin-left: 10px"
              v-model="form.endDate"
              type="date"
              placeholder="課程結束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :disabled-date="disabledDateEnd"
          />
        </el-form-item>

        <el-form-item prop="courseTime" label="上課時間">
          <el-time-select
              v-model="form.startTime"
              style="width: 150px; margin-right: 10px"
              :max-time="form.endTime"
              class="mr-4"
              placeholder="開始時間"
              start="08:30"
              step="00:15"
              end="18:30"
          />
          <div> ~</div>
          <el-time-select
              v-model="form.endTime"
              style="width: 150px; margin-left: 10px"
              :min-time="form.startTime"
              placeholder="結束時間"
              start="08:30"
              step="00:15"
              end="21:00"
          />
        </el-form-item>

        <el-form-item prop="location" label="上課地點">
          <el-select v-model="form.location" placeholder="請選擇地點">
            <div v-for="item in locationData" :key="item.id">
              <el-option v-if="item.name != 'OTHER'" :label="item.nameZh" :value="item.id"/>
            </div>
            <el-option label="其他" value="OTHER"/>
          </el-select>
          <el-input v-if="showLocationText" v-model="form.otherLocation" placeholder="請輸入上課地點"/>
        </el-form-item>

      </el-form>

      <!-- 新增框內的確認、取消按鈕    -->
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addValidate(formRef)">
            確定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {computed, inject, nextTick, onBeforeMount, reactive, ref, watch, watchEffect, toRaw} from 'vue'
import {ElMessage, ElMessageBox, type FormInstance} from 'element-plus'
import http from "@/util/request";
import {useUserStore} from "@/store/user"

const userStore: any = useUserStore()

// 掛載前執行
onBeforeMount(() => {
  // 身分是老師時，自動給予老師ID
  if (userStore.isTeacher) {
    form.teacherId = userStore.id
  }
})


// 刷新頁面用
const reload: any = inject("reload");

// 地址
const BASE_URL: any = inject('COURSE_BASE_URL')
const LOCATION_URL = '/courseLocation'
const TEACHER_URL = '/teacher'

// 控制彈出框顯示
const dialogVisible = ref(false)

// 彈出框標題(新增、修改)
let dialogTitle = ref('')
let dialogConfirm = ref('')

// 新增(修改)框彈出
const dialogPop = (( index: number, row: any ) => {
  if (row){
    dialogTitle.value = '修改'
    dialogConfirm.value = '修改'
    form = reactive(JSON.parse(JSON.stringify(toRaw(row))));
  }else {
    dialogTitle.value = '新增'
    dialogConfirm.value = '新增'
  }
  getLocation()

  if (userStore.isAdmin){
    getTeachers()
  }

  dialogVisible.value = true
})

// 關閉提示方法
const handleClose = (done: () => void) => {
  ElMessageBox.confirm('確定要關閉嗎?', {
    confirmButtonText: '關閉',
    cancelButtonText: '繼續',
  })
      .then(() => {
        done()
        // 清空資料
        formRef.value.resetFields()
      })
      .catch(() => {
        // catch error
      })
}

// 顯示其他上課地點輸入框
let showLocationText = computed(() => {
  return form.location == 'OTHER'
})

// 顯示「老師下拉框」判斷的屬性
let showTeacherOption = computed(() => {
  const roleType = userStore.roleType
  let arr = [
    roleType.admin
  ]
  return userStore.isPass(arr)
})

// 表單物件
const formRef = ref()

// 表單資料
let form = reactive({
  id: '',
  name: '',
  teacherId: '',
  maxCount: '',
  deadline: '',
  startDate: '',
  endDate: '',
  startTime: '',
  endTime: '',
  location: '',
  otherLocation: '',
})

// 清除驗證錯誤提示監視
watchEffect(() => {
  // 清除「老師」欄位驗證提示 (內容為空 且 是管理員身分)
  if (form.teacherId != '' && userStore.identity == userStore.identityType.admin){
    nextTick(formRef.value.clearValidate('teacherId'))
  }

  // 清除「地點」欄位驗證提示
  if (form.location != ''){
    nextTick(formRef.value.clearValidate('location'))
  }

  // 清除「上課時間」欄位驗證提示
  if (form.startTime != '' && form.endTime != '') {
    nextTick(formRef.value.clearValidate(['courseTime']))
  }
})

// 驗證課程日期
const validateCourseDate = (rule: any, value: any, callback: any) => {
  if (form.startDate == '' && form.endDate == '') {
    callback(new Error('請選擇課程日期'))
  } else if (form.startDate == '') {
    callback(new Error('請選擇課程開始日期'))
  } else if (form.endDate == '') {
    callback(new Error('請選擇課程結束日期'))
  } else {
    nextTick(formRef.value.clearValidate(['courseDate']))
    callback()
  }
}
// 驗證上課時間
const validateCourseTime = (rule: any, value: any, callback: any) => {
  if (form.startTime == '' && form.endTime == '') {
    callback(new Error('請選擇上課時間'))
  } else if (form.startTime == '') {
    callback(new Error('請選擇上課開始時間'))
  } else if (form.endTime == '') {
    callback(new Error('請選擇上課結束時間'))
  } else {
    callback()
  }
}

// 表單驗證規則
const courseRules = reactive({
  name: [{required: true, message: '請輸入課程名稱', trigger: 'blur'}],
  teacherId: [{required: true, message: '請選擇老師', trigger: 'blur'}],
  maxCount: [{required: true, message: '請輸入課程人數', trigger: 'blur'}],
  deadline: [{required: true, message: '請選擇報名截止日期', trigger: 'blur'}],
  courseDate: [{validator: validateCourseDate, trigger: 'blur'}],
  courseTime: [{validator: validateCourseTime, trigger: 'blur'}],
  location: [{required: true, message: '請選擇上課地點', trigger: 'blur'}],

})

// 「地點」下拉選框資料
let locationData: any = ref([])
// 「老師」下拉選框資料
let teachersData: any = ref([])

// 設置結束日期
const disabledDateEnd = (time: Date) => {

  // 不能是今天以前
  if (form.startDate == ''){
    return time.getTime() <= Date.now()
  }
  // 結束日期在開始日期之後
  return time.getTime() < new Date(form.startDate).getTime()
}

// 設置開始日期
const disabledDateStart = (time: Date) => {
  // 開始日期在結束日期之前
  if (form.endDate) {
    if (time.getTime() > new Date(form.endDate).getTime()) {
      return true
    }
    // 開始日期在當前日期之後
    return time.getTime() <= Date.now()
  }
  // 開始日期在當前日期之後
  return time.getTime() <= Date.now()
}

// 添加方法(驗證)
const addValidate = async (formEl: FormInstance | undefined) => {
  // 驗證輸入
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      handleAdd()
    }
  })
}

// 添加再次確認框
const handleAdd = (done: () => void) => {
  ElMessageBox.confirm('確定要' + dialogConfirm.value + '嗎?', {
    confirmButtonText: '新增',
    cancelButtonText: '再想想',
  })
      .then(() => {
        addCourse()
        // 清空資料
        formRef.value.resetFields()
        // 關閉視窗
        dialogVisible.value = false
        done()
      })
      .catch(() => {
        // catch error
      })
}

// 添加函數axios
async function addCourse() {
  const json = JSON.stringify(form)
  const {data: res} = await http.post(BASE_URL, json)
  if ('200' == res.code) {
    ElMessage.success(res.msg)
    // 刷新頁面
    reload()
  }
}

// 獲取地點函數
async function getLocation() {
  const {data: res} = await http.get(LOCATION_URL)
  if ('200' == res.code) {
    locationData.value = res.data
  }
}

// 獲取老師函數
async function getTeachers() {
  const {data: res} = await http.get(TEACHER_URL)
  if ('200' == res.code) {
    teachersData.value = res.data
  }
}



// 對外曝露組件內容
defineExpose({dialogPop })

</script>

<style scoped>

</style>
