<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

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
  }
}

// 上一步
const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// 返回首页
const goBack = () => {
  router.push('/')
}
</script>

<template>
  <div class="team-selection-page">
    <!-- 步骤指示器 -->
    <div class="step-indicator">
      <div 
        class="step-item" 
        :class="{ active: currentStep >= 1, completed: currentStep > 1 }"
      >
        <span class="step-number">1</span>
        <span class="step-text">选择队友</span>
      </div>
      <div class="step-divider"></div>
      <div 
        class="step-item" 
        :class="{ active: currentStep >= 2, completed: currentStep > 2 }"
      >
        <span class="step-number">2</span>
        <span class="step-text">下一步</span>
      </div>
    </div>

    <!-- 第一步：选择队友 -->
    <div v-if="currentStep === 1" class="step-content">
      <h2>选择队友</h2>
      <div class="teammate-selection-area">
        <p>请选择您的队友（此处为选择区域）</p>
        <!-- 这里可以添加具体的队友选择组件 -->
      </div>
      <div class="step-actions">
        <button class="btn btn-secondary" @click="goBack">返回</button>
        <button class="btn btn-primary" @click="nextStep">下一步</button>
      </div>
    </div>

    <!-- 第二步：下一模块 -->
    <div v-else-if="currentStep === 2" class="step-content">
      <h2>下一步</h2>
      <div class="next-module-area">
        <p>下一模块内容区域（待开发）</p>
        <!-- 这里可以添加具体的下一步内容 -->
      </div>
      <div class="step-actions">
        <button class="btn btn-secondary" @click="prevStep">上一步</button>
        <button class="btn btn-primary" @click="goBack">完成</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.team-selection-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* 步骤指示器样式 */
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #666;
  transition: all 0.3s ease;
}

.step-text {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
}

.step-item.active .step-number {
  background-color: #409eff;
  color: white;
}

.step-item.active .step-text {
  color: #409eff;
  font-weight: 500;
}

.step-item.completed .step-number {
  background-color: #67c23a;
  color: white;
}

.step-item.completed .step-text {
  color: #67c23a;
}

.step-divider {
  width: 60px;
  height: 2px;
  background-color: #e0e0e0;
  margin: 0 16px;
}

.step-divider:before {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  background-color: #409eff;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.step-item.completed + .step-divider:before {
  transform: scaleX(1);
}

/* 步骤内容样式 */
.step-content {
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.step-content h2 {
  margin-bottom: 24px;
  color: #333;
  text-align: center;
}

/* 选择区域样式 */
.teammate-selection-area,
.next-module-area {
  min-height: 200px;
  border: 2px dashed #dcdfe6;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  background-color: #fafafa;
}

.teammate-selection-area p,
.next-module-area p {
  color: #999;
  font-size: 16px;
}

/* 操作按钮样式 */
.step-actions {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.btn {
  padding: 10px 24px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #409eff;
  color: white;
}

.btn-primary:hover {
  background-color: #66b1ff;
}

.btn-secondary {
  background-color: #f5f7fa;
  color: #606266;
  border: 1px solid #dcdfe6;
}

.btn-secondary:hover {
  background-color: #ecf5ff;
  border-color: #409eff;
  color: #409eff;
}
</style>