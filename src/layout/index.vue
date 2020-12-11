<template>
  <div :class="classObj" class="app-wrapper">
    <!-- 在移动端模式下: 用来点击关闭左侧菜单导航的遮罩div -->
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" 
      @click="handleClickOutside" />
    <!-- 左侧导航条 -->
    <sidebar class="sidebar-container" />
    <!-- 右侧 -->
    <div class="main-container">
      <!-- 上部导航条 -->
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
      </div>
      <!-- 应用主体部分: 路由组件在其中显示 -->
      <app-main />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  // 配置mixin
  mixins: [ResizeMixin],
  computed: {
    /* 
    得到包含导航是否打开及是否不需要动画的标识属性的对象
    */
    sidebar() {
      return this.$store.state.app.sidebar
    },
    /* 
    得到当前显示设备名: desktop/mobile
    */
    device() {
      return this.$store.state.app.device
    },
    /* 
    是否固定NavBar
    */
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },

    /* 
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      fixedHeader: state => state.settings.fixedHeader,
    }), */
 
    // ...mapGetters(['sidebar', 'device', 'fixedHeader']),

    /* 
    多个动态类名的对象
    */
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened, // 是否折叠菜单导航
        openSidebar: this.sidebar.opened, // 是否打开菜单导航
        withoutAnimation: this.sidebar.withoutAnimation, // 是否不需要动画效果
        mobile: this.device === 'mobile', // 是否是mobile模式
      }
    }
  },
  methods: {
    /* 
    点击折叠菜单导航
    */
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
