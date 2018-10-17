<template>
  <div class="devices-page">
    <table-page :manager="false"></table-page>
  </div>
</template>

<script>
import tablePage from '../../components/tablePage'
export default {
  name: 'Devices',
  components: {tablePage},
  data() {
    return {
      like: {
        collector_id: '',
        customer_name: ''
      },
      filter: {
        check_result: ''
      },
      date: {
        start_time: '',
        end_time: ''
      },
      page_size: 10,
      page_number: 1,

      options: [
        { num: 0, label: '不合格' },
        { num: 1, label: '合格' },
      ],
      initData: {
        total: 0,
        datas: []
      }
    }
  },
  methods: {
    search() {
      this.getData();
    },

    reset() {
      this.like.collector_id = '';
      this.like.customer_name = '';
      this.filter.check_result = '';
      this.date.start_time = '';
      this.date.end_time = '';
      this.getData();
    },
    // 获取主数据
    async getData() {
      const requestData = {
        // filter: this.filter,
        like: this.like,
        date: this.date,
        page_size: this.page_size,
        page_number: this.page_number
      }
      if (this.filter.check_result !== '') {
        requestData.filter = this.filter;
      }
      // console.log(requestData);
      const { result: { rows, total } } = await this.$http('devices', { data: requestData });
      for (const data of rows) {
        data.check_result = data.check_result ? '合格' : '不合格';
        data.indate && (data.indate = data.indate.split('T')[0]);
        data.type = data.type === 'instock' ? '未出库' : '已出库';
      }
      // console.log(total);
      this.initData.datas = rows;
      this.initData.total = total
    },

    //换页
    pageChange(current) {
      this.page_number = current;
      this.getData();
    },

    //查看轨迹
    lookTrack(index, row) {

    }
  },
  created() {
    this.getData();
  },
  mounted() {
    // this.getData();
  }
};
</script>

<style lang="scss">
</style>

