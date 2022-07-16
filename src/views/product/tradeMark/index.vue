<template>
  <div>
    <!-- 按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0"
      @click="showDialog"
      >添加</el-button
    >
    <!-- 表格组件 
         data: 表格组件将来需要战术的数据----数组类型
         border:给表格添加边框
         label:显示的标题
         width:对应列的宽度
         align:标题的对齐方式
         prop:对应列内容的字段名，也可以使用 property 属性
         注意1:element-ui的table组件，展示的是以一列一列进行展示数据
           -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column
        type="index"
        prop="prop"
        label="序号"
        width="80px"
        align="center"
      ></el-table-column>

      <el-table-column
        prop="tmName"
        label="品牌名称"
        width="width"
      ></el-table-column>

      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <!-- <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template> -->
        <!-- 接口图片的前几个是本地的,改用了elementui的图片组件 好看一点 -->
        <div class="demo-image" style="">
          <div class="block" v-for="fit in fits" :key="fit">
            <span class="demonstration"></span>
            <el-image
              style="width: 100px; height: 100px; texe-align: center"
              :src="url"
              :fit="fit"
            ></el-image>
          </div>
        </div>
      </el-table-column>

      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器
         当前第几页、数据总条数、每一页展示条数、连续页码数
         @size-change="handleSizeChange"  pageSize 改变时会触发
         @current-change="handleCurrentChange"  currentPage 改变时会触发
         
         :current-page:代表的是当前第几页
         total:代表分页器一共需要数据的条数
         page-size：代表的是可以设置每一页需要展示多少条数据
         laout:可以实现分页器的布局
         pager-count:页码按钮的数量，当总页数超过该值时会折叠 大于等于 5 且小于等于 21 的奇数
         page-sizes:每页显示个数选择器的选项设置  [10, 20, 30, 40, 50, 100]
          -->

    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      :page-count="7"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
    </el-pagination>

    <!-- 对话框
          :visible.sync  控制对话框显示与隐藏用的 -->
    <!-- Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可。 -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- form表单元素 添加:model属性,这个属性的作用是,把表单的数据收集到那个对象身上 将来elementui 需要表单验证，也需要这个属性-->
      <el-form :model="tmForm" style="width: 80%" :rules="rules" ref="ruleForm">
        <el-form-item
          label="品牌名称"
          :label-width="formLabelWidth"
          prop="tmName"
        >
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item
          label="品牌LOGO"
          :label-width="formLabelWidth"
          prop="logoUrl"
        >
          <!-- 
               :on-success="handleAvatarSuccess"  图片上传成功时的钩子
               :before-upload="beforeAvatarUpload"  上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。-->
          <!-- 收集logo图片数据，不能使用v-model，因为不是表单元素 
                action 上传图片的地址-->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件,且不超过500kb
            </div>
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <!-- <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "trandMark",
  data() {
    // 自定义校验规则
    var validateTmName = (rule, value, callback) => {
      // 自定义校验规则
      if (value.length < 2 || value.length > 10) {
        callback(new Error("品牌名称需要2-10位"));
      } else {
        callback();
      }
    };
    return {
      // 代表的是分页器第几页
      page: 1,
      // 代表的是页数展示的数据条数
      limit: 3,
      // 总共数据的条数:
      total: 0,
      // 列表展示的数据:
      list: [],
      // 图片组件假数据
      fits: ["cover"],
      url: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202004%2F09%2F20200409093100_vnumo.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1653557010&t=b2c4a66e5bab3c26255bd03d968160a8",
      //对话框显示与隐藏控制的属性:
      dialogFormVisible: false,
      // 收集对话框的品牌名称
      tmForm: {
        // 收集品牌信息:对象身上的属性，不能乱写，要和后台文档服务器一致
        tmName: "",
        logoUrl: "",
      },
      // 表单验证的规则
      rules: {
        // 品牌名称验证
        tmName: [
          // trigger 代表的是用户的行为，什么行为下触发(事件的设置  blur change)
          // required 必须要校验的字段  (和前面红五角星有关系)
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          // {min: 2,max: 10,message: "长度在 2 到 10 个字符",trigger: "change",},

          // 自定义校验规则
          { validator: validateTmName, trigger: "blur" },
        ],
        // logo验证
        logoUrl: [
          { required: true, message: "请选择品牌logo图片", trigger: "blur" },
        ],
      },
      formLabelWidth: "120px",
    };
  },
  mounted() {
    // 组件挂载完毕发请求
    console.log(this.$API);
    this.getPageList();
  },
  methods: {
    // 获取品牌列表的接口
    async getPageList() {
      // 解构出参数
      const { page, limit } = this;
      // 当你向服务器发请求的时候，这个函数需要带参数，因此在data中初始化两个字段，代表会给服务器传递参数
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      console.log(result, "获取品牌列表的接口");
      if (result.code === 200) {
        // 分别是展示数据总数与列表展示的数据
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    // CurrentChange  改变时会触发
    handleCurrentChange(pager) {
      this.page = pager;
      this.getPageList();
    },
    // pageSize 当分页器某一页需要展示数据条数发生变化时会触发改变时会触发
    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },
    // 点击添加品牌的按钮
    showDialog() {
      // 显示对话框
      this.dialogFormVisible = true;
      // 每次都清理一下数据
      this.tmForm.tmName = "";
      this.tmForm.logoUrl = "";
    },
    // 修改某一个品牌
    updateTradeMark(row) {
      // row 是当前用户选中的这个品牌的信息 来自服务器
      console.log(row);
      // 显示对话框
      this.dialogFormVisible = true;
      // 将已经有的品牌的信息，赋值给tmform进行展示
      // 将服务器返回的品牌的信息，直接赋值给了tmForm进行展示
      // 也就是tmForm存储的即为服务器返回品牌的信息也就是tmForm存储的即为服务器返回品牌的信息

      // 其实就是=把两个对象指向同一地址，改其中一个另外一个也跟着变
      // 就是服务器返回来数据是个对象 你点击修改之后会把这个对象得地址值给tmForm 所以你修改tmForm 返回来得数据也会修改 注意并不会修改服务器数据
      // 最简单的你就记住 扩展运算符三个点就是浅拷贝 除了这个还有concat splice 都是浅拷贝 深拷贝是json的递归调用
      this.tmForm = { ...row };
    },

    // 上传图片相关的回调
    // 图片上传成功
    handleAvatarSuccess(res, file) {
      // res 上传成功之后返回前端数据
      // file 上传成功之后服务器返回给前端的数据
      // 收集品牌图片的数据,因为将来需要带给服务器
      // 弹幕：这里老师没讲清楚,一般用户上传的服务器是cdn,然后返回给前端的一个url.前端需要收集这个url提交给自己的后台服务器
      this.tmForm.logoUrl = res.data;
    },
    // 图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 添加按钮(添加或者是修改)
    addOrUpdateTradeMark() {
      // 当全部的字段通过，再去书写业务逻辑
      this.$refs.ruleForm.validate(async (success) => {
        // 如果全部的字段符合条件
        if (success) {
          // 隐藏对话框
          this.dialogFormVisible = false;
          // 发请求 (添加品牌/修改品牌)
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(
            this.tmForm
          );
          if (result.code === 200) {
            // 弹出信息可能是添加品牌成功，或者修改品牌成功
            this.$message({
              type: "success",
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
            });
            // 添加或者修改品牌成功之后，再发请求获取新的列表进行展示
            this.getPageList();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 删除某个品牌的按钮
    deleteTradeMark(row) {
      this.$confirm(`是否要删除${row.tmName}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            // 再发请求获取品牌列表数据
            this.getPageList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>


