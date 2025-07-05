export default {
  login(credentials) {
    return axios.post('/auth/login', credentials)
  },
  getUser() {
    return axios.get('/auth/user')
  },
  logout() {
    return axios.post('/auth/logout')
  }
}