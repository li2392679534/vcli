<template>
  <div>
    <!-- 面包屑导航  -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <el-input
        placeholder="请输入内容"
        v-model="queryInfo.query"
        class="input-with-select"
        clearable
        @clear="getGoodList"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchGoods"
        ></el-button>
      </el-input>
      <el-button type="primary" @click="addGoods">添加商品</el-button>
      <el-table :data="GoodList" stripe border style="width: 100%">
        <el-table-column type="index" label="#" width="60"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="700">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格（元）">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量">
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{ (scope.row.add_time * 1000) | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- {{ scope.row }} -->
            <el-button
              type="primary"
              class="el-icon-s-tools"
              size="mini"
              @click="editGoods(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              class="el-icon-delete"
              size="mini"
              @click="deleteGood(scope.row.goods_id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 50, 100, 150]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品列表数据
      GoodList: [],
      // 查询参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品总数
      total: 0,
      // 搜索栏
      search: ''
    }
  },
  mounted() {
    this.getGoodList()
  },
  methods: {
    // 获取商品列表
    async getGoodList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.GoodList = res.data.goods
      this.total = res.data.total
    },
    // 修改商品
    editGoods() {},
    // 删除商品
    deleteGoods() {},
    // 每页几条
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getGoodList()
    },
    // 当前第几页
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getGoodList()
    },
    // 搜索商品
    searchGoods() {
      // this.queryInfo.query = this.search
      this.getGoodList()
    },
    // 删除商品
    async deleteGood(id) {
      const confirm = await this.$confirm('你确定要删除吗？', '提示', {
        confirmButtontext: '确定删除',
        cancelButtontext: '取消',
        type: 'warning'
      }).catch(() => {})
      if (confirm === 'confirm') {
        const { data: res } = await this.$http.delete(`goods/${id}`)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.getGoodList()
      } else {
        this.$message.info('已取消删除')
      }
    },
    // 添加商品
    addGoods() {
      this.$router.push('/add')
    }
  }
}
</script>

<style scoped></style>
