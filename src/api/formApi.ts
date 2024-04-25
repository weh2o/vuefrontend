/**
 * 清空表單並關閉彈出框
 * @param form 表單
 * @param dialogVisible 控制彈窗的屬性【可選】
 */
export function resetForm(form: any, dialogVisible?:any) {
    Object.keys(form).forEach(key => {
        form[key] = ""
    })
    if (dialogVisible){
        dialogVisible.value = false
    }
}
