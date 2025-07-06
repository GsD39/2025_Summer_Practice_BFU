import scheduleApi from '@/api/schedule'

export default {
  namespaced: true,
  state: {
  },
  mutations: {
  },
  actions: {
    async fetchGroupSchedule({ commit }, { group, date }) {
      commit('SET_LOADING', true)
      try {
        const response = await scheduleApi.getGroupSchedule(group, date)
        commit('SET_SCHEDULE', response.data)
        return response.data
      } catch (error) {
        commit('SET_ERROR', 'Failed to load group schedule')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async fetchTeacherSchedule({ commit }, { teacher, date }) {
      commit('SET_LOADING', true)
      try {
        const response = await scheduleApi.getTeacherSchedule(teacher, date)
        commit('SET_SCHEDULE', response.data)
        return response.data
      } catch (error) {
        commit('SET_ERROR', 'Failed to load teacher schedule')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async fetchAllLectures({ commit }) {
      commit('SET_LOADING', true)
      try {
        const response = await scheduleApi.getAllLectures()
        commit('SET_SCHEDULE', response.data)
        return response.data
      } catch (error) {
        commit('SET_ERROR', 'Failed to load all lectures')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async createLecture({ commit }, lectureData) {
      commit('SET_LOADING', true)
      try {
        const response = await scheduleApi.createLecture(lectureData)
        commit('ADD_LECTURE', response.data)
        return response.data
      } catch (error) {
        commit('SET_ERROR', 'Failed to create lecture')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
  },
  getters: {
  }
}