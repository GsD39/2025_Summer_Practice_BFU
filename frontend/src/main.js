import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_API_URL
axios.defaults.withCredentials = true

const app = createApp(App)

app.use(store)
app.use(router)

app.config.errorHandler = (err, vm, info) => {
  console.error(`Vue error: ${err.toString()}\nInfo: ${info}`)
}

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

if (localStorage.getItem('token')) {
  store.dispatch('auth/fetchUser')
}

router.isReady().then(() => {
  if (localStorage.getItem('token')) {
    store.dispatch('auth/fetchUser').then(() => {
      app.mount('#app')
    })
  } else {
    app.mount('#app')
  }
})