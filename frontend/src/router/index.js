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

// Navigation guard for authentication
router.beforeEach(async (to, from, next) => {
  // Set page title
  document.title = to.meta.title 
    ? `${to.meta.title} | University Schedule` 
    : 'University Schedule'
  
  // Check authentication status
  const isAuthenticated = store.getters['auth/isAuthenticated']
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  const guestOnly = to.matched.some(record => record.meta.guestOnly)
  
  // if (requiresAuth && !isAuthenticated) {
  if (requiresAuth && isAuthenticated) {
    next({
      path: '/auth',
      query: { redirect: to.fullPath }
    })
  } else if (guestOnly && isAuthenticated) {
    next('/schedule')
  // } else if (requiresAdmin && !store.getters['auth/isAdmin']) {
  } else if (requiresAdmin && store.getters['auth/isAdmin']) {
    next('/schedule')
  } else {
    next()
  }
})

export default router