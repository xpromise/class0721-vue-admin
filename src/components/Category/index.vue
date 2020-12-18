<template>
  <el-card>
    <el-form inline :model="category">
      <el-form-item label="一级分类">
        <el-select
          v-model="category.category1Id"
          placeholder="请选择"
          @change="handleSelectChange1"
          :disabled="disabled"
        >
          <el-option
            v-for="c1 in category1List"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="category.category2Id"
          placeholder="请选择"
          @change="handleSelectChange2"
          :disabled="disabled"
        >
          <el-option
            v-for="c2 in category2List"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          v-model="category.category3Id"
          placeholder="请选择"
          @change="handleSelectChange3"
          :disabled="disabled"
        >
          <el-option
            v-for="c3 in category3List"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  name: "Category",
  props: ["disabled"],
  data() {
    const { category } = this.$store.state.category;

    return {
      category: {
        category1Id: category.category1Id, // 1级分类id
        category2Id: category.category2Id,
        category3Id: category.category3Id,
      },
      // category1List: [], // 1级分类数据
      // category2List: [],
      // category3List: [],
    };
  },
  computed: {
    ...mapState({
      category1List: (state) => state.category.category1List,
      category2List: (state) => state.category.category2List,
      category3List: (state) => state.category.category3List,
      // 不行：数据代理是先代理data数据，再代理计算属性
      // category: (state) => state.category.category,
    }),
  },
  methods: {
    ...mapMutations(["category/SET_CATEGORY3_ID"]),
    ...mapActions([
      "category/getCategory1List",
      "category/getCategory2List",
      "category/getCategory3List",
    ]),
    // 处理输入框的change事件
    async handleSelectChange1(category1Id) {
      this.category.category2Id = "";
      this.category.category3Id = "";

      this["category/getCategory2List"](category1Id);
      // 清空父组件的数据
      // this.$bus.$emit("clearList");
    },
    async handleSelectChange2(category2Id) {
      this.category.category3Id = "";

      this["category/getCategory3List"](category2Id);
      // 清空父组件的数据
      // this.$bus.$emit("clearList");
    },
    async handleSelectChange3(category3Id) {
      this["category/SET_CATEGORY3_ID"](category3Id);
    },
  },
  async mounted() {
    this["category/getCategory1List"]();
  },
};
</script>

<style>
</style>
