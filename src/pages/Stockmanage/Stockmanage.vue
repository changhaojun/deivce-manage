<template>
  <div class="stock-manage">
    <!-- 导出 -->
    <mu-button class="export" fab small @click='export2Excel'>导出</mu-button>
    
    <!-- 表格数据 -->
    <table-page :manager="true" class="Table">
    </table-page>
   
  </div>
</template>
<script>
import tablePage from "../../components/tablePage";
export default {
  name: 'Stockmanage',
  components:{tablePage},
  data() {
    return {
    };
  },
  methods: {
    //导出
    formatJson(filterVal, jsonData) {
  　　　　return jsonData.map(v => filterVal.map(j => v[j]))
  　},
    export2Excel() {	    　　　　
      require.ensure([], () => {                       //这里的require的路径要写对，不然运行会有错误	    　　　　　　
          const { export_json_to_excel } = require('@/vendor/Export2Excel');
          const tHeader = [];	
          const filterVal = [];	
          for(let i=0;i<this.columns.length;i++){
            tHeader.push(this.columns[i].title);
            filterVal.push(this.columns[i].key);
          }
          const list = this.data;
          const data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, '设备库存管理');
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.stock-manage{
  .Table{
    padding-top:50px;
  }
  .export{
      margin-top:20px;
      font-size: 14px;
      float:right;
      margin-right:20px;
  }
}
</style>
