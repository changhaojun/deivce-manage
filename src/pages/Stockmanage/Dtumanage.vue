<template>
  <div class="stock-manage">
    <!-- 导出 -->
    
    
    <!-- 表格数据 -->
    <table-page :manager="true" class="Table">
    </table-page>
   
  </div>
</template>
<script>
import tablePage from "../../components/tablePage";
export default {
  name: 'Dtumanage',
  components:{tablePage},
  data() {
    return {
    };
  },
  methods: {
  }
};
</script>
