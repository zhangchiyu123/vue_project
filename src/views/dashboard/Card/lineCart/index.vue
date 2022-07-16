<template>
  <div class="charts" ref="MyEcharts"></div>
</template>

<script>
// 引入echarts
import * as echarts from "echarts";
// 基于准备好的dom，初始化echarts实例
export default {
  name: "LineCart",
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
          type: "line",
          data: [10, 50, 33, 12, 48, 9, 29, 10, 44],
          // 设置平滑折线
          smooth: true,
          //拐点的样式的设置
          itemStyle: {
            opacity: 0,
          },
          //线条的样式
          lineStyle: {
            color: "purple",
          },
          //填充颜色设置
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              // 渐变色
              colorStops: [
                {
                  offset: 0,
                  color: "purple", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#fff", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
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