import axios from 'axios'

export default {
  getUsers() {
    return axios.get('/api/admin/users')
  },
  createUser(userData) {
    return axios.post('/api/admin/users', userData)
  },
  createUsersBatch(users) {
    return axios.post('/api/admin/users/batch', users)
  },
  updateUser(id, userData) {
    return axios.put(`/api/admin/users/${id}`, userData)
  },
  deleteUser(id) {
    return axios.delete(`/api/admin/users/${id}`)
  }
}