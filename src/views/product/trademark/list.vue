<template>
  <div>
    <el-button type="primary" @click="add" icon="el-icon-plus">添加</el-button>
    <!--
      :count="count"
      v-bind:count="count" 单向数据流 / 强制绑定数据
        子组件只能读取不能修改
        问题：子组件需要修改数据
        解决：数据源在哪，更新数据的方法就定义在哪

      :count.sync="count" 给子组件传递xxx数据以及更新数据的方法update:xxx
        相当于：
          :count="count" @update:count="xxx"

        .sync用于父子通信（子向父）
     -->
    <!-- <Test :count="count" :updateCount="updateCount" /> -->
    <!-- <Test :count.sync="count" /> -->

    <el-table
      :data="trademarkList"
      v-loading="loading"
      border
      style="width: 100%; margin: 20px 0"
    >
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <!-- <template slot-scope="scope"> -->
        <template v-slot="scope">
          <!-- {{ JSON.stringify(scope) }} -->
          <!--
            scope代表所有数据
              scope.row 代表当前行所有数据
          -->
          <img class="trademark-img" :src="scope.row.logoUrl" alt="logo" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button type="warning" icon="el-icon-edit" @click="update(row)"
            >修改</el-button
          >
          <el-button type="danger" icon="el-icon-delete" @click="del(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- <el-pagination
      class="trademark-pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[3, 6, 9]"
      :page-size.sync="limit"
      :current-page="page"
      layout="prev, pager, next, jumper, sizes, total"
      :total="total"
    >
    </el-pagination> -->

    <!--
      :page-size.sync="limit"   可以让limit更新变成同步更新
      :current-page.sync="page" 可以让page更新变成同步更新

      $event
        1.  在DOM事件中代表 event
        <button @click="handle(123, $event)"></button>
        触发事件是浏览器的行为，所以$event代表event

        2. 在自定义事件中代表 第一个参数
          <button @aaa="handle($event)"></button>
          假设这样触发自定义事件： this.$emit('aaa', 123, 456);
          那么$event就为123（第一个参数）
    -->
    <el-pagination
      class="trademark-pagination"
      @size-change="getPageList(page, $event)"
      @current-change="getPageList($event, limit)"
      :page-sizes="[3, 6, 9]"
      :page-size.sync="limit"
      :current-page="page"
      layout="prev, pager, next, jumper, sizes, total"
      :total="total"
    >
    </el-pagination>

    <el-dialog
      :title="`${trademarkForm.id ? '修改' : '添加'}品牌`"
      :visible.sync="visible"
      width="50%"
    >
      <el-form
        :model="trademarkForm"
        :rules="rules"
        ref="trademarkForm"
        label-width="100px"
      >
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="trademarkForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <!--
            前提允许跨域
              action="http://182.92.128.115/admin/product/fileUpload"
              目标服务器地址: 代理配置中 (vue.config.js)

            不允许跨域，就使用proxy
              action="/dev-api/admin/product/fileUpload"
              /dev-api -> request.js 代理
             在main.js中定义 Vue.prototype.$BASE_API = process.env.VUE_APP_BASE_API
           -->
          <el-upload
            class="avatar-uploader"
            :action="`${$BASE_API}/admin/product/fileUpload`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkForm.logoUrl"
              :src="trademarkForm.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span>只能上传jpg/png文件，且不超过50kb</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('trademarkForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { trademark } from "@/api";
import Test from "./test";

export default {
  name: "TrademarkList",
  data() {
    return {
      count: 0, // 测试数据
      trademarkList: [], // 所有数据
      total: 0, // 总数
      page: 1, // 页码
      limit: 3, // 每页条数
      visible: false, // 对话框显示&隐藏
      loading: false,
      trademarkForm: {
        // 表单数据
        tmName: "",
        logoUrl: "",
      },
      rules: {
        // 表单校验规则
        tmName: [
          {
            // 必填项
            // required: true,
            // 错误信息
            // message: "请输入品牌名称",
            // 自定义表单校验规则
            validator: this.validator,
            // 触发表单校验时机
            trigger: "blur",
          },
        ],
        logoUrl: [{ required: true, message: "请上传品牌LOGO" }],
      },
    };
  },
  methods: {
    del(row) {
      this.$confirm(`确定删除 ${row.tmName} 吗?`, "提示", {
        type: "warning",
      })
        .then(async () => {
          // 点击确定的回调
          // 发删除品牌的请求
          const result = await this.$API.trademark.deleteTrademark(row.id);
          // 如果成功了, 提示成功, 重新获取列表(哪一页?)
          this.$message({
            type: "success",
            message: "删除成功!",
          });

          // 哪一页?  显示上一页(当前页的列表数据只剩下1个)  否则显示当前页
          // 如果当前是第1页且只剩下1条数据 ==> 请求第1页数据(当前页)
          this.getPageList(
            this.trademarkList.length === 1 && this.page > 1
              ? this.page - 1
              : this.page,
            this.limit
          );
        })
        .catch((error) => {
          // 点击取消的回调
          if (error === "cancel") {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          }
        });
    },
    validator(rule, value, callback) {
      /*
        rule  校验的字段名
        value 校验的字段值
        callback 决定表单校验成功/失败
      */
      // 其中callback必须调用
      if (!value) {
        callback(new Error("请输入品牌名称"));
        return;
      } else if (value.length < 2 || value.length > 10) {
        callback(new Error("输入品牌名称的长度应为2-10位"));
        return;
      }

      callback();
    },
    add() {
      // 清空表单的校验
      this.$refs.trademarkForm && this.$refs.trademarkForm.clearValidate();
      this.visible = true;
      // 清空（从修改 - 添加要清空修改的数据）
      this.trademarkForm = {
        tmName: "",
        logoUrl: "",
      };
    },
    update(row) {
      /*
        const a = [{x: 1}];
        const b = a[0];
        b.x = 2;

        trademarkList: [row]
        trademarkForm = row
        trademarkForm.x = 2
      */
      // 清空表单的校验
      this.$refs.trademarkForm && this.$refs.trademarkForm.clearValidate();

      // 显示对话框
      this.visible = true;
      // row 代表当前行的数据 {}
      // this.trademarkForm = row; // 地址值一样，修改trademarkForm会导致trademarkList发生变化
      this.trademarkForm = { ...row };
      // this.trademarkForm = JSON.parse(JSON.stringify(row));
    },
    // updateCount() {
    //   this.count++;
    // },
    // 提交表单
    submitForm(form) {
      // 校验表单
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          const { trademarkForm } = this;
          // 代表是否是更新
          const isUpdate = !!trademarkForm.id;

          // 如果是修改需要验证
          if (isUpdate) {
            const tm = this.trademarkList.find(
              (tm) => tm.id === trademarkForm.id
            );

            if (
              tm.tmName === trademarkForm.tmName &&
              tm.logoUrl === trademarkForm.logoUrl
            ) {
              this.$message.warning("不能提交与之前一样的数据");
              return;
            }
          }

          // 表单校验通过
          // console.log(this.trademarkForm);
          // 发送请求
          let result;

          if (isUpdate) {
            result = await this.$API.trademark.updateTrademark(trademarkForm);
          } else {
            result = await this.$API.trademark.addTrademark(trademarkForm);
          }

          if (result.code === 200) {
            this.$message.success(`${isUpdate ? "修改" : "添加"}品牌数据成功~`);
            this.visible = false; // 隐藏对话框
            this.getPageList(this.page, this.limit); // 请求加载新数据
          } else {
            this.$message.error(result.message);
          }
        }
      });
    },
    // 上传图片成功的回调
    handleAvatarSuccess(res) {
      // console.log(res.data); // 图片地址
      this.trademarkForm.logoUrl = res.data;
    },
    // 上次图片之前触发的回调
    beforeAvatarUpload(file) {
      // console.log(file);
      const imgTypes = ["image/jpg", "image/png", "image/jpeg"];
      // 检测文件类型
      const isValidType = imgTypes.indexOf(file.type) > -1;
      // 检测文件大小
      const isLt = file.size / 1024 < 50;

      if (!isValidType) {
        this.$message.error("上传品牌LOGO只能是 JPG 或 PNG 格式!");
      }
      if (!isLt) {
        this.$message.error("上传品牌LOGO大小不能超过 50 kb!");
      }
      // 返回值为true，代表可以上传
      // 返回值为false，代表不可以上传
      return isValidType && isLt;
    },
    // handleSizeChange(limit) {
    //   this.getPageList(this.page, limit);
    // },
    // handleCurrentChange(page) {
    //   this.getPageList(page, this.limit);
    // },
    // 请求分页列表数据
    async getPageList(page, limit) {
      this.loading = true;
      const result = await this.$API.trademark.getPageList(page, limit);
      if (result.code === 200) {
        this.$message.success("获取品牌分页列表成功");
        this.limit = result.data.size; // 代表每页显示的条数
        this.page = result.data.current; // 代表当前页码
        this.trademarkList = result.data.records;
        this.total = result.data.total; // 总数
      } else {
        this.$message.error("获取品牌分页列表失败");
      }
      this.loading = false;
    },
  },
  mounted() {
    this.getPageList(this.page, this.limit);
  },
  components: {
    Test,
  },
};

/*
  lang="less"
    完整写法
    深度选择器 /deep/
  lang="sass"
    可以省略 {}
    可以省略 ;
    深度选择器 /deep/  >>>
  lang="scss"
    完整写法

  lang="stylus"
    可以省略 {}
    可以省略 :
    可以省略 ;

  scoped
    让样式只在当前组件生效
    问题：加上scoped，会让设置的子组件样式失效
    解决：使用深度选择器
*/
</script>

<style lang="sass" scoped>
.trademark-img
  width: 150px

.trademark-pagination
  text-align: right

>>>.el-pagination__sizes
  margin-left: 250px

>>>.avatar-uploader .el-upload
  border: 1px dashed #d9d9d9
  border-radius: 6px
  cursor: pointer
  position: relative
  overflow: hidden
  &:hover
    border-color: #409EFF

>>>.avatar-uploader-icon
  font-size: 28px
  color: #8c939d
  width: 178px
  height: 178px
  line-height: 178px
  text-align: center

>>>.avatar
  width: 178px
  height: 178px
  display: block
</style>
