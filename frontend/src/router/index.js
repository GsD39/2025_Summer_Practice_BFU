import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

const baseUrl = import.meta.env.BASE_URL || '/'


const AuthView = () => import('@/views/AuthView.vue')
const ScheduleView = () => import('@/views/ScheduleView.vue')
const AdminView = () => import('@/views/AdminView.vue')
const NotFound = () => import('@/views/NotFound.vue')

const routes = [
  {
    path: '/',
    redirect: '/schedule'
  },
  {
    path: '/auth',
    name: 'Auth',
    component: AuthView,
    meta: {
      title: 'Login or Register',
      guestOnly: true,
      hideNav: true
    }
  },
  {
    path: '/schedule',
    name: 'Schedule',
    component: ScheduleView,
    meta: {
      title: 'Class Schedule',
      requiresAuth: true
    }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    meta: {
      title: 'Admin Panel',
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: 'Page Not Found'
    }
  }
]

const router = createRouter({
  history: createWebHistory(baseUrl),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})



router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated']
  const isAdmin = store.getters['auth/isAdmin']
  
  if ((to.meta.requiresAuth && !isAuthenticated) || (to.meta.requiresAdmin && !isAdmin)) {
    next({ name: 'Auth', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router