<template>
  <div class="app-wrapper" >
    <side-bar class="sidebar-container" @active="active"></side-bar>
    <div class="main-container">
      <nav-bar :title="title"></nav-bar>
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
import { NavBar, SideBar, AppMain } from './components';

export default {
  name: 'layout',
  components: {
    NavBar,
    SideBar,
    AppMain,
  },
  data () {
    return {
      title:''
    }
  },
  methods:{
    active(name){
      this.title = name;
    }
  },
  mounted(){
    if(sessionStorage.getItem('title')){
      this.title = sessionStorage.getItem('title');
    }else{
      this.title = '首页统计';
    }
  }
};
</script>

<style lang="scss" scoped>
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  &:after {
    content: "";
    display: table;
    clear: both;
  }
}

.main-container {
  min-height: 100vh;
  transition: margin-left 0.28s;
  margin-left: 256px;
  background-color: #f0f2f5;
}
</style>
