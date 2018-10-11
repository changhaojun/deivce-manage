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
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
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
        <el-button>重置</el-button>
      </el-row>
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
          check_result: 0
        },
        options: [
          { 
            value: '选项1',
            label: '合格'
          }, {
            value: '选项2',
            label: '不合格'
          }, {
            value: '选项3',
            label: '未检查'
          }
        ],
        date: {
          start_time: '',
          end_time: ''
        },
        page_size: 10,
        page_number: 0,
        value: ''
      }
    },
    methods: {
      search() {
        console.log('submit!');
      }
    }
};
</script>

<style lang="scss">
.devices-page {
  .search-filter {
    width: 94%;
    height: auto;
    border: 1px solid #bbb;
    border-radius: 10px;
    margin: 20px auto;
    padding: 10px 20px;
  }
}
</style>

