<template>
    <div class="view-path">
        <el-tabs :tab-position="tabPosition" v-model="outStockType">
            <el-tab-pane label="历史记录" name="history" style="height:260px">
                <el-scrollbar style="height:100%">
                    <d2-crud
                    :columns="columns"
                    :data="item"
                    />
                </el-scrollbar>
            </el-tab-pane>
            <el-tab-pane label="详细信息" name="detailed" style="height:260px">
                <el-scrollbar style="height:100%">
                    <div class="detailList"><span class="label">BOX型号：</span><span>{{itemDetail.collector_model}}</span></div>
                    <div class="detailList"><span class="label">所属客户：</span><span>{{itemDetail.customer_name}}</span></div>
                    <div class="detailList"><span class="label">入库时间：</span><span>{{itemDetail.indate}}</span></div>
                    <div class="detailList"><span class="label">库存状态：</span><span>{{itemDetail.stock_status}}</span></div>
                    <div class="detailList"><span class="label">检测状态：</span><span>{{itemDetail.check_result===3?"维修中":itemDetail.check_result===2?"未检测":itemDetail.check_result===1?"合格":"不合格"}}</span></div>    
                    <div class="detailList"><span class="label">SIM供应商：</span><span>{{itemDetail.SIM_name}}</span></div>
                    <div class="detailList"><span class="label">焊接厂家：</span><span>{{itemDetail.weld_name}}</span></div>
                    <div class="detailList"><span class="label">PCB厂家</span>{{itemDetail.PCB_name}}<span></span></div>
                    <div class="detailList"><span class="label">元器件供应商：</span><span>{{itemDetail.CAP_name}}</span></div>
                    <div class="detailList"><span class="label">通讯模块供应商：</span><span>{{itemDetail.CM_name}}</span></div>
                </el-scrollbar>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import moment from 'moment';
export default {
    name:'ViewPath',
    props:['item','itemDetail'],
    data(){
        return{
            tabPosition:"top",
            outStockType:"history",
            columns:[
                {
                    title: '类型',
                    key: 'type'
                },
                {
                    title: '操作人',
                    key: 'user_name'
                },
                {
                    title: '时间',
                    key: 'update'
                },
                {
                    title: '所属客户',
                    key: 'customer_name'
                },
                {
                   title: '原因',
                    key: 'fault_name' 
                },
                {
                    title: '备注',
                    key: 'remark'
                },
            ],
            item:this.item,
            itemDetail:this.itemDetail
        }
    },
    methods:{ 
    },
    watch:{
        item(value){
            this.outStockType ="history"
            if(value.length){
                for(const row of value){
                    row.type = row.type === 'backstock' ? '退库': row.type === 'outstock' ? '出库' : row.type === 'test' ?'测试' : row.type === 'delete' ?'删除':row.type === 'change' ?'替换出库':'入库';
                    row.update =  moment(row.update).zone("+08:00").format("YYYY-MM-DD HH:mm:ss");  
                }
            }
            this.item = value;
        },
        itemDetail(value){
            this.itemDetail = value;
        }
    },
    created(){
    }, 
}
</script>
<style lang="scss">
.view-path{
    height:300px;
    width:100%;
    .el-tabs__header{
        margin-bottom: 0;
    }
   .el-scrollbar .el-scrollbar__wrap{
        overflow-x: hidden !important;
        .d2-crud-body{
            padding-top:0;
        }
    }
    .detailList{
        height:50px;
        line-height: 50px;
        width:45%;
        display: inline-block;
        .label{
            display: inline-block;
            width:120px;
            text-align: right;
            margin-right:10px;
        }

    }
}
</style>

