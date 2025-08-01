import axios from 'axios'

export default {
  getGroupSchedule(groupName, date = null) {
    console.log("PRINTING FRICKEIN REQUEST I sent", groupName)
    console.log("PRINTING FRICKEIN REQUEST", axios.get(`/schedule/group/${groupName}`))
    const params = date ? { date } : {}
    if (date == null) {
      return axios.get(`/schedule/group/${groupName}`)
    } else {
      return axios.get(`/schedule/group/${groupName}`, { params })
    }
  },
  
  getTeacherSchedule(teacherName, date = null) {
    const params = date ? { date } : {}
    return axios.get(`/schedule/teacher/${teacherName}`, { params })
  },
  
  createLecture(lectureData) {
    return axios.post('/schedule/', lectureData)
  },
  createLecturesBatch(lectures) {
    return axios.post('/schedule/batch', lectures)
  },
  getAllLectures() {
    return axios.get('/schedule/admin/all')
  },
  deleteLecture(lectureId) {
    return axios.delete(`/schedule/${lectureId}`)
  },
  getGroups() {
    return axios.get('/schedule/groups')
  },
  getTeachers() {
    return axios.get('/schedule/teachers');
  },
  getSubjects() {
    return axios.get('/schedule/subjects');
  },
  updateLecture(lectureId, lectureData) {
    return axios.put(`/schedule/${lectureId}`, lectureData);
  },
}