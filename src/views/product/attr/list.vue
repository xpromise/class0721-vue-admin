<template>
  <div>
    <!-- 自定义事件 -->
    <!-- <Category
      @change="getAttrList"
      @clearList="clearList"
      :disabled="!isShowList"
    /> -->

    <!-- 全局事件总线事件 -->
    <Category :disabled="!isShowList" />

    <el-card v-show="isShowList" style="margin-top: 20px">
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!category.category3Id"
        @click="add"
        >添加属性</el-button
      >

      <el-table :data="attrList" border style="width: 100%; margin: 20px 0">
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="150">
        </el-table-column>

        <el-table-column label="属性值列表">
          <template v-slot="{ row }">
            <el-tag
              style="margin-right: 5px"
              v-for="attrVal in row.attrValueList"
              :key="attrVal.id"
              >{{ attrVal.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template v-slot="{ row }">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="update(row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card v-show="!isShowList" style="margin-top: 20px">
      <el-form :model="attr" inline>
        <el-form-item label="属性名" prop="attrName">
          <el-input v-model="attr.attrName"></el-input>
        </el-form-item>
      </el-form>

      <el-button
        type="primary"
        :disabled="!attr.attrName"
        icon="el-icon-plus"
        @click="addAttrValue"
        >添加属性值</el-button
      >

      <el-table
        :data="attr.attrValueList"
        border
        style="width: 100%; margin: 20px 0"
      >
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column label="属性值名称">
          <template v-slot="{ row, $index }">
            <!--
              事件修饰符：
                .native
                专门给组件绑定事件使用的
                会给组件中的第一个标签绑定相应的原生DOM事件
             -->
            <el-input
              v-if="row.edit"
              v-model="row.valueName"
              @blur="editCompleted(row, $index)"
              @keyup.enter.native="editCompleted(row, $index)"
              autofocus
              ref="input"
              size="mini"
            ></el-input>
            <!-- 直接给对象添加新属性不是响应式数据, 通过this.$set添加的属性才是响应式 -->
            <span
              v-else
              @click="edit(row)"
              style="display: block; width: 100%"
              >{{ row.valueName }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row, $index }">
            <!-- 文档有问题：onConfirm -->
            <el-popconfirm
              @onConfirm="delAttrValue($index)"
              :title="`确定删除 ${row.valueName} 吗？`"
              ><el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                slot="reference"
              ></el-button
            ></el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="isShowList = true">取消</el-button>
    </el-card>
  </div>
</template>

<script>
import Category from "@/components/Category";

/*
categoryId:61
categoryLevel:3
id:3467
attrName:"屏幕尺寸"
attrValueList:Array[3]
  attrId:3467
  id:18904
  valueName:"5.0~5.49英寸"
*/

export default {
  name: "AttrList",
  data() {
    return {
      attrList: [],
      isShowList: true,
      attr: {
        attrName: "",
        attrValueList: [],
      },
      category: {
        // 代表三个分类id数据
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  methods: {
    clearList() {
      // 清空数据
      this.attrList = [];
      // 禁用按钮
      this.category.category3Id = "";
    },
    // 显示添加属性列表
    add() {
      this.isShowList = false;
      this.attr.attrName = "";
      this.attr.attrValueList = [];
    },
    editCompleted(row, index) {
      if (!row.valueName) {
        this.attr.attrValueList.splice(index, 1);
        return;
      }
      row.edit = false;
    },
    // 保存
    async save() {
      // 判断是否是添加
      const isAdd = !this.attr.id;

      const data = this.attr;

      if (isAdd) {
        // this.attr里面只有attrName和attrValueList
        // 还需要categoryId和categoryLevel
        data.categoryId = this.category.category3Id;
        data.categoryLevel = 3;
      }

      // 修改
      const result = await this.$API.attrs.saveAttrInfo(data);

      if (result.code === 200) {
        this.$message.success("更新属性成功~");
        this.isShowList = true;
        this.getAttrList(this.category);
      } else {
        this.$message.error(result.message);
      }
    },
    delAttrValue(index) {
      console.log(index);
      this.attr.attrValueList.splice(index, 1);
    },
    addAttrValue() {
      this.attr.attrValueList.push({ edit: true });
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    edit(row) {
      this.$set(row, "edit", true);
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    update(attr) {
      // 为了防止attr变化时直接修改原数据
      // this.attr = {
      //   ...attr,
      // };

      // 深度克隆：防止对象中对象还存在引用关系
      this.attr = JSON.parse(JSON.stringify(attr));

      this.isShowList = false;
    },
    async getAttrList(category) {
      this.category = category;
      const result = await this.$API.attrs.getAttrList(category);
      if (result.code === 200) {
        // console.log(result.data);
        // 子组件给父组件传递参数 自定义事件
        this.attrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
  },
  mounted() {
    this.$bus.$on("change", this.getAttrList);
    this.$bus.$on("clearList", this.clearList);
  },
  beforeDestroy() {
    // 通常情况下：清除绑定的全局事件
    this.$bus.$off("change", this.getAttrList);
    this.$bus.$off("clearList", this.clearList);
  },
  components: {
    Category,
  },
};
</script>
