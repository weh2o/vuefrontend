import {defineStore} from 'pinia'

export const useUserStore = defineStore('user', {
    // 存放共享資料的地方
    state() {
        return {
            id: '',     // 使用者識別碼
            name: '',   // 使用者名稱
        }
    },
    actions: {},
    getters: {},
    // 持久化
    persist: {
        enabled: true,
        strategies: [
            {storage: localStorage, paths: ['name']},
            {storage: localStorage, paths: ['id']},
        ]
    }
})
