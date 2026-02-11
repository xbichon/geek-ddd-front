<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'
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

// 退出系统
const logout = () => {
  showConfirmDialog({
    title: '确认退出',
    message: '确定要退出系统吗？',
  }).then(() => {
    // 清除本地存储的token和hasSelected
    localStorage.removeItem('token')
    localStorage.removeItem('hasSelected')
    // 跳转到登录页面
    router.push('/login')
    showToast('已退出系统')
  }).catch(() => {
    // 取消退出
  })
}

const fetchSelectionDetail = async () => {
  loading.value = true
  try {
    const result = await request.get('/internship/thesis/getSelectionDetail') as SelectionDetailResponse
    if (result.code === 200) {
      detail.value = result.data
    }
  } catch (error) {
    showToast('获取选题详情失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSelectionDetail()
})
</script>

<template>
  <div class="success-page">
    <van-nav-bar
      title="选题成功"
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
      
      <div v-else class="detail-container">
        <!-- 选题详情 -->
        <div class="detail-card">
          <h3 class="detail-title">选题详情</h3>
          
          <div class="detail-item">
            <div class="detail-label">
              <van-icon name="underway-o" color="#1989fa" />
              <span>选题方向：</span>
            </div>
            <div class="detail-value">{{ detail?.thesisTitle || '暂无数据' }}</div>
          </div>
          
          <div class="detail-item">
            <div class="detail-label">
              <van-icon name="friends-o" color="#1989fa" />
              <span>选题方式：</span>
            </div>
            <div class="detail-value">
              <van-tag :type="detail?.isGroup ? 'primary' : 'success'">
                {{ detail?.isGroup ? '组队' : '个人' }}
              </van-tag>
            </div>
          </div>
          
          <div class="detail-item">
            <div class="detail-label">
              <van-icon name="user-o" color="#1989fa" />
              <span>学生姓名：</span>
            </div>
            <div class="detail-value">{{ detail?.studentName || '暂无数据' }}</div>
          </div>
          
          <div class="detail-item">
            <div class="detail-label">
              <van-icon name="bookmark-o" color="#1989fa" />
              <span>成果形式：</span>
            </div>
            <div class="detail-value">{{ detail?.achievementType || '暂无数据' }}</div>
          </div>
          
          <div class="detail-item">
            <div class="detail-label">
              <van-icon name="manager-o" color="#1989fa" />
              <span>指导老师：</span>
            </div>
            <div class="detail-value">{{ detail?.advisorName || '暂无数据' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.success-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf9 100%);
}

.content {
  padding: 60px 16px 20px;
}

.loading {
  text-align: center;
  padding: 60px 20px;
}

.detail-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-card {
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.detail-title {
  font-size: 20px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 25px;
  text-align: center;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  display: flex;
  align-items: flex-start;
  font-size: 16px;
  color: #646566;
  min-width: 100px;
  flex-shrink: 0;
}

.detail-label .van-icon {
  margin-right: 8px;
  margin-top: 2px;
}

.detail-value {
  font-size: 16px;
  color: #323233;
  font-weight: 500;
  flex: 1;
  line-height: 1.5;
  word-break: break-all;
  text-align: left;
}

:deep(.van-nav-bar) {
  background: #1989fa; /* 统一为纯蓝色 */
}

:deep(.van-nav-bar__title) {
  color: white;
  font-weight: 500;
}
</style>