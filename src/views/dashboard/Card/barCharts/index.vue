<template>
  <div class="charts" ref="MyEcharts"></div>
</template>

<script>
// 引入echarts
import * as echarts from "echarts";
export default {
  name: "BarCharts",
  mounted() {
    // 初始化echarts
    // 前排提示，设置平滑折线，在series中配置 smooth: true
    let lineCharts = echarts.init(this.$refs.MyEcharts);
    // 配置数据
    lineCharts.setOption({
      xAxis: {
        //隐藏x轴
        show: false,
        type: "category",
      },
      yAxis: {
        //隐藏y轴
        show: false,
      },
      //系列
      series: [
        {
          type: "bar",
          data: [10, 50, 33, 12, 48, 9, 29, 10, 44, 35, 66, 15],
          color: "pink",
        },
      ],
      //布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
      // 提示
      tooltip: {},
    });
  },
};
</script>

<style lang="less" scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>