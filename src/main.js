/*
 * @Descripttion: 
 * @version: 
 * @Author: windowdotonload
 */
/*
 * @Descripttion: 
 * @version: 
 * @Author: windowdotonload
 */
/*
 * @Descripttion: 
 * @version: 
 * @Author: windowdotonload
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import moment from 'moment'
import VueSocketIO from 'vue-socket.io'

import 'element-ui/lib/theme-chalk/index.css';



import './styles/global.scss'
import api from '@/api/api'

Vue.use(ElementUI);
Vue.use(new VueSocketIO({
  debug: true,
  connection: 'http://127.0.0.1:7001/',
}))
Vue.config.productionTip = false
Vue.prototype.$api = api

Vue.filter('dateFormat', function (dataStr, pattern = "YYYY-MM-DD  h:mm:ss a") {
  return moment(dataStr).format(pattern)
})




new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
