import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

// 将子路由设置为根路径' /... '的原因是方便在el-aside二级菜单中路由跳转
const admin = [
  {
    path: "/record", name: 'record',
    component: () => import('@/views/admin/views/createRecord'),
    meta: {
      desc: "创建记录"
    }
  },
  {
    path: '/adminson', name: 'adminson',
    // 如果是子路由的子路由视图使用whiteContiner包裹
    component: () => import('@/components/whiteContiner'),
    meta: {
      desc: '人员信息'
    },
    children: [
      // {
      //   path: '/adminStu', name: 'adminStu',
      //   component: () => import('@/views/admin/views/Student'),
      //   meta: {
      //     desc: '学生面板'
      //   },
      // },
      {
        path: '/adminTec', name: 'adminTec',
        component: () => import('@/views/admin/views/Teacher'),
        meta: {
          desc: '教师面板'
        },
      },
      {
        path: '/recordDetail/:id/:status', name: 'recordDetail',
        props: true,
        component: () => import('@/views/admin/views/recordDetail'),
      },
    ]
  },
]

const teacher = [
  {
    path: "/addtitle", name: 'addtitle',
    component: () => import('@/views/teacher/views/addtitle'),
    meta: {
      desc: "设计选题"
    }
  },
  {
    path: "/audit", name: 'audit',
    component: () => import('@/views/teacher/views/audit'),
    meta: {
      desc: "申请审核"
    }
  },
]

const student = [

]



const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: () => import('@/views/login') },
  {
    path: '/admin', name: 'admin',
    redirect: '/record',
    component: () => import('@/views/admin/manage'),
    children: [
      ...admin
    ]
  },
  {
    path: '/teacher', name: 'teacher',
    redirect: '/addtitle',
    component: () => import('@/views/teacher/manage'),
    children: [
      ...teacher
    ]
  },
  { path: '/student', name: 'student', component: () => import('@/views/student/manage') },
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

export { admin, student, teacher }

export default router
