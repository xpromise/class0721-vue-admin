import { constantRoutes, lastRoute } from '@/router'
import { login as loginAPI} from '@/api'
import Layout from '@/layout'
import asyncRoutes from '@/config/asyncRoutes'

/*
根据路由权限列表生成路由列表
主要工作就是将组件路径转换为对应的异步路由组件
*/
function generateAsyncRoutes(permissionList) {

  const accessedRoutes = permissionList.filter(route => {
    // 得到路由组件名称字符串
    let component = route.component
    if (component) {
      if (component==='Layout') {
        route.component = Layout
      } else if (asyncRoutes[component]) {
        route.component = asyncRoutes[component].component
      } else {
        return false
      }

      // if (component!=="Layout" && component.indexOf('/')!==0) {
      //   component = '/' + component
      // }
      // try {
      //   // 指定路由的组件
      //   route.component = component === 'Layout' ? Layout : () => import(`@/views${component}.vue`)
      // } catch (e) { // 如果对应的组件不存在, 排除它
      //   console.log(e)
      //   return false
      // }
    }
    // 如果有子路由, 递归调用
    if (route.children && route.children.length) {
      route.children = generateAsyncRoutes(route.children)
    }
    return true
  })
  return accessedRoutes
}

const state = {
  routes: [], // 常量路由 + 权限路由 + last路由数组
  asyncRoutes: [] // 当前用户的权限路由数组
}

const mutations = {
  ADD_ASYNC_ROUTES: (state, asyncRoutes) => {
    // 保存异步路由
    state.asyncRoutes = asyncRoutes
    // 将异步路由和lastRoute与常量路由合并成总路由并保存
    // 注意: 一定要将lastRoute放在最后
    state.routes = constantRoutes.concat(asyncRoutes, lastRoute)
  }
}

const actions = {
  /*
  异步生成当前用户的所有路由
  */
  async generateRoutes({ commit }) {
    // 异步获取当前用户权限数据
    const result = await loginAPI.getMenu()
    // 取出权限列表
    const permissionList = result.data.permissionList
    // 动态生成当前用户的所有有权限的路由的数组
    const asyncRoutes = generateAsyncRoutes(permissionList)
    // 提交给mutation更新路由数组
    commit('ADD_ASYNC_ROUTES', asyncRoutes)
    // 返回异步权限路由数组给外部使用
    return asyncRoutes
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
