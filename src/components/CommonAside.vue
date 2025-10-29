<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useCounterStore } from '@/store';

// 菜单数据
const list = ref([
  {
    path: '/home',
    name: 'home',
    label: '首页',
    icon: 'house',
    url: 'Home'
  },
  {
    path: '/mall',
    name: 'mall',
    label: '商品管理',
    icon: 'video-play',
    url: 'Mall'
  },
  {
    path: '/user',
    name: 'user',
    label: '用户管理',
    icon: 'user',
    url: 'User'
  },
  {
    path: '/other',
    label: '其他',
    icon: 'location',
    children: [
      {
        path: '/page1',
        name: 'page1',
        label: '页面1',
        icon: 'setting',
        url: 'Page1'
      },
      {
        path: '/page2',
        name: 'page2',
        label: '页面2',
        icon: 'setting',
        url: 'Page2'
      }
    ]
  }
]);

const store = useCounterStore();

// 计算属性优化
const isCollapse = computed(() => store.iscollapse);
const width = computed(() => isCollapse.value ? "64px" : "200px");

// 使用记忆化优化菜单数据处理
const noChildren = computed(() => {
  return list.value.filter(item => !item.children || !item.children.length);
});

const hasChildren = computed(() => {
  return list.value.filter(item => item.children && item.children.length > 0);
});

// 当前激活的菜单项
const activeIndex = ref('/home');

// 菜单项点击处理
const handleMenuSelect = (index) => {
  activeIndex.value = index;
  console.log('菜单项被点击:', index);
};

// 性能优化：防抖处理
let resizeTimer = null;
const handleResize = () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // 在小屏幕下自动折叠菜单
    if (window.innerWidth < 768 && !isCollapse.value) {
      store.iscollapse = true;
    }
  }, 250);
};

// 生命周期钩子
onMounted(() => {
  window.addEventListener('resize', handleResize);
  // 初始化时检查屏幕尺寸
  if (window.innerWidth < 768) {
    store.iscollapse = true;
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (resizeTimer) {
    clearTimeout(resizeTimer);
  }
});
</script>

<template>
  <el-aside :width="width" class="sidebar-container">
    <!-- 使用 transition 实现平滑动画 -->
    <transition name="sidebar" mode="out-in">
      <el-menu
        :key="isCollapse ? 'collapsed' : 'expanded'"
        class="optimized-menu"
        :default-active="activeIndex"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        :collapse="isCollapse"
        :collapse-transition="false"
        @select="handleMenuSelect"
        unique-opened
      >
        <!-- 标题区域 -->
        <div class="menu-header">
          <h3 v-show="!isCollapse" class="system-title">后台管理系统</h3>
          <h3 v-show="isCollapse" class="system-title-collapsed">后台</h3>
        </div>

        <!-- 无子菜单的菜单项 -->
        <el-menu-item
          v-for="item in noChildren"
          :index="item.path"
          :key="item.path"
          class="menu-item"
        >
          <el-icon class="menu-icon">
            <component :is="item.icon" />
          </el-icon>
          <template #title>
            <span class="menu-label">{{ item.label }}</span>
          </template>
        </el-menu-item>

        <!-- 有子菜单的菜单项 -->
        <el-sub-menu
          v-for="item in hasChildren"
          :index="item.path"
          :key="item.path"
          class="sub-menu"
        >
          <template #title>
            <el-icon class="menu-icon">
              <component :is="item.icon" />
            </el-icon>
            <span class="menu-label">{{ item.label }}</span>
          </template>

          <el-menu-item
            v-for="subItem in item.children"
            :index="subItem.path"
            :key="subItem.path"
            class="sub-menu-item"
          >
            <el-icon class="sub-menu-icon">
              <component :is="subItem.icon" />
            </el-icon>
            <template #title>
              <span class="sub-menu-label">{{ subItem.label }}</span>
            </template>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </transition>
  </el-aside>
</template>

<style lang="less" scoped>
.sidebar-container {
  height: 100vh;
  background-color: #545c64;
  transition: width 0.3s ease;
  overflow: hidden;
  position: relative;
}

.optimized-menu {
  border-right: none;
  height: 100%;
  
  // 移除默认的边框样式
  &:not(.el-menu--collapse) {
    width: 200px;
  }
  
  &.el-menu--collapse {
    width: 64px;
  }
}

.menu-header {
  padding: 20px 0;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 10px;
  
  .system-title {
    line-height: 1.4;
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    margin: 0;
    padding: 0 20px;
  }
  
  .system-title-collapsed {
    line-height: 1.4;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    margin: 0;
  }
}

.menu-item,
.sub-menu {
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1) !important;
  }
  
  &.is-active {
    background-color: #409eff !important;
    
    .menu-label {
      color: #fff;
    }
  }
}

.menu-icon {
  width: 18px;
  height: 18px;
  margin-right: 8px;
  flex-shrink: 0;
}

.menu-label {
  font-size: 14px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.sub-menu-item {
  padding-left: 50px !important;
  
  .sub-menu-icon {
    width: 14px;
    height: 14px;
    margin-right: 8px;
  }
  
  .sub-menu-label {
    font-size: 13px;
  }
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05) !important;
  }
}

// 动画效果
.sidebar-enter-active,
.sidebar-leave-active {
  transition: all 0.3s ease;
}

.sidebar-enter-from,
.sidebar-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

// 响应式设计
@media (max-width: 768px) {
  .sidebar-container {
    position: fixed;
    z-index: 1000;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  }
  
  .optimized-menu:not(.el-menu--collapse) {
    width: 240px;
  }
}

// 滚动条优化
.optimized-menu ::-webkit-scrollbar {
  width: 4px;
}

.optimized-menu ::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.optimized-menu ::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.optimized-menu ::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
