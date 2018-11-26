
<template>
    <div class="falut">
         <div class="top">
            <div class="list">故障总计：<span>{{sum}}</span></div>
            <!-- <div class="list">未出库库存总计：<span>{{sum}}</span></div> -->
        </div>
         <!-- 故障统计 -->
        <div class="troubleContent">
            <div class="header">故障统计</div>
            <div class="trouble-count" ref="trouble"> </div>
        </div>
        <!-- <div class="troubleContent">
            <div class="header">故障型号统计</div>
            <div class="trouble-count" ref="troubleModel"> </div>
        </div> -->
    </div>
</template>
<script>
import {screenPie} from './../../components/charts.js'
export default {
    data(){
        return{
            fault:"",
            chartColor:['#003366','#e5323e','#4cabce'],
            sum:0,
            troubleModel:""
        }
    },
    methods:{
        //获取故障
        async getTrouble(){
            const {result} = await this.$http('faultDatas/faultCount'); 
            result.rows.forEach((item)=>{
                this.sum= item.value+this.sum
            })
            this.fault = screenPie(this.$refs.trouble,result.rows,this.chartColor);
        },
    },
    mounted(){
        window.addEventListener('resize', () => {
            this.fault.resize();      
        })
        
    },
    created(){
        this.getTrouble();
    }
}
</script>
<style lang="scss">
.falut{
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
        span{
           font-size:22px;
        }
    }
    .header{
      line-height: 60px;
      padding-left:20px;
      font-size:18px;
    }
    .troubleContent{
      display: inline-block;
      background: #fff;
      width:100%;
      margin-right:1.5%;
      .trouble-count{
        width: 90%;
        height: 280px;
        display: inline-block;
      } 
    }
    .troubleContent:last-child{
        margin-right: 0;
    }
}
</style>

