<template>
  <section class="app-main">
    <!-- 对应的过渡样式定义在 transition.scss 中-->
    <transition name="fade-transform" mode="out-in">
      <!-- 给在 <transition> 组件中的多个元素设置 key 是一个更好的实践 -->
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    /* 
    将当前请求的路由路径作为标识key
    */
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
  padding: 20px;
}
.fixed-header+.app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
