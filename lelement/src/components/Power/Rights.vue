<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table border :data="listdata" stripe style="width: 100%">
        <el-table-column label="#" width="80" type="index"> </el-table-column>
        <el-table-column prop="authName" label="权限名称" width="500"> </el-table-column>
        <el-table-column prop="path" label="路径" width="500"> </el-table-column>
        <el-table-column prop="level" label="权限等级" width="500">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">等级一</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">等级二</el-tag>
            <el-tag type="danger" v-else>等级三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      listdata: []
    }
  },
  mounted() {
    this.getlist()
  },
  methods: {
    async getlist() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error(`${res.meta.msg}`)
      }
      this.$message.success(`${res.meta.msg}`)
      console.log(res)
      this.listdata = res.data
    }
  }
}
</script>

<style scoped></style>
