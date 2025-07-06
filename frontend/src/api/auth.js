import axios from 'axios'


export default {
  login(credentials) {
    return axios.post('/auth/login', {
      email: credentials.email,
      password: credentials.password
    })
  },
  logout() {
    return axios.post('/auth/logout')
  },
  getUser() {
    return axios.get('/auth/user')
  }
}