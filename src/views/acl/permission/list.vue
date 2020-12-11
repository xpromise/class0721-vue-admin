<template>
  <div>
    <el-table
      border
      style="margin-bottom: 20px;"
      :data="menuPermissionList"
      :expand-row-keys="expandKeys"
      row-key="id"
    >
    
      <el-table-column
        prop="name"
        label="名称"
      />
      <el-table-column
        prop="path"
        label="访问路径"
      />
      <el-table-column
        label="图标"
      >
        <template v-slot="{row}">
          <svg-icon :icon-class="row.icon" v-if="row.icon"/>
        </template>
      </el-table-column>
      <el-table-column
        prop="component"
        label="组件"
      />
      <el-table-column
        prop="permissionValue"
        label="权限值"
      />

      <el-table-column label="操作">
        <template slot-scope="{row}">
          
          <HintButton
            v-if="$hasBP('permission.add')"
            :disabled="row.level===4"
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="toAddPermission(row)"
            :title="getAddTitle(row.level)"
          />

          <HintButton
            v-if="$hasBP('permission.update')"
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="toUpdatePermission(row)"
            :title="row.level===4 ? '修改功能' : '修改菜单'"
          >
          </HintButton>

          <HintButton
            v-if="$hasBP('permission.remove')"
            :disabled="row.level===1"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removePermission(row)"
            title="删除"
          >
          </HintButton>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogPermissionVisible" 
      :title="dialogTitle" @close="resetData">

      <el-form ref="permission" :model="permission" :rules="permissionRules" label-width="120px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="permission.name"/>
        </el-form-item>
        <el-form-item label="访问路径" prop="path" v-if="permission.level!==1">
          <el-input v-model="permission.path" :disabled="permission.level!==2"/>
        </el-form-item>
        
        <el-form-item label="组件" prop="component" v-if="permission.level!==1">
          <el-input v-model="permission.component" disabled v-if="permission.level===2"/>
          <el-select v-model="permission.component" v-else @change="handleComponentChange">
            <el-option :value="name" :label="name" v-for="name in asyncRouteNames" :key="name"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="功能权限值" prop="permissionValue" v-if="permission.level===4">
          <el-input v-model="permission.permissionValue"/>
        </el-form-item>

        <el-form-item label="组件图标" prop="icon" v-if="permission.level===2">
          <el-select v-model="permission.icon" placeholder="请选择">
            <el-option
              v-for="name in svgNames"
              :key="name"
              :label="name"
              :value="name">
              <svg-icon :icon-class="name" style="float: left"/>
              <span style="float: right">{{ name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetData">取 消</el-button>
        <el-button type="primary" @click="addOrUpdatePermission">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import svgNames from '@/icons'
import asyncRoutes from '@/config/asyncRoutes'

// 菜单权限校验的规则
const menuRules = { 
  name: [{required: true, message: '名称必须输入'}],
  path: [{required: true, message: '路径必须输入'}],
  component: [{required: true, message: '组件名称必须输入'}],
}

// 功能权限校验的规则
const funRules = { 
  name: [{required: true, message: '名称必须输入'}],
  permissionValue: [{required: true, trigger: 'blur', message: '功能权限值必须输入'}]
}

export default {
  name: 'PermissionList',

  data() {
    this.svgNames = svgNames // 保存svg图片列表(非响应式)
    console.log(svgNames)
    return {
      menuPermissionList: [], // 菜单列表
      expandKeys: [], // 需要自动展开的项
      dialogPermissionVisible: false, // 是否显示菜单权限的Dialog
      permission: { // 要操作的菜单权限对象
        level: 0,
        component: '',
        path: ''
      }, 
    }
  },

  computed: {
    /* 
    动态计算得到Dialog的标题
    */
    dialogTitle () {
      const {id, level} = this.permission
      if (id) {
        return level===4 ? '修改功能' : '修改菜单'
      } else {
        return level===4 ? '添加功能' : '添加菜单'
      }
    },

    /* 
    根据权限的等级来计算确定校验规则
    */
    permissionRules () {
      if (this.permission.level===4) {
        return funRules
      } else {
        return menuRules
      }
    },

    asyncRouteNames () {
      return Object.keys(asyncRoutes)
    },
  },
  
  mounted () {
    this.fetchPermissionList()
  },

  methods: {

    handleComponentChange (value) {
      this.permission.path = asyncRoutes[value].path
    },

    /* 
    根据级别得到要显示的添加dialog的标题
    */
    getAddTitle (level) {
      if (level===1 || level===2) {
        return '添加菜单'
      } else if (level===3){
        return '添加功能'
      }
    }, 

    /* 
    请求获取权限菜单数据列表
    */
    fetchPermissionList() {
      this.$API.permission.getPermissionList().then(result => {
        this.menuPermissionList = result.data.children
        this.expandKeys = [this.menuPermissionList[0].id]
      })
    },

    /* 
    显示添加权限的界面(菜单或功能)
    */
    toAddPermission (row) {
      this.dialogPermissionVisible = true
      this.permission.pid = row.id
      this.permission.level = row.level + 1
      if (this.permission.level===2) {
        this.permission.component = 'Layout'
      } else {
        this.permission.component = ''
      }
      this.permission.type = this.permission.level===4 ? 2 : 1

      // 清除校验(必须在界面更新之后)
      this.$nextTick(() => this.$refs.permission.clearValidate())
    },

    /* 
    显示菜单添加或更新的dialog
    */
    toUpdatePermission(row) {
      this.dialogPermissionVisible = true
      this.permission = {...row}  // 使用浅拷贝
      this.permission.type = this.permission.level===4 ? 2 : 1

      // 清除校验(必须在界面更新之后)
      this.$nextTick(() => this.$refs.permission.clearValidate())
    },

    /* 
    删除某个权限节点
    */    
    removePermission(permission) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        type: 'warning'
      }).then(async () => {
        const result = await this.$API.permission.removePermission(permission.id)
        this.$message.success(result.message || '删除成功!')
        this.fetchPermissionList()
      }).catch((error) => { 
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    /* 
    添加或更新功能权限
    */
    addOrUpdatePermission() {
      this.$refs.permission.validate(async valid => {
        if (valid) {
          const { permission } = this
          const { id } = permission

          const result = await this.$API.permission[id ? 'updatePermission' : 'addPermission'](permission)
          this.$message.success(result.message || `${id ? '修改' : '添加'}成功!`)
          this.resetData()
          this.fetchPermissionList()
        }
      })
    },

    /* 
    重置数据
    */
    resetData() {
      this.dialogPermissionVisible = false
      this.permission = {
        level: 0,
        component: '',
        path: ''
      }
    }
  }
}

</script>
