import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

const routes = [
  {
    path: '/',
    redirect: { name: 'Schedule' }
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('@/views/AuthView.vue'),
    meta: { 
      title: 'Login or Register',
      guestOnly: true,
      hideNav: true
    }
  },
  {
    path: '/schedule',
    name: 'Schedule',
    component: () => import('@/views/ScheduleView.vue'),
    meta: { 
      title: 'Class Schedule',
      requiresAuth: true
    }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/AdminView.vue'),
    meta: { 
      title: 'Admin Panel',
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { 
      title: 'Page Not Found'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

function getAuthStatus() {
  return {
    isAuthenticated: store.getters['auth/isAuthenticated'],
    isAdmin: store.getters['auth/isAdmin']
  }
}

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  const guestOnly = to.matched.some(record => record.meta.guestOnly)
  
  const { isAuthenticated, isAdmin } = getAuthStatus()
  
  console.log('[Router] Navigating to:', to.name)
  console.log('[Router] isAuthenticated:', isAuthenticated)
  console.log('[Router] requiresAuth:', requiresAuth)
  console.log('[Router] guestOnly:', guestOnly)
  console.log('[Router] requiresAdmin:', requiresAdmin)

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'Auth', query: { redirect: to.fullPath } })
  } else if (requiresAdmin && !isAdmin) {
    next({ name: 'Forbidden' }) // Create this route
  } else if (guestOnly && isAuthenticated) {
    next({ name: 'Home' }) // Redirect to home if logged in
  } else {
    next()
  }
})

export default router