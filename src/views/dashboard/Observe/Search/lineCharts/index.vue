<template>
  <div>
    <div class="header">
      <slot name="user"></slot>
      <slot name="user1"></slot>
      <svg
        t="1652497207395"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="1446"
        width="18"
        height="18"
      >
        <path
          d="M512 0C229.376 0 0 229.376 0 512s229.376 512 512 512 512-229.376 512-512S794.624 0 512 0z m40.96 757.76c0 22.528-18.432 40.96-40.96 40.96s-40.96-18.432-40.96-40.96V430.08c0-22.528 18.432-40.96 40.96-40.96s40.96 18.432 40.96 40.96v327.68z m-40.96-409.6c-33.792 0-61.44-27.648-61.44-61.44s27.648-61.44 61.44-61.44 61.44 27.648 61.44 61.44-27.648 61.44-61.44 61.44z"
          p-id="1447"
          fill="#dbdbdb"
        ></path>
      </svg>
    </div>
    <div class="main">
      <span class="main-content">
        <slot class="main-content" name="content"></slot>
        <slot name="content1"></slot>
      </span>
      <svg
        t="1652501952781"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2480"
        width="16"
        height="16"
      >
        <path
          d="M512 320l-320 384h640l-320-384z"
          p-id="2481"
          fill="#d81e06"
        ></path>
      </svg>
      <span class="main-title">
        <slot name="main"></slot>
        <slot name="main1"></slot>
      </span>
      <svg
        t="1652502622770"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2858"
        width="16"
        height="16"
      >
        <path
          d="M192 384l320 384 320-384h-640z"
          p-id="2859"
          fill="#1afa29"
        ></path>
      </svg>
    </div>
    <div class="footer">
      <div class="charts" ref="MyEcharts"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "LineCharts",
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
            color: "blue",
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
                  color: "blue", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "skyblue", // 100% 处的颜色
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
.header {
  .icon {
    margin-left: 20px;
    vertical-align: middle;
  }
}

.main {
  margin: 10px 0;
  .main-content {
    font-size: 25px;
  }
  .main-title {
    margin-left: 25px;
  }
}

.footer {
  .charts {
    width: 100%;
    height: 50px;
  }
}
</style>