<template>
  <div class="dashboard">
    <!-- 库存管理统计 -->
    <div class="stock-count" ref="stock">
      
    </div>
    <!-- 故障统计 -->
    <div class="trouble-count" ref="trouble">

    </div>
  </div>
</template>

<script>
import {screenPie} from './../../components/charts.js'
export default {
  data() {
    return {
      initData: [
        { value: 50, name: '离线' },
        { value: 100, name: '正常' },
        { value: 200, name: '故障' }
      ]
    }
  },
  methods: {

  },
  mounted() {
    // console.log(this.$refs.stock);
    const pie = screenPie(this.$refs.stock, this.initData);
    window.addEventListener('resize', () => {
      pie.resize();
    })
    
  }
}
</script>

<style lang="scss">
  .dashboard{
    display: flex;
    .stock-count{
      width: 40%;
      height: 300px;

    }
    .trouble-count{
      width: 60%;
      height: 300px;
      background: orangered;
    }
  }
</style>


