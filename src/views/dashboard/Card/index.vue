<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6"
        ><el-card
          ><Detail :title="title[0]" :count="count[0]">
            <template slot="charts"
              ><span style="font-size: 14px">周同比</span>
              <span style="padding-left: 8px; font-size: 14px"
                >56.67%
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
                  ></path></svg
              ></span>
              <span style="padding-left: 15px; font-size: 14px">日同比</span>
              <span style="padding-left: 8px; font-size: 14px"
                >23.58%
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
                  ></path></svg
              ></span>
            </template>
            <template slot="footer"><span>日销售额: ￥ 12655</span> </template>
          </Detail></el-card
        ></el-col
      >
      <!-- **************第二个 -->
      <el-col :span="6"
        ><el-card
          ><Detail :title="title[1]" :count="count[1]">
            <template slot="footer"><span>访问量: 1269</span></template>
            <template slot="charts">
              <LineCart></LineCart>
            </template>
          </Detail>
          <template slot="footer"
            ><span>日销售额: ￥ 12655</span>
          </template></el-card
        ></el-col
      >
      <!-- **************第三个 -->

      <el-col :span="6"
        ><el-card
          ><Detail :title="title[2]" :count="count[2]">
            <template slot="charts"><BarCharts></BarCharts> </template>
            <template slot="footer"><span>转化率: 85%</span> </template></Detail
          ></el-card
        ></el-col
      >
      <!-- **************第四个 -->
      <el-col :span="6"
        ><el-card
          ><Detail :title="title[3]" :count="count[3]">
            <template slot="charts">
              <ProgressCharts></ProgressCharts>
            </template>
            <template slot="footer"
              ><span style="font-size: 14px">周同比</span>
              <span style="padding-left: 8px; font-size: 14px"
                >10.56%
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
                  ></path></svg
              ></span>
              <span style="padding-left: 15px; font-size: 14px">日同比</span>
              <span style="padding-left: 8px; font-size: 14px"
                >23.18%
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
                  ></path></svg
              ></span>
            </template> </Detail></el-card
      ></el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from "./Detail";
import LineCart from "./lineCart";
import BarCharts from "./barCharts";
import ProgressCharts from "./progressCharts";
export default {
  name: "Card",
  data() {
    return {
      title: ["总销售额", "访问量", "支付笔数", "运营活动效果"],
      count: ["￥126560", "88460", "88460", "78%"],
    };
  },
  components: {
    Detail,
    LineCart,
    BarCharts,
    ProgressCharts,
  },
};
</script>

<style>
</style>
