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

// src/main.js
axios.interceptors.request.use(config => {
  const token = store.state.auth.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axios.interceptors.response.use(response => response, error => {
  if (error.response?.status === 401) {
    store.dispatch('auth/logout')
    router.push('/auth')
  }
  return Promise.reject(error)
})