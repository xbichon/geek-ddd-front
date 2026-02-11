<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="success-page">
    <h2>选题成功</h2>

    <div class="info-card">
      <div class="info-item">
        <span class="label">选题方向：</span>
        <span class="value">基于Spring Boot的微服务架构设计与实现</span>
      </div>

      <div class="info-item">
        <span class="label">是否结组：</span>
        <span class="value">个人</span>
      </div>

      <div class="info-item">
        <span class="label">学生姓名：</span>
        <span class="value">张三</span>
      </div>

      <div class="info-item">
        <span class="label">成果形式：</span>
        <span class="value">论文</span>
      </div>

      <div class="info-item">
        <span class="label">指导老师：</span>
        <span class="value">李教授</span>
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
</style>
