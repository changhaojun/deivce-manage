<template>
  <div class="dashboard">
    <!-- 型号统计 -->
    <div class="modelContent">
      <div class="header">型号统计</div>
      <div class="stock-count" ref="model">
      </div>
    </div> 
    <!-- 库存统计 -->
    <div class="stockContent">
      <div class="header">库存统计</div>
      <div class="trouble-count" ref="stock">
      </div>
    </div>
    <!-- 故障统计 -->
    <div class="troubleContent">
      <div class="header">故障统计</div>
      <div class="trouble-count" ref="trouble">
      </div>
    </div>
    <div class="troubleContent">
      <div class="header">服务到期统计</div>
      <div class="trouble-count" ref="expireCount">
      </div>
    </div>
  </div>
</template>
<script>
import {barCharts,screenPie} from './../../components/charts.js'
export default {
  data() {
    return {
      model:"",
      stock:"",
      fault:"",
      expireCount:"",
      chartColor:['#003366','#e5323e','#4cabce'],
      // chartColor:['rgba(33,150,243,0.73)',"rgba(236,37,19,0.70)",'rgba(0,0,0,0.45)'] 
    }
  },
  methods: {
    //获取型号
    async getDevicesModels(){
      const {result} = await this.$http('datas/modelsCount');
      const legend=[];
      for(let i=0;i<result.value.length;i++){
       result.value[i].name =  result.value[i].type === 'all' ? '全部' : result.value[i].type === 1 ? '出库' : '未出库';
       result.value[i].type = 'bar';
       result.value[i].barWidth = 40; 
       result.value[i].barGap = 0 ;
       legend.push(result.value[i].name)
      }
      this.model = barCharts(this.$refs.model,result.name,result.value,legend,this.chartColor);
    },
    //获取库存
    async getStock(){
      const {result} = await this.$http('datas/repertoryCount');
      this.stock = screenPie(this.$refs.stock,result.rows,this.chartColor);
    },
    //获取故障
    async getTrouble(){
      const {result} = await this.$http('datas/faultCount');
      this.fault = screenPie(this.$refs.trouble,result.rows,this.chartColor);
    },
    //获取服务到期
    async getExpireCount(){
      const {result} = await this.$http('datas/expireCount');
      result.rows.forEach((item)=>{
        item.value = item.item.length;
        item.type = item.name;
        item.name = (item.name === "three" ? "3个月" : item.name === "two" ? "2个月" : item.name === "one" ? "1个月" : "大于3个月");
      })
      this.expireCount = screenPie(this.$refs.expireCount,result.rows,this.chartColor,3);
    }
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.model.resize();
      this.stock.resize();
      this.fault.resize();
      this.expireCount.resize();
    }) 
  },
  created(){
    this.getDevicesModels();
    this.getStock();
    this.getTrouble();
    this.getExpireCount();
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
      width:100%;
        .stock-count{
          width:98%;
          height: 400px;
        }
    }
    .stockContent,.troubleContent{
      display: inline-block;
      background: #fff;
      width:32%;
      margin-top:30px; 
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


