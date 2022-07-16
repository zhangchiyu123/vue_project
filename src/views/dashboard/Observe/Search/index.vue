<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="search_header">
          <span>线上热门搜索</span>
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-more"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>黄金糕</el-dropdown-item>
              <el-dropdown-item>狮子头</el-dropdown-item>
              <el-dropdown-item>螺蛳粉</el-dropdown-item>
              <el-dropdown-item disabled>双皮奶</el-dropdown-item>
              <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div>
        <el-row :gutter="10">
          <el-col :span="12">
            <LineCharts>
              <span slot="user">搜索用户数</span>
              <span slot="content1">12321</span>
              <span slot="main">17.1</span>
            </LineCharts>
          </el-col>
          <el-col :span="12">
            <LineCharts>
              <span slot="user1">人均搜索次数</span>
              <span slot="content1">2.7</span>
              <span slot="main1">26.2</span>
            </LineCharts></el-col
          >
        </el-row>
        <!-- table表格 -->
        <!-- :default-sort="{ prop: 'date', order: 'descending' }" -->
        <el-table :data="tableData" style="width: 100%" border>
          <el-table-column prop="date" label="排名" width="80" type="index">
          </el-table-column>
          <el-table-column prop="name" label="搜索" width="280">
          </el-table-column>
          <!-- :formatter="formatter" -->
          <el-table-column prop="address" label="关键字" sortable>
          </el-table-column>
          <el-table-column prop="address" label="周涨幅" sortable width="160">
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          layout="prev, pager, next"
          :total="1000"
          class="pagination"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import LineCharts from "./lineCharts";
export default {
  name: "Search",
  data() {
    return {
      tableData: [{}],
    };
  },
  components: {
    LineCharts,
  },
};
</script>

<style lang="less" scoped>
.search_header {
  display: flex;
  justify-content: space-between;

  // 下拉框自带样式
  .el-dropdown-link {
    cursor: pointer;
    color: #409eff;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  //
}
.pagination {
  text-align: center;
}
</style>