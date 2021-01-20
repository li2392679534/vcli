<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="消息提示的文案"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="tabSel - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 表单 -->
      <el-form ref="baseInfoRef" :model="baseInfo" :rules="baseInfoRule">
        <!-- 标签页 -->
        <el-tabs
          @tab-click="getParams"
          :tab-position="tabPosition"
          style="height: 100%;"
          v-model="tabSel"
          :before-leave="beforeLeave"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="baseInfo.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="baseInfo.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                type="number"
                v-model="baseInfo.goods_weight"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                type="number"
                v-model="baseInfo.goods_number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 级联 -->
              <el-cascader
                v-model="baseInfo.goods_cat"
                :options="options"
                :props="prop"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyTable"
              :key="item.attr_id"
              :label="item.attr_name"
              ><br />
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :label="item2"
                  :key="i"
                  v-for="(item2, i) in item.attr_vals"
                >
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyTable"
              :key="item.attr_id"
              :label="item.attr_name"
              ><br />
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handlesuccess"
              :file-list="fileList"
              list-type="picture"
              :headers="headerObj"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <!-- 图片预览框 -->
            <el-dialog :visible.sync="imgVisible">
              <img width="100%" :src="dialogImageUrl" alt="" />
            </el-dialog>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="baseInfo.goods_introduce"></quill-editor>
            <el-button type="primary" @click="addGoodsSure">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import _ from 'lodash'
console.log(_)
export default {
  data() {
    return {
      // 图片上传路径
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片预览框
      imgVisible: false,
      // 图片预览地址
      dialogImageUrl: '',
      // 上传图片请求头
      headerObj: { Authorization: window.sessionStorage.getItem('token') },
      // 图片列表
      fileList: [],
      // 复选框选中状态
      checked: true,
      // 动态参数
      manyTable: [],
      // 静态属性
      onlyTable: [],
      // 标签页被选中的name
      tabSel: 0,
      tabPosition: 'left',
      //   基本信息表单
      baseInfo: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      //   基本信息验证规则
      baseInfoRule: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      //  级联数据
      options: [],
      //   被选中的级联选项
      selKey: [],
      //   级联规则
      prop: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover'
      }
    }
  },
  mounted() {
    this.getCat()
  },
  methods: {
    tabActive(i) {},
    //   获取级联数据
    async getCat() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.options = res.data
      // console.log(res.data)
    },
    // 级联变化事件
    handleChange() {
      if (this.baseInfo.goods_cat.length !== 3) {
        this.baseInfo.goods_cat = []
        return false
      }
    },
    // 标签页切换验证
    beforeLeave(after, before) {
      if (before === '0') {
        if (this.baseInfo.goods_name === '') {
          this.$message.error('请输入商品名称')
          return false
        } else if (this.baseInfo.goods_price === 0) {
          this.$message.error('请输入商品价格')
          return false
        } else if (this.baseInfo.goods_weight === 0) {
          this.$message.error('请输入商品重量')
          return false
        } else if (this.baseInfo.goods_number === 0) {
          this.$message.error('请输入商品数量')
          return false
        } else if (this.baseInfo.goods_cat.length !== 3) {
          this.$message.error('请选择商品分类')
          return false
        }
      }
    },
    // 获取商品参数和属性
    async getParams() {
      if (this.tabSel === '1') {
        // 动态参数
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'many' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        console.log(res)
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.split(' ')
        })
        this.manyTable = res.data
      } else if (this.tabSel === '2') {
        // 静态属性
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'only' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        console.log(res)
        this.onlyTable = res.data
      }
    },
    // 图片预览
    handlePreview(file) {
      this.dialogImageUrl = file.url
      this.imgVisible = true
    },
    // 图片删除
    handleRemove(file) {
      console.log(file)
      // 获取路径用来查找索引
      const filePath = file.response.data.tmp_path
      // 用findIndex方法根据路径查找索引
      const index = this.baseInfo.pics.findIndex(ele => ele.pic === filePath)
      this.baseInfo.pics.splice(index, 1)
    },
    // 上传成功
    handlesuccess(file) {
      console.log(file)
      this.baseInfo.pics.push({ pic: file.data.tmp_path })
    },
    // 添加商品
    addGoodsSure() {
      this.$refs.baseInfoRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写必要的表单项')
        // 验证通过就深拷贝
        const form = _.cloneDeep(this.baseInfo)
        console.log(form)
        // goods_cat转字符串
        form.goods_cat = form.goods_cat.join(',')
        // attrs动态参数
        this.manyTable.forEach(ele => {
          form.attrs.push({
            attr_id: ele.attr_id,
            attr_value: ele.attr_vals.join(' ')
          })
        })
        // attrs静态属性
        this.onlyTable.forEach(ele => {
          form.attrs.push({
            attr_id: ele.attr_id,
            attr_value: ele.attr_vals
          })
        })
        // 调接口
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.$router.push('/goods')
      })
    }
  },

  computed: {
    // 通过计算属性获取三级分类
    cateId() {
      if (this.baseInfo.goods_cat.length === 3) {
        return this.baseInfo.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style scoped>
.el-input {
  margin-bottom: 5px;
}
.el-button--primary {
  margin-top: 15px;
}
</style>
