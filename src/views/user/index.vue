<template>
  <div>
    <el-form inline>
      <el-form-item>
        <el-input type="text" width="100" placeholder="用户名" v-model="tempSearchObj.loginName" clearable/>
      </el-form-item>
      <el-form-item>
        <el-input type="text" width="100" placeholder="手机号" v-model="tempSearchObj.phoneNum" clearable/>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
      <el-button type="default" @click="resetSearch">清空</el-button>
    </el-form>

    <el-table
      border
      stripe
      highlight-current-row
      :data="users"
      v-loading="loading"
      element-loading-text="拼命加载中..."
    >
      <el-table-column align="center" label="用户ID" width="100" prop="id"/>
      <el-table-column label="用户名" width="150" prop="loginName" />
      <el-table-column label="手机号" prop="phoneNum" />
      <el-table-column label="头像">
        <template slot-scope="scope">
          <img :src="scope.row.headImg" alt="headImg" style="width:100px;height:100px;">
        </template>
      </el-table-column>
      <el-table-column label="邮箱" prop="email" />
      <el-table-column label="级别" prop="userLevel" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <hint-button v-if="$hasBP('cuser.detail')" title="查看" size="mini" type="primary" icon="el-icon-thumb" circle></hint-button>
          <hint-button v-if="$hasBP('cuser.update')" title="修改" size="mini" type="primary" icon="el-icon-edit" circle></hint-button>
          <hint-button v-if="$hasBP('cuser.delete')" title="删除" size="mini" type="danger" icon="el-icon-delete" circle></hint-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
      style="padding: 20px 0;"
      layout="prev, pager, next, jumper, ->, sizes, total"
      @current-change="getUsers"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'UserList',

    data () {
      return {
        loading: false, // 是否正在加载中
        users: [], // 当前页的用户列表
        total: 0, // 总记录数
        page: 1, // 默认页码
        limit: 10, // 每页记录数
        tempSearchObj: {}, // 用来收集搜索条件输入的对象
        searchObj: {}, // 用来发搜索请求的条件数据
      }
    },

    mounted () {
      this.getUsers()
    },

    methods: {
      /* 
      获取指定页码的分页列表显示
      */
      getUsers (page=1) {
        this.loading = true
        this.$API.clientUser.getPageList(page, this.limit, this.searchObj)
          .then(result => {
            const { records, total } = result.data
            this.total = total
            this.users = records
            this.loading = false
          })
      },

      /* 
      每页数量发生改变的监听回调
      */
      handleSizeChange(size) {
        this.limit = size
        this.getUsers()
      },

      /* 
      根据输入条件进行搜索
      */
      search () {
        this.searchObj = {...this.tempSearchObj}
        this.getUsers()
      },

      /* 
      重置输入生搜索
      */
      resetSearch () {
        this.tempSearchObj = {}
        this.searchObj = {}
        this.getUsers()
      }
    }
  }
</script>

