<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToPaperSelection = () => {
  router.push('/paper-selection')
}
</script>

<template>
  <div class="home-page">
    <h1>hello</h1>
    <div class="button-group">
      <button @click="goToPaperSelection">个人</button>
      <button>组队</button>
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
