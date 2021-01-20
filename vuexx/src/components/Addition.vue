<template>
  <div>
    <h3>当前最新的count值为：{{ count }}</h3>
    <button @click="addnum">加5</button>
    <button @click="addtime">延时加</button>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'
export default {
  data() {
    return {}
  },
  methods: {
    ...mapMutations(['add']), // 获得mapMutations映射的add函数
    addnum() {
      this.add(10) // 传参调用mutation里的函数
    },
    ...mapActions(['addasync']), // 获得map映射的addasync函数
    addtime() {
      this.addasync(99)
    }
  },
  computed: {
    ...mapState(['count']) // state中的数据映射为计算属性
  }
}
</script>

<style scoped>
</style>
