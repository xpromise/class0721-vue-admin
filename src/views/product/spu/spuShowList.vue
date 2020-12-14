<template>
  <el-card style="margin-top: 20px">
    <el-button type="primary" icon="el-icon-plus">添加SPU</el-button>

    <el-table :data="[]" border style="width: 100%; margin: 20px 0">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="name" label="SPU名称"> </el-table-column>

      <el-table-column prop="desc" label="SPU描述"> </el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button type="primary" icon="el-icon-plus" size="mini"></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button type="info" icon="el-icon-info" size="mini"></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  name: "SpuShowList",
};
</script>

<style>
</style>
