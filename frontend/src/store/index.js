import { createStore } from 'vuex'
import auth from './modules/auth'
import schedule from './modules/schedule'
import admin from './modules/admin'

export default createStore({
  modules: {
    auth,
    schedule,
    admin
  }
})