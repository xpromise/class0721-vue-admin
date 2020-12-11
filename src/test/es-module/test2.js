// 导入默认导出的模块
import xxx from './test1' // 简洁写法
import {default as xxx2} from './test1' // 完整写法

// 导入分别导出的模块
import {yyy, zzz} from './test1'

// 导入统一导出的模块
import {a, b, c, d} from './test1'

// 导入所有模块
import * as obj from './test1'

// console.log(xxx, xxx2, yyy, zzz, a, b, c, d, obj)
