import request from '@/utils/request'

const api_name = '/admin/order'

export default {
  /*
  获取订单分页列表(带搜索)
  */
  getPageList(page, limit, searchObj) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get',
      params: searchObj // url查询字符串或表单键值对
    })
  }
}
