import {ref} from 'vue'

export default function () {

    // 分頁總數
    let total = ref(0);
    // 當前分頁顯示資料數量
    let pageSize = ref(5)
    // 當前分頁頁數
    let nowPage = ref(1)
    // 排序的屬性
    let sortProp = ref("")
    // 排序的方式
    let sortOrder = ref("")

    /**
     * 分頁
     * @param val 當前點擊的分頁
     */
    const handlePage = ((val: any) => {
        nowPage.value = val
    })

    return {total, pageSize, nowPage, sortProp, sortOrder, handlePage}
}
