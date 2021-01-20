import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    // 加2
    add(state, step) {
      state.count += step
      console.log(state)
    },
    sub(state, step) {
      state.count -= step
    }
  },
  actions: {
    addasync(context, step) {
      console.log(context)
      setTimeout(() => {
        context.commit('add', step)
      }, 2000)
    },
    subasync(context, step) {
      setTimeout(() => {
        context.commit('sub', step)
      }, 2000)
    }
  },
  modules: {}
})
