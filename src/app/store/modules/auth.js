import axios from 'axios'
import { api } from '../../api'
export default ({
  state: {
    status: '',
    sessionID: localStorage.getItem('sessionID') || '',
    user: {},
    message: ''
  },
  getters: {
    isLoggedIn: state => !!state.sessionID,
    authStatus: state => state.status,
    authMessage: state => state.message,
    user: state => state.user,
    sessionID: state => state.sessionID
  },
  mutations: {
    auth_request(state) {
      state.status = 'loading'
    },
    auth_success(state, data) {
      state.status = 'success'
      state.sessionID = data.sessionID
      state.user = data.userInfos
    },
    auth_error(state) {
      state.status = 'error'
    },
    auth_message(state, message) {
      state.message = message
    },
    logout(state) {
      state.status = ''
      state.sessionID = ''
    }
  },
  actions: {
    login({commit}, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios({url: api + '/login', data: user, method: 'POST' })
          .then(resp => {
            let data = {
              sessionID: resp.data.sessionID,
              userInfos: resp.data.userInfos
            }

            if (data.sessionID) {
              localStorage.setItem('sessionID', data.sessionID)
            }
            commit('auth_success', data)
            commit('auth_message', resp.data.message)
            resolve(resp)
          })
          .catch(err => {
            commit('auth_error')
            commit('logout')
            localStorage.removeItem('sessionID')
          })
      })
    },
    register({commit}, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios({url: api + '/register', data: user, method: 'POST' })
          .then(resp => {

            commit('auth_message', resp.data.message)
            resolve(resp)
          })
          .catch(err => {
            commit('auth_error', err)
            localStorage.removeItem('sessionID')
            reject(err)
          })
      })
    },
    forgotPassword({commit}, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios({url: api + '/resetpassword', data: user, method: 'POST' })
          .then(resp => {

            commit('auth_message', resp.data.message)
            resolve(resp)
          })
          .catch(err => {
            commit('auth_error', err)
            localStorage.removeItem('sessionID')
            reject(err)
          })
      })
    },
    logout({commit}) {
      return new Promise((resolve, reject) => {
        commit('logout');
        localStorage.removeItem('sessionID');
        resolve()
      })
    }
  }
})
