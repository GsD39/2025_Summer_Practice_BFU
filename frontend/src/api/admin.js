export default {
  getUsers() {
    return axios.get('/api/admin/users')
  },
  createUser(userData) {
    return axios.post('/api/admin/users', userData)
  },
  updateUser(id, userData) {
    return axios.put(`/api/admin/users/${id}`, userData)
  },
  deleteUser(id) {
    return axios.delete(`/api/admin/users/${id}`)
  }
}