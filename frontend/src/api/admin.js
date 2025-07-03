import axios from 'axios'

export default {
  getUsers() {
    return axios.get('/admin/users')
  },
  updateUser(id, data) {
    return axios.put(`/admin/users/${id}`, data)
  },
  deleteUser(id) {
    return axios.delete(`/admin/users/${id}`)
  }
}