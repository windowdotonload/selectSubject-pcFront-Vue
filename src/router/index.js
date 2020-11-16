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
        // :id是这条记录的id，:status是这条记录的状态 0 为完结， 1 为未完结可操作
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
  {
    path: "/grade", name: 'grade',
    component: () => import('@/views/teacher/views/grade'),
    meta: {
      desc: "给定评级"
    }
  },
]

const student = [
  {
    path: "/titlelist", name: 'titlelist',
    component: () => import('@/views/student/views/titlelist'),
    meta: {
      desc: "申请题目"
    }
  },
  {
    path: "/changetitle", name: 'changetitle',
    component: () => import('@/views/student/views/changetitle'),
    meta: {
      desc: "更换选题"
    }
  },
  // {
  //   path: "/titleapply", name: 'titleapply',
  //   component: () => import('@/views/student/views/titleapply'),
  //   meta: {
  //     desc: "申请状态"
  //   }
  // },
]



const routes = [
  // { path: "*", component: () => import('@/views/login') },
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
  {
    path: '/student', name: 'student',
    redirect: '/titlelist',
    component: () => import('@/views/student/manage'),
    children: [
      ...student
    ]
  },
]

const router = new VueRouter({
  // mode: 'history',
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
