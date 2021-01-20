<template>
  <div class="container">
    <type></type>
    <person></person>
  </div>
</template>

<script>
import Person from './components/Person.vue'
import Type from './components/Type'
export default {
  components: {
    type: Type,
    person: Person
  }
}
</script>

<style>
* {
  box-sizing: border-box;
}

.container {
  width: 1200px;
  margin: 0 auto;
}
</style>
