import {createRouter, createWebHistory} from 'vue-router'
import {delToken, getToken} from "@/util/tokenUtil"
import http from "@/util/request";

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


async function validateToken(jsonToken: any, next: any, to: any) {

    const {data: res} = await http.get("/tokenValidate/" + jsonToken)

    // token 有效
    if ('200' == res.code) {
        // 在登入頁面 => 去首頁
        if (to.name === 'Login') {
            next({name: 'Home'})
        } else {   // 其他放行
            next()
        }
    } else {                        // token 無效，清掉token，跳轉「登入頁面」
        delToken()
        next({name: 'Login'})
    }
}


// 路由守衛【權限控制】
router.beforeEach((to, from, next) => {
    const token = getToken();

    // 情況1: 沒登入(無token)，且不在登入頁面 => 跳轉「登入頁面」
    if (token === false && to.name !== 'Login') {
        next({name: 'Login'})
    } else if (token !== false) {  // 情況2: 已登入(有token)
        // String要先轉成JSON，不然會多一對雙引號
        const jsonToken = JSON.parse(token);
        validateToken(jsonToken, next, to)
    } else {    // 情況3: 已登入，放行任何頁面
        next()
    }
})

export default router
