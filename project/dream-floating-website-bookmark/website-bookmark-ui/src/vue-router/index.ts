import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import i18n from '@src/vue-i18n'

const t = i18n.global.t

const routes = [
  {
    name: 'Index',
    path: '/',
    component: () => import('../components/Index.vue'),
    meta: { requiresAuth: true },
    children: []
  },
  {
    name: 'Login',
    path: '/login',
    component: () => import('../components/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    name: 'Page404',
    path: '/404',
    component: () => import('../components/Page404.vue'),
    meta: { requiresAuth: false }
  },
  {
    name: 'NoPermission',
    path: '/noPermission',
    component: () => import('../components/NoPermission.vue'),
    meta: { requiresAuth: false }
  }
]

// vue-router 配置
const router = createRouter({
  history: createWebHistory('/dreamfloating-website-bookmark'),
  routes,
  // 滚动行为
  scrollBehavior(_to, _from, _savedPosition) {
    // 始终滚动到顶部
    return { top: 0 }
  }
})

// vue-router 全局前置守卫
router.beforeEach((to, _from) => {
  // 检查即将访问的地址是否存在,不存在则跳转到404
  if (to.matched.length === 0) {
    ElMessage({
      type: 'error',
      grouping: true,
      plain: true,
      message: t('system.tip.page_not_fund')
    })
    return { path: '/404' }
  }
  // 检查即将访问的地址是否需要登录才能访问,如果需要则判断是否有登录,没有登录跳转到登录页面
  const authorization = sessionStorage.getItem('Authorization')
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!authorization) {
      ElMessage({
        type: 'error',
        grouping: true,
        plain: true,
        message: t('system.tip.user_no_login')
      })
      return { path: '/login' }
    }
  }
})

// vue-router 全局解析守卫
router.beforeResolve(async (_to) => {})

// vue-router 全局后置钩子
router.afterEach((_to, _from) => {})

export default router
