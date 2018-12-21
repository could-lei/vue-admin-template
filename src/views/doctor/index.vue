<template>
  <div class="app-container">
    <div style="margin-top: 15px;">
      <el-input v-model="target" type="number" placeholder="请输入内容" class="input-with-select" >
        <el-select slot="prepend" v-model="type" placeholder="请选择">
          <el-option label="医疗卡号" value="1"/>
          <el-option label="身份证号" value="2"/>
          <el-option label="手机号" value="3"/>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="search_target(type, target)" />
      </el-input>
    </div>
    <el-table
      v-show="result"
      :data="patientData"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="病人姓名">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="年龄">
              <span>{{ props.row.age }}</span>
            </el-form-item>
            <el-form-item label="医保卡号">
              <span>{{ props.row.mid }}</span>
            </el-form-item>
            <el-form-item label="性别">
              <span>{{ props.row.gender }}</span>
            </el-form-item>
            <el-form-item label="籍贯">
              <span>{{ props.row.place }}</span>
            </el-form-item>
            <el-form-item label="身份证号">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="描述">
              <span>{{ props.row.desc }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="医疗卡号"
        prop="id"/>
      <el-table-column
        label="病人名称"
        prop="name"/>
      <el-table-column
        label="病人年龄"
        prop="age"/>
      <el-table-column
        label="描述"
        prop="desc"/>
      <el-table-column label="开药">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="dialog1Visible = true">开药</el-button>
        </template>
      </el-table-column>
      <el-table-column label="开检查">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="dialog2Visible = true">开检查</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :visible.sync="dialog1Visible"
      :before-close="handleClose"
      title="开药"
      width="66%">
      <el-autocomplete
        :fetch-suggestions="querySearch"
        class="inline-input"
        placeholder="请输入内容"
        @select="handleSelect"
      />
      <el-table
        :data="medicineData"
        style="width: 100%">
        <el-table-column
          label="药名"
          width="180">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>药名: {{ scope.row.name }}</p>
              <p>ID: {{ scope.row.id }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.name }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="数量">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.num" :min="1" controls-position="right" />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog1Visible = false">取 消</el-button>
        <el-button type="primary" @click="applyPrescription(medicineData)">确 定</el-button>
      </span>
    </el-dialog><el-dialog
      :visible.sync="dialog2Visible"
      :before-close="handleClose"
      title="开检查"
      width="30%">
      <el-select v-model="value5" multiple filterable placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog2Visible = false">取 消</el-button>
        <el-button type="primary" @click="applyCheck(value5)">确 定</el-button>
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
import { search, checkList, check, fdaList, prescription } from '@/api/doctor'
export default {
  name: 'Index',
  data() {
    return {
      medicines: [],
      options: [],
      value5: [],
      target: '',
      type: '1',
      patientData: [],
      dialog1Visible: false,
      dialog2Visible: false,
      result: false,
      medicineData: []
    }
  },
  mounted() {
    checkList().then(res => {
      this.options = res.data.map(item => {
        return { value: res.data.indexOf(item), label: item }
      })
    }).catch(err => {
      console.log(err)
    })
    fdaList().then(res => {
      this.medicines = res.data
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    search_target(type, target) {
      if (type === '2' && target.length !== 18) {
        this.$message({
          showClose: true,
          message: '请输入正确的身份证号',
          type: 'error'
        })
      } else if (type === '3' && (target.length !== 11)) {
        this.$message({
          showClose: true,
          message: '请输入正确的手机号码',
          type: 'error'
        })
      } else {
        search(type, target).then(res => {
          this.result = true
          this.patientData = res.data['patient']
          this.$message({
            showClose: true,
            message: '查询成功',
            type: 'success'
          })
        }).catch(err => {
          console.log(err)
          this.$message({
            showClose: true,
            message: '请先办理医疗卡！',
            type: 'error'
          })
        })
      }
    },
    applyCheck(checkList) {
      check(this.patientData[0].id, checkList).then(res => {
        console.log(res)
        this.dialog2Visible = false
        this.$message({
          showClose: true,
          message: '开检查单成功',
          type: 'success'
        })
      }).catch(err => {
        this.$message({
          showClose: true,
          message: '开检查单失败，请重试！',
          type: 'error'
        })
        console.log(err)
      })
    },
    applyPrescription(medicineData) {
      if (!(medicineData === undefined || medicineData.length === 0)) {
        prescription(this.patientData[0].id, medicineData).then(res => {
          console.log(res)
          this.dialog1Visible = false
          this.$message({
            showClose: true,
            message: '开处方单成功',
            type: 'success'
          })
        }).catch(err => {
          this.$message({
            showClose: true,
            message: '开处方单失败，请重试！',
            type: 'error'
          })
          console.log(err)
        })
      } else {
        this.$message({
          showClose: true,
          message: '请先开药！',
          type: 'error'
        })
      }
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {
        })
    },
    querySearch(queryString, cb) {
      var medicines = this.medicines
      var results = queryString ? medicines.filter(this.createFilter(queryString)) : medicines
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (medicines) => {
        return (medicines.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect(item) {
      const temp = { name: item['value'], id: item['id'], num: 1 }
      this.medicineData.push(temp)
    },
    handleDelete(index) {
      this.medicineData.splice(index, 1)
      console.log(this.medicineData)
    }
  }
}
</script>

<style scoped>

</style>
