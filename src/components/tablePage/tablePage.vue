<template>
    <div class="table-page">
        <mu-button class="instock" fab small  @click="inStock" v-if="manager">入库</mu-button>
        <mu-button class="export" fab small @click='export2Excel'>导出</mu-button>
        <div class="searc-filter">
            <mu-form :model="conditions" label-position="top" label-width="100">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <mu-form-item label="采集器ID">
                            <mu-text-field v-model="conditions.like.collector_id"></mu-text-field>
                        </mu-form-item>
                    </el-col>
                    <el-col :span="6">
                        <mu-form-item label="采集器型号">
                            <mu-text-field v-model="conditions.like.collector_model"></mu-text-field>
                        </mu-form-item>
                    </el-col>
                    <el-col :span="6">
                        <mu-form-item label="所属客户">
                            <mu-text-field v-model="conditions.like.customer_name"></mu-text-field>
                        </mu-form-item>
                    </el-col>
                    <el-col :span="6">
                        <mu-form-item label="是否合格">
                            <mu-select v-model="conditions.filter.check_result" filterable placeholder="请选择" full-width>
                                <mu-option v-for="item in checkOptions" :key="item.num" :label="item.label" :value="item.num"></mu-option>
                            </mu-select>
                        </mu-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="6">
                        <mu-form-item label="库存状态">
                            <mu-select v-model="conditions.filter.type" filterable placeholder="请选择" full-width>
                                <mu-option v-for="item in stcokOptions" :key="item.value" :label="item.label" :value="item.value"></mu-option>
                            </mu-select>
                        </mu-form-item>
                    </el-col>
                    <el-col :span="6">
                        <mu-form-item label="开始时间">
                            <mu-date-input v-model="conditions.date.start_time" label-float full-width></mu-date-input>
                        </mu-form-item>
                    </el-col>
                    <el-col :span="6">
                        <mu-form-item label="结束时间">
                            <mu-date-input v-model="conditions.date.end_time" label-float full-width></mu-date-input>
                        </mu-form-item>
                    </el-col>
                    <el-col :span="6" class="form-buttons">
                        <mu-form-item>
                            <mu-button color="primary" @click="search">搜索</mu-button>
                            <mu-button color="warning" @click="reset">重置</mu-button>
                            <!-- <mu-button v-if="manager" color="secondary" @click="inStock">入库</mu-button> -->
                        </mu-form-item>
                    </el-col>
                </el-row>
            </mu-form>
        </div>
        <div class="content">
            <el-table :data="initData.datas" style="width:100%;margin-bottom:30px">
                <el-table-column :prop='item.prop' min-width="120" :label='item.label' v-for="item in columns" :key="item.index">
                </el-table-column>
                <el-table-column label="操作" fixed="right" :width="buttonBoxWidth" class-name="edit-buttons">
                    <template slot-scope="scope">
                        <mu-button v-if="manager" color="primary" mini @click="OutStockDialog(scope.$index, scope.row)">出库</mu-button>
                        <mu-button v-if="manager" color="primary" mini @click="BackStockDialog(scope.$index, scope.row)">退库</mu-button>
                        <mu-button v-if="manager" color="primary" mini @click="deleteStock(scope.$index, scope.row)">{{scope.row.status?'删除':'恢复'}}</mu-button>
                        <mu-button color="primary" mini @click="ViewPathDialog(scope.$index, scope.row)">查看</mu-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background layout="prev, pager, next" @current-change='pageChange' prev-click='pageChange' next-click='pageChange' :total="initData.total">
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
                <out-stock v-on:Cancel="Cancel" v-on:getTypeList="getData" :item="itemDevicesData"></out-stock>
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
                <span>确定删除库存 - <span class="colName">{{itemDevicesData.collector_id}}</span></span>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="Cancel">取 消</el-button>
                    <el-button type="primary" @click="sureDelete">确 定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import InStockLayout from "./InStockLayout.vue";
import OutStock from "./OutStock.vue";
import BackStock from "./BackStock.vue";
import ViewPath from "./ViewPath.vue";
import moment from 'moment';
export default {
    components: { InStockLayout, OutStock, BackStock, ViewPath },
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
                    type: ''
                },
                date: {
                    start_time: '',
                    end_time: ''
                },
            },
            page_size: 10,
            page_number: 1,

            checkOptions: [
                { num: 0, label: '不合格' },
                { num: 1, label: '合格' },
            ],
            stcokOptions: [
                { label: '未出库', value: 'instock' },
                { label: '已出库', value: 'outstock' }
            ],
            initData: {
                total: 0,
                datas: []
            },
            buttonBoxWidth: 120,
            dialogData: {
                title: "",
                dialogFormVisible: false,
                dialogWidth: '500px',
                type: 0
            },
            itemDevicesData: null,
            columns:[
                {
                   label:"采集器ID" ,
                   prop:"collector_id"
                },
                {
                   label:"BOX型号" ,
                   prop:"collector_model"
                },
                {
                   label:"所属客户" ,
                   prop:"customer_name"
                },
                {
                   label:"入库时间" ,
                   prop:"indate"
                },
                {
                   label:"库存状态" ,
                   prop:"type"
                },
                {
                   label:"是否合格" ,
                   prop:"check_result"
                }

            ],
            deleteIndex:null
        }
    },
    methods: {
        search() {
            this.getData();
        },
        reset() {
            this.conditions.like.collector_id = '';
            this.conditions.like.customer_name = '';
            this.conditions.like.collector_model = '';
            this.conditions.filter.check_result = '';
            this.conditions.filter.type = '';
            this.conditions.date.start_time = '';
            this.conditions.date.end_time = '';
            this.getData();
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
            if (this.conditions.filter.type === '') {
                delete this.conditions.filter.type;
            }
            requestData.filter = this.conditions.filter;
            const { result: { rows, total } } = await this.$http('devices', { data: requestData });
            for (const data of rows) {
                data.check_result = data.check_result ? '合格' : '不合格';
                data.indate && (data.indate = data.indate.split('T')[0]);
                data.type = data.type === 'instock' ? '未出库' : '已出库';
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
                this.buttonBoxWidth = 360;
            } else {
                this.buttonBoxWidth = 120;
            }
        },
        showDialog() {
            this.dialogData.dialogFormVisible = true;
        },
        Cancel() {
            this.dialogData.dialogFormVisible = false
        },
        // 入库
        inStock() {
            this.dialogData.title = '入库';
            this.dialogData.type = 0;
            this.dialogData.dialogWidth = '500px';
            this.showDialog();
        },
        //出库
        OutStockDialog( index, row ) {
            this.dialogData.title = '出库';
            this.dialogData.type = 1;
            this.showDialog();
            this.dialogData.dialogWidth = '500px';
            this.itemDevicesData = row;
        },
        //退库
        BackStockDialog( index, row ) {
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
        deleteStock(index,row){
            this.dialogData.title = '删除';
            this.dialogData.type = 4;
            this.dialogData.dialogWidth = '500px';
            this.itemDevicesData = row;
            this.deleteIndex = index;
            this.showDialog();
        },
        async sureDelete(){
            const result= await this.$http('http://121.42.253.149:18859/app/mock/25/v1/devices/'+this.itemDevicesData._id);
            this.$message({
                    message:this.itemDevicesData.status?'删除成功':'恢复成功',
                    type: 'success'
            })
            this.initData.datas.forEach((item,index,arr)=>{
                if(this.deleteIndex === index ){
                    item.status = !item.status;
                }
            })
            this.Cancel();
        },
        //查看
        ViewPathDialog( index, row ) {
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
                for(let i=0;i<this.columns.length;i++){
                    tHeader.push(this.columns[i].label);
                    filterVal.push(this.columns[i].prop);
                }
                const list = this.initData.datas;
                const data = this.formatJson(filterVal, list);
                export_json_to_excel(tHeader, data, '设备库存管理');
            })
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
    width:100%;
    height:100%;
    padding:20px;
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
      .mu-raised-button{
          min-width:60px;
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
  .export{
      font-size: 14px;
      float:right;
      margin-right:20px;
  }
  .instock{
      float: left;
      margin-left: 20px
  }
  .dialog-footer{
      margin-top:20px;
      width:100%;
      text-align: right
  }
  .colName{
      color:red
  }
}
</style>
