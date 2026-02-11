<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()

// 步骤控制
const currentStep = ref(1)

// 页面初始化逻辑
onMounted(() => {
  console.log('组队选题页面已加载')
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
      <!-- 步骤指示器 -->
      <van-steps :active="currentStep - 1" active-color="#409eff" class="steps">
        <van-step>选择队友</van-step>
        <van-step>下一步</van-step>
      </van-steps>
      
      <!-- 第一步：选择队友 -->
      <div v-if="currentStep === 1" class="step-content">
        <van-cell-group inset>
          <van-cell title="队友选择区域" icon="friends-o">
            <template #label>
              <div class="placeholder-text">请选择您的队友</div>
            </template>
          </van-cell>
        </van-cell-group>
        
        <div class="actions">
          <van-button 
            plain 
            type="primary" 
            block 
            @click="goBack"
          >
            返回首页
          </van-button>
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

.steps {
  margin-bottom: 30px;
  background: white;
  padding: 20px;
  border-radius: 8px;
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

.actions {
  display: flex;
  gap: 12px;
  flex-direction: column;
}

.next-btn {
  margin-top: 12px;
}
</style>