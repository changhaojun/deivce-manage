<template>
    <div class="view-path">
        <d2-crud
        :columns="columns"
        :data="item"
        />
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
                    row.type = row.type === 'instock' ? '入库': row.type === 'outstock' ? '出库' : '退库';
                    row.update =  moment(row.indate).format('YYYY-MM-DD hh:mm:ss');
                }
            }
            this.item = value;
        }
    },
    created(){
    }, 
}
</script>
<style lang="scss" scoped>
.view-path{
  
}
</style>

