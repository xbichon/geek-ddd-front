<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request'

const router = useRouter()

interface SelectionDetail {
  studentName: string
  isGroup: boolean
  advisorName: string
  achievementType: string
  thesisTitle: string
  teamInfo: null | string
}

interface SelectionDetailResponse {
  code: number
  data: SelectionDetail
  message: string
}

const detail = ref<SelectionDetail | null>(null)
const loading = ref(false)

const fetchSelectionDetail = async () => {
  loading.value = true
  try {
    const result = await request.get('/internship/thesis-selection/detail') as SelectionDetailResponse
    if (result.code === 200) {
      detail.value = result.data
    }
  } finally {
    loading.value = false
  }
}

const goToHome = () => {
  router.push('/')
}

onMounted(() => {
  fetchSelectionDetail()
})
</script>

<template>
  <div class="success-page">
    <h2>选题成功</h2>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else-if="detail" class="info-card">
      <div class="info-item">
        <span class="label">选题方向：</span>
        <span class="value">{{ detail.thesisTitle }}</span>
      </div>

      <div class="info-item">
        <span class="label">是否结组：</span>
        <span class="value">{{ detail.isGroup ? '组队' : '个人' }}</span>
      </div>

      <div class="info-item">
        <span class="label">学生姓名：</span>
        <span class="value">{{ detail.studentName }}</span>
      </div>

      <div class="info-item">
        <span class="label">成果形式：</span>
        <span class="value">{{ detail.achievementType }}</span>
      </div>

      <div class="info-item">
        <span class="label">指导老师：</span>
        <span class="value">{{ detail.advisorName }}</span>
      </div>
    </div>

    <button class="back-btn" @click="goToHome">
      返回首页
    </button>
  </div>
</template>

<style scoped>
.success-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 60px 20px;
}

h2 {
  text-align: center;
  margin-bottom: 40px;
}

.info-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 30px;
  margin-bottom: 40px;
}

.info-item {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.info-item:last-child {
  border-bottom: none;
}

.label {
  width: 100px;
  color: #666;
  flex-shrink: 0;
}

.value {
  flex: 1;
  color: #333;
}

.back-btn {
  display: block;
  margin: 0 auto;
  padding: 12px 40px;
  font-size: 14px;
  cursor: pointer;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #999;
}
</style>
