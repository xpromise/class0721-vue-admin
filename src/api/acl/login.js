import request from '@/utils/request'
const API_NAME = '/admin/acl/index'

export default {
  /* 
  根据用户名和密码请求登陆
  */
  login(username, password) {
    return request({
      url: `${API_NAME}/login`,
      method: 'post',
      data: {
        username,
        password
      }
    })
  },

  /* 
  获取当前用户信息
  */
  getInfo() {
    return request(`${API_NAME}/info`)
  },

  /* 
  获取当前用户的菜单权限列表
  */
  getMenu() {
    return request(`${API_NAME}/menu`)
  },

  /* 
  退出登陆
  */
  logout() {
    return request({
      url: `${API_NAME}/logout`,
      method: 'post'
    })
  },
}

// {default: {}}