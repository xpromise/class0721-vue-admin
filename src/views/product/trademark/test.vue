<template>
  <div>
    <p>{{ count }}</p>
    <!-- <button @click="updateCount">修改</button> -->
    <button @click="$listeners['update:count'](count + 1)">修改</button>
  </div>
</template>

<script>
export default {
  name: "Test",
  // props: ["count", "updateCount"],
  props: ["count"],
  mounted() {
    console.log(this);
  },
};
</script>

<style>
</style>
