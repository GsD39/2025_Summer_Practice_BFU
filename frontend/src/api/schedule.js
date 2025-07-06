import axios from 'axios'

export default {
  getGroupSchedule(groupName, date = null) {
    const params = date ? { date } : {}
    return axios.get(`/api/schedule/group/${groupName}`, { params })
  },
  
  getTeacherSchedule(teacherName, date = null) {
    const params = date ? { date } : {}
    return axios.get(`/api/schedule/teacher/${teacherName}`, { params })
  },
  
  createLecture(lectureData) {
    return axios.post('/api/schedule/', lectureData)
  },
  createLecturesBatch(lectures) {
    return axios.post('/api/schedule/batch', lectures)
  },
  getAllLectures() {
    return axios.get('/api/schedule/admin/all')
  },
  deleteLecture(lectureId) {
    return axios.delete(`/api/schedule/${lectureId}`)
  },
  
  getGroups() {
    return axios.get('/api/schedule/groups')
  },
  getTeachers() {
    return axios.get('/api/schedule/teachers')
  }
}