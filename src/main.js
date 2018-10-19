import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'normalize.css/normalize.css';
import './styles/index.scss';
import App from './App.vue';
import router from './router';
import service from './components/server.js';
import 'muse-ui/lib/styles/base.less';
import { Button, Select, Helpers, TextField,Checkbox,Radio,Switch,theme,DateInput,Picker,Form, AppBar,List,Menu} from 'muse-ui';
import 'muse-ui/lib/styles/theme.less';
Vue.use(ElementUI);

Vue.use(Button);
Vue.use(Select);
Vue.use(Helpers);
Vue.use(TextField);
Vue.use(Checkbox);
Vue.use(Radio);
Vue.use(Switch);
Vue.use(theme);
Vue.use(DateInput);
Vue.use(Picker);
Vue.use(AppBar);
Vue.use(Form);
Vue.use(List);
Vue.use(Menu);
theme.add('carbon', {
  primary: '#317FFE',
  secondary: '#ff4081',
  success: '#4caf50',
  error: '#cc2432',
  warning: '#ffeb3b',
  white: '#ffffff'
}, 'light');

Vue.prototype.$http = service;
Vue.config.productionTip = false;
router.beforeEach((to, from, next) => { //拦截器
  console.log(to)
  if (to.path === '/') {
    next();
  } else {
    console.log(sessionStorage.getItem('userInfo'))
    if (!sessionStorage.getItem('userInfo')) {
      router.replace('/');
    } else {
      next();
    }
  }
});
new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
