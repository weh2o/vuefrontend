<template>

  <div class="manage">
    <div class="manage-header">
      <el-button class="add-button" type="primary" plain @click="studentDialogRef.dialogPop()">
        新增
      </el-button>
      <!-- 搜索區 -->
      <el-form :model="searchForm" inline>
        <el-form-item>
          <el-input class="search-text" placeholder="請輸入學生證或姓名" v-model="searchForm.nameOrNo"></el-input>
          <el-button type="primary" @click="search">查詢</el-button>
          <el-button type="success" @click="reFindAll">全部</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 頁面資料 -->
    <div class="table-content">
      <el-table
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
            <el-button size="small" type="info" @click="studentDialogRef.dialogPop(scope.$index, scope.row)"
            >編輯
            </el-button>

            <!-- 只有管理員可以刪除學生資料 -->
            <el-button
                v-if="userStore.isAdmin"
                size="small"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
            >刪除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分頁  -->
      <div class="pagination-container">
        <el-pagination layout="prev, pager, next"
                       :total="total"
                       :page-size="pageSize"
                       @current-change="handlePage"
        >
        </el-pagination>
      </div>

    </div>
  </div>

  <StudentDialog ref="studentDialogRef"/>
</template>

<script setup lang="ts">
import {inject, onBeforeMount, reactive, ref, watch} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import http from "@/util/request";
import UsePage from "@/hooks/usePage";
import {useUserStore} from "@/store/user";
import StudentDialog from "@/views/student/StudentManagementDialog.vue";

const userStore: any = useUserStore();

const BASE_URL = '/student'

// 刷新頁面用
const reload: any = inject("reload");

// 頁面資料
let tableData: any = ref([])

// 查詢框
let searchForm = reactive({
  nameOrNo: '',
})

let studentDialogRef = ref()


// 分頁相關
const {total, nowPage, pageSize, sortProp, sortOrder, handlePage} = UsePage()

// 監視當前頁變化，查詢資料
watch(nowPage, (newValue, oldValue) => {
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

// 掛載前執行
onBeforeMount(() => {
  findAll()
})

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

function reFindAll() {
  searchForm.nameOrNo = ""
  findAll()
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
}

.manage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .search-text {
    width: 200px;
    margin-right: 10px
  }
}

.pagination-container {
  position: relative;
  height: 20px;
  margin-top: 10px;
}

.el-pagination {
  position: absolute;
  right: 0;
}

</style>
