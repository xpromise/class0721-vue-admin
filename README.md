# 基于Vue + ElementUI的后台管理

## 安装所有依赖
    npm config set registry http://registry.npmjs.org
    npm install

## 修改element-ui的打包文件
    node_modules\element-ui\lib\tree.js    1051行修改源码
    去掉一个判断条件代码: 'includeHalfChecked &&'

## 运行
    npm run dev