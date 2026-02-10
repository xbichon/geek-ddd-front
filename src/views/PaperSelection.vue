<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import request from '@/utils/request'

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
  if (!selectedPaperId.value || !selectedAchievementType.value) {
    alert('请选择论文和成果形式')
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
      alert('选题成功')
      fetchPapers()
    } else {
      alert(result.message || '选题失败')
    }
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchPapers()
})
</script>

<template>
  <div class="paper-selection-page">
    <h2>论文选题</h2>

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

      <button
        class="submit-btn"
        :disabled="submitting"
        @click="submitSelection"
      >
        {{ submitting ? '提交中...' : '确认选题' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.paper-selection-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
}

h2 {
  margin-bottom: 20px;
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
  margin-top: 30px;
  padding: 10px 40px;
  font-size: 14px;
  cursor: pointer;
}

.submit-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
