<template>
  <div class="dashboard">
    <!-- 型号统计 -->
    <div class="modelContent">
      <div class="header">型号统计</div>
      <div class="stock-count" ref="model"> </div>
    </div>  
     <!-- 每个型号每月统计 -->
     <div class="modelContent" style="margin-right:0;">
      <div class="header">
        型号每月出库统计
        <el-date-picker
          v-model="params.year"
          type="year"
          value-format="yyyy"
          placeholder="选择年" @change="selectYear">
        </el-date-picker>
      </div>
      <div class="stock-count" ref="modelOutStock"> </div>
    </div>
    <!-- 库存统计 -->
    <div class="stockContent">
      <div class="header">库存统计</div>
      <div class="trouble-count" ref="stock"></div>
    </div>
    <!-- 故障统计 -->
    <div class="troubleContent">
      <div class="header">故障统计</div>
      <div class="trouble-count" ref="trouble"> </div>
    </div>
    <!-- 服务到期统计 -->
    <div class="troubleContent">
      <div class="header">服务到期统计</div>
      <div class="trouble-count" ref="expireCount"></div>
    </div>
  </div>
</template>
<script>
import {barCharts,screenPie,lineCharts} from './../../components/charts.js'
export default {
  data() {
    return {
      model:"",
      stock:"",
      fault:"",
      expireCount:"",
      monthCount:"",
      chartColor:['#003366','#e5323e','#4cabce'],
      params:{
        year:"2018"
      },
      itemStyle:{
        normal:{ 
            color:'rgba(128, 128, 128, 0)' 
        } 
      },
      label: { 
        normal: { 
        offset:['50', '80'], 
        show: true, 
        position: 'insideBottom', 
        formatter:'{c}', 
        textStyle:{ color:'#000' } 
        }
      }
      // chartColor:['rgba(33,150,243,0.73)',"rgba(236,37,19,0.70)",'rgba(0,0,0,0.45)'] 
    }
  },
  methods: {
    //获取型号
    async getDevicesModels(){
      const {result} = await this.$http('modelDatas/modelsCount');
      const legend=[];
      result.value.reverse();
      result.value.forEach((item,index,arr)=>{
         item.name =(item.type === 1 ? '已出库' : item.type ==='all'? "全部" :"未出库");
          item.type = 'bar';
          item.barWidth = 25;
          item.stack = 'data';
         if(item.name==="全部"){
            item.itemStyle = this.itemStyle;
            item.label = this.label;    
          }else{
            legend.push(item.name)
          }
      })
      this.model = barCharts(this.$refs.model,result.name,result.value,legend,this.chartColor);
    },
    //获取库存
    async getStock(){
      const {result} = await this.$http('stockDatas/repertoryCount');
      this.stock = screenPie(this.$refs.stock,result.rows,this.chartColor);
    },
    //获取故障
    async getTrouble(){
      const {result} = await this.$http('faultDatas/faultCount');
      this.fault = screenPie(this.$refs.trouble,result.rows,this.chartColor);
    },
    //获取服务到期
    async getExpireCount(){
      const {result} = await this.$http('expireDatas/expireCount');
      result.rows.forEach((item)=>{
        item.value = item.item.length;
        item.type = item.name;
        item.name = (item.name === "three" ? "3个月" : item.name === "two" ? "2个月" : item.name === "one" ? "1个月" : "大于3个月");
      })
      this.expireCount = screenPie(this.$refs.expireCount,result.rows,this.chartColor,3);
    },
    // 获取型号每月出库统计
    async getMonthCount(){
      const {result} = await this.$http('modelDatas/monthCount',{data:{year:this.params.year}});
      result.rows.forEach((item)=>{
        item.type="line";
        item.data = item.value
      })
      const dataX = [];
      for(let i=0;i<12;i++){
        dataX.push((i+1)+`月`)
      }
      this.monthCount = lineCharts(this.$refs.modelOutStock,dataX,result.rows)
    },
    selectYear(year){
      this.getMonthCount();
    }

  },
  mounted() {
    window.addEventListener('resize', () => {
      this.model.resize();
      this.stock.resize();
      this.fault.resize();
      this.expireCount.resize();
      this.monthCount.resize();
    }) 
  },
  created(){
    this.getDevicesModels();
    this.getStock();
    this.getTrouble();
    this.getExpireCount();
    this.getMonthCount();
  }
}
</script>
<style lang="scss">
  .dashboard{
    margin:20px;
    .header{
      line-height: 60px;
      padding-left:30px;
      font-size:22px;
    }
    .modelContent{
      background: #fff;
      width:49%;
      display: inline-block;
      margin-bottom:20px;
      margin-right:2%;
        .stock-count{
          width:98%;
          display: inline-block;
          height: 400px;
        }
        .el-date-editor--year{
          margin-left:20px;
        }
    }
    .stockContent,.troubleContent{
      display: inline-block;
      background: #fff;
      width:32%;
    }
    .trouble-count{
        width: 90%;
        height: 280px;
        display: inline-block;
      }
    .troubleContent{
      margin-left:2%;
    }
  }
</style>


