import axios from 'axios'

export default {
  getUsers() {
    return axios.get('/admin/users/all')
  },
  
  createUser(userData) {
    return axios.post('/admin/users', userData)
  },
  
  createUsersBatch(users) {
    return axios.post('/admin/users/batch', users)
  },
  
  updateUser(id, userData) {
    return axios.put(`/admin/users/${id}`, userData)
  },
  
  deleteUser(id) {
    return axios.delete(`/admin/users/${id}`)
  },
}