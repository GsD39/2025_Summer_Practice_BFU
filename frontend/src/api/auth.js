import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json'
  }
})

export default {
  login(credentials) {
    return apiClient.post('/auth/login', {
      email: credentials.email,
      password: credentials.password
    })
  },
  logout() {
    return apiClient.post('/auth/logout')
  },
  getUser() {
    return apiClient.get('/auth/user')
  }
}