<template>
  <div class="devices-page">
    <div class="search-filter">
      <el-form ref="form" :model="form" label-width="80px" inline="true">
        <el-form-item label="BOX编号:" size="medium">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="生产批次:" size="medium">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="所属客户:" size="medium">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="是否合格:" size="medium">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="入库时间:" size="medium">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择日期" v-model="form.date2" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
      </el-form>
    </div>
    
  </div>
</template>

<script>
export default {
  name: 'Devices',
  components: {},
  data() {
      return {
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        }
      }
    },
     methods: {
      onSubmit() {
        console.log('submit!');
      }
    }
};
</script>

<style lang="scss">
.devices-page {
  .search-filter {
    width: 95%;
    height: 150px;
    border: 1px solid #bbb;
    border-radius: 10px;
    margin: 20px auto;
    padding: 20px;
  }
}
</style>

