import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        // 所有bug查询状态
        allBugState: '全部',
        // 所有bug查询状态
        isRegister: false,
        // 需要重新登录的response.config
        response_configs: [],
        // 复制bug json对象
        copy_bug_data: null,

        personInfo: {},
        // 项目- 版本 处理人 模块
        ProjectVer_options: null,
        Module_options: null,
        bugList: null,
        bugListIndex: null,
    },
    mutations: {
        isRegisterChange(state, isRegister) {
            state.isRegister =isRegister;
        },
        response_configPush(state, config) {
            state.response_configs.push(config)
        },
        response_configClear(state) {
            state.response_configs = [];
        },
        updateCopy_bug_data(state,data) {
            state.copy_bug_data = data;
        }


    },
    actions: {},
    modules: {}
});

export default store;
