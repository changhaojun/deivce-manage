// 菜单配置
// headerMenuConfig：头部导航配置
// asideMenuConfig：侧边导航配置

const headerMenuConfig = [];

const asideMenuConfig = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'el-icon-menu',
    children: [
      {
        path: '/analysis',
        name: '分析页',
      },
      {
        path: '/monitor',
        name: '监控页',
      },
      {
        path: '/workplace',
        name: '工作台',
      },
    ],
  },
  {
    path: '/table',
    name: '表格页',
    icon: 'el-icon-date',
    children: [
      {
        path: '/basic',
        name: '基础表格',
      },
      {
        path: '/fixed',
        name: '固定表格',
      },
    ],
  },
  {
    path: '/form',
    name: '表单页',
    icon: 'el-icon-edit-outline',
    children: [
      {
        path: '/basic',
        name: '典型表单',
      },
      {
        path: '/signup',
        name: '注册表单',
      },
    ],
  },
];

export { headerMenuConfig, asideMenuConfig };
