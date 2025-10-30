import { createApp } from 'vue'
import App from './App.vue'
import "@/assets/less/index.less"
import router from '@/router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
// import "@/api/mock.js"
import api from './api/api'

const app = createApp(App)
const pinia = createPinia()
  
app.use(router).use(pinia).mount('#app')
app.config.globalProperties.$api = api

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
