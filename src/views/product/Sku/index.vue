<template>
  <div>
    <!-- 表格 -->
    <el-table style="width: 100%" border :data="records">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="skuName" label="名称" width="width">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column>
      <el-table-column label="默认图片" width="180" align="center">
        <template slot-scope="{ row }">
          <el-image
            style="width: 100px; height: 100px"
            :src="row.skuDefaultImg"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="100" align="center">
      </el-table-column>
      <el-table-column prop="price" label="价格" width="100" align="center">
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row }">
          <HintButton
            type="success"
            icon="el-icon-bottom"
            size="mini"
            v-if="row.isSale == 0"
            @click="sale(row)"
          ></HintButton>
          <HintButton
            type="success"
            icon="el-icon-top"
            size="mini"
            v-else
            @click="cancel(row)"
          ></HintButton>
          <HintButton
            type="primary"
            icon="el-icon-edit"
            size="mini"
            title="修改"
            @click="edit"
          ></HintButton>
          <HintButton
            type="info"
            icon="el-icon-warning-outline"
            size="mini"
            title="详情"
            @click="getSkuInfo(row)"
          ></HintButton>
          <HintButton
            type="danger"
            icon="el-icon-delete"
            size="mini"
            title="删除"
          ></HintButton>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器      -->
    <el-pagination
      :current-page="1"
      :page-sizes="[15, 20, 25]"
      :page-size="10"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="20"
      style="text-align: center"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
    </el-pagination>
    <!-- 抽屉效果 
     :direction="direction"
      :before-close="handleClose"-->

    <el-drawer :visible.sync="show" size="40%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col> </el-row
      ><el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col> </el-row
      ><el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }} 元</el-col> </el-row
      ><el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag
            type="success"
            v-for="sku in skuInfo.skuAttrValueList"
            :key="sku.id"
            style="margin-right: 10px"
            >{{ sku.attrId }}-{{ sku.valueId }}</el-tag
          >
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="300px" style="width: 300px">
            <el-carousel-item
              v-for="item in skuInfo.skuImageList"
              :key="item.id"
            >
              <el-image
                style="width: 100%; height: 100%"
                :src="item.imgUrl"
              ></el-image>
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "sku",
  data() {
    return {
      page: 1, // 当前第几页
      limit: 10, //当前页面有几条数据
      records: [],
      total: 0,
      skuInfo: {},
      show: false,
    };
  },
  mounted() {
    // 获取sku列表的方法
    this.getSkuList();
  },
  methods: {
    // 获取sku列表的方法
    async getSkuList() {
      const { page, limit } = this;
      let result = await this.$API.sku.reqSkuList(page, limit);
      if (result.code == 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    // CurrentChange  改变时会触发
    handleCurrentChange(pager) {
      this.page = pager;
      this.getSkuList();
    },
    // pageSize 当分页器某一页需要展示数据条数发生变化时会触发改变时会触发
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSkuList();
    },
    // 上架
    async sale(row) {
      let result = await this.$API.sku.reqSale(row.id);
      if (result.code == 200) {
        // 老师用的  row.isSale = 1取反
        this.getSkuList();
        this.$message({
          message: "上架成功",
          type: "success",
          offset: 140,
        });
      }
    },
    // 下架
    async cancel(row) {
      let result = await this.$API.sku.reqCancelSale(row.id);
      if (result.code == 200) {
        // 老师用的  row.isSale = 0取反
        this.getSkuList();
        this.$message({
          message: "下架成功",
          type: "success",
          offset: 140,
        });
      }
    },
    edit() {
      this.$message({
        message: "功能正在开发中",
        type: "info",
        offset: 140,
      });
    },
    // 获取sku详情的方法
    async getSkuInfo(sku) {
      // 展示抽屉
      this.show = true;
      let result = await this.$API.sku.reqSkuById(sku.id);
      if (result.code == 200) {
        this.skuInfo = result.data;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.el-row .el-col-5 {
  font-size: 20px;
  text-align: right;
  font-weight: 700;
}
.el-col {
  margin: 10px;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

/deep/.el-carousel__button {
  width: 10px;
  height: 10px;
  background-color: #409eff;
  border-radius: 50%;
}
</style>
 
<style >
/* 除了深度选择器  也可以写到单独的一个style标签里面 */
</style>