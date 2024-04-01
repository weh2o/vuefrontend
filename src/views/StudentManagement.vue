<template>

  <el-button class="add-button" type="primary" plain @click="addDialogPop()">
    新增
  </el-button>

  <!-- 頁面資料 -->
  <el-table
      :data="tableData"
      :default-sort="{ prop: 'date', order: 'descending' }"
      style="width: 100%"
  >
    <el-table-column prop="name" label="姓名" sortable width="180"/>
    <el-table-column prop="sex" label="性別" width="80" sortable>
      <template #default="scope">
        <span>{{ scope.row.sex === '1' ? '男' : '女' }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="age" label="年齡" width="80" sortable/>
    <el-table-column prop="no" label="學生證" sortable/>
    <el-table-column prop="birth" label="生日" sortable/>
    <el-table-column prop="phone" label="電話" sortable/>
    <el-table-column prop="mail" label="信箱" sortable/>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button size="small" type="info" @click="handleEdit(scope.$index, scope.row)"
        >編輯
        </el-button>

        <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
        >刪除
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- 新增、編輯框-->
  <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600"
      :before-close="handleClose"
  >
    <!-- 用inline select會失效    -->
    <el-form :model="form" ref="formRef">
      <el-form-item prop="name" label="姓名">
        <el-input v-model="form.name" placeholder="請輸入姓名"/>
      </el-form-item>

      <el-form-item prop="sex" label="性別">
        <el-select v-model="form.sex" placeholder="請選擇性別">
          <el-option label="男" value="1"/>
          <el-option label="女" value="2"/>
        </el-select>
      </el-form-item>

      <el-form-item prop="no" label="學生證">
        <el-input v-model="form.no" placeholder="請輸入學生證"/>
      </el-form-item>

      <el-form-item prop="age" label="年齡">
        <el-input v-model.number="form.age" placeholder="請輸入年齡"/>
      </el-form-item>

      <el-form-item prop="birth" label="生日">
        <el-date-picker
            v-model="form.birth"
            type="date"
            placeholder="請選擇日期"
        />
      </el-form-item>

      <el-form-item prop="phone" label="電話">
        <el-input v-model="form.phone" placeholder="請輸入電話"/>
      </el-form-item>

      <el-form-item prop="mail" label="信箱">
        <el-input v-model="form.mail" placeholder="請輸入信箱"/>
      </el-form-item>

    </el-form>

    <!-- 新增框內的確認、取消按鈕    -->
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
import {inject, onBeforeMount, reactive, ref, toRaw} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import axios from "axios";

// 刷新頁面用
const reload: any = inject("reload");


// 頁面資料
let tableData: any = ref([])

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

// 控制彈出框顯示
const dialogVisible = ref(false)

// 彈出框標題(新增、修改)
let dialogTitle = ref('')

// 新增框 彈出
const addDialogPop = (() => {
  dialogTitle.value = '新增'
  dialogVisible.value = true
})
// 修改框 彈出
const updateDialogPop = (() => {
  dialogTitle.value = '修改'
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


// 新增確定提示、新增學生操作
const handleAdd = (done: () => void) => {
  ElMessageBox.confirm('確定要新增嗎?', {
    confirmButtonText: '新增',
    cancelButtonText: '再想想',
  })
      .then(() => {
        addStu()
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

// 新增學生函數
async function addStu() {
  const json = JSON.stringify(form)
  const {data: res} = await axios.post('http://localhost:8081/student', json,
      {headers: {'Content-Type': 'application/json'}}
  )
  if ('200' == res.code) {
    ElMessage.success(res.msg)
    // 刷新頁面
    reload()
  } else {
    ElMessage.error(res.msg)
  }
}

// 掛載前執行
onBeforeMount(() => {
  findAll()
})

// 查詢所有學生資料
async function findAll() {
  const {data: res} = await axios.get('http://localhost:8081/student/all',
      {headers: {'Content-Type': 'application/json'}}
  )
  if ('200' == res.code) {
    tableData.value = res.data
  } else {
    ElMessage.error(res.msg)
  }
}

// 編輯按鈕觸發的函數
const handleEdit = (index: number, row: any) => {
  // 將資料顯示到彈跳框
  // 深拷貝
  form = reactive(JSON.parse(JSON.stringify(toRaw(row))));
  updateDialogPop()

}

// 刪除學生
async function removeStu(id: string) {
  const {data: res} = await axios.delete('http://localhost:8081/student/' + id,
      {headers: {'Content-Type': 'application/json'},}
  )
  if ('200' == res.code) {
    ElMessage.success(res.msg)
    // 刷新頁面
    reload()
  } else {
    ElMessage.error(res.msg)
  }
}

// 刪除方法
const deleteStu = (id: string) => {
  ElMessageBox.confirm('確定要刪除嗎?', {
    confirmButtonText: '刪除',
    cancelButtonText: '保留',
  })
      .then(() => {
        removeStu(id)
      })
      .catch(() => {
        // catch error
      })
}


// 刪除按鈕觸發的函數
const handleDelete = (index: number, row: any) => {
  deleteStu(row.id)
}


</script>

<style scoped>


</style>
