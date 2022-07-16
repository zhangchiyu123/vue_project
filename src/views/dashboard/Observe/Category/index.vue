<template>
  <div>
    <el-card>
      <div slot="header" class="header">
        <div class="category_header">
          <span>销售额类别占比</span>
          <el-radio-group v-model="value">
            <el-radio-button label="全部渠道"></el-radio-button>
            <el-radio-button label="线上"></el-radio-button>
            <el-radio-button label="门店"></el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div ref="myCharts" class="charts"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "Category",
  data() {
    return {
      value: "全部渠道",
    };
  },
  mounted() {
    let myCharts = echarts.init(this.$refs.myCharts);
    myCharts.setOption({
      title: {
        text: "视频",
        subtext: 1048,
        left: "center",
        top: "center",
      },
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
            position: "outside",
          },
          labelLine: {
            show: true,
          },
          data: [
            { value: 1048, name: "视频" },
            { value: 735, name: "Direct" },
            { value: 580, name: "Email" },
            { value: 484, name: "Union Ads" },
            { value: 300, name: "Video Ads" },
          ],
        },
      ],
    });
    // 绑定事件
    myCharts.on("mouseover", (params) => {
      // 获取鼠标移上去的那条数据
      const { name, value } = params.data;
      // 重新设置标题
      myCharts.setOption({
        title: {
          text: name,
          subtext: value,
        },
      });
    });
  },
};
</script>

<style lang="less" scoped>
.header {
  border-bottom: 1px solid #eee;
  padding: 10px;
  .category_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.charts {
  width: 100%;
  height: 300px;
}
</style>