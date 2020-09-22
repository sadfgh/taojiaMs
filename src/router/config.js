import TabsView from '@/layouts/tabs/TabsView'
// import BlankView from '@/layouts/BlankView'
// 路由配置
const options = {
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: () => import('@/pages/login')
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/pages/exception/404'),
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/pages/exception/403'),
    },

    {
      path: '/',
      name: '首页',
      component: TabsView,
      redirect: '/login',
      // children: [
      //   {
      //     path: 'dashboard',
      //     name: 'Dashboard',
      //     meta: {
      //       icon: 'dashboard'
      //     },
      //     component: BlankView,
      //     children: [
      //       {
      //         path: 'workplace',
      //         name: '工作台',
      //         component: () => import('@/pages/dashboard/workplace/WorkPlace'),
      //       },
      //       {
      //         path: 'analysis',
      //         name: '分析页',
      //         component: () => import('@/pages/dashboard/analysis/Analysis'),
      //       }
      //     ]
      //   },
      // ]
      // children: [
      //   {
      //     path: 'text',
      //     name: '权限管理',
      //     meta: {
      //       icon: 'dashboard'
      //     },
      //     component: BlankView,
      //     children: [
      //       {
      //         path: 'text1',
      //         name: '授权管理',
      //         component: () => import('@/pages/text/text1'),
      //       },
      //       {
      //         path: 'text2',
      //         name: '角色管理',
      //         component: () => import('@/pages/text/text2'),
      //       },
      //       {
      //         path: 'text3',
      //         name: '用户管理',
      //         component: () => import('@/pages/text/text3'),
      //       }

      //     ]
      //   }
      // ]
    },
  ]
}

export default options
