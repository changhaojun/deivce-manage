// 以下文件格式为描述路由的协议格式
// 你可以调整 routerConfig 里的内容
// 变量名 routerConfig 为 iceworks 检测关键字，请不要修改名称

import HeaderAsideLayout from './layouts/HeaderAsideLayout';
import Dashboard from './pages/Dashboard';

import Login from './pages/Login';

import BoxTypeList from './pages/BoxTypeList';
import DtuList from './pages/Devices/Dtulist';
import TempList from './pages/Devices/Templist';
import DtuManage from './pages/Stockmanage/Dtumanage';
import TempManage from './pages/Stockmanage/Tempmanage';
import ContractManage from './pages/ContractManage';
import ServicesExpire from './pages/ServiceExpire';
import Model from './pages/Dashboard/Model';
import Stock from './pages/Dashboard/Stock';
import Serve from './pages/Dashboard/Serve';
import Falut from './pages/Dashboard/Falut';
const routerConfig = [
  {
    path: '/',
    component: Login,
    layout: Login,
  },
  {
    path: '/main/model',
    layout: HeaderAsideLayout,
    component: Model,
    children:[
      {
        path: '/main/model',
        layout: HeaderAsideLayout,
        component: Model,
      },
      {
        path: '/main/stock',
        layout: HeaderAsideLayout,
        component: Stock,
      },
      {
        path: '/main/falut',
        layout: HeaderAsideLayout,
        component: Falut,
      },
      {
        path: '/main/serve',
        layout: HeaderAsideLayout,
        component: Serve,
      }
    ]
  },
  {
    path: '/typeList',
    layout: HeaderAsideLayout,
    component: BoxTypeList,
  },
  {
    path: '/deviceList/dtu',
    layout: HeaderAsideLayout,
    component: DtuList,
    children: [
      {
        path: '/deviceList/dtu',
        layout: HeaderAsideLayout,
        component: DtuList,
      },
      {
        path: '/deviceList/temp',
        layout: HeaderAsideLayout,
        component: TempList,
      }
    ]
  },
  {
    path: '/deviceManage/dtu',
    layout: HeaderAsideLayout,
    component: DtuManage,
    children: [
      {
        path: '/deviceManage/dtu',
        layout: HeaderAsideLayout,
        component: DtuManage,
      },
      {
        path: '/deviceManage/temp',
        layout: HeaderAsideLayout,
        component: TempManage,
      }
    ]
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
