import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// 注册svg全局组件
Vue.component('svg-icon', SvgIcon)

// 用来保存所有svg文件名的数组: 用于权限管理中选择一级导航菜单
const svgNames = [] 

// 加载svg文件夹下所有的svg文件模块
const context = require.context('./svg', false, /\.svg$/)
context.keys().forEach(modulePath => {
  context(modulePath) // 加载此模块
  // './product.svg' => 'product'
  const svgName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  svgNames.push(svgName)
})

export default svgNames