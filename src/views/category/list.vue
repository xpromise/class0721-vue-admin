<template>
  <div>
    <el-table
      border
      lazy
      :data="categorys"
      :load="load"
      style="width: 900px;margin-bottom: 20px;"
      :row-key="getRowKey"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :row-class-name="tableRowClassName"
    >
      
      <el-table-column
        prop="id"
        label="分类ID"
        align="center"
        width="150"
      />

      <el-table-column
        prop="name"
        label="分类名称"
        sortable
      />

      <el-table-column label="操作" width="250" align="center">
        <template slot="header" slot-scope="scope">
          <el-input placeholder="按Enter键添加一级分类"/>
        </template>

        <template slot-scope="scope">
          <HintButton v-if="$hasBP('category.add')" title="添加子分类" :disabled="!scope.row.level" 
            size="mini" type="primary" icon="el-icon-plus"/>
          <HintButton v-if="$hasBP('category.update')" title="修改分类" 
            size="mini" type="primary" icon="el-icon-edit"/>
          <HintButton v-if="$hasBP('category.remove')" title="删除分类" 
            size="mini" type="danger" icon="el-icon-delete"/>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'CategoryList',

  data() {
    return {
      categorys: [], //用于存储所有分类列表的数组
    };
  },

  mounted () {
    this.getCategorys1()
  },

  methods: {
    /* 
    获取一级分类列表显示
    */
    getCategorys1 () {
      this.$API.category.getCategorys1().then(result => {
        const categorys = result.data
        categorys.forEach(c => {
          c.hasChildren = true
          c.level = 1
        })
        this.categorys = categorys
      })
    },
    
    /* 
    异步加载下一级分类列表显示
    */
    async load (row, treeNode, resolve) {
      // console.log('---', row, treeNode)
      if (row.level===1) {
        const categorys2 = await this.getCategorys2(row)
        resolve(categorys2)
      } else if (row.level===2) {
        const categorys3 = await this.getCategorys3(row)
        resolve(categorys3)
      }
    },

    /* 
    获取二级分类列表, 返回包含数据的promise对象
    */
    getCategorys2 (row) {
      return this.$API.category.getCategorys2(row.id).then(result => {
        const categorys2 = result.data
        if (categorys2 && categorys2.length>0) {
          categorys2.forEach(item => {
            // 标识有子分类
            item.hasChildren = true
            // 分类级别为2级
            item.level = 2
          })
          return categorys2
        } else {
          row.hasChildren = false
          return []
        }
      })
    },

    /* 
    获取三级分类列表, 返回包含数据的promise对象
    */
    async getCategorys3 (row) {

      const result = await this.$API.category.getCategorys3(row.id)
      const categorys3 = result.data
      if (categorys3 && categorys3.length>0) {
        return categorys3
      } else {
        row.hasChildren = false
        return []
      }
    },

    /* 
    动态确定当前行的唯一key
    */
    getRowKey (row) {
      return row.level + '-' + row.id
    },

    /* 
    返回二级分类列表的类名
    */
    tableRowClassName({row, rowIndex}) {
      if (row.level === 2) {
        return 'level2-row'
      } 
    },
  }
}
</script>
<style>
.el-table .level2-row {
  background: #f0f9eb;
}
</style>