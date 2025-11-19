<template>

<el-form 
        ref="formRef" 
        :model="form" 
        label-width="120px" 
        :rules="rules"
        status-icon
        @submit.prevent>
        
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入活动名称" />
        </el-form-item>
        
        <el-form-item label="性别" prop="region">
          <el-select v-model="form.region" placeholder="请选择您的性别" style="width: 100%">
            <el-option label="男" value="male" />
            <el-option label="女" value="female" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="活动时间" prop="date1">
          <el-col :span="11">
            <el-date-picker
              v-model="form.date1"
              type="date"
              placeholder="选择日期"
              style="width: 100%"
            />
          </el-col>
          <el-col :span="2" class="text-center">
            <span class="text-gray-500">-</span>
          </el-col>
          <el-col :span="11">
            <el-time-picker
              v-model="form.date2"
              placeholder="选择时间"
              style="width: 100%"
            />
          </el-col>
        </el-form-item>
        
        <el-form-item label="即时配送" prop="delivery">
          <el-switch v-model="form.delivery" />
        </el-form-item>
        
        <el-form-item label="活动类型" prop="type">
          <el-checkbox-group v-model="form.type">
            <el-checkbox value="online" name="type">线上活动</el-checkbox>
            <el-checkbox value="promotion" name="type">促销活动</el-checkbox>
            <el-checkbox value="offline" name="type">线下活动</el-checkbox>
            <el-checkbox value="exposure" name="type">品牌曝光</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        
        <el-form-item label="资源类型" prop="resource">
          <el-radio-group v-model="form.resource">
            <el-radio value="sponsor">赞助商</el-radio>
            <el-radio value="venue">场地提供</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="活动描述" prop="desc">
          <el-input v-model="form.desc" type="textarea" :rows="4" placeholder="请输入活动描述" />
        </el-form-item>
        
        <el-form-item class="submit-area">
          <el-button type="primary" @click="onSubmit">创建活动</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

// do not use same name with ref
const form = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})

const rules = reactive({
  name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  region: [{ required: true, message: '请选择活动区域', trigger: 'change' }],
  date1: [{ required: true, message: '请选择活动时间', trigger: 'change' }],
  date2: [{ required: true, message: '请选择活动时间', trigger: 'change' }],
  delivery: [{ required: true, message: '请选择是否需要即时配送', trigger: 'change' }],
  type: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
  resource: [{ required: true, message: '请选择活动资源', trigger: 'change' }],
  desc: [{ required: true, message: '请输入活动描述', trigger: 'blur' }],
})

const onSubmit = () => {
  console.log('submit!')
}
</script>
