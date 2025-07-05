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
      localStorage.setItem('token', token)
    },
    CLEAR_AUTH(state) {
      state.user = null
      state.token = null
      localStorage.removeItem('token')
    }
  },
  actions: {
    async login({ commit }, credentials) {
      const response = await authApi.login(credentials)
      commit('SET_USER', response.data.user)
      commit('SET_TOKEN', response.data.token)
    },
    async logout({ commit }) {
      await authApi.logout()
      commit('CLEAR_AUTH')
    },
    async fetchUser({ commit, state }) {
      if (!state.token) return
      
      try {
        const response = await authApi.getUser()
        commit('SET_USER', response.data)
      } catch (error) {
        commit('CLEAR_AUTH')
      }
    }
  },
  getters: {
    isAuthenticated: state => !!state.token,
    isAdmin: state => state.user?.role === 'admin',
    currentUser: state => state.user
  }
}