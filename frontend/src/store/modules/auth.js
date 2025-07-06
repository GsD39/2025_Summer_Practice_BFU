import authApi from '@/api/auth'

export default {
  namespaced: true,
  state: {
    user: null,
    token: localStorage.getItem('token') || null
  },
  mutations: {
    SET_ROLE(state, role) {
      state.role = role
      console.log(state.role === 'admin')
    },
    SET_TOKEN(state, token) {
      state.token = token;
      console.log(!!state.token)
      localStorage.setItem('token', token);
    },
    CLEAR_AUTH(state) {
      state.role = null
      state.token = null
      localStorage.removeItem('token')
    }
  },
  actions: {
    async login({ commit, dispatch }, credentials) {
      try {
        const response = await authApi.login(credentials)
        console.log(response.data)
        console.log(response.data.access_token)
        console.log(response.data.role)
        commit('SET_TOKEN', response.data.access_token)
        commit('SET_ROLE', response.data.role)
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
        commit('SET_ROLE', response.data)
      } catch (error) {
        commit('CLEAR_AUTH')
        throw error
      }
    }
  },
  getters: {
    isAuthenticated: state => !!state.token,
    isAdmin: state => state.role === 'admin',
  }
}