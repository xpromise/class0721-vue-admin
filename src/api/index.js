// export { default as login } from "./acl/login"; // {default: {}}
// export { default as user } from "./acl/user";
// export { default as role } from "./acl/role";
// export { default as permission } from "./acl/permission";
// export { default as category } from "./category";
// export { default as clientUser } from "./clientUser";
// 1. 引入默认暴露的内容重命名为order
// 2. 将order给分别暴露出去
// export { default as order } from "./order";
// export { default as trademark } from "./product/trademark";
// export { default as attrs } from "./product/attrs";
// export { default as spu } from "./product/spu";
// export { default as sku } from "./product/sku";

// import { default as order } from './order' // 完整引入
// import order from './order' // 完整引入的简写
// export order;

/*
  需求：
    引入所有api模块，统一暴露出去
    暴露出去的结构：
      {
        模块名称: 模块默认暴露的内容,
        login: login默认暴露的内容,
        category: index默认暴露的内容
      }

*/

const context = require.context(".", true, /\.js$/);

const api = context
  .keys()
  .map(modulePath => {
    const names = modulePath.split("/");
    let moduleName = names[2] && names[2].slice(0, -3); // login index undefined
    if (moduleName) {
      moduleName = moduleName === "index" ? names[1] : moduleName;
    }
    return {
      modulePath,
      moduleName
    };
  })
  .filter(module => module.moduleName)
  .reduce((modules, module) => {
    modules[module.moduleName] = context(module.modulePath).default;
    return modules;
  }, {});

// console.log(api);

export default api;

/*
  {
    login: { login() {}... },
    user,
    role,
    permission,
    category,
    clientUser,
    order,
    trademark,
    attrs
  }
*/
