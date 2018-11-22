<template>
    <div class="contract-manage">
        <mu-button class="instock" fab small @click="addContract">添加</mu-button>
        <div class="searc-filter" @keydown.enter="search">
            <mu-form :model="params" label-position="top" label-width="100">
                <el-row :gutter="20">
                    <el-col :span="4">
                        <mu-form-item label="合同编号">
                            <mu-text-field v-model="params.like.pact_number" placeholder="请输入内容"></mu-text-field>
                        </mu-form-item>
                    </el-col>
                    <el-col :span="4">
                        <mu-form-item label="签订人">
                            <mu-text-field v-model="params.like.signatory" placeholder="请输入内容"></mu-text-field>
                        </mu-form-item>
                    </el-col>    
                    <el-col :span="6" class="form-buttons">
                        <mu-form-item>
                            <mu-button color="primary" @click="search">搜索</mu-button>
                            <mu-button color="warning" @click="reset">重置</mu-button>
                        </mu-form-item>
                    </el-col>
                </el-row>
            </mu-form>
        </div>
        <!-- 列表 -->
        <div class="content">
            <el-table :data="initData.datas" style="width:100%;margin-bottom:30px">
                <el-table-column :prop='item.prop' min-width="120" :label='item.label' v-for="item in columns" :key="item.index">
                </el-table-column>
                <el-table-column label="操作" fixed="right"  class-name="edit-buttons">
                    <template slot-scope="scope">
                        <mu-button color="primary" mini @click="putPact(scope.$index, scope.row)">修改</mu-button>
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
        <el-dialog :title="title" :visible.sync="dialogData.dialogFormVisible" width="500px" @close="Cancel">
            <add-contract v-on:Cancel="Cancel" ref="addContract" v-on:getContract="getContract" :itemData.sync="itemData"></add-contract>
        </el-dialog> 
    </div>
</template>

<script>
import AddContract from './addContract.vue';
import moment from 'moment';
export default {
    name: 'ContractManage',
    components: { AddContract },
    data() {
        return {
            dialogData: {
                dialogFormVisible: false
            },
            initData: {
                datas: [],
                total: 0
            },
            columns: [
                {
                    label: "合同编号",
                    prop: 'pact_number'
                },
                {
                    label: "采集器数量",
                    prop: 'collector_amount'
                },
                {
                    label: "已出库",
                    prop: 'finishNumber'
                },
                {
                    label: "签订日期",
                    prop: 'signing_date'
                },
                {
                    label: "签订人",
                    prop: 'signatory'
                }
            ],
            params:{
                like:{
                    pact_number: "",
                    signatory: ''
                },
                page_size: 10,
                page_number: 1,
            },
            itemData:"",
            title:"新增合同"
        }
    },
    methods: {
        async getContract() {
            const { result } = await this.$http("pact",{data:this.params})
            for(const row of result.rows){
               row.signing_date && (row.signing_date = row.signing_date.split('T')[0]); 
               row.finishNumber = !row.finishNumber ? 0 : row.finishNumber;
            }
            this.initData.datas = result.rows;
            this.initData.total = result.total;
        },
        Cancel() {
            this.dialogData.dialogFormVisible = false;
        },
        dialogShow() {
            this.dialogData.dialogFormVisible = true
        },
        addContract() {
            if(this.$refs.addContract){
                this.$refs.addContract.reset()
            }
            this.itemData = "";
            this.dialogShow();
            this.title = '新增合同'
        },
        //换页
        pageChange(current) {
            this.params.page_number = current;
            this.getContract()
        },
        //改变每页的number
        handleSizeChange(val){
            this.params.page_size = val;
            this.getContract();
        },
        reset(){
            this.params.like.pact_number = '';
            this.params.like.signatory = '';
            this.getContract();
        },
        search(){
            this.getContract();
        },
        //修改合同
        putPact(index, rows){
            this.itemData = rows;
            this.dialogShow();
            this.title = '修改合同'
        }
    },
    created(){
        this.getContract()
    }
};
</script>

<style lang="scss">
.contract-manage {
  padding: 20px;
  .el-form {
      .el-form-item{
        margin-right:60px;
      }
    .el-input-number,
    .el-input {
      width: 100%;
    //   margin-right:60px;
    }
  }
  .searc-filter {
    margin: 20px 0;
    padding: 10px 20px;
    border: 1px solid #eee;
    border-radius: 6px;
    background: #ffffff;
    .form-buttons {
     padding-top: 15px;
    }
  }
  .el-dialog{
    .el-dialog__body{
        padding-top:10px;
        padding-bottom: 20px;
    }
  }
}
</style>

