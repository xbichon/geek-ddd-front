<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
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

onMounted(async () => {
  // 页面加载时检查选题状态
  await checkHasSelected()
})
</script>

<template>
  <div class="home-page">
    <h1>hello</h1>
    <div class="button-group">
      <button @click="goToIndividualSelection">个人</button>
      <button @click="goToTeamSelection">组队</button>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  gap: 30px;
}

.home-page h1 {
  font-size: 48px;
  margin: 0;
}

.button-group {
  display: flex;
  gap: 20px;
}

.button-group button {
  padding: 10px 30px;
  font-size: 16px;
  cursor: pointer;
}
</style>