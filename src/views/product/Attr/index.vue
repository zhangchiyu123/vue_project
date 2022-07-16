<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :isShowTable="!isShowTable"
      ></CategorySelect>
    </el-card>
    <el-card>
      <!-- 添加属性|修改属性的结构 -->
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttr"
          :disabled="!isShowTable"
          >添加属性</el-button
        >
        <!-- 表格:展示平台属性 -->
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column
            label="序号"
            width="80px"
            type="index"
            align="center"
          >
          </el-table-column
          ><el-table-column prop="attrName" label="属性名称" width="150px">
          </el-table-column
          ><el-table-column prop="prop" label="属性值列表" width="width">
            <!-- row 就是数组当中的每一个元素   $index暂时没用  要报错 -->
            <template slot-scope="{ row }">
              <el-tag
                type="success"
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                style="margin: 0 15px"
                >{{ attrValue.valueName }}</el-tag
              >
            </template> </el-table-column
          ><el-table-column prop="prop" label="操作" width="150px">
            <template slot-scope="{ row, $index }">
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-edit"
                style="margin-right: 10px"
                @click="updateAttr(row)"
              ></el-button>
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="deleteAttrValueList($index)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowTable">
        <el-form
          :inline="true"
          ref="form"
          label-width="80px"
          v-model="attrInfo"
        >
          <el-form-item label="属性名" align="left">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table
          style="width: 100%; margin: 20px 0"
          border
          :data="attrInfo.attrValueList"
        >
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column width="width" prop="prop" label="属性值名称">
            <template slot-scope="{ row, $index }">
              <!-- 这里的结构需要用到ipnut和span进行来回的切换 -->
              <!-- .trim  去掉前后空格 -->
              <el-input
                v-model.trim="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                v-if="row.flag"
                @blur="tolook(row)"
                @keyup.native.enter="row.flag = false"
                ref="inputBox"
              ></el-input>
              <!-- 没有使用$index,也能实现效果  :ref="$index"  👆 -->
              <span v-else @click="toEdit(row)" class="attr_span">{{
                row.valueName
              }}</span>
            </template>
          </el-table-column>
          <el-table-column width="width" prop="prop" label="操作">
            <template slot-scope="{ row, $index }">
              <!-- 气泡确认框 -->
              <el-popconfirm
                :title="`确定删除${row.valueName}?`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="addOrUpdateAttr"
          :disabled="attrInfo.attrValueList.length == 0"
          >保存</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入 lodash
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      // 给每一个属性值添加一个flag标记，用于切换控制查看模式和编辑模式，每一个属性值都能控制自己的模式切换
      // 当前flag属性，是一个响应式属性
      flag: true,
      // 接收平台属性的字段
      attrList: [],
      // 控制table表格的显示与隐藏
      isShowTable: true,
      //收集新增属性|修改属性使用的
      attrInfo: {
        attrName: "123", //属性名
        attrValueList: [
          //属性值，因为属性值可以有多个因此用数组，每一个属性值都是一个对象需要attrId，valueName
          // 取消占位 不让它上来就显示
        ],
        categoryId: 0, //三级分类的id
        categoryLevel: 3, //因为服务器也需要区分几级id
      },
    };
  },
  methods: {
    // 从子组件获取数据的自定义事件回调
    getCategoryId(catrgoryId) {
      // const { catrgory1Id } = catrgoryId;
      // Object.assign({}, catrgoryId.category1Id);
      // Object.assign({}, catrgoryId.category2Id);
      // Object.assign({}, catrgoryId.category3Id);
      const { category1Id } = catrgoryId;
      const { category2Id } = catrgoryId;
      const { category3Id } = catrgoryId;
      // const cid3 = catrgoryId.category3Id;
      this.category1Id = category1Id;
      this.category2Id = category2Id;
      this.category3Id = category3Id;
      // 发请求获取品牌属性
      this.getAttrList();
    },
    // 获取品牌属性的方法
    // 当用户确定了三级分类的时候，可以向服务器发请求获取平台属性进行展示
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      // 又是为了解决404的BUG,只有三级分类都被选中,才发请求  🐂
      if ((category1Id, category2Id, category3Id)) {
        let result = await this.$API.attr.reqAttrList(
          category1Id,
          category2Id,
          category3Id
        );
        if (result.code === 200) {
          this.attrList = result.data;
        }
      }
    },

    //自定义事件的回调
    // getCategoryId({ categoryId, level }) {
    //   //区分三级分类相应的id，以及父组件进行存储
    //   if (level == 1) {
    //     this.category1Id = categoryId;
    //     this.category2Id = "";
    //     this.category3Id = "";
    //   } else if (level == 2) {
    //     this.category2Id = categoryId;
    //     this.category3Id = "";
    //   } else {
    //     //代表三级分类的id有了
    //     this.category3Id = categoryId;
    //     //发请求获取平台的属性数据
    //     this.getAttrList();
    //   }
    // },
    //获取平台属性的数据
    //当用户确定三级分类的数据时候，可以向服务器发请求获取平台属性进行展示
    async getAttrList() {
      //获取分类的ID
      const { category1Id, category2Id, category3Id } = this;
      //获取属性列表的数据
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    // 添加属性值的回调
    addAttrValue() {
      // 向属性值的数组里面添加元素
      // attrId是相应的属性的id，目前我们是添加属性的操作，还没相应属性的id，目前而言带给服务器的id为undefined
      // valueName:相应的属性值的名称
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, // 对于修改某一个属性的时候，可以在已有的属性值的基础之上，新增新的属性(新增属性值的时候，需要把已有属性的id带上)
        valueName: "",
        flag: true,
      });
      console.log(this.attrInfo);
      // 自动聚焦到新增的input框
      this.$nextTick(() => {
        // this.$refs.inputBox[this.attrInfo.attrValueList.length - 1].focus();
        this.$refs.inputBox.focus();
      });
    },
    addAttr() {
      // 切换table显示与隐藏
      this.isShowTable = false;
      // 清除数据

      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        // 还可以收集三级分类的id
        categoryId: this.category3Id,
        categoryLevel: 3,
      };
    },
    // 修改某一个属性
    updateAttr(row) {
      this.isShowTable = false;
      // 将选中的属性赋值给attrinfo
      // 由于数据结构当中存在对象，数组里面又套对象，{...row}不能完全解决问题，因此需要使用深拷贝解决这类问题
      // this.attrInfo = JSON.parse(JSON.stringify(row)); // 也可以解决
      // lodash 插件也能解决
      this.attrInfo = cloneDeep(row);

      // 在修改某一个属性的时候，将相应的属性值元素添加上flag这个标记
      this.attrInfo.attrValueList.forEach((item) => {
        // 这样书写也可以给属性值添加flag字段，但是会发现视图不会跟着变化，(因为flag不是响应式的数据)
        // 因为 Vue 无法探测普通的新增 property (比如 this.myObject.newProperty = 'hi'),这样书写的数据并非响应式的
        // item.flag = false;

        // 正解👇
        // 第一个参数，对象  第二个参数:添加新的响应式属性，第三个：新的属性的属性值
        this.$set(item, "flag", false);
      });
    },
    // 失去焦点的回调----切换为查看模式、展示模式(span)
    tolook(row) {
      if (row.valueName.trim() == "") {
        // row 形参是当前用户添加的最新属性值
        // 当前编辑模式切换为查看模式,[让input消失,显示span的内容]
        // 如果属性值为空，不能作为新的属性值，需要给用户提示,让他输入其他的属性值
        this.$message({
          message: "请您输入正确的属性值",
          type: "warning",
          offset: 140,
        });
        return;
      }
      let isRepat = this.attrInfo.attrValueList.some((item) => {
        //需要将row从数组里面判断的时候去除
        //row最新新增的属性值【数组的最后一项元素】
        //判断的时候，需要把已有的数组当中新增的这个属性值去除
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });
      if (isRepat) return;
      // row：形参是当前用户添加的最新的属性值
      // 当前编辑模式变为查看模式【让input消失，显示span】
      row.flag = false;
    },
    // 点击span的回调，变成编辑模式
    toEdit(row) {
      row.flag = true;
      // 需要注意，点击span的时候，切换input变为编辑模式，但是需要注意，对于浏览器而言，页面重绘与重排需要耗时间
      // 点击span的时候，重绘重排一个input它是需要时间的，因此我们不能一点span就立马获取到input
      // 当节点渲染完毕会执行一次，
      this.$nextTick(() => {
        // 获取相应的input表单元素 实现聚焦
        this.$refs.inputBox.focus();
      });
      // (没有使用$index也能实现)  👇
      // this.$nextTick(() => {
      //   //获取相应的input表单元素实现聚焦
      //   this.$refs[index].focus();
      // });

      // console.log(this.$refs.inputBox);
    },
    // 气泡确认框 确定按钮的回调
    // 最新版本的elementui-----2.15.7，目前模板中是2.13，
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1);
    },
    // 保存按钮:进行添加属性或者修改属性的操作
    async addOrUpdateAttr() {
      // 整理参数:如果用户添加了很多属性值,且属性值为空，不应该提交给服务器
      // 提交给服务器数据当中不应该出现flag字段
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          delete item.flag;
          return item.valueName.trim() !== ""; // 这里老师用的if来判断
        }
      );
      // 发请求
      let result = await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
      // 有属性值为空，不能保存提交(但没啥卵用呢...)
      let test = this.attrInfo.attrValueList.some((item) => {
        return item.valueName == "";
      });
      if (result.code == 200 && !test) {
        this.$message({
          message: "保存成功",
          type: "success",
        });
        // 保存成功以后需再次获取平台数据进行展示,这里老师用的try catch
        this.getAttrList();
        this.isShowTable = true;
      } else {
        this.$message("保存失败");
      }
    },
    // 没有请求可以发...  删除某一行属性值
    deleteAttrValueList(index) {
      this.attrList.splice(index, 1);
    },
  },
};
</script>
 
<style>
.el-form-item__label {
  text-align: left !important;
}
.attr_span {
  display: inline-block;
  line-height: 30px;
  width: 200px;
  height: 30px;
  background-color: pink;
}
</style> 