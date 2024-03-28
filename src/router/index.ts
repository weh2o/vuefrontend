import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: () => import('@/views/common/Login.vue')
        },
        {
            path: '/',
            name: 'Main',
            component: () => import('@/views/common/Main.vue'),
            children: [
                {
                    path: 'home',
                    name: 'Home',
                    component: () => import('@/views/Home.vue')
                },
                {
                    path: 'userInfo',
                    name: 'UserInfo',
                    component: () => import('@/views/common/UserInfo.vue')
                },
                {
                    path: 'studentManagement',
                    name: 'StudentManagement',
                    component: () => import('@/views/StudentManagement.vue'),
                },

            ]
        },
    ]
})

// 路由守衛【權限控制】
router.beforeEach((to, from, next) =>{
    const userInfo = localStorage.getItem('user-Info');
    // console.log(userInfo)

    // 情況1: 沒登入，且不在登入頁面 => 跳轉「登入頁面」
    if (!userInfo && to.name !== 'Login'){
        next({name: 'Login'})
    }else if (userInfo && to.name === 'Login'){  // 情況2: 已登入，在登入頁面 => 跳轉「登入頁面」
        next({name: 'Home'})
    }else {    // 情況3: 已登入，放行任何頁面
        next()
    }
})

export default router
