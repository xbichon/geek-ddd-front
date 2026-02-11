<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'
import request from '@/utils/request'

const router = useRouter()

interface HasSelectedResponse {
  code: number
  data: boolean
  message: string
}

const goToIndividualSelection = () => {
  router.push('/individual-selection')
}

const goToTeamSelection = () => {
  router.push('/team-selection')
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

onMounted(async () => {
  // 页面加载时检查选题状态
  await checkHasSelected()
})
</script>

<template>
  <div class="home-page">
    <van-nav-bar
      title="选题系统"
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
      <!-- 欢迎区域 -->
      <div class="welcome-section">
        <van-icon name="user-circle-o" size="60" color="#1989fa" />
        <h2 class="welcome-title">欢迎使用</h2>
        <p class="welcome-subtitle">请选择选题方式开始您的学术之旅</p>
      </div>

      <!-- 选题选项卡片 -->
      <div class="selection-cards">
        <van-card
          title="个人选题"
          desc="独立完成论文选题和研究工作"
          thumb="https://img.yzcdn.cn/vant/ipad.jpeg"
          class="selection-card"
          @click="goToIndividualSelection"
        >
          <template #tags>
            <van-tag plain type="primary" class="card-tag">个人独立</van-tag>
            <van-tag plain type="success" class="card-tag">自主研究</van-tag>
          </template>
          <template #footer>
            <van-button 
              type="primary" 
              size="small" 
              round
              @click.stop="goToIndividualSelection"
            >
              立即选择
            </van-button>
          </template>
        </van-card>

        <van-card
          title="组队选题"
          desc="与同学组队协作完成研究项目"
          thumb="https://img.yzcdn.cn/vant/ipad.jpeg"
          class="selection-card"
          @click="goToTeamSelection"
        >
          <template #tags>
            <van-tag plain type="primary" class="card-tag">团队协作</van-tag>
            <van-tag plain type="warning" class="card-tag">多人参与</van-tag>
          </template>
          <template #footer>
            <van-button 
              type="primary" 
              size="small" 
              round
              @click.stop="goToTeamSelection"
            >
              立即组队
            </van-button>
          </template>
        </van-card>
      </div>

      <!-- 系统提示 -->
      <div class="system-tips">
        <van-notice-bar
          left-icon="bulb-o"
          text="温馨提示：根据个人情况选择合适的方式"
          background="#fff7e8"
          color="#ff976a"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf9 100%);
}

.content {
  padding: 60px 16px 20px;
}

.welcome-section {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px 0;
}

.welcome-title {
  font-size: 24px;
  font-weight: 600;
  color: #323233;
  margin: 15px 0 8px;
}

.welcome-subtitle {
  font-size: 15px;
  color: #969799;
  margin: 0;
}

.selection-cards {
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin-bottom: 25px;
}

.selection-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  background: white;
}

.selection-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

:deep(.van-card__header) {
  padding: 25px 20px 15px;
}

:deep(.van-card__title) {
  font-size: 20px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 12px;
}

:deep(.van-card__desc) {
  font-size: 15px;
  color: #646566;
  line-height: 1.6;
  margin-bottom: 15px;
}

:deep(.van-card__tags) {
  margin-bottom: 20px;
  min-height: 28px;
  display: flex;
  align-items: center;
}

.card-tag {
  margin-right: 10px;
  margin-bottom: 6px;
}

:deep(.van-card__footer) {
  padding: 0 20px 25px;
  display: flex;
  justify-content: flex-end;
}

.system-tips {
  padding: 0 8px;
}

:deep(.van-notice-bar) {
  border-radius: 12px;
}

:deep(.van-nav-bar) {
  background: linear-gradient(to right, #1989fa, #07c160);
}

:deep(.van-nav-bar__title) {
  color: white;
  font-weight: 500;
}
</style>