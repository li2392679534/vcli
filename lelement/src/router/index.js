import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/User/Users'
import Roles from '../components/Power/Roles.vue'
import Rights from '../components/Power/Rights.vue'
import Cate from '../components/Goods/Cate.vue'
import Params from '../components/Goods/Params.vue'
import Order from '../components/Orders/Orders.vue'
import Goods from '../components/Goods/Goods.vue'
import Add from '../components/Goods/Add.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/categories',
        component: Cate
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/orders',
        component: Order
      },
      {
        path: '/goods',
        component: Goods
      },
      {
        path: '/add',
        component: Add
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // 如果要去login则直接放行
  if (to.path === '/login') {
    return next()
  }
  // 如果不是去login。则判断是否有token，有就放行，没有则返回login
  const tokenstr = window.sessionStorage.getItem('token')
  if (tokenstr) {
    return next()
  } else {
    next('/login')
  }
})
export default router
