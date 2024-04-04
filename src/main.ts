import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import {createPinia} from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'


const app = createApp(App)
app.use(router)
// 引入圖標
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// 創建 pinia、使用piniaPluginPersistedstate插件
const pinia = createPinia()
app.use(pinia.use(piniaPluginPersistedstate))

app.mount('#app')
