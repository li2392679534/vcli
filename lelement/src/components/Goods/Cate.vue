<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary" @click="Addcat">添加分类</el-button>
        </el-col>
      </el-row>
      <zk-table
        ref="Cat_table"
        index-text="#"
        :data="Catdata"
        :columns="Zkcolumns"
        :stripe="Zkcongig.stripe"
        :border="Zkcongig.border"
        :show-header="Zkcongig.showHeader"
        :show-summary="Zkcongig.showSummary"
        :show-row-hover="Zkcongig.showRowHover"
        :show-index="Zkcongig.showIndex"
        :tree-type="Zkcongig.treeType"
        :is-fold="Zkcongig.isFold"
        :expand-type="Zkcongig.expandType"
        :selection-type="Zkcongig.selectionType"
      >
        <!-- 是否有效 -->
        <template slot="judge" slot-scope="scope">
          <!-- {{ scope.row }} -->
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false"></i>
          <i class="el-icon-error" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="sort" slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="handel" slot-scope="scope">
          <!-- {{ scope.row.children }} -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            @click="DelCat(scope.row)"
          ></el-button>
        </template>
      </zk-table>
      <!-- 分页栏 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 15]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total - 0"
        :current-page="queryInfo.pagenum"
      >
      </el-pagination>
      <!-- 添加分类弹框 -->
      <el-dialog
        title="提示"
        :visible.sync="AddcatVisible"
        width="30%"
        @close="CloseAddcat"
      >
        <el-form
          ref="Add_Cat"
          :model="Addcatform"
          label-width="80px"
          :rules="AddCatrules"
        >
          <el-form-item
            label="分类名称"
            prop="cat_name"
            v-model="Addcatform.cat_name"
          >
            <el-input v-model="Addcatform.cat_name"></el-input>
          </el-form-item>
          <!-- 级联 -->
          <el-form-item label="父级分类">
            <el-cascader
              expandTrigger="hover"
              v-model="selkeys"
              :options="Cat_option"
              :props="cascaderProps"
              @change="parentCateChange"
              clearable
              change-on-select
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="AddcatVisible = false">取 消</el-button>
          <el-button type="primary" @click="AddcatSure">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      Catdata: [],
      Zkcolumns: [
        //   第一列
        {
          label: '分类名称',
          prop: 'cat_name',
          width: '400px'
        },
        // 第二列
        {
          label: '是否有效',
          prop: '',
          type: 'template',
          template: 'judge',
          minWidth: '50px'
        },
        // 第三列
        {
          label: '排序',
          prop: '',
          type: 'template',
          template: 'sort'
        },
        // 第四列
        {
          label: '操作',
          prop: '',
          minWidth: '200px',
          type: 'template',
          template: 'handel'
        }
      ],
      // ZK表格的属性配置
      Zkcongig: {
        stripe: false,
        border: true,
        showHeader: true,
        showSummary: false,
        showRowHover: true,
        showIndex: true,
        treeType: true,
        isFold: true,
        expandType: false,
        selectionType: false
      },
      total: '',
      //   查询参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //   弹框
      AddcatVisible: false,
      //   增加分类表单
      Addcatform: {
        cat_pid: '',
        cat_name: '',
        cat_level: ''
      },
      // 级联数据源
      Cat_option: [],
      // 被选中的key
      selkeys: [],
      // 级联配置
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 添加分类的验证规则
      AddCatrules: {
        cat_name: [
          {
            required: true,
            message: '请输入活动名称',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 5,
            message: '长度在 3 到 5 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted() {
    this.getCatelist()
  },
  methods: {
    // 删除分类
    async DelCat(row) {
      const confirm = await this.$confirm('你确定要删除此分类？', '提示', {
        confirmButtontext: '确定删除',
        cancelButtontext: '取消',
        type: 'warning'
      }).catch(() => {})
      if (confirm === 'confirm') {
        const { data: res } = await this.$http.delete(
          `categories/${row.cat_id}`
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getCatelist()
        // row.children = res.data
      } else {
        this.$message.info('已取消删除')
      }
    },
    // 获取级联父级分类数据列表
    async getCat_option() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: [2] }
      })
      console.log(res.data)
      this.Cat_option = res.data
    },
    // 父级分类级联变换时
    parentCateChange() {
      console.log(this.selkeys)
      if (this.selkeys.length > 0) {
        this.Addcatform.cat_pid = this.selkeys[this.selkeys.length - 1]
        this.Addcatform.cat_level = this.selkeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    //   添加分类
    Addcat() {
      this.getCat_option()
      this.AddcatVisible = true
    },
    // 添加分类（确认）
    AddcatSure() {
      this.$refs.Add_Cat.validate(async valid => {
        if (!valid) {
          return this.$message.error('添加失败')
        } else {
          const { data: res } = await this.$http.post(
            'categories',
            this.Addcatform
          )
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
          this.AddcatVisible = false
          this.getCatelist()
        }
      })
    },
    // 关闭添加框
    CloseAddcat() {
      this.$refs.Add_Cat.resetFields()
      this.selkeys = []
      this.Addcatform.cat_pid = 0
      this.Addcatform.cat_level = 0
    },
    //   获取商品列表
    async getCatelist() {
      const { data: res } = await this.$http.get('/categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.Catdata = res.data.result
      this.total = res.data.total
      this.Cat_option = res.data.result
    },
    // 每页val条数据
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.queryInfo.pagesize = val
      this.getCatelist()
    },
    // 当前是第val页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.queryInfo.pagenum = val
      this.getCatelist()
    }
  }
}
</script>
<style scoped>
.el-col.el-col-24 .el-button--primary {
  margin-bottom: 15px;
}
.el-icon-success {
  color: rgba(24, 206, 24, 0.979);
}
.el-icon-error {
  color: crimson;
}
.el-input {
  margin-bottom: 5px;
}
</style>
