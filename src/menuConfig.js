// 菜单配置
// headerMenuConfig：头部导航配置
// asideMenuConfig：侧边导航配置

const headerMenuConfig = [];

const asideMenuConfig = [
  {
    path: '/main',
    name: '首页统计',
    // icon: 'el-icon-menu',
    icon: 'iconfont icon-tubiaozhexiantu'
  },
  {
    path: '/typeList',
    name: '型号列表',
    // icon: 'el-icon-date',
    icon: 'iconfont icon-liebiao'
  },
  {
    path: '/deviceList',
    name: '设备列表',
    // icon: 'el-icon-edit-outline',
    icon: 'iconfont icon-liebiao'
  },
  {
    path: '/deviceManage',
    name: '设备库存管理',
    // icon: 'el-icon-edit-outline',
    icon: 'iconfont icon-kucun'
  },
  {
    path: '/contractManage',
    name: '合同管理',
    // icon: 'el-icon-edit-outline',
    icon: 'iconfont icon-kucun'
  },
  {
    path: '/expireManage',
    name: '服务到期管理',
    // icon: 'el-icon-edit-outline',
    icon: 'iconfont icon-kucun'
  },
];

export { headerMenuConfig, asideMenuConfig };
