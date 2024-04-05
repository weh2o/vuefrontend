import axios from "axios";
import {delToken, getToken} from "@/util/tokenUtil";
import {ElMessage} from "element-plus";
import router from "@/router";

// 配置Axios
const http = axios.create({
    baseURL: 'http://localhost:8081',   // 基本url
    headers: {
        'Content-Type': 'application/json',
    }
})

// 請求攔截器
http.interceptors.request.use(config => {
    // 獲取token
    const token = getToken();
    // token存在的話，放入請求頭
    if (token) {
        // String要先轉成JSON，不然會多一對雙引號
        config.headers.token = JSON.parse(token);
    }
    return config
}, error => {
    return Promise.reject(error);
})

// 響應攔截器
http.interceptors.response.use(res => {

    const code = res.data.code

    if ('401' == code || '401' === code){
        ElMessage.error(res.data.msg)
        delToken()
        router.push({name: 'Login'})
    }else if ('400' == code){
        ElMessage.error(res.data.msg)
    }

    return res;
}, error => {

})

// 4.曝露
export default http
