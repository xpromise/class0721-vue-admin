<template>
  <div style="width: 100%; height: 300px; overflow: hidden">
    <ve-histogram
      :data="chartData"
      :settings="chartSettings"
      :legend-visible="false"
      height="400px"
      style="margin-top: -50px"
    ></ve-histogram>
  </div>
</template>

<script>
export default {
  name: "BarChart",
  data() {
    this.chartSettings = {
      stack: { page: ["pageA", "pageB", "pageC"] }, // 什么数据会堆叠在一起
      labelMap: {},
    };

    return {
      chartData: {
        columns: ["日期", "pageA", "pageB", "pageC"],
        rows: [
          { 日期: "周一", pageA: 1393, pageB: 1093, pageC: 1093 },
          { 日期: "周二", pageA: 3530, pageB: 3230, pageC: 3230 },
          { 日期: "周三", pageA: 2923, pageB: 2623, pageC: 1093 },
          { 日期: "周四", pageA: 1723, pageB: 1423, pageC: 1093 },
          { 日期: "周五", pageA: 3792, pageB: 3492, pageC: 1093 },
          { 日期: "周六", pageA: 4593, pageB: 4293, pageC: 1093 },
          { 日期: "周日", pageA: 4593, pageB: 4293, pageC: 1093 },
        ],
      },
    };
  },
};
</script>
