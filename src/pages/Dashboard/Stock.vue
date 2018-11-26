
<template>
    <div class="stock">
        <div class="top">
            <div class="list">库存总计：<span>{{allstockSum}}</span></div>
            <div class="list">未出库库存总计：<span>{{inStockSum}}</span></div>
            <div class="list">未出库库存合格：<span>{{checked}}</span></div>
        </div>
        <div class="stockContent">
            <div class="header">库存统计</div>
            <div class="trouble-count" ref="stock"></div>
        </div>
        <div class="stockContent">
            <div class="header">未出库库存统计</div>
            <div class="trouble-count" ref="instock"></div>
        </div>
    </div>
</template>
<script>
import {screenPie} from './../../components/charts.js'
export default {
    data(){
        return{
            stock:"",
            chartColor:['#003366','#e5323e','#4cabce'],
            allstockSum:0,
            inStockSum:0,
            checked:0,
            instock:""
        }
    },
    methods:{
        //获取库存
        async getStock(){
            const {result} = await this.$http('stockDatas/repertoryCount');
            result.rows.forEach((item)=>{
               this.allstockSum = item.value+this.allstockSum
            })
            this.stock = screenPie(this.$refs.stock,result.rows,this.chartColor);
        },
        //获取未出库数据
        async getinStock(){
            const {result} = await this.$http('stockDatas/instock');
            result.rows.forEach((item)=>{
                if(item.name === 1){
                    this.checked = item.value;
                }
                item.name = item.name === 0?'不合格':item.name===1?'合格':item.name===2?'未检测':item.name===3?'维修中':"不确定"
               this.inStockSum = item.value+this.inStockSum

            })
            this.stock = screenPie(this.$refs.instock,result.rows,this.chartColor);
        }
    },
    mounted(){
        window.addEventListener('resize', () => {
            this.stock.resize();  
        }) 
    },
    created(){
        this.getStock();
        this.getinStock();
    }
}
</script>
<style lang="scss">
.stock{
    padding:20px;
    .top{
        height:100px;
        width:100%;
        background: #fff;
        margin-bottom: 20px;
        line-height: 100px;
        padding-left:20px;
        font-size:18px;
        display: flex;
        .list{
            width:250px;
            margin-right:50px;
        }
        span{
           font-size:22px;
        }
        
    }
    .header{
      line-height: 60px;
      padding-left:30px;
      font-size:18px;
    }
    .stockContent{
      display: inline-block;
      background: #fff;
      width:49%;
      margin-right:2%;
    }
    .trouble-count{
        width: 90%;
        height: 300px;
        display: inline-block;
    }
    .stockContent:last-child{
        margin-right: 0
    } 
}
</style>
