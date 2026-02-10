import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/login/index.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ],
})

export default router
