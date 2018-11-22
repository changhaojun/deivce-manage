<template>
  <scroll-bar>
    <div class="logo">
      <!-- <img src="https://img.alicdn.com/tfs/TB13UQpnYGYBuNjy0FoXXciBFXa-242-134.png" width="40">
      <span class="site-name">iOT-BOX</span> -->
      <img src="./../../../assets/iotbox.png" alt="">
    </div>
    <el-menu mode="vertical" :show-timeout="200" background-color="#00142a" text-color="hsla(0, 0%, 100%, .65)" active-text-color="#409EFF">
      <template v-for="item in asideMenuConfig" >
        <mu-list :key ="item.name" toggle-nested>
          <mu-list-item button :ripple="true" v-if="!item.children" :to="item.path" :key="item.name" @click="toUrl(item)">
            <mu-list-item-action>
              <i v-if="item.icon" :class="item.icon"></i>
            </mu-list-item-action>
            <mu-list-item-title style="letter-spacing:1px">{{item.name}}</mu-list-item-title>
          </mu-list-item>
          <!-- <mu-list-item button :ripple="true" v-else nested  nested-indent="true" :to="item.path" :key="item.name" @click="toUrl(item)">
            <mu-list-item-action>
              <i v-if="item.icon" :class="item.icon"></i>
            </mu-list-item-action>
            <mu-list-item-title style="letter-spacing:1px">{{item.name}}</mu-list-item-title>
            <mu-list-item-action>
              
            </mu-list-item-action>
            <mu-list-item button :ripple="true" slot="nested">
              <mu-list-item-title>List Item 1</mu-list-item-title>
            </mu-list-item>
            <mu-list-item button :ripple="true" slot="nested">
              <mu-list-item-title>List Item 2</mu-list-item-title>
            </mu-list-item>
            <mu-list-item button :ripple="true" slot="nested">
              <mu-list-item-title>List Item 3</mu-list-item-title>
            </mu-list-item>
          </mu-list-item> -->
        </mu-list>
      </template>
    </el-menu>
  </scroll-bar>
</template>

<script>
import ScrollBar from './ScrollBar';
import { asideMenuConfig } from '../../../menuConfig';

export default {
  components: { ScrollBar },
  name: 'SideBar',
  props: {},
  data() {
    return {
      asideMenuConfig,
    };
  },
  methods: {
    toUrl(item) {
      this.$emit('active', item.name);
      sessionStorage.setItem('title',item.name);
    }
  }
};
</script>

<style lang="scss">
.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 64px;
  line-height: 64px;
  background: #002140;
  color: #fff;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  overflow: hidden;
  img {
    width: 65%;
    height: 70%;
  }
}
.site-name {
  margin-left: 10px;
}
.sidebar-container {
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  transition: width 0.28s;
  width: 256px !important;
  height: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
  .el-menu {
    padding-top: 16px;
    width: 100% !important;
    border: none;
    .router-link-active {
      background-color: #188fff !important;
      // color: #fff !important;
    }
    .mu-item {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.65);
      .iconfont {
        color: rgba(255, 255, 255, 0.65);
      }
    }
  }
}
</style>
