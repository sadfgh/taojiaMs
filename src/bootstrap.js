import {loadRoutes, loginGuard,if404,ifslash} from '@/utils/routerUtil'
// import {loadRoutes, loginGuard} from '@/utils/routerUtil'

/**
 * 启动引导方法
 * 应用启动时需要执行的操作放在这里
 * @param router 应用的路由实例
 * @param store 应用的 vuex.store 实例
 * @param i18n 应用的 vue-i18n 实例
 */
function bootstrap({router, store,i18n}) {
  // 加载路由
  loadRoutes({router, store,i18n})
  // getRouteList(router)
  // 添加路由守卫
  loginGuard(router)
  // authorityGuard(router, store)
  if404(router,store)
  ifslash(router,store)
  // routesAuthority(router, store)
}

export default bootstrap
