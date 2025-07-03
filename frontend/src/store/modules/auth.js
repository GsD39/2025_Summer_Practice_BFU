import authApi from '@/api/auth'

export default {
  namespaced: true,
  state: {
    user: null,
    token: null
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_TOKEN(state, token) {
      state.token = token
    }
  },
  actions: {
    async login({ commit }, credentials) {
      const response = await authApi.login(credentials)
      commit('SET_USER', response.data.user)
      commit('SET_TOKEN', response.data.token)
    },
    async register({ commit }, userData) {
      const response = await authApi.register(userData)
      commit('SET_USER', response.data.user)
      commit('SET_TOKEN', response.data.token)
    },
    async logout({ commit }) {
      await authApi.logout()
      commit('SET_USER', null)
      commit('SET_TOKEN', null)
    },
    async fetchUser({ commit }) {
      try {
        const response = await authApi.getUser()
        commit('SET_USER', response.data)
      } catch (error) {
        commit('SET_USER', null)
      }
    }
  },
  getters: {
    isAuthenticated: state => !!state.user,
    isAdmin: state => state.user?.role === 'admin',
    currentUser: state => state.user
  }
}