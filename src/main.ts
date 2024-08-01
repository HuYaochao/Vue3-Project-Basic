// import './assets/main.css'
import '@/assets/fonts/fonts.css';
import { createApp } from 'vue'
import { createPinia } from 'pinia'
//引入
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 全局引入axios
import axios from 'axios'


const pinia = createPinia()
const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 配置baseURL
axios.defaults.baseURL = "#"

// 注入axios对象
app.provide('$http', axios)

app.use(router)
//使用elementPlus
app.use(ElementPlus)

app.use(pinia)

app.mount('#app')