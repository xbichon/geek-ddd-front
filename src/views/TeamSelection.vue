<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showLoadingToast, closeToast, showConfirmDialog } from 'vant'
import { getUnselectedStudents, type Student } from '@/api/internship'
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

const papers = ref<Paper[]>([])
const selectedPaperId = ref<number | null>(null)
const selectedAchievementType = ref<string>('')
const submitting = ref(false)

// 步骤控制
const currentStep = ref(1)

// computed 属性
const selectedPaper = computed(() => {
  return papers.value.find(p => p.id === selectedPaperId.value)
})

const achievementTypes = computed(() => {
  return selectedPaper.value?.achievementTypes || []
})

// 学生列表
const studentList = ref<Student[]>([])
const loading = ref(false)

// 选中的队友（最多5人）
const selectedTeammates = ref<number[]>([])

// 组队原因
const teamReason = ref('')

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

// 检查用户是否已经选题
const checkHasSelected = async () => {
  try {
    // 从本地存储中获取选题状态
    const hasSelectedStr = localStorage.getItem('hasSelected')
    const hasSelected = hasSelectedStr === 'true'
    
    if (hasSelected) {
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

// 获取论文列表
const fetchPapers = async () => {
  loading.value = true
  try {
    const result = await request.get('/internship/thesis/list') as ThesisResponse
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

// 选择题目
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

// 提交选题
const submitSelection = async () => {
  if (!selectedPaperId.value) {
    showToast('请选择选题')
    return
  }
  if (!selectedAchievementType.value) {
    showToast('请选择成果形式')
    return
  }

  const paper = papers.value.find(p => p.id === selectedPaperId.value)

  showConfirmDialog({
    title: '确认选题',
    message: `题目：${paper?.title}\n成果形式：${selectedAchievementType.value}\n\n确认提交选题吗？`,
  }).then(async () => {
    submitting.value = true
    showLoadingToast({
      message: '提交中...',
      forbidClick: true,
    })

    try {
      const result = await request.post('/internship/thesis/applySelection', {
        thesisId: selectedPaperId.value,
        achievementType: selectedAchievementType.value,
        selectionType: 'TEAM',
        teamMemberIds: selectedTeammates.value
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
  }).catch(() => {
    // 用户取消，不做任何操作
  })
}

// 页面初始化逻辑
onMounted(() => {
  checkHasSelected()
  fetchUnselectedStudents()
})

// 下一步
const nextStep = () => {
  if (currentStep.value < 2) {
    currentStep.value++
    // 进入第二步时获取论文列表
    fetchPapers()
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
      <div v-if="currentStep === 1" class="step-content step-one">
        <div class="step-one-content">
          <!-- 选择队友卡片 -->
          <div class="team-section">
            <div class="section-title">
              <van-icon name="friends-o" />
              <span>选择队友</span>
            </div>
            <div class="selection-hint">已选择 {{ selectedTeammates.length }}/5 人</div>
            <div class="student-list">
              <van-loading v-if="loading" vertical class="loading">加载中...</van-loading>
              <div v-else-if="studentList.length === 0" class="placeholder-text">暂无可选择的学生</div>
              <van-checkbox-group v-else v-model="selectedTeammates" max="5">
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
            </div>
          </div>

          <!-- 组队原因卡片 -->
          <div class="reason-section">
            <div class="section-title">
              <van-icon name="edit" />
              <span>组队原因</span>
            </div>
            <div class="reason-input">
              <van-field
                v-model="teamReason"
                type="textarea"
                placeholder="请输入组队原因（选填）"
                rows="3"
                maxlength="200"
                show-word-limit
              />
            </div>
          </div>
        </div>

        <!-- 底部按钮 -->
        <div class="submit-section">
          <van-button
            type="primary"
            round
            block
            @click="nextStep"
            class="next-btn"
          >
            下一步
          </van-button>
        </div>
      </div>
      
      <!-- 第二步：选题模块 -->
      <div v-else-if="currentStep === 2" class="step-content selection-step">
        <van-loading v-if="loading" vertical class="loading">
          加载中...
        </van-loading>

        <div v-else class="main-content">
          <!-- 题目列表区域 -->
          <div class="papers-section">
            <div class="section-title papers-title">
              <van-icon name="description" />
              <span>选题方向</span>
            </div>
            <div class="papers-list">
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
                      :class="{ 'tag-full': paper.currentSelections >= paper.maxSelections }"
                      size="medium"
                      class="count-tag"
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

          <!-- 提交按钮区域 -->
          <div class="submit-section">
            <van-button
              plain
              type="primary"
              round
              @click="prevStep"
              class="prev-btn"
            >
              上一步
            </van-button>
            <van-button
              type="primary"
              round
              :loading="submitting"
              @click="submitSelection"
              class="submit-btn"
            >
              {{ submitting ? '提交中...' : '确认选题' }}
            </van-button>
          </div>
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
  padding: 60px 12px 12px;
  height: calc(100vh - 46px);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.step-content {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.step-content.selection-step {
  background: transparent;
  border-radius: 0;
  padding: 0;
  margin-bottom: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
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

.next-btn {
  margin-top: 0;
}

/* 第一步样式 */
.step-one {
  background: transparent;
  border-radius: 0;
  padding: 0;
  margin-bottom: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.step-one-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
}

.team-section {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 16px;
}

.team-section .section-title {
  margin-bottom: 8px;
}

.selection-hint {
  color: #666;
  font-size: 13px;
  margin-bottom: 12px;
}

.student-list {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.reason-section {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 16px;
}

.reason-section .section-title {
  margin-bottom: 12px;
}

.reason-input {
  flex: 1;
}

.reason-input :deep(.van-field) {
  background: #f7f8fa;
  border-radius: 8px;
}

/* 第二步选题样式 */
.selection-step .main-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.loading {
  text-align: center;
  padding: 40px;
}

.main-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.papers-title {
  padding: 12px 16px 8px;
  margin-bottom: 0;
}

.papers-section {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.papers-list {
  overflow-y: auto;
  flex: 1;
}

.paper-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
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

.count-tag {
  background-color: #07c160 !important;
  color: white !important;
}

.count-tag.tag-full {
  background-color: #c8c9cc !important;
  color: white !important;
}

.paper-radio {
  flex-shrink: 0;
  margin-left: 12px;
}

.achievement-section {
  background: white;
  border-radius: 16px;
  padding: 16px 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 12px;
  flex-shrink: 0;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 12px;
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
  margin-top: auto;
  padding-top: 8px;
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  gap: 12px;
}

.prev-btn {
  flex: 1;
}

.submit-btn {
  flex: 2;
  margin-top: 0;
}
</style>