import {defineStore} from 'pinia'

export const useUserStore = defineStore('user', {
    // 存放共享資料的地方
    state() {
        return {
            id: '',         // 使用者識別碼
            name: '',       // 使用者名稱
            roles: '',      // 使用者角色權限
            roleType: {     // 角色權限常量
                admin: 'ADMIN',
                teacher: 'TEACHER',
                student: 'STUDENT',
            },
        }
    },
    actions: {

        /**
         * 判斷是否有權限
         * @param roleArr 權限陣列
         * @return true有權限, false無權限
         */
        isPass(roleArr: Array<any>) {
            let selfArr = this.roles.split("-");
            for (let role of roleArr) {
                for (let string of selfArr) {
                    if (string == role) {
                        return true
                    }
                }
            }
            return false
        }
    },
    getters: {},
    // 持久化
    persist: {
        enabled: true,
        strategies: [
            {storage: localStorage, paths: ['name']},
            {storage: localStorage, paths: ['id']},
            {storage: localStorage, paths: ['roles']},

        ]
    }
})
