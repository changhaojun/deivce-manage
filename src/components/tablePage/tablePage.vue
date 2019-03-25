<template>
    <div class="table-page">
        <!-- <mu-button class="export" fab small @click='export2Excel'>导出</mu-button> -->
        <div class="searc-filter"  @keydown.enter="search">
            <mu-form v-if="deviceType === 0" :model="conditions" label-position="top" label-width="100">
                <el-row :gutter="30">
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
                        <mu-form-item label="开始时间">
                            <mu-date-input v-model="conditions.date.start_time" label-float full-width></mu-date-input>
                        </mu-form-item>
                    </el-col>
                    <el-col :span="4">
                        <mu-form-item label="结束时间">
                            <mu-date-input v-model="conditions.date.end_time" label-float full-width></mu-date-input>
                        </mu-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                     <el-col :span="4">
                        <mu-form-item label="库存状态">
                            <mu-select v-model="conditions.filter.stock_status" filterable placeholder="请选择" full-width>
                                <mu-option v-for="item in stcokOptions" :key="item.value" :label="item.label" :value="item.value"></mu-option>
                            </mu-select>
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
            <mu-form v-if="deviceType === 1" :model="conditionsTemp" label-position="top" label-width="100">
                <el-row :gutter="30">
                    <el-col :span="4">
                        <mu-form-item label="SN">
                            <mu-text-field v-model="conditionsTemp.like.sn"></mu-text-field>
                        </mu-form-item>
                    </el-col>
                    <el-col :span="4">
                        <mu-form-item label="型号">
                            <mu-text-field v-model="conditionsTemp.like.model"></mu-text-field>
                        </mu-form-item>
                    </el-col>
                    <el-col :span="4">
                        <mu-form-item label="所属客户">
                            <mu-text-field v-model="conditionsTemp.like.customer_name"></mu-text-field>
                        </mu-form-item>
                    </el-col>
                    <!-- <el-col :span="4">
                        <mu-form-item label="开启状态">
                            <mu-select v-model="conditionsTemp.filter.status" filterable placeholder="请选择" full-width>
                                <mu-option v-for="item in statusOptions" :key="item.num" :label="item.label" :value="item.num"></mu-option>
                            </mu-select>
                        </mu-form-item>
                    </el-col>     -->
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
                </el-row>
                <el-row :gutter="20">
                     <el-col :span="4">
                        <mu-form-item label="库存状态">
                            <mu-select v-model="conditionsTemp.filter.stock_status" filterable placeholder="请选择" full-width>
                                <mu-option v-for="item in stcokOptions" :key="item.value" :label="item.label" :value="item.value"></mu-option>
                            </mu-select>
                        </mu-form-item>
                    </el-col>
                    <el-col :span="20" class="form-buttons">
                        <mu-form-item>
                            <mu-button color="primary" @click="search">搜索</mu-button>
                            <mu-button color="warning" @click="reset">重置</mu-button>
                            <label v-if="manager" for="fileinp" id='stocl-label'>
                                <input type="button" id="btn" value="批量入库">
                                <input type="file" title=" " id="fileinp" @change="importf">
                            </label>
                            <mu-button v-if="manager" color="secondary" @click="batchStock">批量出库</mu-button>
                            <mu-button v-if="manager" color="secondary" @click="batchEdit">批量修改</mu-button>
                        </mu-form-item>
                    </el-col>
                </el-row>
            </mu-form>
        </div>
        <div class="content">
            <div class="title">
                <span class="titleText">设备列表</span>
                 <mu-button class="instock" color="primary" @click="inStock" v-if="manager">入库</mu-button>
            </div>
            <el-table :data="initData.datas" style="width:100%;margin-bottom:30px" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="45"></el-table-column>
                <el-table-column v-if="deviceType === 0" :prop='item.prop' min-width="105" :label='item.label' v-for="item in columns" :key="item.index"></el-table-column>
                <el-table-column v-if="deviceType === 1" :prop='item.prop' min-width="105" :label='item.label' v-for="item in columnsTemp" :key="item.index"></el-table-column>
                <el-table-column label="操作" fixed="right" :width="buttonBoxWidth" class-name="edit-buttons">
                    <template slot-scope="scope">
                        <mu-button v-if="manager && deviceType === 0" color="primary" mini @click="TestDialog(scope.$index, scope.row)">测试</mu-button>
                        <mu-button v-if="manager" color="primary" mini @click="OutStockDialog(scope.row,false)">出库</mu-button>
                        <mu-button v-if="manager" color="primary" mini @click="BackStockDialog(scope.$index, scope.row)">退库</mu-button>
                        <mu-button v-if="manager && deviceType === 1" color="primary" mini @click="UpdateTimeDialog(scope.row,false)">修改</mu-button>
                        <mu-button v-if="manager" color="primary" mini @click="deleteStock(scope.$index, scope.row)">删除</mu-button>
                        <mu-button color="primary" mini @click="ViewPathDialog(scope.$index, scope.row)">查看</mu-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination v-if="initData.datas.length > 0"
                background 
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
            <div v-if="dialogData.type===0 && deviceType === 0">
                <in-stock-layout v-on:Cancel="Cancel" v-on:getTypeList="getData"></in-stock-layout>
            </div>
            <div v-if="dialogData.type===0 && deviceType === 1">
                <in-stock-layout-temp v-on:Cancel="Cancel" v-on:getTypeList="getDataTemp"></in-stock-layout-temp>
            </div>
            <!-- 出库 -->
            <div v-if="dialogData.type === 1 && deviceType === 0">
                <out-stock v-on:Cancel="Cancel" v-on:getTypeList="getData" :item="itemDevicesData" :batch="batch"  ref="outStock"></out-stock>
            </div>
            <div v-if="dialogData.type === 1 && deviceType === 1">
                <out-stock-temp v-on:Cancel="Cancel" v-on:getTypeList="getDataTemp" :item="itemDevicesData" :batch="batch"  ref="outStock"></out-stock-temp>
            </div>
            <!-- 退库 -->
            <div v-if="dialogData.type === 2">
                <back-stock v-on:Cancel="Cancel" v-on:getTypeList="getData" :item="itemDevicesData"></back-stock>
            </div>
            <!-- 查看轨迹 -->
            <div v-if="dialogData.type === 3" style="height:300px">
                <!-- <el-scrollbar style="height:100%"> -->
                    <view-path v-on:Cancel="Cancel" :item.sync="itemDevicesData" :itemDetail.sync="detailData"></view-path>
                <!-- </el-scrollbar> -->
            </div>
            <!-- 删除库存 -->
            <div v-if="dialogData.type === 4">
                <span v-if="deviceType === 0" class="deleteStock">确定删除采集器 -
                    <span class="colName">{{itemDevicesData.collector_id}}</span>
                </span>
                <span v-if="deviceType === 1" class="deleteStock">确定删除SN -
                    <span class="colName">{{itemDevicesData.sn}}</span>
                </span>
                <div slot="footer" class="dialog-footer">
                    <mu-button @click="Cancel" flat class="cancel" normal>取 消</mu-button>
                    <mu-button color="primary" @click="sureDelete" normal>确 定</mu-button>
                </div>
            </div>
             <!-- 测试 -->
            <div v-if="dialogData.type===5 && deviceType === 0">
                <test-layout  v-on:Cancel="Cancel" v-on:getTypeList="getData" :item="itemDevicesData" ref="Test"></test-layout>
            </div>
            <!-- 采集周期 -->
            <div v-if="dialogData.type===5 && deviceType === 1">
                <update-time  v-on:Cancel="Cancel" v-on:getTypeList="getDataTemp" :item="itemDevicesData" :batch="batch"></update-time>
            </div>
        </el-dialog>
    </div>
</template>
<script ></script>
<script>
import InStockLayout from "./InStockLayout.vue";
import InStockLayoutTemp from "./InStockLayoutTemp.vue";
import OutStock from "./OutStock.vue";
import OutStockTemp from "./OutStockTemp.vue";
import BackStock from "./BackStock.vue";
import ViewPath from "./ViewPath.vue";
import TestLayout from './TestLayout.vue';
import UpdateTime from './UpdateTime.vue';
import moment from 'moment';
import XLSX from './xlsx.full.min.js';
export default {
    components: { InStockLayout, InStockLayoutTemp, OutStock, OutStockTemp, BackStock, ViewPath, TestLayout, UpdateTime },
    props: ['manager', 'deviceType'],
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
                    stock_status: ''
                },
                date: {
                    start_time: '',
                    end_time: ''
                },
            },
            page_size: 10,
            page_number: 1,
            checkOptions: [
                { num: 0, label: '不合格'},
                { num: 1, label: '合格' },
                { num: 2, label: '未检测' },
                { num: 3, label: '维修中' },
            ],
            statusOptions: [
                { num: 0, label: '停用' },
                { num: 1, label: '启用' },
            ],
            stcokOptions: [
                { label: '未出库', value: 0 },
                { label: '已出库', value: 1 }
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
                    prop: "test_result"
                },
                {
                    label: "SIM卡号",
                    prop: "SIM"
                }
            ],
            deleteIndex: null,
            multipleSelection: [],
            batch:false,
            isStop:{
                type:"delete",
                collector_id:[],
                user_id:sessionStorage.getItem('user_id'),
                user_name:sessionStorage.getItem('fullname')
            },
            detailData:null,

            // 批量入库
            datas: {
                devices: [],
                operator: {
                    user_id: '',
                    user_name: ''
                }
            },
            // 温度计
            columnsTemp: [
                {
                    label: "SN",
                    prop: "sn"
                },
                {
                    label: "型号",
                    prop: "model"
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
                    label: "采集周期",
                    prop: "collect_interval"
                }
            ],
            conditionsTemp: {
                filter: {
                    stock_status: ''
                },
                like: {
                    sn: '',
                    model: '',
                    customer_name: ''
                },
                date: {},
            },
            OutOrBackStockParams: {
                type: 'backstock',
                snList: [],
                user_name: sessionStorage.getItem('fullname'),
                user_id: sessionStorage.getItem('user_id')
            }
        }
    },
    methods: {
        search() {
            this.page_number = 1;
            if(this.conditions.date.start_time !== ""|| this.conditions.date.end_time !== ""){
               this.conditions.date.start_time =moment(this.conditions.date.start_time).format().split('T')[0]+"T00:00:00.000Z";
               this.conditions.date.end_time =moment(this.conditions.date.end_time).format().split('T')[0]+"T15:59:59.000Z";
            }
            if(this.deviceType === 0) {
                this.getData();
            }
            if(this.deviceType === 1) {
                this.getDataTemp();
            }
        },
        reset() {
            this.page_number = 1;
            this.conditions.date.start_time = '';
            this.conditions.date.end_time = '';
            if(this.deviceType === 0) {
                this.conditions.like.collector_id = '';
                this.conditions.like.customer_name = '';
                this.conditions.like.collector_model = '';
                this.conditions.filter.check_result = '';
                this.conditions.filter.stock_status  = '';
                this.conditions.filter.status = '';
                this.getData();
            }
            if(this.deviceType === 1) {
                this.conditionsTemp.filter.status = '';
                this.conditionsTemp.filter.stock_status  = '';
                this.conditionsTemp.like.sn = '';
                this.conditionsTemp.like.model = '';
                this.conditionsTemp.like.customer_name = '';
                this.getDataTemp();
            }
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
                    message: '请选择出库设备',
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
            // console.log(requestData);
            const { result: { rows, total } } = await this.$http('devices', { data: requestData });
            for (const data of rows) {
                data.test_result = data.check_result === 0 ? '不合格' : data.check_result === 2 ? '未检测' : data.check_result === 3 ? "维修中" :"合格";
                data.status = data.status ? '启用' : '停用';
                data.indate && (data.indate = data.indate.split('T')[0]);
                data.stock_status = data.stock_status === 0 ? '未出库' : '已出库';
            }
            this.initData.datas = rows;
            this.initData.total = total;
        },
        // 获取主数据-温度计
        async getDataTemp() {
            if (this.conditionsTemp.filter.status === '') {
                delete this.conditionsTemp.filter.status;
            }
            if (this.conditionsTemp.filter.stock_status  === '') {
                delete this.conditionsTemp.filter.stock_status ;
            }
            const requestData = {
                filter: this.conditionsTemp.filter,
                like: this.conditionsTemp.like,
                date: this.conditions.date,
                page_size: this.page_size,
                page_number: this.page_number
            }
            // console.log(requestData);
            const { result: { rows, total } } = await this.$http('gauge', { data: requestData });
            for (const data of rows) {
                data.status = data.status ? '启用' : '停用';
                data.indate && (data.indate = data.indate.split('T')[0]);
                data.stock_status = data.stock_status === 0 ? '未出库' : '已出库';
            }
            this.initData.datas = rows;
            this.initData.total = total;
        },
        //换页
        pageChange(current) {
            this.page_number = current;
            if(this.deviceType === 0) {
                this.getData();
            }
            if(this.deviceType === 1) {
                this.getDataTemp();
            }
        },
        calculateBox() {
            if (this.manager) {
                    this.buttonBoxWidth = 260;
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
                if(this.deviceType === 0) {
                    row.forEach((item)=>{ 
                        if(item.test_result === '合格'){
                            checkedLen++;
                        }
                    })
                    if(checkedLen !== row.length || outstockLen !== 0 ){ //是否所有都合格
                        this.$message({
                            message: '请检查是否所选都合格，不合格不能出库',
                            type: 'warning'
                        })
                    }else{ 
                        this.OutVar(row, batch);
                    }
                }
                if(this.deviceType === 1) {
                    this.OutVar(row, batch);
                }
            }else{
                if(this.deviceType === 0) {
                    if(row.test_result !== '合格'){
                        this.$message({
                            message: '请先测试，合格之后才能出库',
                            type: 'warning'
                        })
                    }else{
                        this.OutVar(row, batch);
                    }
                }
                if(this.deviceType === 1) {
                    this.OutVar(row, batch);
                }
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
        async BackStockDialog(index, row) {
            if (this.initData.datas[index].stock_status === '已出库') {
                this.dialogData.title = '退库';
                this.dialogData.type = 2;
                this.dialogData.dialogWidth = '500px';
                this.itemDevicesData = row;
                if(this.deviceType === 0) {
                    this.showDialog();
                }
                if(this.deviceType === 1) {
                    // this.OutOrBackStockParams.snList.push(row.sn);
                    // console.log(this.OutOrBackStockParams);
                    // const {result} = await this.$http.put('gauge', this.OutOrBackStockParams);
                    // this.$message({
                    //     message: '成功退库',
                    //     type: 'success'
                    // })
                    // this.getDataTemp();
                    // this.OutOrBackStockParams.snList = [];
                }
                
            }else {
                this.$message({
                    message: '请先出库',
                    type: 'warning'
                })
            }
        },
        //删除
        deleteStock(index, row) {        
            if(row.stock_status === '已出库'){
                this.$message({
                    message: '该设备出库了，不能删除哦！',
                    type: 'warning'
                })
            }else{
                this.dialogData.title = '删除';
                this.dialogData.type = 4;
                this.dialogData.dialogWidth = '500px';
                this.itemDevicesData = row;
                this.deleteIndex = index;
                this.isStop.collector_id = [];
                this.showDialog();
            }
        },
        async sureDelete() {
            if(this.deviceType === 0) {
                this.isStop.collector_id.push(this.itemDevicesData.collector_id);
                const result = await this.$http.put('devices',this.isStop);
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                this.Cancel();
                this.getData();
            }
            if(this.deviceType === 1) {

            }
        },
        //查看
        ViewPathDialog(index, row) {
            if(this.deviceType === 0) {
                this.dialogData.title = '轨迹 - ' + row.collector_id;
                this.dialogData.type = 3;
                this.showDialog();
                this.dialogData.dialogWidth = '800px';
                this.getDevicesPath(row)
            }
        },
        //获取查看轨迹
        async getDevicesPath(item) {
            const { result } = await this.$http('deviceTrack', { data: { collector_id: item.collector_id } });
            this.itemDevicesData = result.rows;
            this.detailData = item;
        },
        // formatJson(filterVal, jsonData) {
        //     return jsonData.map(v => filterVal.map(j => v[j]))
        // },
        // export2Excel() {
        //     require.ensure([], () => {                       //这里的require的路径要写对，不然运行会有错误	    　　　　　　
        //         const { export_json_to_excel } = require('@/vendor/Export2Excel');
        //         const tHeader = [];
        //         const filterVal = [];
        //         for (let i = 0; i < this.columns.length; i++) {
        //             tHeader.push(this.columns[i].label);
        //             filterVal.push(this.columns[i].prop);
        //         }
        //         const list = this.initData.datas;
        //         const data = this.formatJson(filterVal, list);
        //         export_json_to_excel(tHeader, data, '设备库存管理');
        //     })
        // },
        handleSizeChange(val){
            this.page_size = val;
            if(this.deviceType === 0) {
                this.getData();
            }
            if(this.deviceType === 1) {
                this.getDataTemp();
            }
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
        },
        // 采集周期
        UpdateTimeDialog(row, batch) {
            if(batch) {
                let outStock = true;
                row.forEach(item => {
                    if(item.stock_status === '未出库') {
                        outStock = false;
                        
                    }
                })
                if(!outStock) {
                    this.$message({
                        message: '选中的设备中有未出库的，请先出库',
                        type: 'warning'
                    })
                }
            }else {
                if(row.stock_status === '已出库') {
                    this.UpdateTime(row, batch);
                }else {
                    this.$message({
                        message: '该设备未出库，请先出库',
                        type: 'warning'
                    })
                }
            }
        },
        UpdateTime(row, batch) {
            this.dialogData.title = '采集周期';
            this.dialogData.type = 5;
            this.showDialog();
            this.dialogData.dialogWidth = '500px';
            this.itemDevicesData = row;
            this.batch = batch;
        },
        //批量编辑
        batchEdit(){
            if(this.multipleSelection.length>0){
                console.log(this.multipleSelection)
                this.UpdateTimeDialog(this.multipleSelection, true)
            }else{
                this.$message({
                    message: '请选择需要编辑采集周期的设备',
                    type: 'warning'
                })
            }
        },

        // 批量入库
        importf() {//导入
            this.datas.devices = [];
            let wb = null; //读取完成的数据
            const rABS = false; //是否将文件读取为二进制字符串
            const obj = document.querySelector('#fileinp');
            if(!obj.files) {
                return;
            }
            let f = obj.files[0];
            let reader = new FileReader();
            reader.onload = (e) => {
                let data = e.target.result;
                if(rABS) {
                    wb = XLSX.read(btoa(fixdata(data)), {//手动转化
                        type: 'base64'
                    });
                } else {
                    wb = XLSX.read(data, {
                        type: 'binary'
                    });
                }
                //wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
                //wb.Sheets[Sheet名]获取第一个Sheet的数据

                // 遍历sheet中的sheetname
                wb.SheetNames.forEach(sheetname => {
                    this.datas.devices = this.datas.devices.concat(XLSX.utils.sheet_to_json(wb.Sheets[sheetname]));
                });
                // console.log(this.datas);
                if(this.datas.devices.length > 0) {
                    this.inStockBatch();
                }else {
                    this.$message({
                        message: '导入的文件内容为空', 
                        type: 'warning'
                    })
                }
            };
            obj.value = null;
            if(rABS) {
                reader.readAsArrayBuffer(f);
            } else {
                reader.readAsBinaryString(f);
            }
        },

        fixdata(data) { //文件流转BinaryString
            let o = "",
                l = 0,
                w = 10240;
            for(; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
            o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
            return o;
        },
        async inStockBatch() {
            const {result} = await this.$http.post('gauge',this.datas); 
            this.$message({
                message: '入库成功', 
                type: 'success'
            })
            this.getDataTemp();
        }
    },
    created() {
        if(sessionStorage.getItem('user_id')) {
            this.datas.operator.user_id = sessionStorage.getItem('user_id');
            this.datas.operator.user_name = sessionStorage.getItem('fullname');
        }
        this.calculateBox();
        if(this.deviceType === 0) {
            this.getData();
        }
        if(this.deviceType === 1) {
            this.getDataTemp();
        }
    },
}
</script>
<style lang="scss">
.table-page {
  width: 100%;
  height: 100%;
  .searc-filter {
    margin: 20px 20px 20px 20px;
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
    .title{
        height:60px;
        line-height: 40px;
        display: flex;
        justify-content: space-between;
        .titleText{
            margin-left:10px;
            font-size: 20px;
        }
    }
    .el-table {
      .mu-raised-button {
        min-width: 38px;
        height:26px;
        line-height: 26px;
        .mu-button-wrapper{
            padding:0 5px;
        }
      }
      tr {
        height: 70px;
        td {
          padding-left: 10px;
          &.edit-buttons {
            button {
              margin-right: 7px;
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
   margin-right: 10px;
  }
  .dialog-footer {
    margin-top: 20px;
    width: 100%;
    text-align: right;
      .mu-button{
            margin-right:10px;
        }
        .cancel{
            border:1px solid #ccc
        }
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
    #stocl-label {
        position: relative;
        width: 88px;
        height: 36px;
        margin-right: 8px;
        box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
        &:hover {
            opacity: 0.85;
        }
        margin-left: 8px;
        #fileinp{
            position: absolute;
            left: 0;
            top: 0;
            opacity: 0;
            width: 88px; 
            height: 36px;
            font-size: 0;
            cursor: pointer;
        }
        #btn{
            margin-right: 5px;
            background-color: #ff4081; 
            border: none; 
            color: #ffffff; 
            border-radius: 2px;
            width: 88px; 
            height: 36px;
        }
        #text{
            color: red;
        }
    }
}
</style>
