import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
    // history: createWebHistory(),
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
                    path: 'demo',
                    name: 'Demo',
                    component: () => import('@/views/Demo.vue')
                },
                {
                    path: 'demo2',
                    name: 'demo2',
                    component: () => import('@/views/Demo2.vue')
                },
            ]
        },



    ]
})

export default router
