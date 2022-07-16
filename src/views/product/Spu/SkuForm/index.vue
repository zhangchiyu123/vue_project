<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称"> {{ spu.spuName }}</el-form-item>
      <el-form-item label="SKU名称">
        <el-input
          placeholder="sku名称"
          v-model="skuInfo.skuName"
          style="width: 300px"
        ></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input
          placeholder="价格(元)"
          v-model="skuInfo.price"
          type="number"
          style="width: 100px"
        ></el-input> </el-form-item
      ><el-form-item label="重量(千克)">
        <el-input
          placeholder="重量(一定要填写,不然会报错拿不到数据！！！)"
          style="width: 300px"
          v-model="skuInfo.weight"
        ></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input
          type="textarea"
          rows="4"
          style="resize: none; width: 300px"
          v-model="skuInfo.skuDesc"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item
            :label="attr.attrName"
            v-for="attr in attrInfoList"
            :key="attr.id"
          >
            <el-select placeholder="请选择" v-model="attr.attrID_ValueId">
              <el-option
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item
            :label="saleAttr.saleAttrName"
            v-for="saleAttr in spuSaveAttrList"
            :key="saleAttr.id"
          >
            <el-select v-model="saleAttr.attrID_ValueId" placeholder="请选择">
              <el-option
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
                v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          style="width: 100%"
          border
          :data="spuImageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            prop="prop"
            width="80"
            type="selection"
            align="center"
          >
          </el-table-column
          ><el-table-column
            prop="prop"
            label="图片"
            width="width"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-image
                style="width: 100px; height: 100px"
                :src="row.imgUrl"
              ></el-image>
            </template> </el-table-column
          ><el-table-column
            prop="imgName"
            label="名称"
            width="width"
            align="center"
          >
          </el-table-column
          ><el-table-column
            prop="prop"
            label="操作"
            width="width"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                v-if="row.isDefault == 0"
                @click="changeDefault(row)"
                >设为默认</el-button
              >
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      abc: "CNM",
      spuImageList: [], //存储图片的信息
      spuSaveAttrList: [], // 存储销售属性
      attrInfoList: [], // 存储平台属性
      // 收集sku的数据
      // 第一类收集的数据，父组件给的数据
      skuInfo: {
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        // 第二类 需要通过数据双向绑定v-model收集
        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",
        // 平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,   有用
          //   attrName: "string",
          //   id: 0,
          //   skuId: 0,
          //   valueId: 0, 有用
          //   valueName: "string",
          // },
        ],
        // 第三类 需要自己手写代码
        // 默认图片
        skuDefaultImg: "",
        // 收集图片的字段:但是需要注意，收集的数据缺少isDefault字段,将来提交给服务器数据的时候，需要整理参数
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        // 销售属性
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
      },
      spu: {},
      // 收集图片数据的字段
      imageList: [],
    };
  },
  mounted() {
    this.$bus.$on("getData", this.getData);
    // 测试用的自定义事件
    this.$emit("getNum", this.abc);
  },
  methods: {
    // 获取Skuform的数据
    async getData(category1Id, category2Id, category3Id, spu) {
      // 收集父组件给的数据
      this.skuInfo.category3Id = category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      this.spu = spu;
      // 获取图片的数据
      let result = await this.$API.spu.reqSpuImageList1(spu.id);
      if (result.code == 200) {
        // 往spuImageList 添加一个字段 isDefault  因为服务器没返回这个数据
        let list = result.data;
        list.forEach((item) => {
          item.isDefault = 0;
        });
        this.spuImageList = list;
      }
      // 获取销售属性的数据
      let result1 = await this.$API.spu.reqSpuSaveAttrList(spu.id);
      if (result1.code == 200) {
        this.spuSaveAttrList = result1.data;
      }
      // 获取平台属性的数据
      let result2 = await this.$API.spu.reqAttrInfoList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result2.code == 200) {
        this.attrInfoList = result2.data;
      }
    },
    //  table表格复选框按钮的事件
    handleSelectionChange(params) {
      // 获取到用户选中图片的信息，但是需要注意，当前收集的数据当中，缺少isDefault字段
      this.imageList = params;
    },
    // 排他操作
    changeDefault(row) {
      // 图片列表的数据的isDefault字段变成0
      this.spuImageList.forEach((item) => {
        item.isDefault = 0;
      });
      // 点击的那个图片数据为1
      row.isDefault = 1;
      // 收集一下默认图片的地址
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    cancel() {
      // 自定义事件，让父组件切换场景为0
      this.$emit("changeScenes", "SPU列表");
      // 清除数据,解决数据回显
      // 完整写法  Object.assign(this._data, this.$options.data.call(this))
      Object.assign(this._data, this.$options.data());
    },
    // 保存按钮
    async save() {
      // 需要整理参数
      // 先整理平台属性数据
      // 把attrID_ValueId:"4507:13481"这种数据  分割赋值给skuInfo.skuAttrValueList 再发给服务器
      const { attrInfoList, skuInfo, spuSaveAttrList, imageList } = this;
      // 整理平台属性的方式Ⅰ
      // 把收集到的数据先整理一下
      attrInfoList.forEach((item) => {
        // 代表当前平台属性，用户进行了选择
        if (item.attrID_ValueId) {
          const [attrId, valueId] = item.attrID_ValueId.split(":");
          // 可以直接push({valueId,attrId})
          // let obj = [valueId, attrId];
          skuInfo.skuAttrValueList.push({ valueId, attrId });
        }
      });

      //  整理平台属性的方式Ⅱ
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrID_ValueId) {
          const [attrId, valueId] = item.attrID_ValueId.split(":");
          prev.push({ valueId, attrId });
        }
        return prev;
      }, []);

      // 整理销售属性
      spuSaveAttrList.forEach((item) => {
        if (item.attrID_ValueId) {
          const [saleAttrId, saleAttrValueId] = item.attrID_ValueId.split(":");
          skuInfo.skuSaleAttrValueList.push({ saleAttrId, saleAttrValueId });
        }
      });

      // 整理图片的数据
      skuInfo.skuImageList = imageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });

      // 发请求  重量一定要添加，不然报错
      let result = await this.$API.spu.reqAddSku(skuInfo);
      // 自定义事件，让父组件切换场景为0
      this.$emit("changeScenes", "SPU列表");
      this.$message({
        message: "保存成功",
        type: "success",
        offset: 140,
      });
    },
  },
};
</script>

<style lang="less" scoped>
// .el-form-item ::v-deep {
//   .el-form-item__content {
//     color: skyblue;
//   }
// }
</style> 