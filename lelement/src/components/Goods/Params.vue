<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-alert
        title="注意只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
      ></el-alert>
      <!-- 选择商品分类的级联选择框 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            expandTrigger="hover"
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-row>
            <el-button
              type="primary"
              :disabled="buttonIsable"
              size="mini"
              @click="addCat"
              >添加参数</el-button
            >
            <!-- 展开表格 -->
            <el-table :data="manyData" style="width: 100%" border>
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form
                    label-position="left"
                    inline
                    class="demo-table-expand"
                  >
                    <el-form-item>
                      <!-- <span>{{ props.row.attr_vals }}</span> -->
                      <!-- tag标签 -->
                      <el-tag
                        :key="i"
                        v-for="(item, i) in props.row.attr_vals"
                        closable
                        :disable-transitions="false"
                        @close="handleClose(i, props.row)"
                      >
                        {{ item }}
                      </el-tag>
                      <!-- {{ props.row }} -->
                      <el-input
                        class="input-new-tag"
                        v-if="inputVisible"
                        v-model="inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(props.row)"
                        @blur="handleInputConfirm(props.row)"
                      >
                      </el-input>
                      <el-button
                        v-else
                        class="button-new-tag"
                        size="small"
                        @click="showInput(props.row)"
                        >+ New Tag</el-button
                      >
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column type="index" label="#"> </el-table-column>
              <el-table-column label="参数名称" prop="attr_name">
              </el-table-column>
              <!-- 操作 -->
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size="small"
                    >编辑</el-button
                  >
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="small"
                    @click="delParams(scope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-row>
            <el-button
              type="primary"
              :disabled="buttonIsable"
              size="mini"
              @click="addCat"
              >添加属性</el-button
            >
            <!-- 展开表格 -->
            <el-table :data="onlyData" style="width: 100%" border>
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form
                    label-position="left"
                    inline
                    class="demo-table-expand"
                  >
                    <!-- tag标签 -->
                    <el-tag
                      :key="i"
                      v-for="(item, i) in props.row.attr_vals"
                      closable
                      :disable-transitions="false"
                      @close="handleClose(i, props.row)"
                    >
                      {{ item }}
                    </el-tag>
                    <el-input
                      class="input-new-tag"
                      v-if="inputVisible"
                      v-model="inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(props.row)"
                      @blur="handleInputConfirm(props.row)"
                    >
                    </el-input>
                    <el-button
                      v-else
                      class="button-new-tag"
                      size="small"
                      @click="showInput"
                      >+ New Tag</el-button
                    >
                    <!-- {{ props.row }} -->
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column type="index" label="#"></el-table-column>
              <el-table-column label="属性名称" prop="attr_name">
              </el-table-column>
              <!-- 操作 -->

              <el-table-column label="操作"
                ><template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size="small"
                    >编辑</el-button
                  >
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="small"
                    @click="delParams(scope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加对话框 -->
    <el-dialog
      :title="'添加' + dialogName"
      :visible.sync="addCatFormVisible"
      @close="addCatClose"
    >
      <el-form :model="addCatForm" :rules="addCatFormRule" ref="addCatFormRef">
        <el-form-item
          :label="dialogName"
          :label-width="formLabelWidth"
          prop="attr_name"
        >
          <el-input
            v-model="addCatForm.attr_name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCatFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCatsure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // taginput框
      inputVisible: false,
      // tag输入框绑定
      inputValue: '',
      // 级联变化
      change: false,
      // 添加验证
      addCatFormRule: {
        attr_name: [
          { required: true, message: '属性名不能为空', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ]
      },
      //   添加对话框
      addCatFormVisible: false,
      formLabelWidth: '80px',
      // 添加属性表单
      addCatForm: {
        attr_name: ''
      },
      // 动态标签组
      manyTag: [],
      // 动态参数列表
      manyData: [],
      //   静态属性列表
      onlyData: [],
      //  卡片默认选中第一个,被选中的标签页name
      activeName: 'many',
      //    级联分类列表
      cateList: [],
      //    级联配置
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover'
      },
      //   级联被选中的key
      selectedCateKeys: []
    }
  },
  mounted() {
    this.getCatList()
  },
  methods: {
    // 确定tag输入内容
    handleInputConfirm(row) {
      if (this.inputValue.trim().length === 0) {
        this.inputVisible = false
        this.inputValue = ''
        return null
      }
      row.attr_vals.push(this.inputValue.trim())
      this.inputVisible = false
      this.inputValue = ''
      this.saveAttrVals(row)
    },
    // 显示tag输入框
    showInput(row) {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除tag
    handleClose(index, row) {
      row.attr_vals.splice(index, 1)
      this.saveAttrVals(row)
    },
    // 保存修改tag后的row
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    //   获取级联分类列表
    async getCatList() {
      const { data: res } = await this.$http.get('categories')
      this.cateList = res.data
    },
    // 获取动态参数or静态属性数据
    async getParams() {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )
      // attr_vals字符串变数组
      if (this.change) {
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
      }
      this.manyData = res.data
      this.onlyData = res.data
    },
    // 级联变化事件
    async handleChange() {
      if (this.selectedCateKeys.length === 0) {
        this.getCatList()
        return false
      }
      this.change = true
      this.getParams()
    },
    // 标签页点击事件
    handleClick() {
      if (this.selectedCateKeys.length === 0) {
        this.$message.error('未选择商品分类')
        return null
      }
      this.getParams()
    },
    // 打开添加属性对话框
    addCat() {
      this.addCatFormVisible = true
    },
    // 确定添加属性
    addCatsure() {
      this.$refs.addCatFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post(
            `categories/${this.cateId}/attributes`,
            {
              attr_name: this.addCatForm.attr_name,
              attr_sel: this.activeName
            }
          )
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
        } else {
          this.$message.error('格式输入错误')
        }
        this.getParams()
        this.addCatFormVisible = false
      })
    },
    // 关闭后清除增加表单
    addCatClose() {
      this.$refs.addCatFormRef.resetFields()
    },
    // 删除属性
    async delParams(row) {
      console.log(row)
      const confirm = await this.$confirm('你确定要删除此参数？', '提示', {
        confirmButtontext: '确定删除',
        cancelButtontext: '取消',
        type: 'warning'
      }).catch(() => {})
      if (confirm !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(
        `categories/${row.cat_id}/attributes/${row.attr_id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getParams()
    }
  },
  computed: {
    buttonIsable() {
      return this.selectedCateKeys.length !== 3
    },
    // 获取第三级id
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[this.selectedCateKeys.length - 1]
      }
      return null
    },
    dialogName() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>

<style scoped>
.el-alert--warning.is-light {
  margin-bottom: 15px;
}
.el-button--primary.is-disabled {
  margin-bottom: 15px;
}
.el-button.el-button--primary.el-button--mini {
  margin-bottom: 15px;
}
.el-tag {
  margin: 5px;
}
.el-form--inline .el-form-item {
  margin-bottom: 0;
}
.input-new-tag {
  width: 88.8px;
  margin-bottom: 0px;
}
</style>
