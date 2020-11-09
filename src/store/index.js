import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    id: window.sessionStorage.getItem('id')
  },
  mutations: {
    recordId(state, params) {
      state.id = params
      window.sessionStorage.setItem("id", params)
    }
  },
  actions: {
  },
  modules: {
  }
})
