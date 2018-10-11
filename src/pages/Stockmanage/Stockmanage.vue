<template>
  <div class="stock-manage">
    <!-- 入库button -->
    <el-tooltip class="item" effect="dark" content="入库" placement="top">
      <el-button class="el-icon-plus" @click="inStock"></el-button>
    </el-tooltip>
    <!-- 导出 -->
    <!-- <el-tooltip class="item" effect="dark" content="入库" placement="top"> -->
      <el-button class="el-icon-document" @click='export2Excel'>  导出</el-button>
    <!-- </el-tooltip> -->
    <!--  搜索条件  -->
     <div class="search-filter">
      <el-form ref="form" label-width="100px" size="medium" :inline='true'>
        <el-form-item label="BOX编号：">
          <el-input v-model="params.like.collector_id"  placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="BOX型号：">
          <el-input v-model="params.like.collector_model" placeholder="请输入"></el-input>
        </el-form-item>      
        <el-form-item label="所属客户：">
          <el-input v-model="params.like.customer_name" placeholder="请输入"></el-input>
        </el-form-item>     
      </el-form>
      <el-row justify="center" type="flex">
        <el-button type="primary" @click="search" class="button">搜索</el-button>
        <el-button class="button" @click="reset">重置</el-button>
      </el-row>
    </div>
    <!-- 表格数据 -->
    <d2-crud
    :columns="columns"
    :data="data"
    :rowHandle="rowHandle"
    @custom-emit-1="OutStockDialog"
    @custom-emit-2="BackStockDialog"
    @custom-emit-3="ViewPathDialog" 
    />
    <el-pagination
    @current-change="handleCurrentChange"
    layout="total, prev, pager, next, jumper"
    :total="total">
    </el-pagination>
    <!-- 弹窗 -->
      <el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px">
        <!-- 入库 -->
        <div v-if="type===0">
            <in-stock-layout v-on:Cancel="Cancel" v-on:getTypeList="getTypeList"></in-stock-layout>
        </div>
        <!-- 出库 -->
        <div  v-if="type === 1">
            <out-stock v-on:Cancel="Cancel" v-on:getTypeList="getTypeList" :item="itemDevicesData"></out-stock>
        </div>
        <!-- 退库 -->
        <div  v-if="type === 2">
            <back-stock v-on:Cancel="Cancel" v-on:getTypeList="getTypeList" :item="itemDevicesData"></back-stock>
        </div>
      </el-dialog>

  </div>
</template>

<script>
import InStockLayout from "./InStockLayout.vue";
import OutStock from "./OutStock.vue";
import BackStock from "./BackStock.vue";
import moment from 'moment';
export default {
  name: 'Stockmanage',
  components:{InStockLayout,OutStock,BackStock},
  data() {
    return {
      title: "",
      type: 0,
      params: {
        like: {
          collector_id: '',
          customer_name: '',
          collector_model:''
        },
        filter: {
          check_result: 0
        },
        date: {
          start_time: '',
          end_time: ''
        },
        page_size: 10,
        page_number: 1,
      },
      columns: [
          {
            title: 'BOX编号',
            key: 'collector_id'
          },
          {
            title: 'BOX型号',
            key: 'collector_model'
          },
          {
            title: '所属客户',
            key: 'customer_name'
          },
          {
            title: '入库时间',
            key: 'instock_date'
          },
          {
            title: '出库时间',
            key: 'outstock_date'
          },
          {
            title: '是否合格',
            key: 'description'
          }
      ],
      data: [],
      rowHandle: {
        custom: [
          {
            text: '出库',
            type: 'primary',
            size: 'mini',
            emit: 'custom-emit-1'
          },
          {
            text: '退库',
            type: 'primary',
            size: 'mini',
            emit: 'custom-emit-2'
          },
          {
            text: '查看',
            type: 'primary',
            size: 'mini',
            emit: 'custom-emit-3'
          }
        ]
      },
      total:0,
      dialogFormVisible:false,
      itemDevicesData:"",
     
    };
  },
  methods: {
    async getTypeList() {
      const {result} = await this.$http('devices',{data:this.params});
      for(const row of result.rows) {
        row.description = !row.check_result ? '不合格' : '合格'; 
        row.instock_date = moment(row.instock_date).format('YYYY-MM-DD hh:mm:ss')
        row.outstock_date =row.outstock_date? moment(row.outstock_date).format('YYYY-MM-DD hh:mm:ss'):""
      }
      this.data = result.rows;
      this.total =result.total;
    },
    // 入库
    inStock(){
      this.title = '入库' ;
      this.type = 0;
      this.showDialog();
    },
    //出库
    OutStockDialog ({index, row}) {
      this.title = '出库' ;
      this.type = 1;
      this.showDialog();
      this.itemDevicesData = row;
     
    },
    //退库
    BackStockDialog({index, row}){
      this.title = '退库' ;
      this.type = 2;
      this.itemDevicesData = row;
      if(this.data[index].outstock_date){
        this.showDialog();
      } else{
        this.$message({
            message: '请先出库',
            type: 'warning'
        }) 
      } 
    },
    //查看
    ViewPathDialog(){
      console.log(333)
    },
    //改变页码
    handleCurrentChange(val){
      this.params.page_number = val;
      this.getTypeList();
    },
    search(){
      this.getTypeList();
    },
    showDialog(){
       this.dialogFormVisible = true;
    },  
    //取消
    Cancel(){
      this.dialogFormVisible = false
    },
    // 重置
    reset(){
      this.params.like.collector_id = '';
      this.params.like.collector_model = '';
      this.params.like.customer_name = '';
      this.getTypeList();
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
  .el-icon-plus{
    font-size: 24px;
    color:#606266;
    padding:10px;
    border-radius:50%;
    &:hover,&:focus{
      border-color: #dcdfe6;
      background-color: #ffffff
    }
  }
  .el-icon-document{
      padding:10px;
      font-size: 16px;
      float:right;
       &:hover,&:focus{
          border-color: 0;
          background-color: #ffffff;
        }
    }
  .search-filter{
    display: flex;
    align-items: center;
    justify-content: space-between;
    border:1px solid #a9abaf;
    border-radius: 6px;
    padding:10px 10px;
    margin:10px 0;
    .el-form-item {
    margin-bottom: 0;
    }
    .button{
      padding:10px 15px;
    } 
  }
  .dialog-footer{
    text-align: right;
  }
}
</style>
