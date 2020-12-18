import Vue from "vue";
import Vuex from "vuex";
// import app from './modules/app'
// import permission from './modules/permission'
// import settings from './modules/settings'
// import user from './modules/user'

import getters from "./getters";

Vue.use(Vuex);

/*
动态加载vuex中所有的modules模块
不再需要通过import手动一个一个引入

  const context = require.context(
    处理的目录,
    要不要递归遍历, (如果是true，就会处理所有目录包括目录中的目录, 如果是false，就只处理一层目录),
    处理的文件
  )

  方法返回值是一个 context 函数
  context函数作为对象使用有一个keys()方法

  context.keys() 获取到处理目录下的所有文件路径列表
      ["./app.js", "./category.js", "./permission.js", "./settings.js", "./user.js"]
*/

// 处理./modules目录（子目录不处理）的下的所有js文件
const context = require.context("./modules", false, /\.js$/);
// console.log("context", context); // 是一个函数
// context.keys() 函数当作对象使用：keys()
// console.log(context.keys()); // 获取modules目录下面的所有文件路径列表

const modules = context.keys().reduce((modules, modulePath) => {
  // './app.js' => 'app'
  // 提取模块名称
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
  // const m = context(模块路径) 相当于 import * as m from 模块路径
  // context(模块路径) 引入xxx模块暴露的内容
  // context(modulePath).default 引入xxx模块得到默认暴露的内容
  // { app: app模块默认暴露的内容 }
  modules[moduleName] = context(modulePath).default;
  return modules;
}, {});

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
  getters
});

export default store;
