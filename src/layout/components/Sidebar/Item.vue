<script>
export default {
  name: 'MenuItem',
  functional: true, // 当前是render组件
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  /* 
  render组件的render函数
  返回需要渲染显示标签或多个标签的数组
  相当于:
    <template>
      <div>
        <svg-icon v-if="icon" icon-class={icon}/>
        <span v-if="title" slot='title'>{(title)}</span>
      </div>
    </template>
  好处:
    可以包含更复杂的逻辑处理
    可以不用指定根标签
  */
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []
    // 如果传入的icon, 添加一个svg图标组件标签显示
    if (icon) {
      vnodes.push(<svg-icon icon-class={icon}/>)
    }

    // 如果传入的title, 添加一个span标签显示
    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>
