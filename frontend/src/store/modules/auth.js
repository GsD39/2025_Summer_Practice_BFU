import authApi from '@/api/auth'

export default {
  namespaced: true,
  state: {
    user: null,
    token: localStorage.getItem('token') || null
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_TOKEN(state, token) {
      state.token = token
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    },
    CLEAR_AUTH(state) {
      state.user = null
      state.token = null
      localStorage.removeItem('token')
    }
  },
  actions: {
    async login({ commit, dispatch }, credentials) {
      try {
        const response = await authApi.login(credentials)
        commit('SET_TOKEN', response.data.token)
        commit('SET_USER', response.data.user)
        return response.data
      } catch (error) {
        commit('CLEAR_AUTH')
        throw error
      }
    },
    
    async logout({ commit }) {
      try {
        await authApi.logout()
      } catch (error) {
        console.error('Logout API error:', error)
      }
      commit('CLEAR_AUTH')
    },
    
    async fetchUser({ commit, state }) {
      if (!state.token) return
      
      try {
        const response = await authApi.getUser()
        commit('SET_USER', response.data)
      } catch (error) {
        commit('CLEAR_AUTH')
        throw error
      }
    }
  },
  getters: {
    isAuthenticated: state => !!state.token,
    isAdmin: state => state.user?.role === 'admin',
    currentUser: state => state.user
  }
}