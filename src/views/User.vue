<template>
  <div class="page-container">
    <div class="user-header">
      <el-button type="primary" @click="handleAdd">新增</el-button>
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
            <el-button type="primary" size="small" @click="handleClick(scope.row)">编辑</el-button>
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
      <el-dialog
        v-model="dialogVisible"
        :title="action == 'add' ? '新增用户' : '编辑用户'"
        width="35%"
        :before-close="handleClose"
      >
          <!--需要注意的是设置了:inline="true"，
        会对el-select的样式造成影响，我们通过给他设置一个class=select-clearn
        在css进行处理-->
        <el-form :inline="true"  :model="formUser" ref="userForm" :rules="rules">
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="formUser.name" placeholder="请输入姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="年龄" prop="age">
                <el-input v-model.number="formUser.age" placeholder="请输入年龄" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item class="select-clearn" label="性别" prop="sex">
                <el-select  v-model="formUser.sex" placeholder="请选择">
                  <el-option label="男" value="1" />
                  <el-option label="女" value="0" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="出生日期" prop="birth">
                <el-date-picker
                  v-model="formUser.birth"
                  type="date"
                  placeholder="请输入"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item
              label="地址"
              prop="addr"
            >
              <el-input v-model="formUser.addr" placeholder="请输入地址" />
            </el-form-item>
          </el-row>
          <el-row style="justify-content: flex-end">
            <el-form-item>
              <el-button type="primary" @click="handleCancel">取消</el-button>
              <el-button type="primary" @click="onSubmit">确定</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref,getCurrentInstance, onMounted, onUnmounted, nextTick } from 'vue'
const {proxy} = getCurrentInstance()
import { ElMessage, ElMessageBox } from 'element-plus'

const handleAdd = () => {
  formUser.value = {}
  action.value = 'add'
  dialogVisible.value = true
  console.log(formUser.value)
}

const handleCancel = () => {
  dialogVisible.value = false
  proxy.$refs["userForm"].resetFields()
  formUser.value = {}
}

const timeFormat = (time) => {
    let dateObj = new Date(time);
    let year = dateObj.getFullYear();
    let month = dateObj.getMonth() + 1;
    let date = dateObj.getDate();
    function add(m) {
        return m < 10 ? "0" + m : m;
    }
    return year + "-" + add(month) + "-" + add(date);
}

const onSubmit = () => {
    //执行userForm表单的validate进行规则校验，传入一个回调函数，回调函数会接受到一个是否校验通过的变量
    proxy.$refs["userForm"].validate(async (valid)=>{
        
        //如果校验成功
        if (valid) {
                //res用于接收添加用户或者编辑用户接口的返回值
                let res=null
                //这里无论是新增或者是编辑，我们都要对这个日期进行一个格式化
                //如果不是1997-01-02这种格式，使用timeFormat方法进行格式化
                formUser.birth=/^\d{4}-\d{2}-\d{2}$/.test(formUser.birth) ? formUser.birth : timeFormat(formUser.birth)
                //如果当前的操作是新增，则调用新增接口
                if (action.value == "add") {
                  config.formUser = formUser.value
                  res = await proxy.$api.createUser(config.formUser);
                }else if(action.value == "edit"){
                  config.formUser = formUser.value
                  res = await proxy.$api.updateUser(config.formUser);
                }
                //如果接口调用成功
                if(res){
                  console.log(res)
                        //关闭对话框，重置表单，重新请求用户数据
                        dialogVisible.value = false;
                        proxy.$refs["userForm"].resetFields()
                        getUserData()
                }else {
                  console.log(res)
                  ElMessage({
                    showClose: true,
                    message: "添加失败",
                    type: "error",
                  })
                  handleCancel()
                }


		//如果校验失败
        }else {
          ElMessage({
            showClose: true,
            message: "请输入正确的内容",
            type: "error",
          })
        }

    })
}

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

const action = ref('add')
const dialogVisible = ref(false)
const formUser = ref({})
const rules = ref({
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' },
    { type: 'number', message: '请输入数字', trigger: 'blur' }
  ],
  sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
  birth: [{ required: true, message: '请选择出生日期', trigger: 'change' }],
  addr: [{ required: true, message: '请输入地址', trigger: 'blur' }],
})

const handleCurrentChange = (currentPage) => {
  config.page = currentPage
  getUserData(config)
}

const handleClick = (item) => {
  action.value = 'edit'
  nextTick(() => {
    formUser.value = {...item}
    dialogVisible.value = true
    formUser.value.birth = timeFormat(item.birth)
    formUser.value.sex = item.sex === 1 ? '男' : '女'
  })
}

const config = {
  name: '',
  total:0,
  page:1,
  formUser:{}
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

.select-clearn{
    display:flex;
}
</style>