import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes = [
  {
    name: 'Index',
    path: '/',
    component: () => import('@src/components/Index.vue')
  }
] as RouteRecordRaw[]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  // 滚动行为
  scrollBehavior(_to, _from, _savedPosition) {
    // 始终滚动到顶部
    return { top: 0 }
  }
})

// vue-router 全局前置守卫
router.beforeEach((_to, _from) => {})

// vue-router 全局解析守卫
router.beforeResolve(async (_to) => {})

// vue-router 全局后置钩子
router.afterEach((_to, _from) => {})

export default router
