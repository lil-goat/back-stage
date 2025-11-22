import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import "@/assets/less/index.less"
import router from '@/router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
import "@/api/mock.js"
import api from './api/api'
import { useCounterStore } from './store'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
const store = useCounterStore()
store.addMenu(router,"refresh")
app.use(router).use(ElementPlus).mount('#app')
app.config.globalProperties.$api = api

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
