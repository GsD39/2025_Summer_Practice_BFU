import axios from 'axios'

export default {
  login(credentials) {
    return axios.post('/auth/login', credentials)
  },
  register(userData) {
    return axios.post('/auth/register', userData)
  },
  logout() {
    return axios.post('/auth/logout')
  },
  getUser() {
    return axios.get('/auth/user')
  }
}