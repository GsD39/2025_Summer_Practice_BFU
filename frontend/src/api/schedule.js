import axios from 'axios'

export default {
  getSchedule() {
    return axios.get('/schedule')
  },
  
  getWeekSchedule(weekOffset) {
    return axios.get(`/schedule/week?offset=${weekOffset}`)
  },
  
  getGroups() {
    return axios.get('/schedule/groups')
  },
  
  getTeachers() {
    return axios.get('/schedule/teachers')
  },
  
  createLecture(lectureData) {
    return axios.post('/schedule', lectureData)
  },
  
  updateLecture(lectureId, updateData) {
    return axios.put(`/schedule/${lectureId}`, updateData)
  },
  
  deleteLecture(lectureId) {
    return axios.delete(`/schedule/${lectureId}`)
  }
}