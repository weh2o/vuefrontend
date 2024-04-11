import {createRouter, createWebHistory} from 'vue-router'
import {getToken} from "@/util/tokenUtil"
import {useTagStore} from "@/store/tag"

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            redirect: "/home"
        },
        {
            path: '/login',
            name: 'Login',
            component: () => import('@/views/common/Login.vue'),
            meta: {},
        },
        {
            path: '/',
            name: 'Main',
            component: () => import('@/views/common/Main.vue'),
            children: [
                {
                    path: 'home',
                    name: 'Home',
                    component: () => import('@/views/Home.vue'),
                    meta: {
                        title: '首頁',
                    },
                },
                {
                    path: 'userInfo',
                    name: 'UserInfo',
                    component: () => import('@/views/common/UserInfo.vue'),
                    meta: {
                        title: '使用者資料',
                    },
                },
                {
                    path: 'studentManagement',
                    name: 'StudentManagement',
                    component: () => import('@/views/StudentManagement.vue'),
                    meta: {
                        title: '學生管理',
                    },
                },
                {
                    path: 'teacherManagement',
                    name: 'TeacherManagement',
                    component: () => import('@/views/teacher/TeacherManagement.vue'),
                    meta: {
                        title: '教師管理',
                    },
                },
                {
                    path: 'course',
                    name: 'Course',
                    component: () => import('@/views/course/Course.vue'),
                    meta: {
                        title: '課程管理',
                    },
                },
                {
                    path: 'announcement',
                    name: 'Announcement',
                    component: () => import('@/views/Announcement.vue'),
                    meta: {
                        title: '公告管理',
                    },
                },
            ]
        },

    ]
})


// 路由守衛【權限控制】
router.beforeEach((to, from, next) => {
    const token = getToken();
    // 情況1: 沒登入，且不在登入頁面 => 跳轉「登入頁面」
    if (!token && to.name !== 'Login') {
        next({name: 'Login'})
    } else if (token && to.name === 'Login') {  // 情況2: 已登入，在登入頁面 => 跳轉「首頁」
        next({name: 'Home'})
    } else {    // 情況3: 已登入，放行任何頁面
        next()
    }
})
router.afterEach((to, nextTick) => {
    const useTag = useTagStore()
    useTag.$patch({
        title: to.meta.title,
    })
})
export default router
