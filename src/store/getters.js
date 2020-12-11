const getters = {
  sidebar: state => state.app.sidebar, // 是否展开左侧菜单
  device: state => state.app.device, // 当前设备类型
  fixedHeader: state => state.settings.fixedHeader, // 头部是否固定
  token: state => state.user.token, // 用户的token
  avatar: state => state.user.avatar, // 头像url
  name: state => state.user.name, // 用户名

  buttons: state => state.user.buttons, // 当前用户所有按钮权限的数组
  roles: state => state.user.roles, // 当前用户所有的角色
  routes: state => state.permission.routes, // 当前用户所有路由的数组
  asyncRoutes: state => state.permission.asyncRoutes // 当前用户有权限的所有路由的数组
}
export default getters
