<template>
  <div class="manage">


    <div class="manage-header">
      <el-button v-if="showAddBtn" class="add-button" type="primary" plain @click="courseDialog.dialogPop()">
        新增
      </el-button>

      <!-- 搜索區 -->
      <el-form :model="searchForm" class="search-form" inline>
        <el-form-item>
          <el-input placeholder="請輸入課程名稱或老師" v-model="searchForm.courseNameOrTeacher"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查詢</el-button>
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
        <el-table-column prop="name" label="課程名稱" sortable/>
        <el-table-column prop="teacher" label="老師" width="100" sortable/>
        <el-table-column prop="count" label="人數" width="100" sortable/>
        <el-table-column prop="maxCount" label="總人數" width="100" sortable/>
        <el-table-column prop="deadline" label="報名截止日" width="120" sortable/>
        <el-table-column prop="courseDate" label="課程時間" width="180" sortable/>
        <el-table-column prop="courseTime" label="上課時間" width="120" sortable/>
        <el-table-column prop="location" label="上課地點" sortable/>


        <el-table-column label="操作">
          <template #default="scope">

            <el-button size="small" type="info">
              詳細內容
            </el-button>

            <el-button size="small" type="success">
              報名
            </el-button>

            <!-- 管理員身分: 全部顯示。 老師身分: 只顯示屬於自己的  -->
            <span v-if="userStore.identity == userStore.identityType.admin || teacherId == scope.row.teacherId"
                  style="margin-left: 15px">
            <el-button size="small" type="warning" @click="courseDialog.dialogPop(scope.$index, scope.row)">
              編輯
            </el-button>

            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">
              刪除
            </el-button>
            </span>

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

    <!-- 新增、編輯框-->
    <CourseDialog ref="courseDialog"/>
  </div>
</template>

<script setup lang="ts">

import {computed, inject, onBeforeMount, provide, reactive, ref, toRaw, watch} from 'vue'
import http from "@/util/request"
import UsePage from "@/hooks/usePage"
import {useUserStore} from "@/store/user"
import CourseDialog from "@/views/course/CourseDialog.vue"
import {ElMessage, ElMessageBox} from 'element-plus'


// 掛載前執行
onBeforeMount(() => {
  findAll()
})

const userStore: any = useUserStore()

const BASE_URL = '/course'

// 刷新頁面用
const reload: any = inject("reload");

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

// 頁面資料
let tableData: any = ref([])

// CourseDialog子組件
let courseDialog = ref()

// 顯示「新增按鈕」判斷的屬性
let showAddBtn = computed(() => {
  const roleType = userStore.roleType
  let arr = [
    roleType.admin,
    roleType.teacher,
  ]
  return userStore.isPass(arr)
})

// 老師身分顯示「編輯、刪除按鈕」判斷的屬性
let teacherId = computed(() => {
  if (userStore.identity == userStore.identityType.teacher) {
    return userStore.id
  }
})


// 查詢所有學生資料
async function findAll() {
  const {data: res} = await http.get(BASE_URL,
      {
        params: {
          page: nowPage.value,
          pageSize: pageSize.value,
          prop: sortProp.value,
          order: sortOrder.value,
          courseNameOrTeacher: searchForm.courseNameOrTeacher
        }
      }
  )
  if ('200' == res.code) {
    tableData.value = res.data.data
    total.value = res.data ? res.data.total : 0
  }
}

// 查詢框
let searchForm = reactive({
  courseNameOrTeacher: '',
})

// 查詢函數
function search() {
  findAll()
}

// 刪除處理
const handleDelete = (index: number, row: any) => {
  ElMessageBox.confirm('確定要刪除嗎?', {
    confirmButtonText: '刪除',
    cancelButtonText: '保留',
  }).then(() => {
    removeCourse(row.id)
  })
}

// 刪除axios函數
async function removeCourse(id: string) {
  const {data: res} = await http.delete(BASE_URL + '/' + id)
  if ('200' == res.code) {
    ElMessage.success(res.msg)
    // 刷新頁面
    reload()
  }
}

// 向子組件傳遞資料
provide('COURSE_BASE_URL', BASE_URL)

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
  align-items: center;

  .search-form {
    margin-left: auto;
  }
}

</style>
