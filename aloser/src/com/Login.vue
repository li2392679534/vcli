<template>
  <div class="main">
    <div class="box">
      <h1>夜的CLUB</h1>
      <p>Dragon - hub</p>
      <el-form
        :model="LoginForm"
        :rules="LoginFormrules"
        ref="LoginFormRef"
        class="demo-ruleForm"
        label-width="20px"
      >
        <el-form-item label="" prop="username">
          <el-input v-model="LoginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input v-model="LoginForm.password"></el-input>
        </el-form-item>
      </el-form>
      <el-row>
        <el-button type="primary">登录</el-button>
        <el-button type="info">重置</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      LoginForm: {
        username: ''
      },
      LoginFormrules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {}
}
</script>
<style scoped>
.main {
  background: url(../assets/bg.png) no-repeat;
  background-size: cover;
  height: 100%;
  position: relative;
}
.box {
  width: 500px;
  height: 340px;
  background: rgb(255, 255, 255);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.el-form-item {
  width: 480px;
}
h1 {
  color: brown;
}
h1,
p {
  text-align: center;
}
.el-form.demo-ruleForm {
  margin-top: 30px;
}
.el-row {
  text-align: center;
}
</style>
