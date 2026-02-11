import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import IndividualSelection from '@/views/IndividualSelection.vue'
import TeamSelection from '@/views/TeamSelection.vue'
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
      path: '/individual-selection',
      name: 'IndividualSelection',
      component: IndividualSelection,
      meta: { requiresAuth: true }
    },
    {
      path: '/team-selection',
      name: 'TeamSelection',
      component: TeamSelection,
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