<template>
  <div>
    <el-input disabled :value="$route.query.roleName"></el-input>
    <el-tree 
      style="margin: 20px 0"
      ref="tree"
      :data="allPermissions" 
      node-key="id"  
      show-checkbox 
      default-expand-all
      :props="defaultProps" 
    />
    <el-button :loading="loading" type="primary" @click="save">保存</el-button>
    <el-button @click="$router.replace('/acl/role/list')">取消</el-button>
  </div>
</template>
<script>

  export default {
    name: 'roleAuth',

    data() {
      return {
        loading: false, // 用来标识是否正在保存请求中的标识, 防止重复提交
        allPermissions: [], // 所有
        defaultProps: {
          children: 'children',
          label: 'name'
        },
      };
    },

    created() {
      this.init()
    },

    methods: {
      /* 
      初始化
      */
      init() {
        const roleId = this.$route.params.id
        this.getPermissions(roleId)
      },

      /* 
      获取指定角色的权限列表
      */
      getPermissions(roleId) {
        this.$API.permission.toAssign(roleId).then(result => {
          const allPermissions = result.data.children
          this.allPermissions = allPermissions
          const checkedIds = this.getCheckedIds(allPermissions)
          // console.log('getPermissions() checkedIds', checkedIds)
          this.$refs.tree.setCheckedKeys(checkedIds)
        })
      },

      /* 
      得到所有选中的id列表
      */
      getCheckedIds (auths, initArr = []) {
        return auths.reduce((pre, item) => {
          if (item.select && item.level===4) {
            pre.push(item.id)
          } else if (item.children) {
            this.getCheckedIds(item.children, initArr)
          }
          return pre
        }, initArr)
      },

      /* 
      保存权限列表
      */
      save() {
        var ids = this.$refs.tree.getCheckedKeys().join(",")
        /* 
        vue elementUI tree树形控件获取父节点ID的实例
        node_modules\element-ui\lib\element-ui.common.js    25377行修改源码 
        // if ((child.checked || includeHalfChecked && child.indeterminate) && (!leafOnly || leafOnly && child.isLeaf)) {
        if ((child.checked || child.indeterminate) && (!leafOnly || leafOnly && child.isLeaf)) {
        */
        this.loading = true
        this.$API.permission.doAssign(this.$route.params.id, ids).then(result => {
          this.loading = false
          this.$message.success(result.$message || '分配权限成功')
          this.$router.replace('/acl/role/list')
        })
      }
    }
  };
</script>
