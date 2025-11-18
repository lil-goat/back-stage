<template>
  <div class="page-container">
    <div class="user-header">
      <el-button type="primary">新增</el-button>
      <el-form :inline="true" :model="forminline">
        <el-form-item label="请输入">
          <el-input 
            placeholder="请输入用户名" 
            v-model="forminline.keyword"
            @focus="bindEnterKey"
            @blur="unbindEnterKey"
            @keyup.enter="handleEnterSearch"
            clearable
            @clear="handleClear"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <div class="table-wrapper">
      <el-table :data="tableData" style="width: 100%" stripe border>
        <el-table-column 
          v-for="item in tableLabel"
          :key="item.prop"
          :width="item.width ? item.width : 'auto'"
          :prop="item.prop"
          :label="item.label"
          :min-width="getMinWidth(item.prop)"
          show-overflow-tooltip
        />
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleClick">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-pagination 
      background 
      layout="prev, pager, next" 
      :total="config.total"
      @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref,getCurrentInstance, onMounted, onUnmounted } from 'vue'
const {proxy} = getCurrentInstance()
import { ElMessage, ElMessageBox } from 'element-plus'

const handleDelete = (item) => {
  ElMessageBox.confirm('确定删除该用户吗？').then(async () => {
    await proxy.$api.deleteUser({id: item.id})
    ElMessage({
      showClose: true,
      message: '删除成功',
      type: 'success'
    })
    getUserData(config)
  })
}

const handleCurrentChange = (currentPage) => {
  config.page = currentPage
  getUserData(config)
}

const config = {
  name: '',
  total:0,
  page:1
}

const forminline = ref({
  keyword: ''
})

// 回车键绑定状态
const isEnterKeyBound = ref(false)

// 绑定回车键事件
const bindEnterKey = () => {
  isEnterKeyBound.value = true
  document.addEventListener('keydown', handleGlobalEnterKey)
}

// 解绑回车键事件
const unbindEnterKey = () => {
  isEnterKeyBound.value = false
  document.removeEventListener('keydown', handleGlobalEnterKey)
}

// 全局回车键处理函数
const handleGlobalEnterKey = (event) => {
  if (event.key === 'Enter' && isEnterKeyBound.value) {
    event.preventDefault()
    handleSearch()
  }
}

// 输入框回车键处理
const handleEnterSearch = () => {
  handleSearch()
}

const handleSearch = () => {
  config.name = forminline.value.keyword
  getUserData(config)
}

// 清空搜索
const handleClear = () => {
  forminline.value.keyword = ''
  config.name = ''
  getUserData(config)
}

const getUserData = async (keyword) => {
  let data = await proxy.$api.getUserData(keyword)
  console.log(data)
  tableData.value = data.list.map(item => ({
    ...item,
    sexLabel: item.sex === 1 ? '男' : '女'
  }))
  config.total = data.count
}

onMounted(() => {
  getUserData()
})

// 表格列配置 - 根据图片中的列调整
const tableLabel = ref([
  { prop: 'name', label: '姓名', width: '120' },
  { prop: 'age', label: '年龄', width: '100' },
  { prop: 'birth', label: '生日', width: '140' },
  { prop: 'addr', label: '地址' }, // 不设置宽度，自动填充剩余空间
  { prop: 'sexLabel', label: '性别', width: '100' }
])

// 表格数据 - 根据图片内容
const tableData = ref([])

// 根据列属性设置最小宽度
const getMinWidth = (prop) => {
  const widthMap = {
    name: 100,
    age: 80,
    birthday: 120,
    sex: 80,
    address: 200
  }
  return widthMap[prop] || 120
}

const handleClick = () => {
  // 编辑操作
}

// 组件卸载时清理事件监听
onUnmounted(() => {
  if (isEnterKeyBound.value) {
    document.removeEventListener('keydown', handleGlobalEnterKey)
  }
})
</script>

<style scoped lang="less">
.page-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background: #f5f7fa;
  overflow: hidden; /* 关键：防止页面滚动 */
}

.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-shrink: 0; /* 防止头部被压缩 */
  
  .el-form {
    margin-bottom: 0;
    
    .el-form-item {
      margin-bottom: 0;
      margin-right: 10px;
    }
  }
}

.table-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; /* 关键：允许内容区域收缩 */
  background: #fff;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden; /* 隐藏溢出的内容 */
  
  /* 关键修改：使用Element Plus的height属性实现内部滚动 */
  .el-table {
    height: calc(100vh - 280px) !important; /* 根据实际情况调整高度 */
    
    /* 表格内部滚动 */
    :deep(.el-table__body-wrapper) {
      overflow-y: auto;
    }
    
    /* 表头固定 */
    :deep(.el-table__header-wrapper) {
      position: sticky;
      top: 0;
      z-index: 2;
    }
  }
  
  .pager {
    margin-top: 20px;
    text-align: right;
    flex-shrink: 0; /* 分页器不收缩 */
  }
}

// 响应式适配
@media (max-width: 768px) {
  .page-container {
    padding: 10px;
  }
  
  .user-header {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    
    .el-form {
      display: flex;
      flex-wrap: wrap;
      
      .el-form-item {
        flex: 1;
        min-width: 150px;
      }
    }
  }
  
  .table-wrapper {
    padding: 10px;
    
    .el-table {
      height: calc(100vh - 240px) !important; /* 移动端调整高度 */
    }
    
    :deep(.el-table) {
      th, td {
        padding: 6px 4px;
        font-size: 12px;
      }
    }
  }
}

// 小屏幕适配
@media (max-width: 480px) {
  .user-header {
    .el-form {
      flex-direction: column;
      
      .el-form-item {
        margin-right: 0;
        margin-bottom: 10px;
      }
    }
  }
  
  .table-wrapper {
    .el-table {
      height: calc(100vh - 220px) !important; /* 小屏幕进一步调整高度 */
    }
    
    :deep(.el-table) {
      // 在小屏幕上允许横向滚动
      .el-table__body-wrapper {
        overflow-x: auto;
      }
    }
  }
}
</style>