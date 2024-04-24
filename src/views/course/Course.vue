<template>
  <div class="manage">

    <div class="manage-header">
      <el-button v-if="showAddBtn" class="add-button" type="primary" plain @click="courseDialog.dialogPop()">
        新增
      </el-button>

      <!-- 搜索區 -->
      <el-form :model="searchForm" class="search-form" inline>
        <el-form-item>
          <el-input class="search-text" placeholder="請輸入課程名稱或老師"
                    v-model="searchForm.courseNameOrTeacher">
          </el-input>
          <el-button type="primary" @click="search">查詢</el-button>
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

            <el-button v-if="isShowSignUpBtn(scope.row)"
                       size="small" type="success"
                       @click="signUpPop(scope.row)"
            >
              報名
            </el-button>

            <!-- 已報名 -->
            <!--            <el-button v-if="scope.row.isSignUp == '1' && scope.row.isSelf == '0'"-->
            <el-button v-if="isShowSignedUpBtn(scope.row)"
                       size="small" type="success"
                       disabled
            >
              已報名
            </el-button>

            <!-- 編輯、刪除按鈕:
                  1. 管理員身分: 全部顯示。
                  2. 老師身分: 只顯示屬於自己的
                  3. 學生身分: 皆不顯示
              -->
            <span v-if="userStore.isAdmin || teacherId == scope.row.teacherId"
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
      <div class="pagination-container">
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

import {computed, inject, onBeforeMount, provide, reactive, ref, watch} from 'vue'
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
          userId: userStore.id,
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

// 報名確認框
function signUpPop(data: any) {
  const courseName = data.name
  const courseId = data.id
  ElMessageBox.confirm('確定要報名 ' + courseName + ' 嗎?', {
    confirmButtonText: '報名',
    cancelButtonText: '再想想',
  }).then(() => {
    signUp(courseId)
  })
}

// 報名 axios 函數
async function signUp(courseId: string) {
  let url = BASE_URL + '/' + courseId + '/signUp/' + userStore.id
  const {data: res} = await http.patch(url)
  if ('200' == res.code) {
    ElMessage.success(res.msg)
    reload()
  }
}


/*
  是否展示「報名」按鈕
  <br/>
  規則:
  <br/>
  scope.row.isSignUp 是否報名
   - 0 尚未報名
   - 1 已報名
   <br/>

   scope.row.isSelf 課程是否屬於本人
   - 0 不是
   - 1 是
 */
function isShowSignUpBtn(row: any) {
  // 已經報名
  if (row.isSignUp == '1') {
    return false
  }
  // 課程是自己的
  if (row.isSelf == '1') {
    return false
  }
  // 超過報名截止日期
  const deadline = new Date(row.deadline)
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  if (deadline < currentDate) {
    return false
  }
  // 到此顯示按鈕
  return true
}

/*
  是否展示「已報名」按鈕
  <br/>
  規則:
  <br/>
  scope.row.isSignUp 是否報名
   - 0 尚未報名
   - 1 已報名
   <br/>

   scope.row.isSelf 課程是否屬於本人
   - 0 不是
   - 1 是
 */
function isShowSignedUpBtn(row: any) {

  // 還沒報名
  if (row.isSignUp == '0') {
    return false
  }
  // 課程是自己的
  if (row.isSelf == '1') {
    return false
  }
  return true
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
}

.manage-header {
  display: flex;
  align-items: center;

  .search-form {
    margin-left: auto;
  }

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
