import { login as loginAPI } from '@/api'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(), // 登陆用户的token, 初始值从cookie中读取
    name: '', // 用户名
    avatar: '', // 用户头像图片地址

    buttons: [], // 当前用户的按钮权限的数组
    roles: [] // 当前用户所拥有角色的数组
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_BUTTONS: (state, buttons) => {
    state.buttons = buttons
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  /* 
  异步登陆
  */
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      loginAPI.login(username.trim(), password).then(result => {
        const { data } = result
        setToken(data.token) // 将token保存到cookie中
        commit('SET_TOKEN', data.token) // 将token保存到state中
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  /* 
  异步获取用户信息
  */
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      loginAPI.getInfo().then(result => {
        const { data } = result

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { name, avatar, roles, permissionValueList } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)

        if (roles && roles.length > 0) { // 验证返回的roles是否是一个非空数组
          commit('SET_ROLES', roles)
        } else {
          reject('getInfo: roles must be a non-null array !')
        }

        commit('SET_BUTTONS', permissionValueList)

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  /* 
  退出登陆
  */
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      loginAPI.logout().then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  /* 
  删除token与重置状态
  */
  async resetToken({ commit }) {
    /* 
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    }) */
    removeToken() // must remove  token  first
    commit('RESET_STATE')
  }
}

export default {
  namespaced: true, // dipatch('user/getInfo')
  state,
  mutations,
  actions
}

