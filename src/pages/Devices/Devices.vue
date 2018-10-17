<template>
  <div class="devices-page">
    <div class="search-filter">
      <el-form ref="form" label-width="100px" size="medium" :inline='true'>
        <el-form-item label="BOX编号：">
          <!-- <el-input v-model="like.collector_id"></el-input> -->
          <mu-text-field v-model="like.collector_id"></mu-text-field><br />
        </el-form-item>
        <el-form-item label="所属客户：">
          <mu-text-field v-model="like.customer_name"></mu-text-field><br />
          <!-- <el-input v-model="like.customer_name"></el-input> -->
        </el-form-item>
        <el-form-item label="是否合格：">
          <mu-select  v-model="filter.check_result" filterable  placeholder="请选择" full-width>
            <mu-option v-for="item in options" :key="item.num" :label="item.label" :value="item.num"></mu-option>
          </mu-select>
          <!-- <el-select v-model="filter.check_result" placeholder="请选择">
            <el-option v-for="item in options" :key="item.num" :label="item.label" :value="item.num">
            </el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item label="入库时间：">
          <el-col :span="11">
            <mu-date-input v-model="date.start_time" label="开始日期" label-float full-width></mu-date-input>
            <!-- <el-date-picker type="date" placeholder="选择日期" v-model="date.start_time" style="width: 100%;"></el-date-picker> -->
          </el-col>
          <el-col class="line" :span="1" style="text-align:center">-</el-col>
          <el-col :span="11">
            <mu-date-input v-model="date.end_time" label="结束日期" label-float full-width></mu-date-input>
            <!-- <el-date-picker type="date" placeholder="选择日期" v-model="date.end_time" style="width: 100%;"></el-date-picker> -->
          </el-col>
        </el-form-item>
      </el-form>
      <el-row justify="center" type="flex">
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </el-row>
    </div>
    <div class="content">
      <el-table :data="initData.datas" style="width:100%;margin-bottom:30px">
        <el-table-column prop='collector_id' label='采集器ID' align="center">
        </el-table-column>
        <el-table-column prop='collector_model' align="center" label='BOX型号'>
        </el-table-column>
        <el-table-column prop="customer_name" align="center" label="所属客户">
        </el-table-column>
        <el-table-column prop="indate" align="center" label="入库时间">
        </el-table-column>
        <el-table-column prop="type" align="center" label="库存状态">
        </el-table-column>
        <el-table-column align="center" prop="check_result" label="是否合格">
        </el-table-column>
        <el-table-column label="库存轨迹">
          <template slot-scope="scope">
            <mu-button color="primary" @click="lookTrack(scope.$index, scope.row)">查看</mu-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="prev, pager, next" @current-change='pageChange' prev-click='pageChange' next-click='pageChange' :total="initData.total">
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
      date: {
        start_time: '',
        end_time: ''
      },
      page_size: 10,
      page_number: 1,

      options: [
        { num: 0, label: '不合格' },
        { num: 1, label: '合格' },
      ],
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
      this.like.collector_id = '';
      this.like.customer_name = '';
      this.filter.check_result = '';
      this.date.start_time = '';
      this.date.end_time = '';
      this.getData();
    },
    // 获取主数据
    async getData() {
      const requestData = {
        // filter: this.filter,
        like: this.like,
        date: this.date,
        page_size: this.page_size,
        page_number: this.page_number
      }
      if (this.filter.check_result !== '') {
        requestData.filter = this.filter;
      }
      // console.log(requestData);
      const { result: { rows, total } } = await this.$http('devices', { data: requestData });
      for (const data of rows) {
        data.check_result = data.check_result ? '合格' : '不合格';
        data.indate && (data.indate = data.indate.split('T')[0]);
        data.type = data.type === 'instock' ? '未出库' : '已出库';
      }
      // console.log(total);
      this.initData.datas = rows;
      this.initData.total = total
    },

    //换页
    pageChange(current) {
      this.page_number = current;
      this.getData();
    },

    //查看轨迹
    lookTrack(index, row) {

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

<style lang="scss" scoped>
.devices-page {
  .el-form-item{
    margin-bottom: 0;
  }
  .search-filter {
    width: 94%;
    height: auto;
    border: 1px solid #bbb;
    border-radius: 10px;
    margin: 20px auto;
    padding: 10px 20px;
    background: #ffffff;
  }
  .content {
    width: calc(90% + 40px);
    margin: 0px auto;
  }
}
</style>

