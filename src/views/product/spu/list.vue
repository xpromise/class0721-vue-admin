<template>
  <div>
    <!--
      @change 当三级分类修改的时候触发。得到所有分类id
      @clearList 当1级分类和2级分类触发的时候触发，清空列表
      :disabled 决定select是否可以使用
     -->
    <Category />
    <!--
      v-show 组件虽然是隐藏的，但是组件被加载了~
     -->
    <SpuShowList v-if="isShowList" @showUpdateList="showUpdateList" />
    <SpuUpdateList v-else :item="item" />
  </div>
</template>

<script>
import Category from "@/components/Category";
import SpuShowList from "./spuShowList";
import SpuUpdateList from "./spuUpdateList";

export default {
  name: "SpuList",
  data() {
    return {
      isShowList: true,
      item: {},
    };
  },
  methods: {
    showUpdateList(row) {
      this.isShowList = false;
      this.item = { ...row };
    },
  },
  components: {
    Category,
    SpuShowList,
    SpuUpdateList,
  },
};
</script>
