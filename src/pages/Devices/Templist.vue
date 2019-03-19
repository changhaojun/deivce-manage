<template>
    <div class="devices-page">
        <table-page :manager="false" :deviceType=1></table-page>
    </div>
</template>
<script>
import tablePage from '../../components/tablePage'
export default {
    name: 'Templist',
    components: {tablePage}
}
</script>
