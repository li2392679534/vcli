<template>
  <div class="main">
    <div class="box">
      <p class="title">后台管理系统</p>
      <el-form :model="form" ref="form" class="Login-box" :rules="Loginrules">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="" prop="password">
          <el-input
            placeholder="请输入密码"
            prefix-icon="iconfont icon-3702mima"
            v-model="form.password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item class="btnbox">
          <el-button type="primary" class="btn" @click="login('form')"
            >登录</el-button
          >
          <el-button class="btn" @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: 'admin',
        password: '123456'
      },
      Loginrules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    login(formname) {
      this.$refs[formname].validate(valid => {
        // 判断输入格式
        if (!valid) {
          this.$message.error('用户名或密码格式出错')
          return false
        } else {
          this.$http.post('/login', this.form).then(res => {
            // console.log(res)
            if (res.data.meta.status !== 200) {
              // 判断接口的账号密码
              return this.$message.error('登陆失败，原因：' + res.data.meta.msg)
            } else {
              window.sessionStorage.setItem('token', res.data.data.token)
              this.$router.push('/home')
              return this.$message.success('登陆成功！')
            }
          })
        }
      })
    },
    resetForm(formname) {
      this.$refs[formname].resetFields()
    }
  }
}
</script>

<style scoped>
.main {
  background: url(../assets/login.png) no-repeat;
  background-size: cover;
  height: 100%;
  position: relative;
}
.box {
  width: 380px;
  height: 300px;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.title {
  text-align: center;
  font-weight: 700;
  color: rgb(14, 158, 213);
  font-size: 25px;
}
.Login-box {
  padding: 0 25px;
  box-sizing: border-box;
}
.btn {
  text-align: center;
  font-size: 12px;
}
.btnbox {
  display: flex;
  justify-content: flex-end;
}
</style>
