import request from "@/utils/request";

const api_name = "/admin/product";

export default {
  /*
  获取Spu分页列表
  */
  getSpuList({ category3Id, page, limit }) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: "GET",
      params: {
        category3Id
      }
    });
  },
  /*
  获取销售属性列表
  */
  getSaleAttrList() {
    return request({
      url: `${api_name}/baseSaleAttrList`,
      method: "GET"
    });
  },

  /*
  删除SPU
  */
  deleteSpu(spuId) {
    return request({
      url: `${api_name}/deleteSpu/${spuId}`,
      method: "DELETE"
    });
  },
  /*
  添加SPU
  */
  saveSpu(spu) {
    return request({
      url: `${api_name}/saveSpuInfo`,
      method: "POST",
      data: spu
    });
  },
  /*
  更新SPU
  */
  updateSpu(spu) {
    return request({
      url: `${api_name}/updateSpuInfo`,
      method: "POST",
      data: spu
    });
  }
};
