/**
 * axios二次封装
 1. 配置统一的请求基础路径: 开发环境与生产环境不同
 2. 配置请求超时时间
 3. 请求时, 通过请求头携带登陆用户的token
 4. 请求成功得到的不是response, 而是请求体response.data
 5. 对请求出错进行统一的提示处理, 具体请求可以选择处理或不处理
 6. 对请求操作失败进行统一提示处理, 具体请求可以选择处理或不处理
 */

import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

const _Message = Message // 必须定义新的名称, 否则会报错

// 创建一个新的axios
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  
  timeout: 20000 //请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 如果有token, 通过token请求头携带token
    if (store.getters.token) {
      config.headers['token'] = getToken()
    }
    return config
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    
    const result = response.data
    /* 
    code为非20000或200是抛错 可结合自己业务进行修改
    */
    if (result.code !== 20000 && result.code !== 200) {
      if (result.code===201) { // 删除商品相关的系统数据时, 错误信息保存在了data上
        _Message.error(result.data || '未知错误')
      } else {
        _Message.error(result.message || '未知错误')
      }

      // 返回了一个失败的promise
      // return Promise.reject(new Error(result.data || result.message || '未知错误'))
      return Promise.reject(new Error(result.message || '未知错误'))
    } else {
      return result
    }
  },

  error => {
    console.log('err' + error)
    // 统一显示错误提示
    _Message({
      message: error.message || '请求出错了',
      type: 'error',
      duration: 5 * 1000
    })
    // 向下传递错误, 具体的请求右以选择处理或不处理
    return Promise.reject(error)
  }
)

export default service
