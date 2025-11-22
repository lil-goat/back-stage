import { watch } from 'vue'
import { defineStore } from 'pinia'
import { ref } from 'vue'

function initState(){
  return{
    iscollapse: true,
    menuList: [],
    token: '',
    tags: [{
        name: 'home',
        label: '首页',
        path: '/home',
        icon: 'home'
      }
    ],
    currentMenu: {},
    routerList: []  
  }
}

export const useCounterStore = defineStore('counter', () => {
  const state = ref(initState())

  watch(state,(newObj) => {
    if(!newObj.token) return
    localStorage.setItem('store', JSON.stringify(newObj))
    console.log(newObj)
  },
  {deep: true}
)

  const controlCollapse = () => {
    state.value.iscollapse = !state.value.iscollapse
  }
  function selectMenu (val) {
    if(val.name === 'home'){
      state.value.currentMenu = null
    }else{
      let index = state.value.tags.findIndex(item => item.name === val.name)
      if(index === -1){
        state.value.tags.push(val)
        // 保存到localStorage
        localStorage.setItem('pinia_tags', JSON.stringify(state.value.tags))
      }
    }
  }
  function updateMenuList(list) {
    state.value.menuList = list
  }
  function addMenu(router , type) {
    // if(type === "refresh"){
    //   if(JSON.parse(localStorage.getItem('store'))){
    //     state.value = JSON.parse(localStorage.getItem('store'))
    //     state.value.routerList = []
    //     state.value.menuList = []
    //     console.log(state.value)
    //   }
    //   else return
    // }
    let routers = router.getRoutes()
    console.log(routers)
    routers = routers.filter(item => {
      if(item.name !== 'login' && item.name !== 'main'){
        router.removeRoute(item.name)
      }
    })
    const menu = state.value.menuList
    const module = import.meta.glob('../views/**/*.vue')
    const routerArr = []
    menu.forEach(item => {
      if(item.children && item.children.length > 0){
        item.children.forEach(child => {
          let url = `../views/${child.url}.vue`
          child.component = module[url]
          routerArr.push(...item.children)
        })
      }else{
        let url = `../views/${item.url}.vue`
        item.component = module[url]
        routerArr.push(item)
      }
    })
    state.value.routerList = routerArr
    routerArr.forEach(item => {
      router.addRoute("main",item)
    })
  }
  function deleteTag (tag) {
    if(tag.name === 'home'){
      // 首页不应该被删除，重置为默认值
      state.value.tags = [{
        name: 'home',
        label: '首页',
        path: '/home',
        icon: 'home'
      }
    ]
    }else{
      let index = state.value.tags.findIndex(item => item.name === tag.name)
      if(index !== -1){
        state.value.tags.splice(index, 1)
      }
    }
  }
  return {
    state,
    controlCollapse,
    selectMenu,
    deleteTag,
    updateMenuList,
    addMenu
  }
})