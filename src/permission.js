import router from './router'
import store from './store'
import { lastRoute } from './router'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 水平进度条提示: 在跳转路由时使用
import 'nprogress/nprogress.css' // 水平进度条样式
import getPageTitle from '@/utils/get-page-title' // 获取应用头部标题的函数

NProgress.configure({ showSpinner: false }) // 配置NProgress: 不显示右侧旋转进度条

// 不用进行登陆token检查的白名单路径数组
const whiteList = ['/login']

// 注册全局前置守卫: 在路由准备跳转前执行
router.beforeEach(async(to, from, next) => {
  // debugger
  // 在显示进度条
  NProgress.start()

  // 设置整个页面的标题
  document.title = getPageTitle(to.meta.title)

  // 获取cookie中保存的token
  const token = store.getters.token
  // 如果token存在(已经登陆或前面登陆过)
  if (token) {
    // 如果请求的是登陆路由
    if (to.path === '/login') {
      // 直接跳转到根路由, 并完成进度条
      next({ path: '/' })
      NProgress.done()
    } else { // 请求的不是登陆路由
      // 是否已经登陆
      const hasLogin = !!store.getters.name
      // 如果已经登陆直接放行
      if (hasLogin) {
        next()
      } else { // 如果还没有登陆
        try {
          // 异步请求获取用户信息
          await store.dispatch('user/getInfo')
          // 成功后, 请求获取当前用户的所有权限路由数组
          const asyncRoutes = await store.dispatch('permission/generateRoutes')
          // 动态添加可访问的路由, 注意将lastRoute放在最后
          // router.addRoutes(asyncRoutes.concat(lastRoute))
          router.addRoutes([...asyncRoutes, lastRoute])
          // console.log('asyncRoutes', asyncRoutes.concat(lastRoute))
          // 跳转到目标路由去, 只是强制用替换模式
          next({ ...to, replace: true })
        } catch (error) { // 如果请求处理过程中出错
          // 重置token
          await store.dispatch('user/resetToken')
          // 提示错误信息
          Message.error(error || 'Has Error')
          // 跳转到登陆页面, 并携带原本要跳转的路由路径, 用于登陆成功后跳转
          next(`/login?redirect=${to.path}`)
          // 完成进度条
          NProgress.done()
        }
      }
    }
  } else { // 没有token
    // 如果目标路径在白名单中(是不需要token的路径)
    if (whiteList.indexOf(to.path) !== -1) {
      // 放行
      next()
    } else {
      // 如果没在白名单中, 跳转到登陆路由携带原目标路径
      next(`/login?redirect=${to.path}`)
      // 完成进度条
      NProgress.done()
    }
  }
})

// 注册全局后置守卫: 在路由跳转完成后执行
router.afterEach(() => {
  // console.log('afterEnter callback()')
  // 完成(隐藏)进度条显示
  NProgress.done()
})
