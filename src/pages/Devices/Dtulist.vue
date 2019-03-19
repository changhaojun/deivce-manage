<template>
  <div class="devices-page">
    <table-page :manager="false" :deviceType=0></table-page>
  </div>
</template>

<script>
import tablePage from '../../components/tablePage'
export default {
  name: 'Devices',
  components: {tablePage}
};
</script>

<style lang="scss">
</style>