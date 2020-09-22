import routerMap from '@/router/router.map'
import {mergeI18nFromRoutes} from '@/utils/i18n'
import Router from 'vue-router'
import {loginIgnore} from '@/router'
import {checkAuthorization} from '@/utils/request'
// import store from '../store'

/**
 * 根据 路由配置 和 路由组件注册 解析路由
 * @param routesConfig 路由配置
 * @param routerMap 本地路由组件注册配置
 */
function parseRoutes(routesConfig, routerMap) {
  let routes = [];
  // let routeList = []
  routesConfig.forEach(item => {
    // 获取注册在 routerMap 中的 router，初始化 routeCfg
    let router = undefined, routeCfg = {}
    if (typeof item === 'string') {
      router = routerMap[item]
      routeCfg = {path: router.path || item, router: item}
    } else if (typeof item === 'object') {
      router = routerMap[item.router]
      routeCfg = item
    }
    // 从 router 和 routeCfg 解析路由
    if (!router) {
      console.warn(`can't find register for router ${routeCfg.router}, please register it in advance.`)
    } else {
      console.log(routeCfg)
      const route = {
        path: routeCfg.path || router.path || routeCfg.router,
        name: routeCfg.name || router.name,
        component: router.component,
        redirect: routeCfg.redirect || router.redirect,
        meta: {
          //制定路由权限
          routeAuthority: routeCfg.router,
          // authority: routeCfg.authority || router.authority || '*',
          icon: routeCfg.icon || router.icon,
          page: routeCfg.page || router.page
        }
      }
      if (routeCfg.children && routeCfg.children.length > 0) {
        route.children = parseRoutes(routeCfg.children, routerMap)
      }
      routes.push(route)
    }
  })
  return routes
}
// console.log("能看到吗")
//抽离路由权限
// function getRouteList(routes,store) {
//   let routeList = [];
//   let newRoute = routes[0].children
//   console.log(newRoute)
//     routeDisp(newRoute)
//     function routeDisp(newRoute){
//        newRoute.forEach(item =>{
//          if(item.children && item.children.length >0){
//             routeDisp(item.children)
//             // return false
//          }
//          if(typeof item === 'string'){
//             routeList.push({authority: item})
//          }
//        })
//      }
//      console.log("这里输出路由数组")
//      console.log(routeList)
//      store.commit('account/setRouteList', routeList)
// }




/**
 * 加载路由
 * @param router 应用路由实例
 * @param store 应用的 vuex.store 实例
 * @param i18n 应用的 vue-i18n 实例
 * @param routesConfig 路由配置
 */
function loadRoutes({router, store,i18n}, routesConfig) {
  // 如果 routesConfig 有值，则更新到本地，否则从本地获取
  // console.log(routesConfig)
  if (routesConfig) {
    console.log("进这里了？")
    console.log(routesConfig)
    store.commit('account/setRoutesConfig', routesConfig)
  } else {
    routesConfig = store.getters['account/routesConfig']
  }
  // 如果开启了异步路由，则加载异步路由配置
  // const asyncRoutes = store.state.setting.asyncRoutes
  // if (asyncRoutes) {
  //   console.log("不进这里？")
    if (routesConfig && routesConfig.length > 0) {
      const routes = parseRoutes(routesConfig, routerMap)
      const finalRoutes = mergeRoutes(router.options.routes, routes)
      // console.log("finalRoutes中文【"+finalRoutes+"】")
      router.options = {...router.options, routes: finalRoutes}
      router.matcher = new Router({...router.options, routes:[]}).matcher
      router.addRoutes(finalRoutes)
    }
  // }
  
  // console.log("看看这里的路由有啥：")
  // console.log(router)
  // 初始化Admin后台菜单数据
  const rootRoute = router.options.routes.find(item => item.path === '/')
  const menuRoutes = rootRoute && rootRoute.children
  // console.log("这个应该是最后的结果")
  // console.log(menuRoutes)
  if (menuRoutes) {
    mergeI18nFromRoutes(i18n, menuRoutes)
    store.commit('setting/setMenuData', menuRoutes)
  }
}

/**
 * 合并路由
 * @param target {Route[]}
 * @param source {Route[]}
 * @returns {Route[]}
 */
function mergeRoutes(target, source) {
  const routesMap = {}
  target.forEach(item => routesMap[item.path] = item)
  source.forEach(item => routesMap[item.path] = item)
  return Object.values(routesMap)
}

/**
 * 登录守卫
 * @param router 应用路由实例
 */
function loginGuard(router) {
  router.beforeEach((to, from, next) => {
    // console.log("这个是啥子哦：")
    // console.log(to)
    // console.log(from)
    // console.log(loginIgnore.includes(to))
    // console.log(checkAuthorization())
    if (!loginIgnore.includes(to) && !checkAuthorization()) {
      // console.log("登录守卫进这里")
      next({path: '/login'})
    } else {
      // console.log("跳这里来")
      // console.log(next())
      next()
    }
  })
}

//拦截404
function if404(router,store) {
  router.beforeEach((to, from, next) => {
    // console.log("这个是啥子哦：")
    // console.log(to)
    // console.log(from)
    // console.log(loginIgnore.includes(to))
    if(to.name === '404'){
      if(store.getters['account/routesConfig'].length === 0){
        // console.log("判断404")
        next({path: '/login'})
        // router.push({path:'/login'})
      }else{
        // console.log("判断404为true")
        next({path:'/403'})
      }
    }else{
      next()
    }

  })
}

//拦截'/'
function ifslash(router,store) {
  router.beforeEach((to, from, next) => {
    // console.log("这个是啥子哦1：")
    // console.log(to)
    // console.log(from)
    // console.log(loginIgnore.includes(to))
    // console.log(to.redirectedFrom)
    if(to.redirectedFrom && to.redirectedFrom === '/'){
      // console.log("这是斜杠拦截")
      if(store.getters['account/routesConfig'].length === 0 && !checkAuthorization()){
        // console.log("这斜杠拦截进来了吗")
        next({path: '/login'})
      }else{
        // console.log("斜杠拦截可能来这边了")
        // console.log(to)
        // console.log(from)
        if(from.path === '/'){
          next({path:'/login'})
        }else{
          next({path:from.path})
        }
       
      }
    }else{
      next()
    }

  })
}






/**
 * 权限守卫
 * @param router 应用路由实例
 * @param store 应用的 vuex.store 实例
 */
// function authorityGuard(router, store) {
//   console.log("这是权限守卫：")
//   console.log(router)
//   console.log(store)
//   router.beforeEach((to, form, next) => {
//     console.log(to)
//     const permissions = store.getters['account/permissions']
//     const roles = store.getters['account/roles']
//     if (!hasPermission(to, permissions) && !hasRole(to, roles)) {
//       next({path: '/403'})
//     } else {
//       next()
//     }
//     // const routeList = store.getters['account/routeList']
//   })
// }

//路由权限
// function routesAuthority(router,store){
//   router.beforeEach((to , form , next) =>{
//     const routeList = store.getters['account/routeList']
//     console.log(to)
//     // if(routeList.length === 0){
//     //   console.log("进来了吗----------------------")
//     //   next()
//     // }
//     // console.log(routeList)
//     // console.log(to)
//     // console.log(next)
//     // next()
//     if(!hasRouteList(to,routeList)){
//       console.log("跳/403")
//       next({path:'/403'})
//     }else{
//       console.log("跳next（）")
//       next()
//     }
//   })
 
// }
//判断遍历权限表
// function hasRouteList(route , routeList){
//   let resulet = routeList.some(item =>{
//     return item.authority === route.meta.routeAuthority
//   })
//   return resulet
// }


/**
 * 判断是否有路由的权限
 * @param route 路由
 * @param permissions 用户权限集合
 * @returns {boolean|*}
 */
// function hasPermission(route, permissions) {
//   console.log("这是权限判断：")
//   console.log(route)
//   const authority = route.meta.authority || '*'
//   let required = '*'
//   if (typeof authority === 'string') {
//     required = authority
//   } else if (typeof authority === 'object') {
//     required = authority.permission
//   }
//   return required === '*' || (permissions && permissions.findIndex(item => item === required || item.id === required) !== -1)
// }

/**
 * 判断是否有路由需要的角色
 * @param route 路由
 * @param roles 用户角色集合
 */
// function hasRole(route, roles) {
//   const authority = route.meta.authority || '*'
//   let required = undefined
//   if (typeof authority === 'object') {
//     required = authority.role
//   }
//   return authority === '*' || (required && roles.findIndex(item => item === required || item.id === required) !== -1)
// }

/**
 * 判断是否有路由跳转的权限
 * @param route 路由
 * @param routeList 路由权限集合
 */
// function hasRouter(route , routeList){

// }


export {parseRoutes, loadRoutes, loginGuard,ifslash,if404}
// export {parseRoutes, loadRoutes, loginGuard}

