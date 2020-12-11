<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <span v-if="item.redirect==='noredirect'||index==levelList.length-1" class="no-redirect">
          {{ item.meta.title }}
        </span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp'

export default {
  data() {
    return {
      levelList: null, // 用于显示多级面包屑的数组
    }
  },
  watch: {
    /* 
    一旦路由有变化, 重新显示列表
    */
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    // 获取需要显示的面包屑的数组
    this.getBreadcrumb() 
  },
  methods: {
    /* 
    得到需要显示的面包屑数组
    */
    getBreadcrumb() {
      // console.log('----getBreadcrumb', this.$route.matched)
      // 过滤掉没有指定title的路由
      let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      // 如果第一个不是首页路由, 添加首页路由
      const first = matched[0]
      if (!this.isDashboard(first)) {
        matched = [{ path: '/dashboard', meta: { title: '首页' }}].concat(matched)
      }
      // 过滤掉breadcrumb为false的路由
      this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
      
      // console.log('----levelList', this.levelList)
    },

    /* 
    是否是首页路由
    */
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim() === '首页'
    },

    /* 
    用来处理路径中的params参数:
    比如path是: /product/:id, 请求的params是: {id: 2}
    处理后返回 '/product/2'
    */
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },

    /* 
    点击链接, 跳转路由
    */
    handleLink(item) {
      const { redirect, path } = item
      // 如果redirect指定了, 根据redirect跳转路由
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      // 否则根据path跳转路由
      this.$router.push(this.pathCompile(path))
    }
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
