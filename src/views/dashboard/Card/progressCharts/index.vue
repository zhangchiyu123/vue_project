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
        max: 100,
        min: 0,
      },
      yAxis: {
        //隐藏y轴
        show: false,
        // 均分
        type: "category",
      },
      //系列
      series: [
        {
          type: "bar",
          data: [78],
          color: "yellowgreen",
          barWidth: 10,
          showBackground: true,
          // 设置背景颜色
          backgroundStyle: {
            color: "#eee",
          },
          // 文本
          label: {
            show: true,
            // 改变文本内容
            formatter: "|",
            // 文本标签位置
            position: "right",
          },
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