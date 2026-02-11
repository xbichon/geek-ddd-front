<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showLoadingToast, closeToast } from 'vant'
import { login, getCaptcha } from '@/api/login'

const router = useRouter()

const username = ref('')
const password = ref('')
const captchaCode = ref('')
const captchaKey = ref('')
const captchaImage = ref('')
const loading = ref(false)

const fetchCaptcha = async () => {
  try {
    const result = await getCaptcha()
    if (result.code === 200) {
      captchaKey.value = result.data.key
      captchaImage.value = result.data.data
    }
  } catch (error) {
    showToast('获取验证码失败')
  }
}

const onSubmit = async () => {
  if (!username.value.trim()) {
    showToast('请输入用户名')
    return
  }
  
  if (!password.value.trim()) {
    showToast('请输入密码')
    return
  }
  
  if (!captchaCode.value.trim()) {
    showToast('请输入验证码')
    return
  }

  loading.value = true
  showLoadingToast({
    message: '登录中...',
    forbidClick: true,
  })

  try {
    const result = await login({
      userType: 'student',
      identifier: username.value,
      password: password.value,
      captcha: captchaCode.value,
      captchaKey: captchaKey.value
    })

    if (result.code === 200) {
      localStorage.setItem('token', result.data)
      router.push('/')
    } else {
      showToast(result.message || '登录失败')
      fetchCaptcha()
    }
  } catch (error) {
    showToast('网络错误，请稍后重试')
    fetchCaptcha()
  } finally {
    loading.value = false
    closeToast()
  }
}

onMounted(() => {
  fetchCaptcha()
})
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <!-- 头部logo区域 -->
      <div class="login-header">
        <van-icon name="manager" size="56" color="#ffffff" />
        <h1 class="login-title">论文选题系统</h1>
      </div>

      <!-- 登录表单 -->
      <van-form @submit="onSubmit" class="login-form">
        <van-cell-group inset>
          <!-- 用户名输入 -->
          <van-field
            v-model="username"
            name="username"
            placeholder="请输入用户名"
            :rules="[{ required: true, message: '请填写用户名' }]"
            left-icon="user-o"
            size="large"
            class="custom-field"
          />

          <!-- 密码输入 -->
          <van-field
            v-model="password"
            type="password"
            name="password"
            placeholder="请输入密码"
            :rules="[{ required: true, message: '请填写密码' }]"
            left-icon="lock"
            size="large"
            class="custom-field"
          />

          <!-- 验证码区域 -->
          <div class="captcha-section">
            <van-field
              v-model="captchaCode"
              name="captcha"
              placeholder="请输入验证码"
              :rules="[{ required: true, message: '请填写验证码' }]"
              left-icon="shield-o"
              size="large"
              class="custom-field captcha-input"
            />
            <div class="captcha-wrapper">
              <img
                v-if="captchaImage"
                :src="captchaImage"
                alt="验证码"
                @click="fetchCaptcha"
                class="captcha-image"
              />
              <div v-else class="captcha-placeholder">
                加载中...
              </div>
            </div>
          </div>
        </van-cell-group>

        <!-- 登录按钮 -->
        <div class="login-button">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="loading"
            loading-text="登录中..."
            size="large"
          >
            登录
          </van-button>
        </div>
      </van-form>

      <!-- 底部提示 -->
      <div class="login-footer">
        <van-notice-bar
          left-icon="info-o"
          text="请使用自己的学号进行登录"
          background="#ecf9ff"
          color="#1989fa"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-title {
  color: #323233; /* 改为深灰色，不再使用白色 */
  font-size: 28px;
  font-weight: 600;
  margin: 20px 0 0;
  letter-spacing: 1px;
}

.login-form {
  background: white;
  border-radius: 16px;
  padding: 25px 20px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.custom-field {
  margin-bottom: 15px;
}

:deep(.van-field__control) {
  font-size: 16px !important;
  height: 50px !important;
}

:deep(.van-field__left-icon) {
  font-size: 20px !important;
  color: #1989fa !important;
  margin-right: 12px !important;
}

:deep(.van-field__body) {
  min-height: 50px !important;
}

.captcha-section {
  position: relative;
  margin-bottom: 15px;
}

.captcha-input {
  margin-bottom: 0;
}

.captcha-wrapper {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
}

.captcha-image {
  width: 110px;
  height: 45px;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid #ebedf0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.captcha-placeholder {
  width: 110px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 6px;
  color: #999;
  font-size: 14px;
}

.login-button {
  margin-top: 25px;
}

:deep(.van-button--large) {
  height: 50px;
  font-size: 18px;
  font-weight: 500;
}

.login-footer {
  margin-top: 25px;
}

:deep(.van-cell-group--inset) {
  overflow: hidden;
  border-radius: 12px;
}

:deep(.van-notice-bar) {
  border-radius: 8px;
}
</style>