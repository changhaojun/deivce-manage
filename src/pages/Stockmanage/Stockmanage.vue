<template>
  <div class="stock-manage">
    <!-- 入库button -->
    <el-tooltip class="item" effect="dark" content="入库" placement="top">
      <mu-button  fab class="stockAdd" small  @click="inStock">+</mu-button>
    </el-tooltip>
    <!-- 导出 -->
      <mu-button class="export" fab small @click='export2Excel'>导出</mu-button>
    <!--  搜索条件  -->
    <search 
      v-on:search="search"
      v-on:reset="reset" 
      :BoxNumber="true"
      :BoxModel="true"
      :Checked="true"
      :Status="true"
      :Customer="true"
     ></search>
    <!-- 表格数据 -->
    <table-list :data="data" v-on:getTypeList="getTypeList" :edit="edit" v-on:changePage="changePage"></table-list>
    <!-- 弹窗 -->
      <el-dialog :title="title" :visible.sync="dialogFormVisible" :width="dialogWidth" @close="Cancel">
        <!-- 入库 -->
        <div v-if="type===0">
            <in-stock-layout v-on:Cancel="Cancel" v-on:getTypeList="getTypeList"></in-stock-layout>
        </div>
      </el-dialog>
  </div>
</template>
<script>
import InStockLayout from "./InStockLayout.vue";
import moment from 'moment';
import search from '../manage/search.vue';
import tableList from '../manage/tableList.vue';
export default {
  name: 'Stockmanage',
  components:{InStockLayout,search,tableList},
  data() {
    return {
      title: "",
      type: 0,
      params: {
        like: {
          collector_id: '',
          customer_name: '',
          collector_model: ''
        },
        filter: {
        },
        date: {
          start_time: '',
          end_time: ''
        },
        page_size: 10,
        page_number: 1,
      },
      data: [],
      edit:["查看",'出库','退库']
    };
  },
  methods: {
    async getTypeList() {
      const {result} = await this.$http('devices',{data:this.params});
      for(const row of result.rows) {
        row.description = !row.check_result ? '不合格' : '合格'; 
        row.indate = moment(row.indate).format('YYYY-MM-DD hh:mm:ss');
        row.type = row.type === 'outstock' ? '出库' : '未出库';
      }
      this.data=result;
    },
    search(data){
      this.params = data;
      this.getTypeList();
    },
    reset(data){
       this.params = data;
       this.getTypeList();
    },
    // 入库
    inStock(){
      this.title = '入库' ;
      this.type = 0;
      this.showDialog();
    },
    changePage(data){
      this.params.page_number=data.page_number;
      this.getTypeList()
    },
    showDialog(){
       this.dialogFormVisible = true;
    },  
    //取消
    Cancel(){
      this.dialogFormVisible = false
    },
    //导出
    formatJson(filterVal, jsonData) {
  　　　　return jsonData.map(v => filterVal.map(j => v[j]))
  　},
    export2Excel() {	    　　　　
      require.ensure([], () => {                       //这里的require的路径要写对，不然运行会有错误	    　　　　　　
          const { export_json_to_excel } = require('@/vendor/Export2Excel');
          const tHeader = [];	
          const filterVal = [];	
          for(let i=0;i<this.columns.length;i++){
            tHeader.push(this.columns[i].title);
            filterVal.push(this.columns[i].key);
          }
          const list = this.data;
          const data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, '设备库存管理');
      })
    }
  },
  created() {
    this.getTypeList();
  }
};
</script>

<style lang="scss" scoped>
.stock-manage{
  margin:20px 20px;
  padding: 10px 20px;
  background: #ffffff;
  .stockAdd{
    font-size:28px;
  }
  .export{
      font-size: 14px;
      float:right;
  }
  
  .dialog-footer{
    text-align: right;
  }
}
</style>
