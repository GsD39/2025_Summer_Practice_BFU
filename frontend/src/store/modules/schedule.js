// src/store/modules/schedule.js
import scheduleApi from '@/api/schedule'
import { format, addWeeks, startOfWeek, endOfWeek } from 'date-fns'

export default {
  namespaced: true,
  state: {
    // Schedule data
    schedule: [],
    filteredSchedule: [],
    weekSchedule: [],
    
    // Filtering options
    currentFilter: {
      type: 'group', // 'group' or 'teacher'
      value: ''
    },
    
    // Date navigation
    currentWeekOffset: 0,
    
    // Data options for filters
    groups: [],
    teachers: [],
    
    // UI state
    isLoading: false,
    error: null,
    
    // Selected lecture for editing
    selectedLecture: null
  },
  mutations: {
    // Schedule mutations
    SET_SCHEDULE(state, schedule) {
      state.schedule = schedule
    },
    SET_FILTERED_SCHEDULE(state, schedule) {
      state.filteredSchedule = schedule
    },
    SET_WEEK_SCHEDULE(state, schedule) {
      state.weekSchedule = schedule
    },
    
    // Filter mutations
    SET_FILTER(state, filter) {
      state.currentFilter = filter
    },
    
    // Data option mutations
    SET_GROUPS(state, groups) {
      state.groups = groups
    },
    SET_TEACHERS(state, teachers) {
      state.teachers = teachers
    },
    
    // Date navigation
    SET_WEEK_OFFSET(state, offset) {
      state.currentWeekOffset = offset
    },
    
    // UI state
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    
    // Lecture editing
    SET_SELECTED_LECTURE(state, lecture) {
      state.selectedLecture = lecture
    },
    ADD_LECTURE(state, lecture) {
      state.schedule.push(lecture)
    },
    UPDATE_LECTURE(state, updatedLecture) {
      const index = state.schedule.findIndex(l => l.id === updatedLecture.id)
      if (index !== -1) {
        state.schedule.splice(index, 1, updatedLecture)
      }
    },
    DELETE_LECTURE(state, lectureId) {
      state.schedule = state.schedule.filter(l => l.id !== lectureId)
    }
  },
  actions: {
    // Fetch all schedule data
    async fetchSchedule({ commit, dispatch }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        // Fetch all necessary data in parallel
        const [scheduleRes, groupsRes, teachersRes] = await Promise.all([
          scheduleApi.getSchedule(),
          scheduleApi.getGroups(),
          scheduleApi.getTeachers()
        ])
        
        commit('SET_SCHEDULE', scheduleRes.data)
        commit('SET_GROUPS', groupsRes.data)
        commit('SET_TEACHERS', teachersRes.data)
        
        // Apply current filters
        dispatch('applyFilter')
        
        // Load current week schedule
        dispatch('loadWeekSchedule', 0)
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to load schedule data')
        console.error('Schedule fetch error:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    // Apply current filters to schedule
    applyFilter({ commit, state }) {
      if (!state.currentFilter.value) {
        commit('SET_FILTERED_SCHEDULE', state.schedule)
        return
      }
      
      const filtered = state.schedule.filter(lecture => {
        if (state.currentFilter.type === 'group') {
          return lecture.groups.includes(state.currentFilter.value)
        } else {
          return lecture.teacher === state.currentFilter.value
        }
      })
      
      commit('SET_FILTERED_SCHEDULE', filtered)
    },
    
    // Set filter and apply it
    setFilter({ commit, dispatch }, filter) {
      commit('SET_FILTER', filter)
      dispatch('applyFilter')
    },
    
    // Load schedule for a specific week
    async loadWeekSchedule({ commit, state }, weekOffset) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      commit('SET_WEEK_OFFSET', weekOffset)
      
      try {
        // In a real app, this would be an API call:
        // const response = await scheduleApi.getWeekSchedule(weekOffset)
        // commit('SET_WEEK_SCHEDULE', response.data)
        
        // For demo purposes, we'll filter locally
        const startDate = addWeeks(startOfWeek(new Date()), weekOffset)
        const endDate = addWeeks(endOfWeek(new Date()), weekOffset)
        
        const weekSchedule = state.filteredSchedule.filter(lecture => {
          const lectureDate = new Date(lecture.date)
          return lectureDate >= startDate && lectureDate <= endDate
        })
        
        commit('SET_WEEK_SCHEDULE', weekSchedule)
      } catch (error) {
        commit('SET_ERROR', 'Failed to load week schedule')
        console.error('Week schedule error:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    // Select a lecture for editing
    selectLecture({ commit }, lecture) {
      commit('SET_SELECTED_LECTURE', lecture)
    },
    
    // Lecture CRUD operations
    async createLecture({ commit }, lectureData) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        const response = await scheduleApi.createLecture(lectureData)
        commit('ADD_LECTURE', response.data)
        return response.data
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to create lecture')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async updateLecture({ commit }, lectureData) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        const response = await scheduleApi.updateLecture(lectureData.id, lectureData)
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
      commit('SET_ERROR', null)
      
      try {
        await scheduleApi.deleteLecture(lectureId)
        commit('DELETE_LECTURE', lectureId)
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to delete lecture')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    // Navigation actions
    navigateToPreviousWeek({ state, dispatch }) {
      dispatch('loadWeekSchedule', state.currentWeekOffset - 1)
    },
    
    navigateToNextWeek({ state, dispatch }) {
      dispatch('loadWeekSchedule', state.currentWeekOffset + 1)
    },
    
    navigateToCurrentWeek({ dispatch }) {
      dispatch('loadWeekSchedule', 0)
    }
  },
  getters: {
    // Schedule data
    allSchedule: state => state.schedule,
    filteredSchedule: state => state.filteredSchedule,
    weekSchedule: state => state.weekSchedule,
    
    // Filter options
    currentFilter: state => state.currentFilter,
    groups: state => state.groups,
    teachers: state => state.teachers,
    
    // UI state
    isLoading: state => state.isLoading,
    error: state => state.error,
    
    // Selected lecture
    selectedLecture: state => state.selectedLecture,
    
    // Date information
    currentWeekRange: state => {
      const now = new Date()
      const start = addWeeks(startOfWeek(now), state.currentWeekOffset)
      const end = addWeeks(endOfWeek(now), state.currentWeekOffset)
      return {
        start: format(start, 'yyyy-MM-dd'),
        end: format(end, 'yyyy-MM-dd'),
        formatted: `${format(start, 'MMM dd')} - ${format(end, 'MMM dd, yyyy')}`
      }
    },
    
    // Check if schedule is empty
    isEmpty: state => state.schedule.length === 0,
    
    // Get lecture by ID
    getLectureById: state => id => {
      return state.schedule.find(lecture => lecture.id === id)
    }
  }
}