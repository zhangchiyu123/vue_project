<template>
  <div>
    <!-- inline:代表的是行内表单，代表一行可以放置多个表单元素 -->
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category1Id"
          :disabled="isShowTable"
        >
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="c1 in list1"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category2Id"
          :disabled="isShowTable"
        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="c2 in list2"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category3Id"
          :disabled="isShowTable"
        >
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="c3 in list3"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  props: ["isShowTable"],
  data() {
    return {
      //一级分类的数据
      list1: [],
      //二级分类的数据
      list2: [],
      //三级分类的数据
      list3: [],
      //收集相应的一级二级三级分类的id
      cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  //组件挂载完毕：向服务器发请求，获取相应的一级分类的数据
  mounted() {
    //获取一级分类的数据的方法
    this.getCategory1List();
  },
  methods: {
    //获取一级分类数据的方法
    async getCategory1List() {
      //获取一级分类的请求：不需要携带参数
      let result = await this.$API.attr.reqCategory1List();
      if (result.code == 200) {
        this.list1 = result.data;
      }
    },
    //  老师的写法  😁
    // //一级分类的select事件回调（当一级分类的option发生变化的时候获取相应二级分类的数据）
    // async handler1() {
    //   //清除数据
    //   this.list2 = [];
    //   this.list3 = [];
    //   this.cForm.category2Id = "";
    //   this.cForm.category3Id = "";
    //   //解构出一级分类的id
    //   const { category1Id } = this.cForm;
    //   this.$emit("getCategoryId", { categoryId: category1Id, level: 1 });
    //   //通过一级分类的id，获取二级分类的数据
    //   let result = await this.$API.attr.reqCategory2List(category1Id);
    //   if (result.code == 200) {
    //     this.list2 = result.data;
    //   }
    // },
    // //二级分类的select事件回调（当二级分类的option发生变化的时候获取相应三级分类的数据）
    // async handler2() {
    //   //清除数据
    //   this.list3 = [];
    //   this.cForm.category3Id = "";
    //   //结构出数据
    //   const { category2Id } = this.cForm;
    //   this.$emit("getCategoryId", { categoryId: category2Id, level: 2 });
    //   let result = await this.$API.attr.reqCategory3List(category2Id);
    //   if (result.code == 200) {
    //     this.list3 = result.data;
    //   }
    // },
    // //三级分类的事件回调
    // handler3() {
    //   //获取三级分类的id
    //   const { category3Id } = this.cForm;
    //   this.$emit("getCategoryId", { categoryId: category3Id, level: 3 });
    // },
  },
  // 自己写的 ....😥
  watch: {
    // 监视一级列表的数据发生了改变，就根据一级列表的id发请求获取二级列表的数据
    // 这里老师使用的是@change，饿了么封装的原生事件  👆
    "cForm.category1Id": {
      async handler(newvalue, oldvalue) {
        // 一级分类发生变化 清除数据
        this.list3 = [];
        this.cForm.category2Id = "";
        this.cForm.category3Id = "";
        const { category1Id } = this.cForm;
        // this.$emit("getCaregoryId", category1Id);
        let result = await this.$API.attr.reqCategory2List(category1Id);
        if (result.code == 200) {
          this.list2 = result.data;
        }
      },
    },
    // 监听二级列表的数据发生了改变，就根据二级列表的id发请求获取三级列表的数据
    "cForm.category2Id": {
      async handler(newvalue, oldvalue) {
        // 二级分类发生变化 清除三级数据
        this.list3 = [];
        this.cForm.category3Id = "";
        const { category2Id, category1Id } = this.cForm;
        // this.$emit("getCaregoryId", category2Id);
        // 这个if为了解决发请求404的BUG，🐂！！！
        if (category2Id !== "" && category1Id !== "") {
          let result = await this.$API.attr.reqCategory3List(category2Id);
          if (result.code == 200) {
            this.list3 = result.data;
          }
        }
      },
    },
    "cForm.category3Id": {
      async handler(newvalue, oldvalue) {
        // 三级分类发生变化 清除三级数据
        this.$emit("getCategoryId", this.cForm);
      },
    },
  },
};
</script>

<style scoped>
</style>
