<template>
  <div>
    <el-card class="box-card" style="margin: 10px 0">
      <div slot="header" class="clearfix">
        <!--  @tab-click="handleClick" -->
        <!-- 头部左侧内容 -->
        <el-tabs class="tab" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="销售额" name="sale"></el-tab-pane>
          <el-tab-pane label="访问量" name="visit"></el-tab-pane>
        </el-tabs>
        <!-- 右侧盒子内容 -->
        <div class="tab_right">
          <span @click="setDay">今日</span>
          <span @click="setWeek">本周</span>
          <span @click="setMonth">本月</span>
          <span @click="setYear">本年</span>
          <!-- v-model="value1" -->
          <el-date-picker
            v-model="date"
            class="date"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </div>
      </div>
      <div class="clearfix2">
        <el-row :gutter="10">
          <el-col :span="16">
            <div class="charts" ref="charts"></div>
          </el-col>
          <el-col :span="8" style="padding-left: 100px">
            <div class="sales_right">
              <h3>商城手机类{{ title }}总排名(年)</h3>
              <ul>
                <li>
                  <span class="rindex">0</span>
                  <span>苹果</span>
                  <span>5654</span>
                </li>
                <li>
                  <span class="rindex">1</span>
                  <span>三星</span>
                  <span>4656</span>
                </li>
                <li>
                  <span class="rindex">2</span>
                  <span>索尼</span>
                  <span>3687</span>
                </li>
                <li>
                  <span class="rindex">3</span>
                  <span>小米</span>
                  <span>3555</span>
                </li>
                <li>
                  <span class="rindex">4</span>
                  <span>华为</span>
                  <span>2650</span>
                </li>
                <li>
                  <span class="rindex">5</span>
                  <span>OPPO</span>
                  <span>2350</span>
                </li>
                <li>
                  <span class="rindex">6</span>
                  <span>VIVO</span>
                  <span>2169</span>
                </li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入echarts
import * as echarts from "echarts";
import * as dayjs from "dayjs";
import { mapState } from "vuex";
export default {
  name: "Sale",
  data() {
    return {
      activeName: "sale",
      myCharts: null,
      // 收集日历的数据
      date: [],
    };
  },
  mounted() {
    this.myCharts = echarts.init(this.$refs.charts);
    this.myCharts.setOption({
      title: {
        text: this.title + "趋势",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "30%",
          color: "yellowgreen",
          data: [],
        },
      ],
    });
    // 顶部是moutend：为什么第一次没有数据，没数据是因为不显示。需要监听
  },
  computed: {
    title() {
      return this.activeName == "sale" ? "销售额" : "访问量";
    },
    ...mapState({
      listState: (state) => state.home.list,
    }),
  },
  methods: {
    // tab 被选中时触发
    handleClick() {
      // 重新修改图表的配置数据
      // 图表的配置数据可以再次修改，如果有新的数值，就用新的数值，没有新的数值，还是用旧的数值
      this.myCharts.setOption({
        title: {
          text: this.title + "趋势",
        },
        xAxis: {
          data:
            this.title == "销售额"
              ? this.listState.orderFullYearAxis
              : this.listState.userFullYearAxis,
        },
        series: [
          {
            data:
              this.title == "销售额"
                ? this.listState.orderFullYear
                : this.listState.userFullYear,
          },
        ],
      });
    },
    // 今天的时间
    setDay() {
      const day = dayjs().format("YYYY-MM-DD");
      this.date = [day, day];
    },
    // 本周的时间
    setWeek() {
      const start = dayjs().day(1).format("YYYY-MM-DD");
      const end = dayjs().day(7).format("YYYY-MM-DD");
      this.date = [start, end];
    },
    //本月
    setMonth() {
      const start = dayjs().startOf("month").format("YYYY-MM-DD");
      const end = dayjs().endOf("month").format("YYYY-MM-DD");
      this.date = [start, end];
    },
    // 本年
    setYear() {
      const start = dayjs().startOf("year").format("YYYY-MM-DD");
      const end = dayjs().endOf("year").format("YYYY-MM-DD");
      this.date = [start, end];
    },
  },
  watch: {
    listState() {
      this.myCharts.setOption({
        title: {
          text: this.title + "趋势",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.listState.orderFullYearAxis,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "Direct",
            type: "bar",
            barWidth: "30%",
            color: "yellowgreen",
            data: this.listState.orderFullYear,
          },
        ],
      });
    },
  },
};
</script>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}
.clearfix {
  display: flex;
  justify-content: space-between;
  position: relative;
  .tab {
    width: 100%;
  }
  .tab_right {
    position: absolute;
    right: 0;
    .date {
      width: 300px;
    }
    span {
      padding: 0 10px;
    }
  }
}

.clearfix2 {
  .charts {
    width: 100%;
    height: 300px;
  }
  .sales_right {
    padding: 0;
    ul {
      list-style: none;
      width: 100%;
      height: 300px;
      li {
        height: 8%;
        margin: 15px 0px;
        span {
          margin: 0 10px;
          &:last-child {
            float: right;
            padding-right: 200px;
          }
        }
        .rindex {
          float: left;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: black;
          color: #fff;
          text-align: center;
          line-height: 20px;
        }
      }
    }
  }
}

// 去掉销售额  访问量下面的线
/deep/ .el-card__header {
  border-bottom: none;
}
</style>