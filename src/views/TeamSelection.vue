<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { getUnselectedStudents, type Student } from '@/api/internship'

const router = useRouter()

// 步骤控制
const currentStep = ref(1)

// 学生列表
const studentList = ref<Student[]>([])
const loading = ref(false)

// 选中的队友（最多5人）
const selectedTeammates = ref<number[]>([])

// 获取未选择的学生列表
const fetchUnselectedStudents = async () => {
  loading.value = true
  try {
    const res = await getUnselectedStudents()
    if (res.code === 200) {
      studentList.value = res.data
    } else {
      showToast(res.message || '获取学生列表失败')
    }
  } catch (error) {
    showToast('获取学生列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 切换选择状态
const toggleSelection = (studentId: number) => {
  const index = selectedTeammates.value.indexOf(studentId)
  if (index > -1) {
    // 已选中，取消选择
    selectedTeammates.value.splice(index, 1)
  } else {
    // 未选中，检查是否超过5人
    if (selectedTeammates.value.length >= 5) {
      showToast('最多只能选择5个队友')
      return
    }
    selectedTeammates.value.push(studentId)
  }
}

// 判断是否已选中
const isSelected = (studentId: number) => {
  return selectedTeammates.value.includes(studentId)
}

// 页面初始化逻辑
onMounted(() => {
  fetchUnselectedStudents()
})

// 下一步
const nextStep = () => {
  if (currentStep.value < 2) {
    currentStep.value++
    showToast('进入下一步')
  }
}

// 上一步
const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    showToast('返回上一步')
  }
}

// 返回首页
const goBack = () => {
  router.push('/')
}
</script>

<template>
  <div class="team-selection-page">
    <van-nav-bar
      title="组队选题"
      left-text="返回"
      left-arrow
      @click-left="goBack"
      fixed
    />
    
    <div class="content">
      <!-- 第一步：选择队友 -->
      <div v-if="currentStep === 1" class="step-content">
        <van-cell-group inset>
          <van-cell title="选择队友" icon="friends-o">
            <template #label>
              <div class="selection-hint">已选择 {{ selectedTeammates.length }}/5 人</div>
            </template>
          </van-cell>
          <div v-if="loading" class="loading-text">加载中...</div>
          <div v-else-if="studentList.length === 0" class="placeholder-text">暂无可选择的学生</div>
          <van-checkbox-group v-model="selectedTeammates" max="5">
            <van-cell
              v-for="student in studentList"
              :key="student.id"
              :title="student.name"
              clickable
              @click="toggleSelection(student.id)"
            >
              <template #right-icon>
                <van-checkbox
                  :name="student.id"
                  shape="square"
                  @click.stop
                />
              </template>
            </van-cell>
          </van-checkbox-group>
        </van-cell-group>
        
        <div class="actions">
          <van-button 
            type="primary" 
            block 
            @click="nextStep"
            class="next-btn"
          >
            下一步
          </van-button>
        </div>
      </div>
      
      <!-- 第二步：下一模块 -->
      <div v-else-if="currentStep === 2" class="step-content">
        <van-cell-group inset>
          <van-cell title="下一模块" icon="apps-o">
            <template #label>
              <div class="placeholder-text">功能开发中...</div>
            </template>
          </van-cell>
        </van-cell-group>
        
        <div class="actions">
          <van-button 
            plain 
            type="primary" 
            block 
            @click="prevStep"
          >
            上一步
          </van-button>
          <van-button 
            type="primary" 
            block 
            @click="goBack"
            class="next-btn"
          >
            完成
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.team-selection-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.content {
  padding: 60px 16px 20px;
}

.step-content {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.placeholder-text {
  color: #999;
  font-size: 14px;
  padding: 40px 0;
  text-align: center;
}

.loading-text {
  color: #999;
  font-size: 14px;
  padding: 40px 0;
  text-align: center;
}

.selection-hint {
  color: #666;
  font-size: 13px;
  padding: 8px 0;
}

.actions {
  display: flex;
  gap: 12px;
  flex-direction: column;
}

.next-btn {
  margin-top: 12px;
}
</style>