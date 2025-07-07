import authApi from '@/api/auth'
import { setAuthToken } from '@/utils/auth'


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
		setAuthToken(response.data.access_token)
        return response.data
      } catch (error) {
        commit('CLEAR_AUTH')
		setAuthToken(null)
        return error       //TODO Doesn't show error to user
      }
    },
    
    async logout({ commit }) {
      try {
        await authApi.logout()
      } catch (error) {
        if (error.response?.status === 401) {
          console.warn('Logout with expired token')
        } else {
          console.error('Logout API error:', error)
        }
      } finally {
        commit('CLEAR_AUTH')
      }
    },
    
    async fetchUser({ commit, state }) {
      if (!state.token) return
      
      try {
		console.warn(localStorage.getItem('token'))
		setAuthToken(localStorage.getItem('token'))  
        const response = await authApi.getUser()
        commit('SET_ROLE', response.data)
		commit('SET_TOKEN', response.data.access_token)
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