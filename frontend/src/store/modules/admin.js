import adminApi from '@/api/admin'

export default {
  namespaced: true,
  state: {
    users: [],
    isLoading: false,
    error: null
  },
  mutations: {
    SET_USERS(state, users) {
      state.users = users
    },
    ADD_USER(state, user) {
      state.users.push(user)
    },
    UPDATE_USER(state, updatedUser) {
      const index = state.users.findIndex(u => u.id === updatedUser.id)
      if (index !== -1) {
        state.users.splice(index, 1, updatedUser)
      }
    },
    REMOVE_USER(state, userId) {
      state.users = state.users.filter(u => u.id !== userId)
    },
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  },
  actions: {
    async fetchUsers({ commit }) {
      commit('SET_LOADING', true)
      try {
        const response = await adminApi.getUsers()
        commit('SET_USERS', response.data)
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch users')
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async createUser({ commit }, userData) {
      commit('SET_LOADING', true)
      try {
        const response = await adminApi.createUser(userData)
        commit('ADD_USER', response.data)
        return response.data
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to create user')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async updateUser({ commit }, { id, ...updateData }) {
      commit('SET_LOADING', true)
      try {
        const response = await adminApi.updateUser(id, updateData)
        commit('UPDATE_USER', response.data)
        return response.data
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to update user')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async deleteUser({ commit }, userId) {
      commit('SET_LOADING', true)
      try {
        await adminApi.deleteUser(userId)
        commit('REMOVE_USER', userId)
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to delete user')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    }
  }
}