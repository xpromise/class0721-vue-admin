<template>
  <el-card>
    <el-form label-width="100px" :model="sku" :rules="rules" ref="spuForm">
      <el-form-item label="SPU名称" prop="spuName">
        <span>{{ spu.spuName }}</span>
      </el-form-item>
      <el-form-item label="SKU名称" prop="skuName">
        <el-input placeholder="请输入SKU名称" v-model="sku.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)" prop="price">
        <el-input-number
          align="left"
          style="width: 300px"
          placeholder="请输入价格"
          controls-position="right"
          v-model="sku.price"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="重量(千克)" prop="weight">
        <el-input-number
          style="width: 300px"
          placeholder="请输入重量"
          controls-position="right"
          v-model="sku.weight"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="规格描述" prop="description">
        <el-input
          type="textarea"
          placeholder="请输入规格描述"
          v-model="sku.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <div v-for="(attr, index) in attrList" :key="attr.id">
          <span>{{ attr.attrName }}</span>
          <el-form-item style="display: inline-block" prop="skuAttrValueList">
            <el-select
              placeholder="请选择"
              v-model="sku.skuAttrValueList[index]"
            >
              <el-option
                v-for="value in attr.attrValueList"
                :key="value.id"
                :label="value.valueName"
                :value="`${attr.id}-${value.id}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="销售属性">
        <div
          class="skulist-select-container"
          v-for="(sale, index) in spuSaleAttrList"
          :key="sale.id"
        >
          <span>{{ sale.saleAttrName }}</span>
          <el-form-item
            style="display: inline-block"
            prop="skuSaleAttrValueList"
          >
            <el-select
              placeholder="请选择"
              v-model="sku.skuSaleAttrValueList[index]"
            >
              <el-option
                v-for="value in sale.spuSaleAttrValueList"
                :key="value.id"
                :label="value.saleAttrValueName"
                :value="`${sale.id}-${value.id}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          ref="multipleTable"
          border
          :data="imageList"
          style="width: 100%; margin: 20px 0"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="图片">
            <template slot-scope="scope"
              ><img
                style="display: inline-block; width: 100%; height: 100px"
                :src="scope.row.imgUrl"
                :alt="scope.row.imgName"
            /></template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称"> </el-table-column>
          <el-table-column label="操作">
            <template v-slot="{ row, $index }">
              <el-button
                v-if="!row.isDefault"
                type="primary"
                size="mini"
                @click="setDefault($index)"
                >设为默认</el-button
              >
              <el-tag v-else type="success">默认</el-tag>
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
import { mapState } from "vuex";

export default {
  props: {
    spuItem: Object,
  },
  data() {
    return {
      spu: this.spuItem, // spu数据
      rules: {}, // 表单验证规则
      imageList: [], // 图片列表
      spuSaleAttrList: [], // 销售属性数据
      attrList: [], // 平台属性数据
      sku: {
        // sku数据
        skuAttrValueList: [],
        skuSaleAttrValueList: [],
        skuImageList: [],
      },
    };
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
    }),
  },
  methods: {
    setDefault(i) {
      this.imageList = this.imageList.map((img, index) => {
        return {
          ...img,
          isDefault: i === index ? true : false,
        };
      });
    },
    handleSelectionChange(skuImageList) {
      // const imageList = skuImageList.length
      //   ? skuImageList
      //   : this.sku.skuImageList;

      // this.imageList = this.imageList.map((img, index) => {
      //   const isCheck = imageList.find((skuImg) => {
      //     return skuImg.id === img.id;
      //   })
      //     ? true
      //     : false;

      //   console.log(isCheck);
      //   return {
      //     ...img,
      //     isCheck,
      //   };
      // });

      this.sku.skuImageList = skuImageList;
    },
    // 获取所有图片数据
    async getSpuImageList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuImageList(id);
      if (result.code === 200) {
        this.$message.success("获取所有图片成功~");
        // 处理数据
        // [{imgName: '', imgUrl: ''}]
        // [{name: '', url: ''}]
        this.imageList = result.data.map((img) => {
          return {
            ...img,
            isCheck: true,
          };
        });
      } else {
        this.$message.error(result.message);
      }
    },
    // 获取所有销售属性列表
    async getSpuSaleAttrList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuSaleAttrList(id);
      if (result.code === 200) {
        this.$message.success("获取SPU销售属性列表成功~");
        // 处理数据
        this.spuSaleAttrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    // 获取所有平台属性列表
    async getAttrList() {
      const result = await this.$API.attrs.getAttrList(this.category);
      if (result.code === 200) {
        this.$message.success("获取所有平台属性列表成功~");
        // 处理数据
        this.attrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
  },
  mounted() {
    this.getSpuImageList();
    this.getSpuSaleAttrList();
    this.getAttrList();
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
