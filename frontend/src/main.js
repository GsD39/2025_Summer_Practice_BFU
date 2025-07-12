import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import i18n from './i18n'
import { setAuthToken } from '@/utils/auth'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(fas)

axios.defaults.baseURL = import.meta.env.VITE_API_URL
axios.defaults.withCredentials = true

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(store)
app.use(i18n)

const savedToken = localStorage.getItem('token')
if (savedToken) {
  setAuthToken(savedToken)
}
app.use(router)


app.config.errorHandler = (err, vm, info) => {
  console.error(`Vue error: ${err.toString()}\nInfo: ${info}`)
}

const token = localStorage.getItem('token')
if (token) {
	
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
	
 }


axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
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



// router.isReady().then(async () => {
//   const token = localStorage.getItem('token')
//   if (token) {
//     try {
//       setAuthToken(token)
      
//   	  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
//       await store.dispatch('auth/fetchUser')
//     } catch (error) {
//       console.error('Auth initialization failed:', error)
//       setAuthToken(null)
//     }
//   }
  
  app.mount('#app')
// })


if (localStorage.getItem('token')) {
  store.dispatch('auth/fetchUser')
}