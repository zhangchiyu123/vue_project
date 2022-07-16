<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :isShowTable="scene !== `SPU列表`"
      ></CategorySelect>
    </el-card>
    <el-card>
      <!-- 底部这里将来是三部分来进行切换 -->
      <div v-show="scene == 'SPU列表'">
        <!-- 展示spu列表的结构 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row }">
              <!-- 这里的按钮,将来用hintbutton替换
              为了让你知道怎么用的，老师之前就讲了你也可以用饿了么按钮的title -->
              <el-button
                type="success"
                icon="el-icon-circle-plus-outline"
                size="mini"
                title="添加sku"
                style="margin: 10px"
                @click="addSku(row)"
              ></el-button>
              <HintButton
                type="warning"
                size="mini"
                icon="el-icon-edit"
                title="修改spu"
                @click="updateSpu(row)"
              ></HintButton>
              <HintButton
                type="info"
                icon="el-icon-warning"
                size="mini"
                title="查看当前spu全部sku列表"
                @click="handler(row)"
              ></HintButton>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSpu(row)"
              >
                <HintButton
                  type="danger"
                  icon="el-icon-delete"
                  title="删除spu"
                  size="mini"
                  slot="reference"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- "
           -->
        <el-pagination
          style="text-align: center"
          :current-page="page"
          :page-sizes="[5, 7, 10]"
          :page-size="limit"
          layout=" prev, pager, next, jumper,->,sizes,total"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>
      <SpuForm
        v-show="scene == '添加SPU'"
        @sceneChange="sceneChange"
        ref="spu"
      ></SpuForm>
      <SkuForm
        v-show="scene == '添加SKU'"
        ref="sku"
        @getNum="getNum"
        @changeScenes="changeScenes"
      ></SkuForm>
    </el-card>
    <!-- ********************   sku详情的弹出框 -->
    <el-dialog
      :title="`${spu.spuName} 的sku列表`"
      :visible.sync="dialogTableVisible"
      :before-close="close"
    >
      <el-table :data="skuList" style="width: 100%" border v-loading="loading">
        <!-- table展示 -->
        <el-table-column prop="skuName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="price" label="价格" width="width">
        </el-table-column>
        <el-table-column prop="weight" label="重量" width="width">
        </el-table-column>
        <el-table-column label="默认图片" width="width">
          <template slot-scope="{ row }">
            <el-image
              style="width: 100px; height: 100px"
              :src="row.skuDefaultImg"
            ></el-image>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SkuForm from "./SkuForm";
import SpuForm from "./SpuForm";
export default {
  name: "spu",
  components: {
    SkuForm,
    SpuForm,
  },
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      // 控制三级联动的可操作性
      page: 1, // 分页器当前第几页
      limit: 5, // 每一页需要展示多少条数据
      total: 0, //总条数
      records: [], //spu列表的数据
      scene: "SPU列表", // 0代表展示SPU列表数据  1添加SPU|修改SPU   2添加SKU
      abc: "",
      dialogTableVisible: false, // 控制 sku详情的对话框 显示隐藏
      spu: {},
      skuList: [], // 存储的是sku列表的数据
      loading: true,
    };
  },
  methods: {
    // 三级联动
    // 从子组件获取数据的自定义事件回调
    getCategoryId(catrgoryId) {
      const { category1Id } = catrgoryId;
      const { category2Id } = catrgoryId;
      const { category3Id } = catrgoryId;
      this.category1Id = category1Id;
      this.category2Id = category2Id;
      this.category3Id = category3Id;
      // 发请求获取品牌属性
      this.getSpuList();
    },
    //获取SPU列表数据的方法
    //三级联动的自定义事件，可以把子组件的相应的id传递给父组件
    // getCategoryId({ categoryId, level }) {
    //   //categoryId:获取到一、二、三级分类的id  level：为了区分是几级id
    //   if (level == 1) {
    //     this.category1Id = categoryId;
    //     //清除2、3级分类的id
    //     this.category2Id = "";
    //     this.category3Id = "";
    //   } else if (level == 2) {
    //     this.category2Id = categoryId;
    //     //清除3级id
    //     this.category3Id = "";
    //   } else {
    //     this.category3Id = categoryId;
    //     //获取SPU列表数据进行展示
    //     this.getSpuList();
    //   }
    // },
    async getSpuList() {
      const { page, limit, category3Id } = this;
      //携带三个参数:page 第几页  limit 每一页需要展示多少条数据  三级分类id
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    // 点击分页器的第几页按钮的回调
    handleCurrentChange(page) {
      this.page = page;
      this.getSpuList();
    },
    // 当分页器的某一页展示数据的条数，发生变化的回调
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    // 添加spu按钮的回调
    addSpu() {
      this.$bus.$emit("addSpuData", this.category3Id);
      this.scene = "添加SPU";
      // 通知子组件spuform发请求---品牌 销售属性
    },
    // 修改spu按钮的回调
    updateSpu(row) {
      // 获取子组件Spuform,触发子组件的initSpuData事件，让子组件发请求(老师的方法)
      // this.$refs.spu.initSpuData(); 在父组件当中，可以通过$ref获取子组件、children
      // 直接v-if也可以,不用v-show
      // 全局事件总线实现
      this.$bus.$emit("initSpuData", row);
      this.scene = "添加SPU";
    },
    // 自定义事件，子组件点击取消,scene切换为'SPU列表'，显示SPU列表
    sceneChange(scene) {
      this.scene = scene;
      // 子组件通知父组件切换场景，需要再次获取SPU列表的数据进行展示
      this.getSpuList();
    },
    // 删除SPU
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message({
          message: "保存成功",
          type: "success",
          offset: 140,
        });
        this.getSpuList();
      }
    },
    // 添加SKU
    addSku(row) {
      // 通知子组件发请求----3个
      this.$bus.$emit(
        "getData",
        this.category1Id,
        this.category2Id,
        this.category3Id,
        row
      );
      this.scene = "添加SKU";
    },
    // 测试用的自定义事件
    getNum(num) {
      this.abc = num;
    },
    // skuform通知父组件修改场景
    changeScenes(scene) {
      this.scene = scene;
    },
    // 查看sku按钮的回调
    async handler(spu) {
      // 点击按钮的时候，对话框可见
      this.dialogTableVisible = true;
      // 需要储存传过来的row(spu)的信息
      this.spu = spu;
      // 获取sku列表的数据进行展示
      let result = await this.$API.spu.reqSkuList(spu.id);
      if (result.code == 200) {
        this.skuList = result.data;
        this.loading = false;
      }
    },
    // 对话框关闭的回调  弹幕:close事件也可以
    close(done) {
      // loading属性再次变成真,重置loading效果
      this.loading = true;
      // 清除sku列表的数据
      this.skuList = [];
      // 关闭对话框
      done();
    },
  },
};
</script>

<style>
</style>