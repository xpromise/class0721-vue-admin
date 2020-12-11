<template>
  <div>
    <el-button type="primary" icon="el-icon-plus">添加</el-button>

    <el-table :data="trademarkList" border style="width: 100%; margin: 20px 0">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="scope">
          <!-- {{ JSON.stringify(scope) }} -->
          <!--
            scope代表所有数据
              scope.row 代表当前行所有数据
          -->
          <img class="trademark-img" :src="scope.row.logoUrl" alt="logo" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button type="warning" icon="el-icon-edit">修改</el-button>
          <el-button type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--
      :page-size.sync="limit" 可以让limit更新变成同步更新
     -->
    <!-- <el-pagination
      class="trademark-pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[3, 6, 9]"
      :page-size.sync="limit"
      :current-page="page"
      layout="prev, pager, next, jumper, sizes, total"
      :total="total"
    >
    </el-pagination> -->

    <!--
      $event 在DOM事件中代表 event
          <button @click="handle(123, $event)"></button>
            在自定义事件中代表 第一个参数
        <button @aaa="handle($event)"></button>
    -->
    <el-pagination
      class="trademark-pagination"
      @size-change="getPageList(page, $event)"
      @current-change="getPageList($event, limit)"
      :page-sizes="[3, 6, 9]"
      :page-size.sync="limit"
      :current-page="page"
      layout="prev, pager, next, jumper, sizes, total"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
// import { trademark } from "@/api";

export default {
  name: "TrademarkList",
  data() {
    return {
      trademarkList: [],
      total: 0,
      page: 1,
      limit: 3,
    };
  },
  methods: {
    // handleSizeChange(limit) {
    //   this.getPageList(this.page, limit);
    // },
    // handleCurrentChange(page) {
    //   this.getPageList(page, this.limit);
    // },
    // 请求分页列表数据
    async getPageList(page, limit) {
      try {
        const result = await this.$API.trademark.getPageList(page, limit);
        if (result.code === 200) {
          this.$message.success("获取品牌分页列表成功");
          this.limit = result.data.size; // 代表每页显示的条数
          this.page = result.data.current; // 代表当前页码
          this.trademarkList = result.data.records;
          this.total = result.data.total; // 总数
        } else {
          this.$message.error("获取品牌分页列表失败");
        }
      } catch (e) {
        console.log(e);
        this.$message.error("获取品牌分页列表失败");
      }
    },
  },
  mounted() {
    this.getPageList(this.page, this.limit);
  },
};
</script>

<style lang="sass">
.trademark-img
  width: 150px
.trademark-pagination
  text-align: right
.el-pagination__sizes
  margin-left: 250px
</style>
