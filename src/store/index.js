import Vue from 'vue'
import Vuex from 'vuex'
// import app from './modules/app'
// import permission from './modules/permission'
// import settings from './modules/settings'
// import user from './modules/user'

import getters from './getters'

Vue.use(Vuex)

/* 
动态加载vuex中所有的modules模块
不再需要通过import手动一个一个引入
*/
const context = require.context('./modules', false, /\.js$/)
const modules = context.keys().reduce((modules, modulePath) => {
  // './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  modules[moduleName] = context(modulePath).default
  return modules
}, {})

// 创建store对象
const store = new Vuex.Store({
  /* 
  modules: {
    app,
    permission,
    settings,
    user
  }, */
  modules,
  getters,
})

export default store
