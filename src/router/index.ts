import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import PaperSelection from '@/views/PaperSelection.vue'
import Success from '@/views/Success.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/paper-selection',
      name: 'PaperSelection',
      component: PaperSelection,
      meta: { requiresAuth: true }
    },
    {
      path: '/success',
      name: 'Success',
      component: Success,
      meta: { requiresAuth: true }
    }
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/')
  } else {
    next()
  }
})

export default router
