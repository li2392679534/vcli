<template>
  <el-container class="home-container">
    <el-header>
      <span>泡泡龙后宫管理系统</span>
      <el-button type="primary" @click="clear">退出后台</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '63px' : '200px'">
        <div class="control" @click="Collapse">| | |</div>
        <el-menu
          :collapse-transition="false"
          :collapse="isCollapse"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
          :router="true"
        >
          <el-submenu :index="item.id + ''" v-for="item in menu" :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span class="authName">{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="sonitem.path + ''"
              v-for="sonitem in item.children"
              :key="sonitem.id"
            >
              <i class="el-icon-menu"></i>
              <span slot="title">{{ sonitem.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false,
      menu: [],
      iconObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      }
    }
  },
  mounted() {
    this.getlist()
  },
  methods: {
    Collapse() {
      this.isCollapse = !this.isCollapse
    },
    getlist() {
      this.$http.get('menus').then(res => {
        this.menu = res.data.data
        // console.log(this.menu)
      })
    },
    clear() {
      if (confirm('你确定要退出吗？')) {
        window.sessionStorage.clear()
        this.$router.push('/login')
      }
    },
    handleOpen(key, keyPath) {
      // console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath)
    }
  }
}
</script>

<style scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  line-height: 60px;
  text-align: center;
}
.el-header span {
  color: #fff;
  font-weight: 700;
}
.el-header button {
  float: right;
  margin-top: 10px;
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.authName {
  margin-left: 10px;
}
.control {
  font-size: 12px;
  height: 25px;
  line-height: 25px;
  text-align: center;
  color: #fff;
  cursor: pointer;
  background-color: #515355;
}
ul.el-menu {
  border: none;
}
</style>
