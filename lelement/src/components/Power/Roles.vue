<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/home">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button type="primary" @click="addRoles">添加角色</el-button>
      <!-- 表格 -->
      <el-table border :data="datalist">
        <!-- 可展开表格 -->
        <el-table-column type="expand">
          <!-- 插槽模板 -->
          <template slot-scope="props">
            <el-row :class="['bb', index1 === 0 ? 'bt' : '', 'vcenter']" v-for="(item1, index1) in props.row.children" :key="item1.id">
              <!-- 第一级权限 -->
              <el-col :span="5">
                <el-tag type="primary" plain closable @close="RemoveTag(props.row, item1.id)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row :class="[index2 === 0 ? '' : 'bt', 'vcenter']" v-for="(item2, index2) in item1.children" :key="item2.id">
                  <!-- 第二级权限 -->
                  <el-col :span="6">
                    <el-tag type="success" plain closable @close="RemoveTag(props.row, item2.id)">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 第三级权限 -->
                  <el-col :span="18">
                    <el-tag closable type="warning" plain v-for="item3 in item2.children" :key="item3.id" @close="RemoveTag(props.row, item3.id)"
                      >{{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{ props.row }}</pre> -->
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRole(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRole(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="getRights(scope.row)">分配权限</el-button>
            <!-- {{ scope.row }} -->
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限弹出框 -->
    <el-dialog title="分配权限" :visible.sync="rightsVisible" width="30%">
      <el-tree
        ref="treeRef"
        :data="Rightlist"
        show-checkbox
        node-key="id"
        :props="treeProps"
        :default-expanded-keys="[101, 102, 103, 125, 145]"
        :default-checked-keys="Defkey"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightsVisible = false">取 消</el-button>
        <el-button type="primary" @click="giveRights()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加用户弹出框 -->
    <el-dialog title="添加角色" :visible.sync="adduserFormVisible">
      <el-form :model="Roles" :rules="rules">
        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
          <el-input v-model="Roles.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth">
          <el-input v-model="Roles.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="adduserFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRolessure">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑角色弹出框 -->
    <el-dialog title="修改角色" :visible.sync="editFormVisible">
      <el-form :model="editRoles" :rules="rules">
        <el-form-item label="角色名称" :label-width="formLabelWidth">
          <el-input v-model="editRoles.roleName" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth">
          <el-input v-model="editRoles.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRolessure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 权限树
      Rightlist: [],
      // 权限树的数据绑定
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中的权限树
      Defkey: [],
      // 当前的角色ID
      roleId: '',
      // 数据列表
      datalist: [],
      formLabelWidth: '80px',
      Roles: {},
      editRoles: {
        id: 0,
        roleName: '',
        roleDesc: ''
      },
      // 一堆弹框
      adduserFormVisible: false,
      rightsVisible: false,
      editFormVisible: false,
      // 验证规则
      rules: {
        roleName: [
          { required: true, message: '角色名字不能为空', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getlist()
    // this.getRights()
  },
  methods: {
    // 获取数据
    async getlist() {
      const { data: res } = await this.$http.get('/roles')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.datalist = res.data
    },
    // 分配权限(确认)
    async giveRights(ref) {
      // 获取选中的叶子结点和半选中的节点
      const key = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      // 将获取到的数组转换为拼接的字符串
      const idStr = key.join(',')
      this.Defkey = []
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids: idStr
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getlist()
      this.rightsVisible = false
    },
    // 删除权限标签
    async RemoveTag(row, id) {
      const confirm = await this.$confirm('你确定要删除此权限？', '提示', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {})
      if (confirm !== 'confirm') {
        this.$message('已取消删除')
        console.log(row, id)
        return false
      }
      const { data: res } = await this.$http.delete(`roles/${row.id}/rights/${id}`)
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
        return false
      }
      this.$message.success(res.meta.msg)
      // 可以防止网页刷新，是利用了element框架内部的逻辑
      row.children = res.data
      // this.getlist()
    },
    // 获取树形权限列表
    async getRights(row) {
      this.roleId = row.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取权限树失败')
      this.$message.success(res.meta.msg)
      this.Rightlist = res.data
      this.getDefkey(row, this.Defkey)
      this.rightsVisible = true
    },
    // 递归获取所有拥有的的第三级权限,程序调用自身的编程技巧称为递归（ recursion）。
    getDefkey(row, key) {
      // 只有第三级权限没有children
      if (!row.children) {
        // 把这个第三级权限的ID插入到this.defkey中
        return key.push(row.id)
      }
      // 不断向内循环直到进入第三级权限
      row.children.forEach(item => {
        this.getDefkey(item, key)
      })
    },
    // 角色删除
    async removeRole(id) {
      const confirm = await this.$confirm('你确定要删除吗？', '提示', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {})
      if (confirm !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`roles/${id}`)
      if (res.meta.status !== 200) return this.$message.error('获取权限树失败')
      this.$message.success(res.meta.msg)
      this.getlist()
    },
    // 添加角色（弹窗）
    addRoles() {
      this.adduserFormVisible = true
    },
    // 确定添加角色
    async addRolessure() {
      const { data: res } = await this.$http.post('/roles', this.Roles)
      if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getlist()
      this.Roles = {}
      this.adduserFormVisible = false
    },
    // 编辑角色(弹出框)
    editRole(row) {
      this.editRoles.roleName = row.roleName
      this.editRoles.roleDesc = row.roleDesc
      this.editRoles.id = row.id
      this.editFormVisible = true
    },
    // 编辑角色（确认）
    async editRolessure() {
      const { data: res } = await this.$http.put(`roles/${this.editRoles.id - 0}`, this.editRoles)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getlist()
      this.editFormVisible = false
    }
  }
}
</script>

<style scoped>
button.el-button {
  margin-bottom: 20px;
}
.el-tag {
  margin: 7px;
}
.bt {
  border-top: 1px solid #ccc;
}
.bb {
  border-bottom: 1px solid #ccc;
}
.vcenter {
  display: flex;
  align-items: center;
}
.el-input {
  /* margin-right: 20px; */
  margin-bottom: 5px;
}
</style>
