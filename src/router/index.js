import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// Layout: 整体界面布局的根路由组件
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
  * hidden: true/false    如果为true, 在左侧导航中隐藏, 默认是false
  * redirect: noredirect  如果指定为此值, 在头部的导航列表项中就不是链接
  * name: 'xxx'           路由的标识名称, 用于<keep-alive>, 必须指定
  * component             路由组件(可能是懒加载函数)
  * meta: {
      title: '标题'        用于显示在左侧和头部导航的标题
      icon: 'svg-name'     显示在左侧导航中的图标名称
  }
*/

/**
 * 常量路由的数组
 * 也就是任何角色用户都可以访问的所有路由的数组
 */
export const constantRoutes = [
  // 登陆
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    // hidden: true
  },
  // 404
  {
    path: '/404',
    component: () => import('@/views/404'),
    // hidden: true
  },
  // 首页根路由
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: '首页',
      component: () => import('@/views/dashboard/index'),
      meta: { 
        title: '首页', 
        icon: 'dashboard' 
      }
    }]
  },
]

/* 
必须最后才注册的路由
用于处理当请求路径没有一个匹配时, 自动跳转到404路由界面
*/
export const lastRoute = { 
  path: '*', 
  redirect: '/404', 
  hidden: true 
}

/* 
用于创建只注册常量路由的路由器的函数
*/
const createRouter = () => new Router({
  mode: 'hash', // 带#模式
  scrollBehavior: () => ({ y: 0 }), // 切换路由自动滑动到顶部
  routes: constantRoutes // 默认只有常量路由, 其它权限路由后面动态添加
})

// 生成只包含常量路由的路由器
const router = createRouter()

// 向外暴露重置路由器的matcher的函数
// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  // 重新生成只包含常量路由的路由器
  const newRouter = createRouter()

  // 重置路由器的matcher(只包含常量路由)
  router.matcher = newRouter.matcher 
}

// 向外暴露路由器
export default router
