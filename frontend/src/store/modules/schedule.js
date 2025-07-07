import scheduleApi from '@/api/schedule'

export default {
  namespaced: true,
  state: {
    lectures: [],
    groups: [],
    subjects: [],
    teachers: [],
    schedule: [],
    isLoading: false,
    error: null,
    filters: {
      day: '',
      teacher: '',
      group: ''
    }
  },
  mutations: {
    SET_LECTURES(state, lectures) {
      state.lectures = lectures;
    },
    SET_GROUPS(state, groups) {
      state.groups = groups
    },
    SET_SUBJECTS(state, subjects) {
      state.subjects = subjects
    },
    SET_TEACHERS(state, teachers) {
      state.teachers = teachers
    },
    SET_SCHEDULE(state, schedule) {
      state.schedule = schedule
    },
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    SET_FILTER(state, { key, value }) {
      state.filters[key] = value
    },
    ADD_LECTURE(state, lecture) {
      state.lectures.push(lecture)
    },
    UPDATE_LECTURE(state, updatedLecture) {
      const index = state.lectures.findIndex(l => l.id === updatedLecture.id);
      if (index !== -1) {
        state.lectures = [
          ...state.lectures.slice(0, index),
          updatedLecture,
          ...state.lectures.slice(index + 1)
        ];
      }
    },
    REMOVE_LECTURE(state, lectureId) {
      state.lectures = state.lectures.filter(l => l.id !== lectureId)
    }
  },
  actions: {
    async fetchGroupSchedule({ commit }, { group, date }) {
      commit('SET_LOADING', true)
      try {
        const response = await scheduleApi.getGroupSchedule(group, date)
		console.log(response.data);
        commit('SET_SCHEDULE', response.data)
        return response.data
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to load group schedule')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async fetchTeacherSchedule({ commit }, { teacher, date }) {
      commit('SET_LOADING', true)
      try {
        const response = await scheduleApi.getTeacherSchedule(teacher, date)
		console.log(response.data);
        commit('SET_SCHEDULE', response.data)
        return response.data
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to load teacher schedule')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async fetchAllLectures({ commit }) {
      commit('SET_LOADING', true);
      try {
        const response = await scheduleApi.getAllLectures();
		console.log( "response data!", response.data);
        commit('SET_LECTURES', JSON.parse(response.data));
        return response.data;
      } catch (error) {
        if (error.message === "Network Error") {
          commit('SET_ERROR', 'Backend server unavailable. Please try again later.');
        } else {
          commit('SET_ERROR', error.response?.data?.message || 'Failed to load lectures');
        }
      } finally {
        commit('SET_LOADING', false);
      }
    },
	
	async fetchGroups({ commit }) {
      commit('SET_LOADING', true);
      try {
		  
        const response = await scheduleApi.getGroups();
		    console.log(response.data);
        commit('SET_GROUPS', JSON.parse(JSON.stringify(response.data)));
        return response.data;
      } catch (error) {
        if (error.message === "Network Error") {
          commit('SET_ERROR', 'Backend server unavailable. Please try again later.');
        } else {
          commit('SET_ERROR', error.response?.data?.message || 'Failed to load groups');
        }
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async fetchSubjects({ commit }) {
      commit('SET_LOADING', true);
      try {
        const response = await scheduleApi.getSubjects();
		    console.log(response.data);
        commit('SET_SUBJECTS', JSON.parse(JSON.stringify(response.data)));
        return response.data;
      } catch (error) {
        if (error.message === "Network Error") {
          commit('SET_ERROR', 'Backend server unavailable. Please try again later.');
        } else {
          commit('SET_ERROR', error.response?.data?.message || 'Failed to load subjects');
        }
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async createLecture({ commit }, lectureData) {
      commit('SET_LOADING', true)
      try {
        const response = await scheduleApi.createLecture(lectureData)
		console.log(response.data);
        commit('ADD_LECTURE', response.data)
        return response.data
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to create lecture')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async updateLecture({ commit }, { id, data }) {
      commit('SET_LOADING', true)
      try {
        const response = await scheduleApi.updateLecture(id, data)
		console.log(response.data);
        commit('UPDATE_LECTURE', response.data)
        return response.data
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to update lecture')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async deleteLecture({ commit }, lectureId) {
      commit('SET_LOADING', true)
      try {
        await scheduleApi.deleteLecture(lectureId)
        commit('REMOVE_LECTURE', lectureId)
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to delete lecture')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    
    async fetchTeachers({ commit }) {
      try {
        const response = await scheduleApi.getTeachers()
		console.log(response.data);
        commit('SET_TEACHERS', JSON.parse(JSON.stringify(response.data)))
        return response.data
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to load teachers')
        throw error
      }
    },
    
    setFilter({ commit }, { key, value }) {
      commit('SET_FILTER', { key, value })
    }
  },
  getters: {        
    isLoading: (state) => state.isLoading,
    error: (state) => state.error,
    groups: (state) => state.groups,
    subjects: (state) => state.subjects,
    teachers: (state) => state.teachers,
    currentFilters: (state) => state.filters
  }
}