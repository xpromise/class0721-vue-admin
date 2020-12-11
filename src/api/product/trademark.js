import request from "@/utils/request";

const api_name = "/admin/product/baseTrademark";

export default {
  /*
  获取品牌分页列表
  */
  getPageList(page, limit) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: "GET"
    });
  },
  /*
  新增品牌
  */
  addTrademark(data) {
    return request({
      url: `${api_name}/save`,
      method: "POST",
      data
    });
  },
  /*
  修改品牌
  */
  updateTrademark(data) {
    return request({
      url: `${api_name}/update`,
      method: "PUT",
      data
    });
  },
  /*
  删除品牌
  */
  deleteTrademark(id) {
    return request({
      url: `${api_name}/remove/${id}`,
      method: "DELETE"
    });
  }
};
