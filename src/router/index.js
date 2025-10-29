import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs'
import { createRouter, createWebHashHistory } from 'vue-router'


//制定路由规则

const routes = [
  {
    path: '/',
    name: 'main',
    component:() => import("@/views/Main.vue"),
    redirect: "/home",
    children:[
      {
        path: 'home',
        name: 'home',
        component:() => import("@/views/Home.vue"),
      }
    ]
  }
]

//设置路由模式

export default createRouter({
  history: createWebHashHistory(),
  routes,
})