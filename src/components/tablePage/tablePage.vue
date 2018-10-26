<template>
    <div class="table-page">
        <mu-button class="instock" fab small @click="inStock" v-if="manager">入库</mu-button>
        <mu-button class="export" fab small @click='export2Excel'>导出</mu-button>
        <div class="searc-filter">
            <mu-form :model="conditions" label-position="top" label-width="100">
                <el-row :gutter="20">
                    <el-col :span="4">
                        <mu-form-item label="采集器ID">
                            <mu-text-field v-model="conditions.like.collector_id"></mu-text-field>
                        </mu-form-item>
                    </el-col>
                    <el-col :span="4">
                        <mu-form-item label="采集器型号">
                            <mu-text-field v-model="conditions.like.collector_model"></mu-text-field>
                        </mu-form-item>
                    </el-col>
                    <el-col :span="4">
                        <mu-form-item label="所属客户">
                            <mu-text-field v-model="conditions.like.customer_name"></mu-text-field>
                        </mu-form-item>
                    </el-col>
                    <el-col :span="4">
                        <mu-form-item label="检测状态">
                            <mu-select v-model="conditions.filter.check_result" filterable placeholder="请选择" full-width>
                                <mu-option v-for="item in checkOptions" :key="item.num" :label="item.label" :value="item.num"></mu-option>
                            </mu-select>
                        </mu-form-item>
                    </el-col>
                    <el-col :span="4">
                        <mu-form-item label="库存状态">
                            <mu-select v-model="conditions.filter.type" filterable placeholder="请选择" full-width>
                                <mu-option v-for="item in stcokOptions" :key="item.value" :label="item.label" :value="item.value"></mu-option>
                            </mu-select>
                        </mu-form-item>
                    </el-col>
                    <el-col :span="4">
                        <mu-form-item label="启停状态">
                            <mu-select v-model="conditions.filter.status" filterable placeholder="请选择" full-width>
                                <mu-option v-for="item in statusOptions" :key="item.num" :label="item.label" :value="item.num"></mu-option>
                            </mu-select>
                        </mu-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="4">
                        <mu-form-item label="开始时间">
                            <mu-date-input v-model="conditions.date.start_time" label-float full-width></mu-date-input>
                        </mu-form-item>
                    </el-col>
                    <el-col :span="4">
                        <mu-form-item label="结束时间">
                            <mu-date-input v-model="conditions.date.end_time" label-float full-width></mu-date-input>
                        </mu-form-item>
                    </el-col>
                    <el-col :span="10" class="form-buttons">
                        <mu-form-item>
                            <mu-button color="primary" @click="search">搜索</mu-button>
                            <mu-button color="warning" @click="reset">重置</mu-button>
                            <mu-button v-if="manager" color="secondary" @click="batchStock">批量出库</mu-button>
                        </mu-form-item>
                    </el-col>
                </el-row>
            </mu-form>
        </div>
        <div class="content">
            <el-table :data="initData.datas" style="width:100%;margin-bottom:30px" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column :prop='item.prop' min-width="120" :label='item.label' v-for="item in columns" :key="item.index">
                </el-table-column>
                <el-table-column label="操作" fixed="right" :width="buttonBoxWidth" class-name="edit-buttons">
                    <template slot-scope="scope">
                         <mu-button v-if="manager" color="primary" mini @click="TestDialog(scope.$index, scope.row)">测试</mu-button>
                        <mu-button v-if="manager" color="primary" mini @click="OutStockDialog(scope.row,false)">出库</mu-button>
                        <mu-button v-if="manager" color="primary" mini @click="BackStockDialog(scope.$index, scope.row)">退库</mu-button>
                        <mu-button v-if="manager" color="primary" mini @click="deleteStock(scope.$index, scope.row)">{{scope.row.status?'删除':'恢复'}}</mu-button>
                        <mu-button color="primary" mini @click="ViewPathDialog(scope.$index, scope.row)">查看</mu-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background 
               layout="prev, pager, next, sizes" 
                @current-change='pageChange' 
                @size-change="handleSizeChange" 
                prev-click='pageChange' 
                next-click='pageChange' 
                :total="initData.total" 
                :page-sizes="[10, 50, 100, 150]"
                :page-size="10">
            </el-pagination>
        </div>
        <!-- 弹窗 -->
        <el-dialog :title="dialogData.title" :visible.sync="dialogData.dialogFormVisible" :width="dialogData.dialogWidth" @close="Cancel">
            <!-- 入库 -->
            <div v-if="dialogData.type===0">
                <in-stock-layout v-on:Cancel="Cancel" v-on:getTypeList="getData"></in-stock-layout>
            </div>
            <!-- 出库 -->
            <div v-if="dialogData.type === 1">
                <out-stock v-on:Cancel="Cancel" v-on:getTypeList="getData" :item="itemDevicesData" :batch="batch"  ref="outStock"></out-stock>
            </div>
            <!-- 退库 -->
            <div v-if="dialogData.type === 2">
                <back-stock v-on:Cancel="Cancel" v-on:getTypeList="getData" :item="itemDevicesData"></back-stock>
            </div>
            <!-- 查看轨迹 -->
            <div v-if="dialogData.type === 3">
                <view-path v-on:Cancel="Cancel" :item.sync="itemDevicesData"></view-path>
            </div>
            <!-- 删除库存 -->
            <div v-if="dialogData.type === 4">
                <span class="deleteStock">确定删除库存 -
                    <span class="colName">{{itemDevicesData.collector_id}}</span>
                </span>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="Cancel">取 消</el-button>
                    <el-button type="primary" @click="sureDelete">确 定</el-button>
                </div>
            </div>
             <!-- 测试 -->
            <div v-if="dialogData.type===5">
                <test-layout  v-on:Cancel="Cancel" v-on:getTypeList="getData" :item="itemDevicesData" ref="Test"></test-layout>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import InStockLayout from "./InStockLayout.vue";
import OutStock from "./OutStock.vue";
import BackStock from "./BackStock.vue";
import ViewPath from "./ViewPath.vue";
import TestLayout from './TestLayout.vue';
import moment from 'moment';
export default {
    components: { InStockLayout, OutStock, BackStock, ViewPath, TestLayout },
    props: ['manager'],
    data() {
        return {
            conditions: {
                like: {
                    collector_id: '',
                    collector_model: '',
                    customer_name: ''
                },
                filter: {
                    check_result: '',
                    stock_status : '',
                    status: ''
                },
                date: {
                    start_time: '',
                    end_time: ''
                },
            },
            page_size: 10,
            page_number: 1,

            checkOptions: [
                { num: 0, label: '待测' },
                { num: 1, label: '维修中' },
                { num: 2, label: '合格' },
            ],
            statusOptions: [
                { num: 0, label: '停用' },
                { num: 1, label: '启用' },
            ],
            stcokOptions: [
                { label: '未出库', value: 'instock' },
                { label: '已出库', value: 'outstock' }
            ],
            initData: {
                total: 0,
                datas: []
            },
            buttonBoxWidth: 80,
            dialogData: {
                title: "",
                dialogFormVisible: false,
                dialogWidth: '500px',
                type: 0
            },
            itemDevicesData: null,
            columns: [
                {
                    label: "采集器ID",
                    prop: "collector_id"
                },
                {
                    label: "BOX型号",
                    prop: "collector_model"
                },
                {
                    label: "所属客户",
                    prop: "customer_name"
                },
                {
                    label: "入库时间",
                    prop: "indate"
                },
                {
                    label: "库存状态",
                    prop: "stock_status"
                },
                {
                    label: "检测状态",
                    prop: "check_result"
                },
                {
                    label: "PCB厂家",
                    prop: "PCB_name"
                },
                {
                    label: "通讯模块供应商",
                    prop: "CM_name"
                },
                {
                    label: "元器件供应商",
                    prop: "CAP_name"
                },
                {
                    label: "SIM供应商",
                    prop: "SIM_name"
                },
                {
                    label: "焊接厂家",
                    prop: "weld_name"
                }

            ],
            deleteIndex: null,
            multipleSelection: [],
            batch:false
        }
    },
    methods: {
        search() {
            this.page_number = 1;
            this.getData();
        },
        reset() {
            this.conditions.like.collector_id = '';
            this.conditions.like.customer_name = '';
            this.conditions.like.collector_model = '';
            this.conditions.filter.check_result = '';
            this.conditions.filter.stock_status  = '';
            this.conditions.filter.status = '';
            this.conditions.date.start_time = '';
            this.conditions.date.end_time = '';
            this.getData();
        },
        //批量出库赋值
        handleSelectionChange(val){
            this.multipleSelection=val;
        },
        //批量出库
        batchStock(){
            if(this.multipleSelection.length>0){
                this.OutStockDialog(this.multipleSelection,true)
            }else{
                this.$message({
                    message: '请选择采集器',
                    type: 'warning'
                })
            }
        },
        // 获取主数据
        async getData() {
            const requestData = {
                like: this.conditions.like,
                date: this.conditions.date,
                page_size: this.page_size,
                page_number: this.page_number
            }
            if (this.conditions.filter.check_result === '') {
                delete this.conditions.filter.check_result;
            }
            if (this.conditions.filter.stock_status  === '') {
                delete this.conditions.filter.stock_status ;
            }
            if (this.conditions.filter.status === '') {
                delete this.conditions.filter.status;
            }
            requestData.filter = this.conditions.filter;
            const { result: { rows, total } } = await this.$http('devices', { data: requestData });
            for (const data of rows) {
                data.check_result = data.check_result === 0 ? '不合格' : data.check_result === 2 ? '未检测' : data.check_result === 3 ? "维修中" :"合格";
                data.status = data.status ? '启用' : '停用';
                data.indate && (data.indate = data.indate.split('T')[0]);
                data.stock_status = data.stock_status === 0 ? '未出库' : '已出库';
            }
            this.initData.datas = rows;
            this.initData.total = total
        },
        //换页
        pageChange(current) {
            this.page_number = current;
            this.getData();
        },
        calculateBox() {
            if (this.manager) {
                this.buttonBoxWidth = 300;
            } else {
                this.buttonBoxWidth = 80;
            }
        },
        showDialog() {
            this.dialogData.dialogFormVisible = true;
        },
        Cancel() {
            this.dialogData.dialogFormVisible = false;      
        },
        // 入库
        inStock() {
            this.dialogData.title = '入库';
            this.dialogData.type = 0;
            this.dialogData.dialogWidth = '800px';
            this.showDialog();
        },
        //出库
        OutStockDialog(row,batch) {
            let checkedLen=0;
            let outstockLen=0;
            if(batch){ //先判断是否批量
                row.forEach((item)=>{ 
                   if(item.check_result === '合格'){
                       checkedLen++;
                   }
                   if(item.stock_status === '已出库'){
                       outstockLen++;
                   }
                })
                // if(checkedLen !== row.length || outstockLen !== 0 ){ //是否所有都合格
                //     this.$message({
                //         message: '请检查是否所选都合格或者已出库，不合格、已出库不能出库',
                //         type: 'warning'
                //     })
                // }else{ 
                    this.OutVar(row, batch);
                // }
            }else{
                // if(row.check_result !== '合格'){
                //     this.$message({
                //         message: '请先测试，合格之后才能出库',
                //         type: 'warning'
                //     })
                // }else{
                    this.OutVar(row, batch);
                // }
            }  
        },
        OutVar(row, batch){ //出库需要改变的变量       
            this.dialogData.title = '出库';
            this.dialogData.type = 1;
            this.showDialog();
            this.dialogData.dialogWidth = '500px';
            this.itemDevicesData = row;
            this.batch = batch;
            if(this.$refs.outStock){
                this.$refs.outStock.initData();
            }
        },
        //退库
        BackStockDialog(index, row) {
            this.dialogData.title = '退库';
            this.dialogData.type = 2;
            this.dialogData.dialogWidth = '500px';
            this.itemDevicesData = row;
            if (this.initData.datas[index].type === '已出库') {
                this.showDialog();
            } else {
                this.$message({
                    message: '请先出库',
                    type: 'warning'
                })
            }
        },
        //删除
        deleteStock(index, row) {
            this.dialogData.title = '删除';
            this.dialogData.type = 4;
            this.dialogData.dialogWidth = '500px';
            this.itemDevicesData = row;
            this.deleteIndex = index;
            this.showDialog();
        },
        async sureDelete() {
            const result = await this.$http('devices/' + this.itemDevicesData._id);
            this.$message({
                message: this.itemDevicesData.status ? '删除成功' : '恢复成功',
                type: 'success'
            })
            this.initData.datas.forEach((item, index, arr) => {
                if (this.deleteIndex === index) {
                    item.status = !item.status;
                }
            })
            this.Cancel();
        },
        //查看
        ViewPathDialog(index, row) {
            this.dialogData.title = '轨迹 - ' + row.collector_id;
            this.dialogData.type = 3;
            this.showDialog();
            this.dialogData.dialogWidth = '800px';
            this.getDevicesPath(row)
        },
        //获取查看轨迹
        async getDevicesPath(item) {
            const { result } = await this.$http('deviceTrack', { data: { collector_id: item.collector_id } });
            this.itemDevicesData = result.rows;
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => v[j]))
        },
        export2Excel() {
            require.ensure([], () => {                       //这里的require的路径要写对，不然运行会有错误	    　　　　　　
                const { export_json_to_excel } = require('@/vendor/Export2Excel');
                const tHeader = [];
                const filterVal = [];
                for (let i = 0; i < this.columns.length; i++) {
                    tHeader.push(this.columns[i].label);
                    filterVal.push(this.columns[i].prop);
                }
                const list = this.initData.datas;
                const data = this.formatJson(filterVal, list);
                export_json_to_excel(tHeader, data, '设备库存管理');
            })
        },
        handleSizeChange(val){
            this.page_size = val;
            this.getData();
        },
        // 测试
        TestDialog(index, row){
            this.dialogData.title = '修改测试';
            this.dialogData.type = 5;
            this.dialogData.dialogWidth = '500px';
            this.itemDevicesData = row;
            this.showDialog();
            if(this.$refs.Test){
                this.$refs.Test.initData()
            }
        }

    },
    created() {
        this.calculateBox();
        this.getData();
    },
}
</script>
<style lang="scss">
.table-page {
  width: 100%;
  height: 100%;
  padding: 20px;
  .searc-filter {
    margin: 50px 20px 20px 20px;
    padding: 10px 20px;
    border: 1px solid #eee;
    border-radius: 6px;
    background: #ffffff;
    .form-buttons {
      padding-top: 15px;
    }
  }
  .content {
    margin: 20px;
    .el-table {
      .mu-raised-button {
        min-width: 40px;
        height:26px;
        .mu-button-wrapper{
            padding:0 8px;
        }
      }
      tr {
        height: 70px;
        td {
          padding-left: 10px;
          &.edit-buttons {
            button {
              margin-right: 10px;
            }
          }
        }
      }
    }
  }
  .export {
    font-size: 14px;
    float: right;
    margin-right: 20px;
  }
  .instock {
    float: left;
    margin-left: 20px;
  }
  .dialog-footer {
    margin-top: 20px;
    width: 100%;
    text-align: right;
  }
  .colName {
    color: red;
  }
  .el-dialog{
        .el-dialog__body{
        padding-top:0
     }
   }
  .deleteStock{
      display: inline-block;
      margin-top:20px;
  }
}
</style>
