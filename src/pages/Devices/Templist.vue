<template>
    <div class="devices-page">
        <table-page :manager="false", :deviceType="temp"></table-page>
    </div>
</template>
<script>
import tablePage from '../../components/tablePage'
export default {
    name: 'Templist',
    components: {tablePage}
}
</script>
