<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { login, getCaptcha } from '@/api/login'

const username = ref('')
const password = ref('')
const captchaCode = ref('')
const captchaKey = ref('')
const captchaImage = ref('')

const fetchCaptcha = async () => {
  const result = await getCaptcha()
  if (result.code === 200) {
    captchaKey.value = result.data.key
    captchaImage.value = result.data.data
  }
}

const onSubmit = async () => {
  const result = await login({
    userType: 'student',
    identifier: username.value,
    password: password.value,
    captcha: captchaCode.value,
    captchaKey: captchaKey.value
  })

  if (result.code === 200) {
    localStorage.setItem('token', result.data)
    alert('登录成功')
  } else {
    alert(result.message || '登录失败')
    fetchCaptcha()
  }
}

onMounted(() => {
  fetchCaptcha()
})
</script>

<template>
  <div class="login-page">
    <div class="login-box">
      <h1>论文选题系统</h1>

      <form @submit.prevent="onSubmit">
        <div class="form-item">
          <input
            v-model="username"
            type="text"
            placeholder="请输入用户名"
          />
        </div>

        <div class="form-item">
          <input
            v-model="password"
            type="password"
            placeholder="请输入密码"
          />
        </div>

        <div class="form-item">
          <img
            v-if="captchaImage"
            :src="captchaImage"
            alt="验证码"
            @click="fetchCaptcha"
            class="captcha-img"
          />
        </div>

        <div class="form-item">
          <input
            v-model="captchaCode"
            type="text"
            placeholder="请输入验证码"
          />
        </div>

        <div class="form-item">
          <button type="submit">登录</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}

.login-box {
  width: 100%;
  max-width: 300px;
}

.login-box h1 {
  text-align: center;
  margin-bottom: 30px;
}

.form-item {
  margin-bottom: 15px;
}

.form-item input {
  width: 100%;
  height: 40px;
  padding: 0 10px;
  box-sizing: border-box;
  font-size: 14px;
}

.form-item button {
  width: 100%;
  height: 40px;
  font-size: 14px;
}

.captcha-img {
  width: 100%;
  height: 50px;
  object-fit: contain;
  cursor: pointer;
}
</style>
