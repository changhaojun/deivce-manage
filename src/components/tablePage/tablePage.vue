<template>
    <div class="table-page">
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
                        <mu-form-item label="是否合格">
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
                                <mu-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></mu-option>
                            </mu-select>
                        </mu-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
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
                            <mu-button v-if="manager" color="secondary" @click="inStock">入库</mu-button>
                        </mu-form-item>
                    </el-col>
                </el-row>
            </mu-form>
        </div>
        <div class="content">
            <el-table :data="initData.datas" style="width:100%;margin-bottom:30px">
                <el-table-column prop='collector_id' min-width="120" label='采集器ID'>
                </el-table-column>
                <el-table-column prop='collector_model' min-width="180" label='BOX型号'>
                </el-table-column>
                <el-table-column prop="customer_name" min-width="180" label="所属客户">
                </el-table-column>
                <el-table-column prop="check_result" label="是否合格">
                </el-table-column>
                <el-table-column prop="type" label="库存状态">
                </el-table-column>
                <el-table-column prop="status" label="启停状态">
                </el-table-column>
                <el-table-column prop="indate" label="入库时间">
                </el-table-column>
                <el-table-column label="操作" fixed="right" :width="buttonBoxWidth" class-name="edit-buttons">
                    <template slot-scope="scope">
                        <mu-button v-if="manager" color="primary" small @click="OutStockDialog(scope.$index, scope.row)">出库</mu-button>
                        <mu-button v-if="manager" color="primary" small @click="BackStockDialog(scope.$index, scope.row)">退库</mu-button>
                        <mu-button color="primary" small @click="ViewPathDialog(scope.$index, scope.row)">查看</mu-button>
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
                    type: '',
                    status:''
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
            statusOptions:[
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
            buttonBoxWidth: 120,
            dialogData: {
                title: "",
                dialogFormVisible: false,
                dialogWidth: '500px',
                type: 0
            },
            itemDevicesData: null
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
            if (this.conditions.filter.status === '') {
                delete this.conditions.filter.status;
            }
            requestData.filter = this.conditions.filter;
            const { result: { rows, total } } = await this.$http('devices', { data: requestData });
            for (const data of rows) {
                data.check_result = data.check_result ? '合格' : '不合格';
                data.status = data.status ? '启用' : '停用';
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
    },
    created() {
        this.calculateBox();
        this.getData();
    },
}
</script>
<style lang="scss">
.table-page {
  .searc-filter {
    margin: 20px;
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
}
</style>
