<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showLoadingToast, closeToast, showConfirmDialog } from 'vant'
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

// 退出系统
const logout = () => {
  showConfirmDialog({
    title: '确认退出',
    message: '确定要退出系统吗？',
  }).then(() => {
    // 清除本地存储的token
    localStorage.removeItem('token')
    // 跳转到登录页面
    router.push('/login')
    showToast('已退出系统')
  }).catch(() => {
    // 取消退出
  })
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
    showToast('检查选题状态失败')
    return false
  }
}

const fetchPapers = async () => {
  loading.value = true
  try {
    const result = await request.get('/internship/thesis') as ThesisResponse
    if (result.code === 200) {
      papers.value = result.data
      // 默认选中第一个可用的题目
      if (papers.value.length > 0) {
        const firstAvailablePaper = papers.value.find(paper => 
          paper.currentSelections < paper.maxSelections
        )
        if (firstAvailablePaper) {
          selectedPaperId.value = firstAvailablePaper.id
          // 默认选择第一个成果形式
          if (firstAvailablePaper.achievementTypes.length > 0) {
            selectedAchievementType.value = firstAvailablePaper.achievementTypes[0] || ''
          }
        }
      }
    }
  } finally {
    loading.value = false
  }
}

const selectPaper = (paper: Paper) => {
  if (paper.currentSelections >= paper.maxSelections) {
    showToast('该题目已满员')
    return
  }
  selectedPaperId.value = paper.id
  // 切换题目时，默认选择第一个成果形式
  if (paper.achievementTypes.length > 0) {
    selectedAchievementType.value = paper.achievementTypes[0] || ''
  } else {
    selectedAchievementType.value = ''
  }
}

const submitSelection = async () => {
  if (!selectedPaperId.value) {
    showToast('请选择选题')
    return
  }
  if (!selectedAchievementType.value) {
    showToast('请选择成果形式')
    return
  }

  submitting.value = true
  showLoadingToast({
    message: '提交中...',
    forbidClick: true,
  })
  
  try {
    const result = await request.post('/internship/thesis-selection', {
      thesisId: selectedPaperId.value,
      achievementType: selectedAchievementType.value,
      selectionType: 'INDIVIDUAL'
    }) as { code: number; message: string }

    if (result.code === 200) {
      router.push('/success')
    } else {
      showToast(result.message || '选题失败')
    }
  } catch (error) {
    showToast('网络错误，请稍后重试')
  } finally {
    submitting.value = false
    closeToast()
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
    <van-nav-bar
      title="个人选题"
      left-text="返回"
      left-arrow
      @click-left="goBack"
      fixed
    >
      <template #right>
        <van-button 
          type="primary" 
          size="small" 
          plain
          @click="logout"
        >
          退出
        </van-button>
      </template>
    </van-nav-bar>
    
    <div class="content">
      <van-loading v-if="loading" vertical class="loading">
        加载中...
      </van-loading>
      
      <div v-else>
        <!-- 题目列表区域 -->
        <div class="papers-section">
          <div 
            v-for="paper in papers"
            :key="paper.id"
            class="paper-item"
            :class="{
              'selected': selectedPaperId === paper.id,
              'disabled': paper.currentSelections >= paper.maxSelections
            }"
            @click="selectPaper(paper)"
          >
            <div class="paper-info">
              <div class="paper-title">{{ paper.title }}</div>
              <div class="paper-stats">
                <van-tag 
                  :type="paper.currentSelections >= paper.maxSelections ? 'danger' : 'default'"
                  size="medium"
                >
                  {{ paper.currentSelections }}/{{ paper.maxSelections }} 人
                </van-tag>
              </div>
            </div>
            <van-radio 
              :name="paper.id" 
              :model-value="selectedPaperId"
              @click.stop
              class="paper-radio"
            />
          </div>
        </div>
        
        <!-- 成果形式选择 -->
        <div v-if="selectedPaper" class="achievement-section">
          <div class="section-title">
            <van-icon name="bookmark" />
            <span>成果形式</span>
          </div>
          <div class="achievement-options">
            <van-button
              v-for="type in achievementTypes"
              :key="type"
              :type="selectedAchievementType === type ? 'primary' : 'default'"
              size="small"
              round
              @click="selectedAchievementType = type"
            >
              {{ type }}
            </van-button>
          </div>
        </div>
        
        <!-- 提交按钮 -->
        <div class="submit-section">
          <van-button
            type="primary"
            size="large"
            block
            round
            :loading="submitting"
            @click="submitSelection"
          >
            {{ submitting ? '提交中...' : '确认选题' }}
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.individual-selection-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf9 100%);
}

.content {
  padding: 60px 12px 80px;
}

.loading {
  text-align: center;
  padding: 40px;
}

.papers-section {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
}

.paper-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.paper-item:last-child {
  border-bottom: none;
}

.paper-item:hover:not(.disabled) {
  background-color: #f8f9fa;
}

.paper-item.selected {
  background-color: #e8f3ff;
  border-left: 4px solid #1989fa;
}

.paper-item.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.paper-info {
  flex: 1;
  min-width: 0;
}

.paper-title {
  font-size: 16px;
  color: #323233;
  margin-bottom: 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.paper-stats {
  display: flex;
  align-items: center;
}

.paper-radio {
  flex-shrink: 0;
  margin-left: 12px;
}

.achievement-section {
  background: white;
  border-radius: 16px;
  padding: 20px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 16px;
}

.section-title .van-icon {
  margin-right: 8px;
  color: #1989fa;
}

.achievement-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.submit-section {
  position: fixed;
  bottom: 20px;
  left: 12px;
  right: 12px;
}

:deep(.van-nav-bar) {
  background: #1989fa; /* 改为纯蓝色，避免渐变过渡色 */
}

:deep(.van-nav-bar__title) {
  color: white;
  font-weight: 500;
}

:deep(.van-nav-bar__text) {
  color: white;
}

:deep(.van-button--primary) {
  background: #1989fa;
  border: none;
}
</style>