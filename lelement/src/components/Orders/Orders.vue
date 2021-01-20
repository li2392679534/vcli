<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-input
        placeholder="请输入内容"
        v-model="search"
        class="input-with-select"
      >
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-table :data="orderData" stripe style="width: 100%" border>
        <el-table-column label="#" type="index" width="40"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="180">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- {{ scope.row }} -->
            <el-button
              type="primary"
              class="el-icon-s-tools"
              size="mini"
              @click="editOrder(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="warning"
              class="el-icon-location"
              size="mini"
              @click="cityChange"
              >地址</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 15]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 省市级联对话框 -->
    <el-dialog title="选择城市地区" :visible.sync="cityVisible" width="30%">
      <el-cascader
        v-model="selcity"
        :options="cityData"
        :props="{ expandTrigger: 'hover' }"
        @change="handleChange"
      ></el-cascader>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cityVisible = false">取 消</el-button>
        <el-button type="primary" @click="cityVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改订单对话框 -->
    <el-dialog title="修改订单" :visible.sync="editVisible" width="30%">
      <el-form :model="editform">
        <!-- 订单发货 -->
        <el-form-item label="订单是否发货" :label-width="formLabelWidth">
          <el-dropdown @command="is_sendHandel">
            <el-button type="primary">
              {{ this.editform.is_send == 0 ? '未发货' : '已发货'
              }}<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="1">已发货</el-dropdown-item>
              <el-dropdown-item command="0">未发货</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
        <!-- 订单支付 -->
        <el-form-item label="订单支付" :label-width="formLabelWidth">
          <el-dropdown @command="order_payHandel">
            <el-button type="primary">
              {{
                this.editform.order_pay == 0
                  ? '未支付'
                  : this.editform.order_pay == 1
                  ? '支付宝'
                  : this.editform.order_pay == 2
                  ? '微信'
                  : '银行卡'
              }}<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="0">未支付</el-dropdown-item>
              <el-dropdown-item command="1">支付宝</el-dropdown-item>
              <el-dropdown-item command="2">微信</el-dropdown-item>
              <el-dropdown-item command="3">银行卡</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
        <!-- 订单价格 -->
        <el-form-item label="订单价格" :label-width="formLabelWidth">
          <el-input
            v-model="editform.order_price"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <!-- 订单数量 -->
        <el-form-item label="订单数量" :label-width="formLabelWidth">
          <el-input
            v-model="editform.order_number"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <!-- 支付状态 -->
        <el-form-item label="支付状态" :label-width="formLabelWidth">
          <el-dropdown @command="pay_statusHandel">
            <el-button type="primary"
              >{{ this.editform.pay_status == 0 ? '未付款' : '已付款' }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="0">未付款</el-dropdown-item>
              <el-dropdown-item command="1">已付款</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editOrdersure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import citydata from './citydata'
export default {
  data() {
    return {
      formLabelWidth: '120px',
      editform: {
        is_send: '',
        order_pay: '',
        order_price: '',
        order_number: '',
        pay_status: ''
      },
      // 订单列表
      orderData: [],
      //   查询参数
      queryInfo: {
        query: '',
        pagenum: '1',
        pagesize: '5'
      },
      //   搜索框绑定
      search: '',
      //   订单总数
      total: 0,
      //   对话框
      cityVisible: false,
      editVisible: false,
      //   城市列表
      cityData: citydata,
      //   选中的级联选项
      selcity: [],
      //   订单id
      orderid: 0
    }
  },
  mounted() {
    this.getOrderList()
  },
  methods: {
    //   获取订单列表
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      res.data.goods.forEach(item => {
        // 使用moment时间插件
        item.create_time = this.$moment(item.create_time * 1000).format(
          'YYYY-MM-DD HH:mm:ss'
        )
      })
      console.log(res.data)
      this.orderData = res.data.goods
      this.total = res.data.total
    },
    // 每页页数
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getOrderList()
    },
    // 当前第几页
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getOrderList()
    },
    // 级联变化事件
    handleChange() {},
    // 城市选择
    cityChange() {
      this.cityVisible = true
      console.log(this.cityData)
    },
    // 修改订单
    editOrder(row) {
      this.editVisible = true
      this.orderid = row.order_id
      this.editform.is_send = row.is_send
      this.editform.pay_status = row.pay_status
      this.editform.order_pay = row.order_pay
      this.editform.order_price = row.order_price
    },
    // 修改订单(确认)
    async editOrdersure() {
      const { data: res } = await this.$http.put(
        `orders/${this.orderid}`,
        this.editform
      )
      if (res.meta.status !== 201) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getOrderList()
      this.editVisible = false
    },
    // 订单支付
    order_payHandel(command) {
      this.editform.order_pay = command
    },
    // 发货状态
    is_sendHandel(command) {
      this.editform.is_send = command
    },
    // 支付状态
    pay_statusHandel(command) {
      this.editform.pay_status = command
    }
  }
}
</script>

<style scoped></style>
