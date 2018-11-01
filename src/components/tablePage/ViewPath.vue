<template>
    <div class="view-path">
        <el-scrollbar style="height:100%">
            <d2-crud
            :columns="columns"
            :data="item"
            />
        </el-scrollbar>
    </div>
</template>
<script>
import moment from 'moment';
export default {
    name:'ViewPath',
    props:['item'],
    data(){
        return{
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
            ],
            item:this.item
        }
    },
    methods:{ 
    },
    watch:{
        item(value){
            if(value.length){
                for(const row of value){
                    row.type = row.type === 'backstock' ? '退库': row.type === 'outstock' ? '出库' : row.type === 'test' ?'测试' : row.type === 'delete ' ?'删除':row.type === 'change' ?'替换出库':'入库';
                    row.update =  moment(row.update).zone("+08:00").format("YYYY-MM-DD HH:mm:ss");   
                }
            }
            this.item = value;
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
   .el-scrollbar .el-scrollbar__wrap{
        overflow-x: hidden !important;
    }
}
</style>

