import { createStore } from 'vuex'
import auth from './modules/auth'
import schedule from './modules/schedule'

export default createStore({
  modules: {
    auth,
    schedule
  }
})