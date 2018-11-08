<template>
    <div class="service-expire">
       
        <div class="searc-filter" @keydown.enter="Search">
            <mu-form :model="params" label-position="top" label-width="100">
                <el-row :gutter="20">
                    <el-col :span="4">
                        <mu-form-item label="所属客户">
                            <mu-text-field  v-model="params.like.customer_name" placeholder="请输入内容"></mu-text-field>
                        </mu-form-item>
                    </el-col>  
                    <el-col :span="6" class="form-buttons">
                        <mu-form-item>
                            <mu-button color="primary" @click="Search">搜索</mu-button>
                            <mu-button color="warning" @click="reset">重置</mu-button>
                        </mu-form-item>
                    </el-col>
                </el-row>
            </mu-form>
        </div>
        <div class="header">
           <mu-button color="primary" :flat="!(activeIndex === index)" @click="activeClick(item.prop,index)" v-for="(item,index) in activeButton" :key="index">{{item.label}}</mu-button>
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
            label:"",
            params:{
                like:{
                    customer_name:""
                }
            },
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
            copySelectedData:[],
            columns:[
                {
                    label:"采集器ID",
                    prop:"collector_id",
           
                },
                {
                    label:"到期时间",
                    prop:"validity",
           
                },
                {
                    label:"库存状态",
                    prop:"type"
                },
                {
                    label:"BOX型号",
                    prop:"collector_model"
           
                },
                {
                    label:"所属客户",
                    prop:"customer_name",
                  
                },
            ],

        }
    },
    methods:{
        async getSevicesExpire(){
             const {result} = await this.$http('datas/expireCount');
             this.allData = result.rows;
            this.initButton()
        },
        activeClick(name,index){
            this.activeIndex = index
            this.allData.forEach((Item)=>{
                 Item.item.forEach((items)=>{
                    items.validity = items.validity.split('T')[0];
                    items.type = ((items.stock_status === 1)? '已出库' : "未出库");
                })
                if(name === Item.name){                    
                    this.copySelectedData = this.selectedData = Item.item;
                }  
            })
        },
       async initButton(){
            if(Object.keys(this.$route.query).length){
                this.activeButton.forEach((item,index)=>{
                    if(this.$route.query.type === item.prop){
                       this.activeClick(this.$route.query.type,index)
                    }
                    return false;
                })          
            }else{
               this.activeClick("one",0)
            } 
        },
        Search(){
            const arr = [];
            this.allData.forEach((item)=>{
                item.item.forEach((items)=>{
                    if(items.customer_name){
                        if(items.customer_name.search(this.params.like.customer_name)!==-1){
                            arr.push(items);
                        }
                    }
                })   
            })
            this.selectedData = arr;
             this.activeClick("",-1);
        },
        reset(){
            this.params.like.customer_name = "";
            this.activeClick("one",0);
        }
    },
    created(){
        this.getSevicesExpire();     
             
    }
}
</script>
<style lang="scss">
    .service-expire{
        margin:20px 20px;
        width:calc(100% - 40px);
        border-radius: 3px;
       .searc-filter{
           background:#fff;
           padding-left:20px;
           padding-top:10px;
           margin-bottom:20px;
           .mu-button{
               margin-top:20px;
           }  
       }
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


