<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="tm in tradeMarkList"
            :key="tm.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="SPU描述"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 上传图片 
        action:图片上传的地址  
        list-type:文件列表的类型 on-preview:图片预览的时候触发 
        on-remove；图片删除的时候触发   
        file-list:上传照片墙需要的的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}] -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="spuImageList"
          :on-success="handlerSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${unSelectSaleAttr.length}未选择 `"
          v-model="attrId_AttrName"
        >
          <el-option
            :label="unselect.name"
            :value="`${unselect.id}:${unselect.name}`"
            v-for="unselect in unSelectSaleAttr"
            :key="unselect.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-left: 20px"
          size="mini"
          :disabled="!attrId_AttrName"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <!-- 展示的是当前SPU属于自己的销售属性 -->
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row }">
              <!-- el-tag是为了展示已有属性值列表的数据 -->
              <el-tag
                v-for="(tag, index) in row.spuSaleAttrValueList"
                :key="tag.id"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- 底下的结构v-if，可以当作之前的span和input的切换
                    @keyup.enter.native="handleInputConfirm"
                    -->
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @blur="handleInputConfirm(row)"
              >
                <!-- @click="showInput" -->
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="spu.spuSaleAttrList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="add_UpdateSpu">保存</el-button>
        <el-button @click="goScene">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      // spu属性初始化的时候是一个空对象，在修改spu的时候，会向服务器发请求，返回SPU信息，在修改的时候可以利用服务器返回的这个对象收集最新的数据提交给服务器
      // spu的添加，如果是添加spu的时候，并没有向服务器发请求，数据还是收集到[spu]收集数据的时候需要有哪些字段，看笔记 36)
      spu: {
        category3Id: 0,
        // 描述
        description: "",
        spuName: "",
        // 品牌的id
        tmId: "",
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        // 平台属性与属性值
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      }, //存储spu的信息属性
      tradeMarkList: [], // 存储品牌的信息
      spuImageList: [], // 存储SPU图片的数据
      saleAttrList: [], //销售属性的数据（项目全部的销售属性）
      attrId_AttrName: "", // 收集未选择的销售属性id，一共三个，选中谁就是谁的id
    };
  },
  mounted() {
    // 全局事件总线实现 老师用的ref,在父组件spu
    this.$bus.$on("initSpuData", this.initSpuData);
    this.$bus.$on("addSpuData", this.addSpuData);
  },
  methods: {
    // elementui 照片墙
    handleRemove(file, fileList) {
      //file参数:代表的是删除的那个张图片
      //fileList:照片墙删除某一张图片以后，剩余的其他的图片
      // console.log(file, fileList,22222);
      //收集照片墙图片的数据
      //对于已有的图片【照片钱中显示的图片：有name、url字段的】，因为照片墙显示数据务必要有这两个属性
      //对于服务器而言，不需要name、url字段，将来对于有的图片的数据在提交给服务器的时候，需要处理的
      this.spuImageList = fileList;
    },
    // 照片墙图片预览的回调
    handlePictureCardPreview(file) {
      // 将图片的地址赋值给这个属性
      this.dialogImageUrl = file.url;
      // 对话框的显示
      this.dialogVisible = true;
    },
    // 自定义事件的回调,更改父组件的secne为'SPU列表'
    goScene() {
      this.$emit("sceneChange", "SPU列表");
      // 清理数据  笨办法找到data里面的值，一个一个的清
      // Object.assign:es6中新增的方法，可以合并对象
      // 组件实例this._data,可以操作data当中的响应式数据
      // this.$options 获取当前组件的配置对象，配置对象的data函数执行,返回的响应式数据为空
      Object.assign(this._data, this.$options.data());
    },
    // 初始化Spuform的数据  spu就是父组件传过来的row 目的是为了拿里面的ld
    async initSpuData(spu) {
      // 获取SPU的信息
      let result = await this.$API.spu.reqSpu(spu.id);
      if (result.code == 200) {
        // 在修改spu的时候，是需要向服务器发请求的，把服务器返回的数据(对象)，赋值给spu
        this.spu = result.data;
      }
      // 获取品牌的信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      // 获取SPU图片的的信息
      let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (spuImageResult.code == 200) {
        // 由于照片墙显示图片所需要的数据需要数组，数组里面的元素需要有name和url字段
        // 需要把服务器返回的数据进行修改
        let ListArr = spuImageResult.data;
        ListArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        // 把整理好的数据赋值给spuImageList
        this.spuImageList = ListArr;
      }

      // 获取平台全部销售属性(最多仨)  试着用then方法..
      this.$API.spu
        .reqBaseSaleAttrList()
        .then((res) => {
          this.saleAttrList = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 照片墙上传成功的回调
    handlerSuccess(response, file, fileList) {
      // 收集图片的信息
      this.spuImageList = fileList;
    },
    // 添加新的销售属性
    addSaleAttr() {
      // 已经收集到了需要添加的销售属性的信息
      // 把收集到的数据进行分割  数组按照顺序解构
      const [baseSaleAttrId, saleAttrName] = this.attrId_AttrName.split(":");
      // 向SPU对象的spuAttrList属性里面添加新的销售属性
      let newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      // 添加新的销售属性
      this.spu.spuSaleAttrList.push(newSaleAttr);
      // 清空数据
      this.attrId_AttrName = "";
    },
    // 添加按钮的回调
    addSaleAttrValue(row) {
      // 当你点击销售属性值当中的添加按钮的时候，需要由button变成input，通过inputVisible进行控制
      // 挂载在销售属性身上的响应式数据，控制着button和input的切换
      this.$set(row, "inputVisible", true);
      // 通过响应式数据inputVaule字段收集新增的销售属性值
      this.$set(row, "inputVaule", "");
    },
    // el-input失去焦点的事件
    handleInputConfirm(row) {
      // 结构出销售属性中收集的数据
      const { baseSaleAttrId, inputValue } = row;
      // 新增的销售属性值不能为空
      if (inputValue.trim() == "") {
        this.$message("属性值不能为空");
        return;
      }

      // 属性值不能重复  为true就代表有重复的   老师用的every
      let result = row.spuSaleAttrValueList.some(
        (item) => item.saleAttrValueName == inputValue
      );
      if (result)
        this.$message({
          message: "无效操作",
          type: "error",
          offset: 140,
        });
      // 新增的销售属性值
      let newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue };
      // 新增
      row.spuSaleAttrValueList.push(newSaleAttrValue);
      // 修改inputVisible 为false
      row.inputVisible = false;
    },
    // 保存按钮的回调
    async add_UpdateSpu() {
      // 整理参数：需要整理照片墙的数据】
      // 携带参数:对于图片，需要携带imageName与imageUrl字段
      // 发请求整理参数的时候，图片的字段是imgName和imgUrl
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          // 图片不显示的原因是因为带给服务器的字段是imgName和imgUlrl  老师写错了 别跟着抄
          imgName: item.name,
          // 新的图片要用👇这个地址，不然url里面的是本地地址
          // imgUrl: (item.response && item.response.data) || item.imgUrl
          imgUrl: (item.response && item.response.data) || item.imgUrl,
        };
        // (item.response.data ? item.response.data : item.imgUrl) || item.url,
      });
      let result = await this.$API.spu.reqAdd_UpdateSpu(this.spu);
      // 子组件通知父组件回到场景SPU列表
      if (result.code == 200) {
        this.$emit("sceneChange", "SPU列表");
        this.$message({
          message: "保存成功",
          type: "success",
          offset: 140,
        });
      }
    },
    // 点击添加SPU按钮的时候，发请求的函数(全局事件总线,父组件传过来的)
    // 添加spu的时候,收集category3Id
    async addSpuData(category3Id) {
      // 点击添加SPU的时候，清除数据
      Object.assign(this._data, this.$options.data());
      this.spu.category3Id = category3Id;
      // 获取品牌的信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      // 获取平台全部销售属性(最多仨)
      this.$API.spu
        .reqBaseSaleAttrList()
        .then((res) => {
          this.saleAttrList = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  computed: {
    // 计算出还未选择的销售属性
    unSelectSaleAttr() {
      //整个平台的销售属性一共三个:颜色、尺寸、版本  saleAttrList
      // 当前SPU拥有的属于自己的销售属性 spuSaleAttrValueList
      // 数组过滤方法，可以从已有的数组当中，过滤出用户的元素，并且返回一个新的数组

      // 弹幕：遍历两遍，一遍是所有属性，一遍是已有属性，找不相等的  😀
      let result = this.saleAttrList.filter((item) => {
        // every() 方法测试一个数组内的所有元素是否都能通过某个指定函数的测试。它返回一个布尔值。
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name !== item1.saleAttrName;
        });
      });
      return result;
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>