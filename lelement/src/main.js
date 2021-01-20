import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
// 路由
import router from './router'
// vuex
import store from './store'
// 引入element插件
import './plugins/element.js'
// 引入公共样式和Icon
import './assets/style/public.css'
import './assets/fonts/iconfont.css'
// 引入属性表单ZKtable
import ZkTable from 'vue-table-with-tree-grid'
// 时间格式插件 moment
import moment from 'moment'
// 富文本编辑器 vue-quill-editor
import VueQuillEditor from 'vue-quill-editor'
// 导入vue‐quill‐editor的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 全局注册富文本编辑器
Vue.use(VueQuillEditor)

// 全局注册树形表单
Vue.use(ZkTable)

// 请求在到达服务器之前，先会调用use中的这个回调函数来添加请求头信息
axios.interceptors.request.use(config => {
  // 为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 挂载axios
Vue.prototype.$http = axios
// 设置基地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 挂载moment
Vue.prototype.$moment = moment
// 时间格式过滤器
Vue.filter('dateFormat', function(originVal) {
  var dt = new Date(originVal)
  var YY = dt.getFullYear()
  var MM = (dt.getMonth() + 1 + '').padStart(2, '0')
  var DD = (dt.getDate() + '').padStart(2, '0')
  var hh = (dt.getHours() + '').padStart(2, '0')
  var mm = (dt.getMinutes() + '').padStart(2, '0')
  var ss = (dt.getSeconds() + '').padStart(2, '0')
  // console.log(originVal)
  return `${YY}-${MM}-${DD} ${hh}:${mm}:${ss}`
})

Vue.config.productionTip = false
new Vue({
  router,
  store,
  axios,
  render: h => h(App)
}).$mount('#app')
