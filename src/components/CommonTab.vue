<template>
  <div class="tags">
      <el-tag
        :key="tag.name"
        v-for="(tag , index) in tags"
        :closable="tag.name !== 'home'"
        :effect="route.name === tag.name ? 'dark' : 'plain'"
        @click="handleMenu(tag)"
        @close="handleClose(tag , index)"
      >
        {{ tag.label }}
      </el-tag>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCounterStore } from '@/store'
const route = useRoute()
const router = useRouter()
const tags = computed(() => useCounterStore().state.tags)
const handleMenu = (tag) => {
  router.push(tag.path)
  useCounterStore().selectMenu(tag)
}

const handleClose = (tag , index) => {
  if(tag.name === route.name) {
    if(index === tags.value.length - 1) {
      router.push(tags.value[index - 1].path)
    }else {
      router.push(tags.value[index + 1].path)
    }
  }
  useCounterStore().deleteTag(tag)
}
</script>

<style lang="less" scoped>
.tags{
  margin: 20px 0 0 20px;
}
.el-tag{
  margin-right: 10px;
  cursor: pointer;
}
</style>