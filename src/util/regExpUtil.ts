/**
 * 信箱正規表達式
 * @param rule
 * @param value
 * @param callback
 */
export const validateMail = (rule: any, value: any, callback: any) => {
    const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

    if (value) {
        if (mailReg.test(value)) {
            callback()
        } else {
            callback(new Error('請輸入正確的信箱'))
        }
    }
    callback()
}
