import Vue from 'vue'

// 引入专门的reset.css模块
import 'normalize.css/normalize.css'

import './plugins/vcharts'

// 完整引入element-ui
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import './plugins/elements'

// 引入es6模块化的测试模块
import './test/es-module/test2'
import './test/es-module/test4'

// 引入全局样式
import '@/styles/index.scss'

import App from './App'

// 引入vuex的store对象模块
import store from './store'

// 引入vue-router的router对象模块
import router from './router'

// 引入svg-icon的主模块
import '@/icons'

// 引入权限控制的主模块
import '@/permission' // permission control

// 引入按钮级别权限控制的工具函数
import { hasBtnPermission } from './utils/permission'

// 引入包含所有接口请求函数模块的API对象
import * as API from '@/api'

// 引入准备全局注册的组件
import HintButton from '@/components/HintButton'
import CategorySelector from '@/components/CategorySelector'

// 注册全局组件
Vue.component('HintButton', HintButton)
Vue.component('CategorySelector', CategorySelector)

// 挂载到Vue原型对象上, 以便组件中直接可见
Vue.prototype.$hasBP = hasBtnPermission
Vue.prototype.$API = API
Vue.prototype.$BASE_API = process.env.VUE_APP_BASE_API

// 引入mockjs的配置, 不使用
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// 声明使用element插件
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
