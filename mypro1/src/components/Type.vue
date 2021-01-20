<template>
  <div>
    <p>票价信息</p>
    <div class="type">
      <p>单次预定限5张</p>
      <p>
        普通：<span>&yen;325(280+20+15)</span>学生：<span>&yen;299(265+20+15)</span>军人：<span
          >&yen;275(235+20+15)</span
        >
        儿童： <span>&yen;98(65+20+15)</span><a href="#">[说明]</a>
      </p>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.type {
  border: 1px solid skyblue;
  padding: 2rem;
}

.type span {
  color: orange;
  margin-right: 75px;
}

.type a {
  text-decoration: none;
  color: rgb(33, 165, 218);
}
</style>
