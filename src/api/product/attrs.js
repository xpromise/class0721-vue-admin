import request from "@/utils/request";

const api_name = "/admin/product";

export default {
  /*
  获取1级分类列表
  */
  getCategorys1() {
    return request({
      url: `${api_name}/getCategory1`,
      method: "GET"
    });
  },
  /*
  获取2级分类列表
  */
  getCategorys2(category1Id) {
    return request({
      url: `${api_name}/getCategory2/${category1Id}`,
      method: "GET"
    });
  },
  /*
  获取3级分类列表
  */
  getCategorys3(category2Id) {
    return request({
      url: `${api_name}/getCategory3/${category2Id}`,
      method: "GET"
    });
  },
  /*
  获取分类对应的属性列表
  */
  getAttrList({ category1Id, category2Id, category3Id }) {
    return request({
      url: `${api_name}/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
      method: "GET"
    });
  },
  /*
  删除属性
  */
  deleteAttr(attrId) {
    return request({
      url: `${api_name}/deleteAttr/${attrId}`,
      method: "DELETE"
    });
  },
  /*
  获取属性的属性值列表
  */
  getAttrValueList(attrId) {
    return request({
      url: `${api_name}/getAttrValueList/${attrId}`,
      method: "GET"
    });
  },
  /*
  获取属性的属性值列表
  */
  getAttrValueList(attrId) {
    return request({
      url: `${api_name}/getAttrValueList/${attrId}`,
      method: "GET"
    });
  },
  /*
  保存属性
  */
  saveAttrInfo(attr) {
    return request({
      url: `${api_name}/saveAttrInfo`,
      method: "POST",
      data: attr
    });
  }
};
