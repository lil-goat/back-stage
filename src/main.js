import { createApp } from 'vue'
import App from './App.vue'
import "@/assets/less/index.less"
import router from '@/router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
import axios from'axios'

const app = createApp(App)
const pinia = createPinia()
  
app.use(router).use(pinia).mount('#app')

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
