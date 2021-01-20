<template>
  <div>
    <h3>当前最新的count值为：{{ $store.state.count }}</h3>
    <button @click="subnum">减减</button>
    <button @click="subtime">延时减</button>
  </div>
</template>

<script>
// import { mapState } from 'vuex'
export default {
  data() {
    return {}
  },
  // computed: {
  //   ...mapState(['count'])
  // },
  methods: {
    subnum() {
      this.$store.commit('sub', 5)
    },
    subtime() {
      this.$store.dispatch('subasync', 50)
    }
  }
}
</script>

<style scoped>
</style>
