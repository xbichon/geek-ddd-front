<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request'

const router = useRouter()

interface Paper {
  id: number
  title: string
  maxSelections: number
  currentSelections: number
  achievementTypes: string[]
}

interface ThesisResponse {
  code: number
  data: Paper[]
  message: string
}

interface HasSelectedResponse {
  code: number
  data: boolean
  message: string
}

const papers = ref<Paper[]>([])
const selectedPaperId = ref<number | null>(null)
const selectedAchievementType = ref<string>('')
const loading = ref(false)
const submitting = ref(false)

const selectedPaper = computed(() => {
  return papers.value.find(p => p.id === selectedPaperId.value)
})

const achievementTypes = computed(() => {
  return selectedPaper.value?.achievementTypes || []
})

// 返回首页
const goBack = () => {
  router.push('/')
}

// 检查用户是否已经选题
const checkHasSelected = async () => {
  try {
    const result = await request.get('/internship/thesis-selection/has-selected') as HasSelectedResponse
    if (result.code === 200 && result.data === true) {
      // 已经选题，直接跳转到成功页面
      router.push('/success')
      return true
    }
    return false
  } catch (error) {
    console.error('检查选题状态失败:', error)
    return false
  }
}

const fetchPapers = async () => {
  loading.value = true
  try {
    const result = await request.get('/internship/thesis') as ThesisResponse
    if (result.code === 200) {
      papers.value = result.data
    }
  } finally {
    loading.value = false
  }
}

const selectPaper = (paper: Paper) => {
  if (paper.currentSelections >= paper.maxSelections) {
    return
  }
  selectedPaperId.value = paper.id
  selectedAchievementType.value = paper.achievementTypes.includes('论文') ? '论文' : paper.achievementTypes[0] || ''
}

const submitSelection = async () => {
  if (!selectedPaperId.value) {
    alert('请选择选题')
    return
  }
  if (!selectedAchievementType.value) {
    alert('请选择成果形式')
    return
  }

  submitting.value = true
  try {
    const result = await request.post('/internship/thesis-selection', {
      thesisId: selectedPaperId.value,
      achievementType: selectedAchievementType.value,
      selectionType: 'INDIVIDUAL'
    }) as { code: number; message: string }

    if (result.code === 200) {
      router.push('/success')
    } else {
      alert(result.message || '选题失败')
    }
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  // 先检查是否已经选题
  const hasSelected = await checkHasSelected()
  if (!hasSelected) {
    // 没有选题才获取论文列表
    fetchPapers()
  }
})
</script>

<template>
  <div class="individual-selection-page">
    <div class="header">
      <h2>个人选题</h2>
      <button class="back-btn" @click="goBack">返回</button>
    </div>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else class="paper-list">
      <div
        v-for="paper in papers"
        :key="paper.id"
        class="paper-item"
        :class="{
          selected: selectedPaperId === paper.id,
          disabled: paper.currentSelections >= paper.maxSelections
        }"
        @click="selectPaper(paper)"
      >
        <input
          v-model="selectedPaperId"
          type="radio"
          name="paper"
          :value="paper.id"
          :disabled="paper.currentSelections >= paper.maxSelections"
        />
        <span class="paper-title">{{ paper.title }} ({{ paper.currentSelections }}/{{ paper.maxSelections }})</span>
      </div>
    </div>

    <div v-if="selectedPaper" class="achievement-section">
      <h3>成果形式</h3>
      <div class="achievement-options">
        <label
          v-for="type in achievementTypes"
          :key="type"
          class="achievement-item"
        >
          <input
            v-model="selectedAchievementType"
            type="radio"
            name="achievementType"
            :value="type"
          />
          <span>{{ type }}</span>
        </label>
      </div>
    </div>

    <button
      class="submit-btn"
      :disabled="submitting"
      @click="submitSelection"
    >
      {{ submitting ? '提交中...' : '确认选题' }}
    </button>
  </div>
</template>

<style scoped>
.individual-selection-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px 100px;
  position: relative;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
}

.back-btn {
  padding: 8px 16px;
  background-color: #f5f7fa;
  color: #606266;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background-color: #ecf5ff;
  border-color: #409eff;
  color: #409eff;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #999;
}

.paper-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.paper-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.paper-item:hover:not(.disabled) {
  background-color: #f5f5f5;
}

.paper-item.selected {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.paper-item.disabled {
  background-color: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

.paper-title {
  flex: 1;
}

.achievement-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.achievement-section h3 {
  margin-bottom: 15px;
  font-size: 16px;
}

.achievement-options {
  display: flex;
  gap: 20px;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.submit-btn {
  position: fixed;
  bottom: 40px;
  right: 40px;
  padding: 12px 40px;
  font-size: 14px;
  cursor: pointer;
}

.submit-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>