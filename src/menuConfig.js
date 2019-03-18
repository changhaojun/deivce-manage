// 菜单配置
// headerMenuConfig：头部导航配置
// asideMenuConfig：侧边导航配置

const headerMenuConfig = [];

const asideMenuConfig = [
  {
    path: '/main/model',
    name: '首页统计',
    // icon: 'el-icon-menu',
    icon: 'iconfont icon-tubiaozhexiantu',
    children:[
      {
        path: '/main/model',
        name: '型号统计',
        // icon: 'el-icon-menu',
        icon: 'iconfont icon-tubiaozhexiantu',
      },
      {
        path: '/main/stock',
        name: '库存统计',
        // icon: 'el-icon-menu',
        icon: 'iconfont icon-tubiaozhexiantu',
      },
      {
        path: '/main/falut',
        name: '故障统计',
        // icon: 'el-icon-menu',
        icon: 'iconfont icon-tubiaozhexiantu',
      },
      {
        path: '/main/serve',
        name: '服务统计',
        // icon: 'el-icon-menu',
        icon: 'iconfont icon-tubiaozhexiantu',
      }
    ]
  },
  {
    path: '/typeList',
    name: '型号列表',
    // icon: 'el-icon-date',
    icon: 'iconfont icon-liebiao'
  },
  {
    path: '/deviceList/dtu',
    name: '设备列表',
    // icon: 'el-icon-edit-outline',
    icon: 'iconfont icon-liebiao',
    children: [
      {
        path: '/deviceList/dtu',
        name: 'DTU列表',
        // icon: 'el-icon-menu',
        icon: 'iconfont icon-liebiao',
      },
      {
        path: '/deviceList/temp',
        name: '温度计列表',
        // icon: 'el-icon-menu',
        icon: 'iconfont icon-liebiao',
      }
    ]
  },
  {
    path: '/deviceManage/dtu',
    name: '设备库存管理',
    // icon: 'el-icon-edit-outline',
    icon: 'iconfont icon-kucun',
    children: [
      {
        path: '/deviceManage/dtu',
        name: 'DTU管理',
        // icon: 'el-icon-menu',
        icon: 'iconfont icon-kucun',
      },
      {
        path: '/deviceManage/temp',
        name: '温度计管理',
        // icon: 'el-icon-menu',
        icon: 'iconfont icon-kucun',
      }
    ]
  },
  {
    path: '/contractManage',
    name: '合同管理',
    // icon: 'el-icon-edit-outline',
    icon: 'iconfont icon-hetongguanli-'
  },
  {
    path: '/expireManage',
    name: '服务到期管理',
    // icon: 'el-icon-edit-outline',
    icon: 'iconfont icon-fu-wu-guan-li'
  },
];

export { headerMenuConfig, asideMenuConfig };
