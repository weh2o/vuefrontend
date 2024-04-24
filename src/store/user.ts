import {defineStore} from 'pinia'

export const useUserStore = defineStore('user', {
    // 存放共享資料的地方
    state() {
        return {
            id: '',         // 使用者識別碼
            name: '',       // 使用者名稱
            identity: '',   // 使用者身分
            identityType: {     // 身分常量
                admin: '1',
                teacher: '2',
                student: '3',
            },
            roles: [],      // 使用者角色權限
            roleType: {     // 角色權限常量
                admin: 'ADMIN',
                teacher: 'TEACHER',
                student: 'STUDENT',
            },
            menu: [],       // 菜單
        }
    },
    actions: {

        /**
         * 判斷是否有權限
         * @param roleArr 權限陣列
         * @return true有權限, false無權限
         */
        isPass(roleArr: Array<any>) {
            if (this.roles.length != 0) {
                for (let role of roleArr) {
                    for (let string of this.roles) {
                        if (string == role) {
                            return true
                        }
                    }
                }
            }
            return false
        }
    },
    getters: {
        // 是否為管理員身分
        isAdmin() {
            return this.identity == this.identityType.admin
        },
        // 是否為老師身分
        isTeacher() {
            return this.identity == this.identityType.teacher
        }
    },
    // 持久化
    persist: {
        enabled: true,
        strategies: [
            {storage: localStorage, paths: ['id']},
            {storage: localStorage, paths: ['name']},
            {storage: localStorage, paths: ['identity']},
            {storage: localStorage, paths: ['identityType']},
            {storage: localStorage, paths: ['roles']},
            {storage: localStorage, paths: ['roleType']},
            {storage: localStorage, paths: ['menu']},

        ]
    }
})
