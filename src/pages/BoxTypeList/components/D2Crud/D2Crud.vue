<template>
  <div class="d2-crud">
    <!-- 使用方法请参考文档和示例 -->
    <!-- 文档： https://d2-projects.github.io/d2-admin-doc/zh/ecosystem-d2-crud/ -->
    <!-- 示例： https://d2-projects.github.io/d2-admin/#/demo/d2-crud/index -->
    <d2-crud
      ref="d2Crud"
      :columns="columns"
      :options="options"
      :data="data"/>
  </div>
</template>

<script>
import Vue from 'vue';
import D2Crud from '@d2-projects/d2-crud';

Vue.use(D2Crud);

export default {
  data() {
    return {
      columns: [
        {
          title: 'loT-Box型号',
          key: 'collector_model',
          align: 'center'
        },
        {
          title: 'loT-Box说明',
          key: 'description',
          align: 'center'
        },
        {
          title: '状态',
          key: 'statusDescription',
          align: 'center',
        },
        {
          title: 'loT-Box端口说明',
          key: 'port_info',
          align: 'center'
        }
      ],
      data: [],
      options: {
        stripe: true
      }
    }
  },
  methods: {
    async getTypeList() {
      const { result: { rows } } = await this.$http('models');
      for(const row of rows) {
        row.statusDescription = row.status ? '正常' : '停用';
        
      }
      this.data = rows;
    }
  },
  created() {
    this.getTypeList();
  }
}

</script>
