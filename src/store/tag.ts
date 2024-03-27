import {defineStore} from 'pinia'

// 命名方式 useXxxStore
// defineStore('自定義id', {...})
export const useTagStore = defineStore('tag', {
    // 存放共享資料的地方
    state() {
        return {
            menuCollapse: false,
        }
    },
    // 放函數的
    actions: {
        changeTag() {
            this.menuCollapse = !this.menuCollapse
        }
    },

    // 對state共享數據進行計算，相當於組件中的computed計算屬性
    getters: {}
})
