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
  </div>
</template>
<script>
import {barCharts,screenPie} from './../../components/charts.js'
export default {
  data() {
    return {
      model:"",
      stock:"",
      fault:""
    }
  },
  methods: {
    //获取型号
    async getDevicesModels(){
      const {result} = await this.$http('datas/modelsCount');
      const legend=[];
      for(let i=0;i<result.value.length;i++){
       result.value[i].name =  result.value[i].type === 'all' ? '全部' : result.value[i].type === 'outstock' ? '出库' : '未出库';
       result.value[i].type = 'bar';
       result.value[i].barWidth = 40; 
       result.value[i].barGap = 0 ;
       legend.push(result.value[i].name)
      }
      this.model = barCharts(this.$refs.model,result.name,result.value,legend,['rgba(33,150,243,0.73)',"rgba(236,37,19,0.70)",'rgba(0,0,0,0.45)'] );
    },
    //获取库存
    async getStock(){
      const {result} = await this.$http('datas/repertoryCount');
      this.stock = screenPie(this.$refs.stock,result.rows,['rgba(0,0,0,0.45)',"rgba(236,37,19,0.70)"]);
    },
    //获取故障
    async getTrouble(){
      const {result} = await this.$http('datas/faultCount');
      this.fault = screenPie(this.$refs.trouble,result.rows,['rgba(0,0,0,0.45)','rgba(236,37,19,0.70)']);
    }
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.model.resize();
      this.stock.resize();
      this.fault.resize();
    }) 
  },
  created(){
    this.getDevicesModels();
    this.getStock();
    this.getTrouble();
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
          height: 300px;
        }
    }
    .stockContent,.troubleContent{
      display: inline-block;
      background: #fff;
      width:49%;
      margin-top:30px; 
    }
    .trouble-count{
        width: 90%;
        height: 300px;
        display: inline-block;
      }
    .troubleContent{
      margin-left:2%;
    }
  }
</style>


