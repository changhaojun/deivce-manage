<template>
  <div class="devices-page">
    <div class="search-filter">
      <el-form ref="form" label-width="100px" size="medium" :inline='true'>
        <el-form-item label="BOX编号：">
          <el-input v-model="like.collector_id"></el-input>
        </el-form-item>
        <el-form-item label="生产批次：">
          <el-input v-model="filter.check_result"></el-input>
        </el-form-item>
        <el-form-item label="所属客户：">
          <el-input v-model="like.customer_name"></el-input>
        </el-form-item>
        <el-form-item label="是否合格：">
          <el-select v-model="ontest" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入库时间：">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择日期" v-model="date.start_time" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="1" style="text-align:center">-</el-col>
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择日期" v-model="date.end_time" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
      </el-form>
      <el-row justify="center" type="flex">
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </el-row>
    </div>
    <div class="content">
      <el-table
          :data="initData.datas"
          style="width:100%;margin-bottom:30px">
          <el-table-column
              prop='collector_id'
              label='BOX编号'
              align="center">
          </el-table-column>
          <el-table-column
              prop='collector_model'
              align="center"
              label='BOX型号'>
          </el-table-column>
          <el-table-column
              prop='inspect'
              align="center"
              label='批次'>
          </el-table-column>
          <el-table-column
              prop="customer_name"
              label="所属客户">
          </el-table-column> 
          <el-table-column
              prop="instock_date"
              align="center"
              label="入库时间">
          </el-table-column>   
          <el-table-column
              prop="used_flow"
              align="center"
              label="已使用流量(KB)">
          </el-table-column> 
          <el-table-column
              prop="residual_flow"
              label="剩余流量(KB)">
          </el-table-column>        
          <el-table-column
              align="center"
              label="测试报告">
              <template slot-scope="scope">
                  <span @click="boxInfo(scope.row)">查看</span>
              </template>
          </el-table-column>
          
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="initData.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Devices',
  components: {},
  data() {
    return {
      like: {
        collector_id: '',
        customer_name: ''
      },
      filter: {
        check_result: ''
      },
      options: ['合格', '不合格', '未检查'],
      date: {
        start_time: '',
        end_time: ''
      },
      page_size: 10,
      page_number: 1,
      ontest: '',
      initData: {
        total: 0,
        datas: []
      }
    }
  },
  methods: {
    search() {
      this.getData();
    },
    reset() {
      this.ontest = '';
      this.like.collector_id = '';
      this.customer_name = '';
      this.filter.check_result = '';
      this.date.start_time = '';
      this.date.end_time = '';
    },
   
    boxInfo(row) {
      console.log(row);
    },
    async getData() {
      const requestData = {
        filter: this.filter,
        like: this.like,
        date: this.date,
        page_size: this.page_size,
        page_number: this.page_number
      }
      const {datas, total} = await this.$http.get('devices',{data: requestData});
      console.log(datas);
      for(const data of datas) {
        data.instock_date = data.instock_date.split('T')[0];
        if(data.residual_flow) {
          const used_flow = data.total_flow - data.residual_flow;
          data.used_flow = used_flow;
        }else {
          data.used_flow = data.total_flow;
        }
      }
      this.initData.datas = datas;
      this.initData.total = total
    }
  },
  created() {
    this.getData();
  },
  mounted() {
    // this.getData();
  }
};
</script>

<style lang="scss">
.devices-page {
  .search-filter {
    width: 90%;
    height: auto;
    border: 1px solid #bbb;
    border-radius: 10px;
    margin: 20px auto;
    padding: 10px 30px;
  }
  .content{
    width: calc(90% + 40px);
    margin: 0px auto;
  }
}
</style>

