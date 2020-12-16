<template>
  <el-card>
    <el-form label-width="100px" :model="sku" :rules="rules" ref="spuForm">
      <el-form-item label="SPU名称">
        <span>{{ 123 }}</span>
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="请输入SKU名称"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input-number
          align="left"
          style="width: 300px"
          placeholder="请输入价格"
          controls-position="right"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input-number
          style="width: 300px"
          placeholder="请输入重量"
          controls-position="right"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" placeholder="请输入规格描述"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <div class="skulist-select-container">
          <span>111</span>
          <el-select placeholder="请选择">
            <el-option>111</el-option>
            <el-option>222</el-option>
          </el-select>
        </div>
        <div class="skulist-select-container">
          <span>111</span>
          <el-select placeholder="请选择">
            <el-option>111</el-option>
            <el-option>222</el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="销售属性">
        <div class="skulist-select-container">
          <span>111</span>
          <el-select placeholder="请选择">
            <el-option>111</el-option>
            <el-option>222</el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          ref="multipleTable"
          border
          :data="[]"
          tooltip-effect="dark"
          style="width: 100%; margin: 20px 0"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="图片">
            <template slot-scope="scope"
              ><img :src="scope.row.imgUrl" alt=""
            /></template>
          </el-table-column>
          <el-table-column prop="name" label="名称"> </el-table-column>
          <el-table-column prop="address" label="操作" show-overflow-tooltip>
            <template>
              <el-button type="primary" size="mini">设为默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  props: {
    skuItem: Object,
  },
  data() {
    return {
      sku: this.skuItem,
      rules: {},
    };
  },
  methods: {
    handleSelectionChange() {},
  },
};
</script>

<style lang="sass" scoped>
>>>.el-input-number .el-input__inner
  text-align: left

.skulist-select-container
  display: inline-block
  margin-right: 20px
</style>
