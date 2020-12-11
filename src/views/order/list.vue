<template>
  <div>
    <el-form inline>
      <el-form-item label="订单号">
        <el-input type="text" width="100" placeholder="订单号" v-model="tempSearchObj.outTradeNo" clearable/>
      </el-form-item>

      <el-form-item label="订单状态">
        <el-select v-model="tempSearchObj.orderStatus" clearable placeholder="订单状态">
          <el-option value="UNPAID" label="未支付"/>
          <el-option value="PAID" label="已支付"/>
          <el-option value="WAITING_DELEVER" label="待发货"/>
          <el-option value="DELEVERED" label="已发货"/>
          <el-option value="CLOSED" label="已关闭"/>
          <el-option value="FINISHED" label="已完结"/>
          <el-option value="SPLIT" label="已拆分"/>
        </el-select>
      </el-form-item>

      <el-form-item label="下单时间">
        <el-date-picker
          v-model="times"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>

       <el-form-item label="收货人">
        <el-input type="text" width="100" placeholder="收货人" v-model="tempSearchObj.consignee" clearable/>
      </el-form-item>

      <el-form-item label="收件电话">
        <el-input type="text" width="100" placeholder="收件人电话" v-model="tempSearchObj.consigneeTel" clearable/>
      </el-form-item>

      <el-form-item label="送货地址">
        <el-input type="text" width="150" placeholder="送货地址" v-model="tempSearchObj.deliveryAddress" clearable/>
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
      <el-button type="default" @click="resetSearch">清空</el-button>
    </el-form>

    <el-table
      border
      stripe
      highlight-current-row
      :data="orderList"
      v-loading="loading"
    >
      <el-table-column
        type="index"
        label="序号"
        width="50"
        align="center">
      </el-table-column>

      <el-table-column prop="outTradeNo" label="订单号" width="220" />
      <el-table-column prop="totalAmount" label="支付金额(￥)" align="center" />
      <el-table-column prop="consignee" label="收货人" />
      <el-table-column prop="createTime" label="创建时间" width="180"/>
      <el-table-column prop="expireTime" label="失效时间" width="180"/>
      <el-table-column prop="orderStatusName" label="订单状态" width="80" />


      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="{row, $index}">
          <hint-button v-if="$hasBP('order.detail')" title="查看"  size="mini" type="primary" icon="el-icon-thumb" circle></hint-button>
          <hint-button v-if="$hasBP('order.update')" title="修改" size="mini" type="primary" icon="el-icon-edit" circle></hint-button>
          <hint-button v-if="$hasBP('order.delete')" title="删除" size="mini" type="danger" icon="el-icon-delete" circle></hint-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
      style="padding: 20px 0;"
      layout="prev, pager, next, jumper, ->, sizes, total"
      @current-change="getOrders"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
export default {
  name: 'OrderList',

  data() {
    return {
      loading: false, // 是否正在加载
      orderList: [], // 订单列表
      total: 0, // 总记录数
      page: 1, // 默认页码
      limit: 10, // 每页记录数
      searchObj: {}, // 查询条件对象
      tempSearchObj: {}, // 收集输入
      times: [], // 收集日期时间区间输入
    }
  },

  created () {
    this.getOrders()
  },

  watch: {
    /*
    一旦选择了新的时间区间, 保存新的数据
    */
    times (value) {
      if (value.length===2) {
        this.searchObj.createTimeBegin = value[0]
        this.searchObj.createTimeEnd = value[1]
      }
    }
  },

  methods: {

    /*
    根据输入搜索条件请求获取分页列表
    */
    search () {
      this.searchObj = {...this.tempSearchObj}
      this.getOrders()
    },

    /*
    每页数量发生改变时回调
    */
    handleSizeChange(size) {
      this.limit = size
      this.getOrders()
    },

    /*
    异步请求指定页码的分页数据
    */
    getOrders(page = 1) {
      this.page = page
      this.loading = true
      this.$API.order.getPageList(this.page, this.limit,this.searchObj).then(
        result => {
          this.loading = false
          this.orderList = result.data.records
          this.total = result.data.total
        }
      )
    },

    /*
    重置查询表单
    */
    resetSearch() {
      this.tempSearchObj = {}
      this.searchObj = {}
      this.getOrders()
    },
  }
}
</script>
