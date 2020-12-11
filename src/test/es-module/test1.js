/* 
2.1.ES6模块化导出与导入的深入理解和使用
  1.导出方式一: 默认一次性导出 (只能有一个)
      export default xxx
      本质: 整个模块是一个对象, 对象中有default属性, 即: {default: xxx}
  2.导出方式二: 非默认分别导出 (可以有多个)
      export yyy
      export zzz
      本质: 整个模块是一个对象, 对象中有yyy和zzz属性, 即: {yyy, zzz}
  3.导出方式三: 非默认统一导出 (可以有多个)
      export {yyy, zzz}
      本质:  整个模块是一个对象, 对象中有yyy和zzz属性, 即: {yyy, zzz}  
          
  4.导入方式一: 导入默认导出的模块
      简洁写法: import xxx from './test' // 可以是任意名称
      完整写法: import {default as xxx} from './test'
  5.导入方式二: 导入分别导出的模块
      import {yyy, zzz} from './test'  // 必须是指定的名称
  6.导入方式三: 导入整个/所有模块(包括默认与非默认导出的)
      import * as obj from './test' // 可以是任意名称
      obj的结构: {default, yyy, zzz}

  7.导入并导出: 对导入的模块同时做导出的操作
      export {default as xxx} from './test'
      export {yyy, zzz} from './test'
*/

// 1. 默认导出(只能有一个)
export default {
  m: 1
}

// 2. 分别导出(可以有多个)
export const yyy = 3
export function zzz() {

}

// 3. 统一导出(可以有多个)
const a = 1
const b = 2
const c = 3
export {
  a,
  b,
  c
}
const d = 4
const e = 5
export {
  d,
  e
}
