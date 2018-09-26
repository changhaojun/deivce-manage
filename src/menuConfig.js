// 菜单配置
// headerMenuConfig：头部导航配置
// asideMenuConfig：侧边导航配置

const headerMenuConfig = [];

const asideMenuConfig = [
  {
    path: '/main',
    name: '首页统计',
    icon: 'el-icon-menu',
    // children: [
    //   {
    //     path: '/analysis',
    //     name: '分析页',
    //   },
    //   {
    //     path: '/monitor',
    //     name: '监控页',
    //   },
    //   {
    //     path: '/workplace',
    //     name: '工作台',
    //   },
    // ],
  },
  {
    path: '/typeList',
    name: '型号列表',
    icon: 'el-icon-date',
    // children: [
    //   {
    //     path: '/basic',
    //     name: '基础表格',
    //   },
    //   {
    //     path: '/fixed',
    //     name: '固定表格',
    //   },
    // ],
  },
  {
    path: '/deviceList',
    name: '设备列表',
    icon: 'el-icon-edit-outline',
    // children: [
    //   {
    //     path: '/basic',
    //     name: '典型表单',
    //   },
    //   {
    //     path: '/signup',
    //     name: '注册表单',
    //   },
    // ],
  },
  {
    path: '/deviceManage',
    name: '设备库存管理',
    icon: 'el-icon-edit-outline',
  },
];

export { headerMenuConfig, asideMenuConfig };
