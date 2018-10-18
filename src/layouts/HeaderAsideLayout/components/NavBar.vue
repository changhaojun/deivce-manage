<template>
  <mu-appbar class="navbar" color="primary">
    {{title}}
    <mu-menu slot="right" open-on-hover>
      <mu-button flat>
        <span class="iconfont icon-zhanghao"></span>
        <span class="user-name">{{fullname}}</span>
      </mu-button>
      <mu-list slot="content">
        <mu-list-item button @click="logout">
          <mu-list-item-content>
            <mu-list-item-title >退出登录</mu-list-item-title>
          </mu-list-item-content>
        </mu-list-item>
      </mu-list>
    </mu-menu>
  </mu-appbar>
</template>

<script>

export default {
  name: 'NavBar',
  props:['title'],
  data() {
    return {
      fullname: ''
    }
  },
  methods: {
    logout() {
      this.$router.push({ path: '/' });
      sessionStorage.removeItem('actk');
      sessionStorage.removeItem('title');
    },
  },
  created() {
    this.fullname = sessionStorage.getItem('fullname');
  },
  mounted() {

  }
};
</script>

<style lang="scss" scoped>
.navbar {
  width: 100%;
  .mu-menu {
    height: 100%;
    .iconfont {
      margin-right: 10px;
    }
  }
}
</style>

