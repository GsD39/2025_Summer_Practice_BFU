// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

// Configure axios base URL using Vite's import.meta.env
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
axios.defaults.withCredentials = true

// Create Vue application
const app = createApp(App)

// Use plugins
app.use(store)
app.use(router)

// Global error handler
app.config.errorHandler = (err, vm, info) => {
  console.error(`Vue error: ${err.toString()}\nInfo: ${info}`)
  // You could also send this to an error tracking service
}

// Mount the application
app.mount('#app')

// Global progress indicator for API calls
axios.interceptors.request.use(config => {
  store.commit('setLoading', true)
  return config
})

axios.interceptors.response.use(response => {
  store.commit('setLoading', false)
  return response
}, error => {
  store.commit('setLoading', false)
  
  // Handle common error cases
  if (error.response) {
    const { status } = error.response
    
    if (status === 401) {
      // Unauthorized - redirect to login
      store.commit('auth/logout')
      router.push({ path: '/auth', query: { redirect: router.currentRoute.value.fullPath } })
    } else if (status === 403) {
      // Forbidden - show access denied
      alert('You do not have permission to access this resource')
    }
  }
  
  return Promise.reject(error)
})