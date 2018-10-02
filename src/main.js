// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import qs from 'qs'
import Vue from 'vue'
import Vuex from 'vuex'
import store from './store';
import App from './App'
import router from './router'
import ElementUI from 'element-ui'

import 'simditor/styles/simditor.css'

import {bugIntfc, baseUrl} from './assets/js/interface.js'
// import { intfc, baseUrl } from 'common/js/common-interface'
// import * as method_ from 'common/js/custom.js'
import * as globadata_ from './assets/js/data.js'
// import { rte } from 'common/global-cc'
import rte from './components/rich-text-editor/rte'
import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css'
import '../static/font/font-awesome/css/font-awesome.min.css'
import './assets/css/custom.css'

// Vue.prototype.Gmethod = method_;
// Vue.prototype.$intfc = intfc;
Vue.prototype.$intfcUrl = baseUrl;
Vue.prototype.$ajax = globadata_;
Vue.config.productionTip = false

Vue.use(Vuex);
Vue.use(ElementUI);
Vue.component('rte',rte);
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: {App},
    template: '<App/>'
})


import Axios from 'axios'
// import Axios from './assets/js/axios'

// 拦截request,设置全局请求为ajax请求
Axios.interceptors.request.use((config) => {
    if(config.method.toUpperCase() == 'POST') {
        config.data = qs.stringify(config.data)
    }
    return config
});
Axios.interceptors.response.use((response) => {
    const data = response.data;
    if(data) {
        if(data.error == "没有登录， 不能调用") {
            // if(response.config.method === 'post') {
            //     response.config.data = qs.parse(response.config.data)
            // }
            if(response.config.method.toLowerCase() === 'get') {
                store.commit('response_configPush', response.config);
            }
            store.commit('isRegisterChange', true);
            console.log('没有登录， 不能调用');
            // router.push({
            //     path: '/login'
            // })
        }
    }
    return response
});
Vue.prototype.$http = Axios;


