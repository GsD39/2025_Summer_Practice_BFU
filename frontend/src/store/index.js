import { createStore } from 'vuex'
import auth from './modules/auth'
import schedule from './modules/schedule'
import admin from './modules/admin'
import i18n from '@/i18n'

export default createStore({
  getters: {
    t: () => (key) => i18n.global.t(key)
  },
  modules: {
    auth,
    schedule,
    admin
  }
})