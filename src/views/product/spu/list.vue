<template>
  <div>
    <Category />
    <SpuShowList v-show="isShowList" />
    <SpuUpdateList v-show="!isShowList" />
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
      isShowList: false,
    };
  },
  components: {
    Category,
    SpuShowList,
    SpuUpdateList,
  },
};
</script>
