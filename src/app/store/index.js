import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import language from './modules/language'
import currency from './modules/currency'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},

  modules: {
    auth,
    language,
    currency,
  }
})
