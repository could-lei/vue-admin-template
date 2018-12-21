<template>
  <div class="app-container">
    <div style="margin-top: 15px;">
      <el-input v-model="target" type="number" placeholder="请输入内容" class="input-with-select" >
        <el-select slot="prepend" v-model="type" placeholder="请选择">
          <el-option label="医疗卡号" value="1"/>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="order(type, target)" />
      </el-input>
    </div>
    <el-table
      v-show="result"
      :data="orderData"
      style="width: 100%">
      <el-table-column
        label="订单编号">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.oid }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="日期">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="姓名">
        <template slot-scope="scope">
          <el-tag size="medium">{{ scope.row.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="dialogVisible = true;applyOrder(scope.$index, scope.row)">配药</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      title="配药"
      width="66%">
      <el-table
        :data="detailData"
        stripe
        style="width: 100%">
        <el-table-column
          prop="name"
          label="药名"/>
        <el-table-column
          prop="num"
          label="数量"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="finishPrescription(tempId)">完成配药</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style>
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
<script>
import {
  prescriptionOrder,
  prescriptionOrderDetail,
  finishDispensary,
  finishPrescription
} from '@/api/prescription'
export default {
  name: 'Index',
  data() {
    return {
      dialogVisible: false,
      target: '',
      type: '1',
      result: false,
      timeout: null,
      num: 1,
      orderData: [],
      detailData: [],
      tempId: ''
    }
  },
  methods: {
    order(type, target) {
      prescriptionOrder(type, target)
        .then(res => {
          this.result = true
          this.orderData = res.data['order']
          this.$message({
            showClose: true,
            message: '查询成功',
            type: 'success'
          })
        })
        .catch(err => {
          console.log(err)
          this.$message({
            showClose: true,
            message: '请先开处方单！',
            type: 'error'
          })
        })
    },
    applyOrder(index, row) {
      this.tempId = row['oid']
      prescriptionOrderDetail(this.tempId)
        .then(res => {
          this.detailData = res.data
          this.$message({
            showClose: true,
            message: '查询成功',
            type: 'success'
          })
        })
        .catch(err => {
          console.log(err)
          this.$message({
            showClose: true,
            message: '订单查询失败，请重试！',
            type: 'error'
          })
        })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    finishPrescription(oid) {
      finishDispensary(oid)
        .then(res => {
          this.detailData = res.data
          this.$message({
            showClose: true,
            message: '完成配药',
            type: 'success'
          })
        })
        .catch(err => {
          console.log(err)
          this.$message({
            showClose: true,
            message: '配药失败，请重试！',
            type: 'error'
          })
        })
      finishPrescription(oid)
        .then(res => {
          console.log(res.data)
          this.detailData = res.data
          this.$message({
            showClose: true,
            message: '完成取药',
            type: 'success'
          })
        })
        .catch(err => {
          console.log(err)
          this.$message({
            showClose: true,
            message: '取药失败，请重试！',
            type: 'error'
          })
        })
      this.order(1, this.target)
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
</style>
