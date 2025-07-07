import axios from 'axios'

export default {
  getGroupSchedule(groupName, date = null) {
    const params = date ? { date } : {}
    return axios.get(`/schedule/group/${groupName}`, { params })
  },
  
  getTeacherSchedule(teacherName, date = null) {
    const params = date ? { date } : {}
    return axios.get(`/schedule/teacher/${teacherName}`, { params })
  },
  
  createLecture(lectureData) {
    console.log("createLecture", lectureData, axios.post('/schedule/', lectureData));
    return axios.post('/schedule/', lectureData)
  },
  createLecturesBatch(lectures) {
    return axios.post('/schedule/batch', lectures)
  },
  getAllLectures() {
    console.log("getAllLectures", axios.get('/schedule/admin/all'));
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