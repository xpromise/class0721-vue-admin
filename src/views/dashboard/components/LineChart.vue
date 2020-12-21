<template>
  <div ref="LineChartContainer" class="line-chart-container">111</div>
</template>

<script>
// import throttle from "lodash/throttle";
import Echarts from "echarts";
import "echarts/theme/macarons";
import resize from "./mixins/resize";

export default {
  name: "LineChart",
  props: {
    yTittle: {
      type: String,
      required: true,
    },
    chartData: {
      type: Object,
      required: true,
    },
  },
  mixins: [resize],
  watch: {
    chartData({ expectedData, actualData }) {
      this.setOption({ expectedData, actualData });
    },
  },
  methods: {
    initChart() {
      // 初始化echarts实例
      this.chart = Echarts.init(this.$refs.LineChartContainer, "macarons");
    },
    setOption({ expectedData, actualData }) {
      // 定义option
      const option = {
        // title: {
        //   text: "堆叠区域图", // 标题
        // },
        // 提示（十字架）
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "skyblue",
            },
          },
        },
        // 代表有几种数据 （几条线）
        legend: {
          data: ["预期", "实际"],
        },
        // 下载
        // toolbox: {
        //   feature: {
        //     saveAsImage: {},
        //   },
        // },
        grid: {
          left: "1%",
          right: "1%",
          bottom: "1%",
          containLabel: true, // 充满整个容器，防止溢出
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "交易金额(万元)",
          },
        ],
        // 数据
        series: [
          {
            name: "预期",
            type: "line",
            // stack: "总量",
            // areaStyle: {}, // 有没有区域颜色
            data: expectedData,
            smooth: true, // 平滑
            lineStyle: {
              color: "red",
            },
          },
          {
            name: "实际",
            type: "line",
            // stack: "总量",
            areaStyle: {
              color: "gray",
              opacity: 0.1,
            },
            data: actualData,
            smooth: true, // 平滑
            lineStyle: {
              color: "blue",
            },
          },
        ],
      };
      // 调用setOption生成图片
      this.chart.setOption(option);
    },
  },
  mounted() {
    this.initChart();
    // 窗口调整事件
    // window.onresize = throttle(this.chart.resize, 150);
  },
};
</script>

<style lang="sass">
.line-chart-container
  width: 100%
  height: 400px
</style>
