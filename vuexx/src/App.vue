<template>
  <div>
    <Add></Add>
    <hr />
    <Sub></Sub>
  </div>
</template>

<script>
import Add from './components/Addition.vue'
import Sub from './components/Sub.vue'

export default {
  components: { Add, Sub }
}
</script>

<style>
button {
  width: 70px;
  height: 70px;
}
</style>
