import { collapseContextKey } from 'element-plus'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  const iscollapse = ref(true)
  const controlCollapse = () => {
    iscollapse.value = !iscollapse.value
  }
  return {
    iscollapse,
    controlCollapse
  }
})