import Vue from 'vue'
import App from './App.vue'
// import {initRouter} from './router'
import Router from 'vue-router'
import './theme/index.less'
import Antd from 'ant-design-vue'
import Viser from 'viser-vue'
import '@/mock'
import store from './store'
import 'animate.css/source/animate.css'
import Plugins from '@/plugins'
import {initI18n} from '@/utils/i18n'
import bootstrap from '@/bootstrap'
import axios from 'axios'



// axios.defaults.baseURL = 'http://192.168.1.58:6001'
axios.defaults.baseURL = ''
// axios.defaults.headers = {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
Vue.prototype.axios = axios

Vue.prototype.isPromiss = (data) =>{
    const getPromiss = JSON.parse(localStorage.getItem(process.env.VUE_APP_FUNCLIST_KEY))
    if (getPromiss.includes(data)) {
      return true
    }else{
      return false
    }
}






const options =  require('./router/config').default
const router = new Router(options)
console.log(router)
const i18n = initI18n('CN', 'US')
bootstrap({router, store, i18n})
console.log(router)
Vue.config.productionTip = false

Vue.use(Viser)
Vue.use(Antd)
Vue.use(Plugins)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')
