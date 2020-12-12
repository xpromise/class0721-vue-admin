<template>
  <div>
    <Category @change="getAttrList" />

    <el-card style="margin-top: 20px">
      <el-button type="primary" icon="el-icon-plus">添加属性</el-button>

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
          <template>
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
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
  </div>
</template>

<script>
import Category from "./category";

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
    };
  },
  methods: {
    getAttrList(attrList) {
      this.attrList = attrList;
    },
  },
  components: {
    Category,
  },
};
</script>
