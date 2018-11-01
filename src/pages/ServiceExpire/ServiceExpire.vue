<template>
    <div class="service-expire">
       <div class="header">
           <mu-button color="primary" :flat="!(activeIndex === index)" @click="activeClick(item.prop,index,allData)" v-for="(item,index) in activeButton" :key="index">{{item.label}}</mu-button>
       </div>
       <div class="content">
        <el-table :data="selectedData" style="width:100%;margin-bottom:30px;padding:0 20px">
            <el-table-column :prop='item.prop' min-width="120" :label='item.label' v-for="item in columns" :key="item.index">
            </el-table-column>
        </el-table>
       </div>
    </div>
</template>
<script>
import moment from 'moment';
export default {
    name:"ServiceExpire",
    data(){
        return{
            activeIndex:0,
            activeButton:[
                {
                    label:"1个月以内",
                    prop:"one",
                },
                {
                    label:"2个月",
                    prop:"two",
                },
                {
                    label:"3个月",
                    prop:"three",
                },
                {
                    label:"3个月以上",
                    prop:"above",
                },
            ],
            allData:[],
            selectedData:[],
            columns:[
                {
                    label:"采集器ID",
                    prop:"collector_id"
                },
                {
                    label:"到期时间",
                    prop:"validity"
                },
                {
                    label:"库存状态",
                    prop:"stock_status"
                },
                {
                    label:"BOX型号",
                    prop:"collector_model"
                },
                {
                    label:"所属客户",
                    prop:"customer_name"
                },
            ],

        }
    },
    methods:{
        async getSevicesExpire(callBack){
             const {result} = await this.$http('datas/expireCount');
             this.allData = result.rows;
             callBack && callBack(); 
        },
        activeClick(name,index,allData){
            this.activeIndex = index
            allData.forEach((item)=>{
                item.item.forEach((items)=>{
                     items.validity = items.validity.split('T')[0];
                     items.stock_status = items.stock_status === 1 ? '已出库' : "未出库";
                 })
                if(name === item.name){
                    this.selectedData = item.item;
                }
            })
        }
    },
    created(){
        this.getSevicesExpire(()=>{
            if(Object.keys(this.$route.query).length){
                this.activeButton.forEach((item,index)=>{
                    if(this.$route.query.type === item.prop){
                        this.activeClick(this.$route.query.type,index,this.allData)
                    }
                    return false;
                })          
            }else{
                this.activeClick("one",0,this.allData)
            } 
        });     
             
    }
}
</script>
<style lang="scss">
    .service-expire{
        margin:20px 20px;
        width:calc(100% - 40px);
        border-radius: 3px;
       
        .header{
            height:80px;
            width:100%;
            line-height: 80px;
            background: #fff;
            margin-bottom:20px;
        }
        .mu-button{
            margin: 10px;
        }
        .mu-flat-button{
            border:1px solid #2196f3;
        }
    }
</style>


