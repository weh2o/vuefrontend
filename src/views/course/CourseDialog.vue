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
              value-format="YYYY-MM-DD"
              :disabled-date="disabledDateStart"
          />
          <div> ~</div>
          <el-date-picker
              style="width: 150px; margin-left: 10px"
              v-model="form.endDate"
              type="date"
              placeholder="課程結束日期"
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
              <el-option :label="item.nameZh" :value="item.id"/>
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
import {computed, inject, onBeforeMount, reactive, ref} from 'vue'
import {ElMessage, ElMessageBox, type FormInstance} from 'element-plus'
import http from "@/util/request";
import {useUserStore} from "@/store/user"

const userStore = useUserStore()

// 掛載前執行
onBeforeMount(() => {

})


// 刷新頁面用
const reload: any = inject("reload");
const BASE_URL: any = inject('COURSE_BASE_URL')

const LOCATION_URL = '/courseLocation'

// 控制彈出框顯示
const dialogVisible = ref(false)

// 彈出框標題(新增、修改)
let dialogTitle = ref('')
let dialogConfirm = ref('')

// 新增框 彈出
const addDialogPop = (() => {
  dialogTitle.value = '新增'
  dialogConfirm.value = '新增'
  getLocation()
  dialogVisible.value = true
})
// 修改框 彈出
const updateDialogPop = (() => {
  dialogTitle.value = '修改'
  dialogConfirm.value = '修改'
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

// 表單物件
const formRef = ref()

// 表單資料
let form = reactive({
  name: '',
  teacher: userStore.id,
  maxCount: '',
  deadline: '',
  startDate: '',
  endDate: '',
  startTime: '',
  endTime: '',
  location: '',
  otherLocation: '',
})

// 表單驗證規則
const courseRules = reactive({
  name: [{required: true, message: '請輸入課程名稱', trigger: 'blur'},],
  maxCount: [{required: true, message: '請輸入課程人數', trigger: 'blur'},],
  deadline: [{required: true, message: '請選擇報名截止日期', trigger: 'blur'},],
  courseDate: [{required: true, message: '請選擇課程日期', trigger: 'blur'},],
  courseTime: [{required: true, message: '請選擇上課時間', trigger: 'blur'},],
  location: [{required: true, message: '請選擇上課地點', trigger: 'blur'},],

})

// 頁面資料
let locationData: any = ref([])

// 設置結束日期
const disabledDateEnd = (time: Date) => {
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
  console.log(res)
  if ('200' == res.code) {
    locationData.value = res.data
  }
}

// 對外曝露組件內容
defineExpose({addDialogPop})

</script>

<style scoped>

</style>
