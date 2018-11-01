// 以下文件格式为描述路由的协议格式
// 你可以调整 routerConfig 里的内容
// 变量名 routerConfig 为 iceworks 检测关键字，请不要修改名称

import HeaderAsideLayout from './layouts/HeaderAsideLayout';
import Dashboard from './pages/Dashboard';

import Login from './pages/Login';

import BoxTypeList from './pages/BoxTypeList';
import Devices from './pages/Devices';
import StockManage from './pages/Stockmanage';
import ContractManage from './pages/ContractManage';
import ServicesExpire from './pages/ServiceExpire';
const routerConfig = [
  {
    path: '/',
    component: Login,
    layout: Login,
  },
  {
    path: '/main',
    layout: HeaderAsideLayout,
    component: Dashboard,
  },
  {
    path: '/typeList',
    layout: HeaderAsideLayout,
    component: BoxTypeList,
  },
  {
    path: '/deviceList',
    layout: HeaderAsideLayout,
    component: Devices,
  },
  {
    path: '/deviceManage',
    layout: HeaderAsideLayout,
    component: StockManage,
  },
  {
    path: '/contractManage',
    layout: HeaderAsideLayout,
    component: ContractManage,
  },
  {
    path: '/expireManage',
    layout: HeaderAsideLayout,
    component: ServicesExpire,
  },
];

export default routerConfig;
