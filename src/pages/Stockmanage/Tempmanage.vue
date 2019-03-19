<template>
  <div class="stock-manage">
    <table-page :manager="true" :deviceType=1 class="Table">
    </table-page>
   
  </div>
</template>
<script>
import tablePage from "../../components/tablePage";
export default {
  name: 'Tempmanage',
  components:{tablePage},
  data() {
    return {
    };
  },
  methods: {
  }
};
</script>

