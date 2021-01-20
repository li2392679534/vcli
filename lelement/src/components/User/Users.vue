<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-input placeholder="请输入内容" class="input-with-select" v-model="page.query" clearable @clear="getlist">
        <el-button slot="append" icon="el-icon-search" @click="SearchUser"></el-button>
      </el-input>
      <el-button type="primary" @click="addFormVisible = true">添加用户</el-button>
      <!-- 添加用户弹框 -->
      <el-dialog @close="addDialogClosed" title="添加用户" :visible.sync="addFormVisible">
        <el-form :model="addFormRef" ref="addFormRef" :rules="rules">
          <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
            <el-input v-model="addFormRef.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
            <el-input v-model="addFormRef.password" autocomplete="off"></el-input> </el-form-item
          ><el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
            <el-input v-model="addFormRef.email" autocomplete="off"></el-input> </el-form-item
          ><el-form-item label="手机号" :label-width="formLabelWidth" prop="mobile">
            <el-input v-model="addFormRef.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 用户列表 -->
      <el-table :data="listdata" border style="width: 100%">
        <el-table-column prop="id" label="#" width="180"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- {{ scope.row }} -->
            <el-switch v-model="scope.row.mg_state" active-color="#409EFF" inactive-color="#DCDFE6" @change="ChangeUserState(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="EditUser(scope.row)"></el-button>
            <!-- 删除 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="Deluser(scope.row.id)"></el-button>
            <!-- 权限管理 -->
            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 修改用户对话框 -->
      <el-dialog @close="editDialogClosed" title="修改用户" :visible.sync="editFormVisible">
        <el-form :model="editForm" ref="editFormRef" :rules="rules">
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="editForm.username" autocomplete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
            <el-input v-model="editForm.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号" :label-width="formLabelWidth" prop="mobile">
            <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="Editsure('editFormRef')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 删除用户对话框 -->
      <el-dialog title="提示" :visible.sync="delVisible" width="30%" center>
        <span :class="['center']">确定要删除这条用户数据吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="delVisible = false">取 消</el-button>
          <el-button type="primary">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[4, 5, 6, 7]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagetotal"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      row: '',
      Search: '',
      addFormRef: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {},
      formLabelWidth: '80px',
      page: {
        query: '',
        pagenum: 1,
        pagesize: 4
      },
      pagetotal: 0,
      listdata: [],
      addFormVisible: false,
      editFormVisible: false,
      delVisible: false,
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 4, max: 6, message: '长度在 4 到 6 个字符', trigger: 'blur' }
        ],
        email: [
          { required: false, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: false, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入正确的手机号码', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  mounted() {
    this.getlist()
  },
  methods: {
    // 每页条数改变
    handleSizeChange(val) {
      this.page.pagesize = val
      this.getlist()
    },
    // 改变当前页码
    handleCurrentChange(val) {
      this.page.pagenum = val
      this.getlist()
    },
    // 获取用户列表
    async getlist() {
      const { data: res } = await this.$http.get('/users', {
        params: this.page
      })
      if (res.meta.status !== 200) {
        return this.$message.error(`${res.meta.msg}`)
      }
      this.$message.success(`${res.meta.msg}`)
      this.listdata = res.data.users
      this.pagetotal = res.data.total
    },
    // 改变用户状态
    async ChangeUserState(row) {
      // console.log(row)
      const { data: res } = await this.$http.put(`users/${row.id}/state/${row.mg_state}`)
      console.log(res)
      if (res.meta.status !== 200) {
        row.mg_state = !row.mg_state
        this.$message.error('状态设置失败！')
      } else {
        this.$message.success('状态设置成功！')
      }
    },
    // 添加用户
    async addUser() {
      const { data: res } = await this.$http.post('/users', this.addFormRef)
      if (res.meta.status !== 201) {
        return this.$message.error(`${res.meta.msg}`)
      }
      this.$message.success(`${res.meta.msg}`)
      this.getlist()
      this.addFormVisible = false
      // this.form = {
      //   username: '',
      //   password: '',
      //   email: '',
      //   mobile: ''
      // }
    },
    // 重置增加表单
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 重置修改表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 搜索用户
    SearchUser() {
      this.getlist()
    },
    // 修改用户
    async EditUser(row) {
      this.editForm = {
        id: row.id,
        username: row.username,
        email: row.email,
        mobile: row.mobile
      }
      this.editFormVisible = true
    },
    // 确认修改
    Editsure(formname) {
      this.$refs[formname].validate(async valid => {
        if (!valid) {
          this.$message.error('格式有错误')
          return false
        } else {
          const { data: res } = await this.$http.put(`/users/${this.editForm.id}`, { email: this.editForm.email, mobile: this.editForm.mobile })
          if (res.meta.status !== 200) {
            return this.$message.error(`${res.meta.msg}`)
          }
          this.$message.success(`${res.meta.msg}`)
          this.editFormVisible = false
          this.getlist()
        }
      })
    },
    // // 删除用户
    async Deluser(id) {
      const confirm = await this.$confirm('请问是否要永久删除该用户？', '删除提示', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {})
      // 取消删除
      if (confirm !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      // 确认删除
      const { data: res } = await this.$http.delete(`users/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getlist()
      // console.log(err)
      // console.log(confirm)
    }
    // Deluser(row) {
    //   this.delVisible = true
    //   this.row = row
    // },
    // // 确认删除
    // async Delsure() {
    //   const { data: res } = await this.$http.delete(`users/${this.row.id}`)
    //   if (res.meta.status !== 200) {
    //     return this.$message.error(res.meta.msg)
    //   }
    //   this.$message.success(res.meta.msg)
    //   this.delVisible = false
    //   this.getlist()
    // }
  }
}
</script>

<style scoped>
.el-button {
  margin-bottom: 20px;
}
.el-input {
  /* margin-right: 20px; */
  margin-bottom: 5px;
}
.center {
  text-align: center;
}
</style>
