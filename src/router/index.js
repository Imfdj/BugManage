import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const rootRouter = {
    path: '/',
    name: 'Index',
    // redirect: '/home/main',
    // meta: {
    //     title: '全域旅行社管理系统'
    // },
    component: () => import('../pages/Index'),
    children: [
        {
            path: '/',
            name: 'projectList',
            component: () => import('../pages/project/ProjectList')
        },
        {
            path: '/bug',
            name: 'bug',
            meta: {
                title: 'bug'
            },
            component: () => import('../pages/bug/bug'),
            children: [
                {
                    path: '/bug',
                    name: 'situation',
                    meta: {
                        title: '项目概况'
                    },
                    component: () => import('../pages/bug/Situation')
                }, {
                    path: '/bug/situation',
                    name: 'situation',
                    meta: {
                        title: '项目概况'
                    },
                    component: () => import('../pages/bug/Situation')
                }, {
                    path: '/bug/myDispose',
                    name: 'my-dispose',
                    meta: {
                        title: '分配给我的Bug'
                    },
                    component: () => import('../pages/bug/MyDispose')
                }, {
                    path: '/bug/mySubmit',
                    name: 'my-submit',
                    meta: {
                        title: '我创建的Bug'
                    },
                    component: () => import('../pages/bug/MySubmit')
                }, {
                    path: '/bug/allBug',
                    name: 'all-bug',
                    meta: {
                        title: '所有Bug'
                    },
                    component: () => import('../pages/bug/AllBug')
                }, {
                    path: '/bug/bugStatistics',
                    name: 'bug-statistics',
                    meta: {
                        title: 'Bug统计'
                    },
                    component: () => import('../pages/bug/BugStatistics')
                }
            ]
        }, {
            path: '/mysettings',
            name: 'user-settings',
            meta: {
                title: '个人设置'
            },
            component: () => import('../pages/User-settings')
        },
        {
            path: '/myteam',
            name: 'my-team',
            meta: {
                title: '我的团队'
            },
            component: () => import('../pages/team/MyTeam')
        },
        {
            path: '/projectList',
            name: 'project-list',
            meta: {
                title: '项目中心'
            },
            component: () => import('../pages/project/ProjectList')
        },
        {
            path: '/companyInfo',
            name: 'company-info',
            meta: {
                title: '企业信息'
            },
            component: () => import('../pages/CompanyInfo')
        },
        // {
        //     path: '/knowledge',
        //     name: 'knowledge',
        //     meta: {
        //         title: '知识库'
        //     },
        //     component: () => import('../pages/knowledge/knowledge')
        // },
        {
            path: '/bugInfo/:id',
            name: 'bugInfo',
            meta: {
                title: 'bug处理'
            },
            component: () => import('../pages/bug/BugInfo')
        }
    ]
};
export const loginRouter = {
    path: '/login',
    name: 'Login',
    meta: {
        title: 'Login - 登录'
    },
    component: () => import('../pages/Login')
};


export const baseRouter = {
    path: '/bugInfo/:id',
    name: 'bugInfo',
    meta: {
        title: 'bug处理'
    },
    component: () => import('../pages/bug/BugInfo')
};


export const routers = [
    rootRouter,
    loginRouter,
    // baseRouter,
];
const router = new Router({
    routes: routers,
});


router.beforeEach((to, from, next) => {
    //to: Route: 即将要进入的目标 路由对象
    //from: Route: 当前导航正要离开的路由
    //next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。
    //console.log(to.path);
//     if(to.path == '/login') {
//         if(sessionStorage.getItem('EmployeeInfo')) {
//             router.go(-1)
//             next();
//         }else {
//             next({
//                 path: '/login'
//                 // query: { redirect: to.fullPath }
//             })
//         }
//     }else {
//         if(sessionStorage.getItem('EmployeeInfo')) {
//             next();
//         }else {
//             next({
//                 path: '/login'
//                 // query: { redirect: to.fullPath }
//             })
//         }
//
//     }
// return
//     console.log(JSON.parse(localStorage.getItem('EmployeeInfo')));
    // 10分钟  过期


    let path = to.path;
    path = path.substr(1, path.lastIndexOf('/') - 1);
    //  如果是bugInfo页面， sessionStorage没有， 赋值
    if (path == 'bugInfo') {
        if(!JSON.parse(sessionStorage.getItem('EmployeeInfo'))) {
            sessionStorage.setItem('EmployeeInfo', JSON.stringify(localStorage.getItem('EmployeeInfo')));
        }
    }else {
        // 设置title
        window.document.title = 'Bug';
    }
    // console.log(localStorage.getItem('EmployeeInfo'));
    // console.log(sessionStorage.getItem('EmployeeInfo'));
    // console.log(!sessionStorage.getItem('EmployeeInfo'));
    // console.log(!localStorage.getItem('EmployeeInfo'));
    if (!sessionStorage.getItem('EmployeeInfo') || !localStorage.getItem('EmployeeInfo')) {
        console.log('需要重新登录，sessionStorage不存在');
        if (to.path == '/login') {
            next();
        } else {
            // 如果是其他页面跳转到登录页面，保存到lastPath
            if(to.path != '/') {
                sessionStorage.setItem('lastPath', to.path);
            }
            next({
                path: '/login'
                // query: { redirect: to.fullPath }
            })
        }
    } else {
        next()
    }

});


export default router;

