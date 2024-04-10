<template>

  <div class="manage">
    <div class="manage-header">
      <el-button class="add-button" type="primary" plain @click="addDialogPop()">
        新增
      </el-button>
      <!-- 搜索區 -->
      <el-form :model="searchForm" inline>
        <el-form-item>
          <el-input placeholder="請輸入學生證或姓名" v-model="searchForm.nameOrNo"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查詢</el-button>
          <el-button type="success" @click="findAll">全部</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 頁面資料 -->
    <div class="table-content">
      <!-- element bug 當 height設置為%時，內部的 el-table__inner-wrapper 也會被設定，導致下方出現空白 -->
      <el-table
          height="90%"
          :data="tableData"
          :default-sort="{ prop: 'age', order: 'ascending' }"
          style="width: 100%;"
          @sort-change="sortChange"
      >
        <el-table-column prop="name" label="姓名" sortable width="180"/>
        <el-table-column prop="sex" label="性別" width="80" sortable>
          <template #default="scope">
            <span>{{ scope.row.sex === '1' ? '男' : scope.row.sex === '2' ? '女' : '未知' }}</span>
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

      <!-- 分頁  -->
      <div>
        <el-pagination layout="prev, pager, next"
                       :total="total"
                       :page-size="pageSize"
                       @current-change="handlePage"
        >
        </el-pagination>
      </div>

    </div>


    <div>
      <!-- 新增、編輯框-->
      <el-dialog
          v-model="dialogVisible"
          :title="dialogTitle"
          width="600"
          :before-close="handleClose"
      >
        <!-- 用inline select會失效    -->
        <el-form :model="form" ref="formRef" :rules="rules">
          <el-form-item prop="name" label="姓名">
            <el-input v-model="form.name" placeholder="請輸入姓名"/>
          </el-form-item>

          <el-form-item prop="sex" label="性別">
            <el-select v-model="form.sex" placeholder="請選擇性別">
              <el-option label="男" value="1"/>
              <el-option label="女" value="2"/>
              <el-option label="未知" value="3"/>
            </el-select>
          </el-form-item>

          <el-form-item prop="no" label="學生證">
            <el-input v-model="form.no" placeholder="請輸入學生證"/>
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
            <el-button type="primary" @click="addStuValidate(formRef)">
              確定
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>

  </div>
</template>

<script setup lang="ts">
import {inject, onBeforeMount, reactive, ref, toRaw, watch} from 'vue'
import {ElMessage, ElMessageBox, type FormInstance} from 'element-plus'
import http from "@/util/request";
import {validateMail} from "@/util/regExpUtil"
import UsePage from "@/hooks/usePage";


const BASE_URL = '/student'

// 刷新頁面用
const reload: any = inject("reload");

// 頁面資料
let tableData: any = ref([])

// 查詢框
let searchForm = reactive({
  nameOrNo: '',
})

// 分頁相關
const {total, nowPage, pageSize, sortProp, sortOrder, handlePage} = UsePage()

// 監視當前頁變化，查詢資料
watch(nowPage,(newValue, oldValue) =>{
  findAll()
})

/**
 * 分頁排序
 * @param sort proxy物件
 *  裡面有 prop 排序屬性
 *        order 排序規則
 */
function sortChange(sort: any) {
  sortProp.value = sort.prop
  sortOrder.value = sort.order
  findAll()
}

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

// 用戶輸入驗證
const rules = reactive({
  name: [{required: true, message: '請輸入姓名', trigger: 'blur'},],
  sex: [{required: true, message: '請選擇性別', trigger: 'blur'},],
  mail: [{validator: validateMail, trigger: 'blur'},],
})

const addStuValidate = async (formEl: FormInstance | undefined) => {
  // 驗證輸入
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      handleAdd()
    }
  })
}

// 查詢所有學生資料
async function findAll() {
  const {data: res} = await http.get(BASE_URL,
      {
        params: {
          page: nowPage.value,
          pageSize: pageSize.value,
          prop: sortProp.value,
          order: sortOrder.value,
          nameOrNo: searchForm.nameOrNo,
        }
      }
  )
  if ('200' == res.code) {
    tableData.value = res.data.data
    total.value = res.data ? res.data.total : 0
  }
}

// 控制彈出框顯示
const dialogVisible = ref(false)

// 彈出框標題(新增、修改)
let dialogTitle = ref('')
let dialogConfirm = ref('')

// 新增框 彈出
const addDialogPop = (() => {
  dialogTitle.value = '新增'
  dialogConfirm.value = '新增'
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


// 新增確定提示、新增學生操作
const handleAdd = (done: () => void) => {
  ElMessageBox.confirm('確定要' + dialogConfirm.value + '嗎?', {
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
  const {data: res} = await http.post(BASE_URL, json)
  if ('200' == res.code) {
    ElMessage.success(res.msg)
    // 刷新頁面
    reload()
  }
}

// 掛載前執行
onBeforeMount(() => {
  findAll()
})


// 編輯按鈕觸發的函數
const handleEdit = (index: number, row: any) => {
  // 將資料顯示到彈跳框
  // 深拷貝
  form = reactive(JSON.parse(JSON.stringify(toRaw(row))));
  updateDialogPop()

}

// 刪除學生
async function removeStu(id: string) {
  const {data: res} = await http.delete(BASE_URL + '/' + id)
  if ('200' == res.code) {
    ElMessage.success(res.msg)
    // 刷新頁面
    reload()
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

// 查詢事件
function search() {
  if (searchForm.nameOrNo !== "") {
    findAll()
  }
}

/**
 * 查一個學生
 * @param condition 條件
 */
async function findStu(condition: string) {
  const {data: res} = await http.get(BASE_URL + '/search/' + condition,)
  if ('200' == res.code) {
    tableData.value = res.data.data
    total.value = res.data ? res.data.total : 0
  }
}

</script>

<style scoped>

.manage {
  height: 100%;
  position: relative;
}

.table-content {
  position: absolute;
  width: 100%;
  height: 100%;
}

.manage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

</style>
