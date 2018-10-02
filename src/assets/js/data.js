// import { bugIntfc } from './interface.js'
// import { getAjaxData, tree, addPath } from 'common/js/custom.js'
//
//
// export function getKnowledgeClassify(classify){
//     if(classify == null){return}
//     var cf = '';
//     switch(classify){
//         case '集团':
//             cf = 0;
//             break;
//         case '公司':
//             cf = 1;
//             break;
//         case '部门':
//             cf = 2;
//             break;
//         case '个人':
//             cf = 3;
//             break;
//         case 0:
//             cf = '集团';
//             break;
//         case 1:
//             cf = '公司';
//             break;
//         case 2:
//             cf = '部门';
//             break;
//         case 3:
//             cf = '个人';
//             break;
//     }
//     return cf
// }
//
// export function auth(){
//     var url = bugIntfc.getCurrentUserInfo;
//     return getAjaxData(url,'GET',{})
//         .then(function(res){
//             //console.log(res);
//             if(res.hasError){
//                 return Promise.reject(res);
//             } else {
//                 var be_current_user = res.CurrentUser;
//                 var current_user = {};
//                 return Promise.resolve(current_user)
//             }
//         })
//         .catch(function (error) {
//             console.log(error);
//             return Promise.reject(error);
//         });
// }
//
// //包装过的获取后台数据方法
// export function getAuthData(url,type,data,ajaxoption){
//     return getAjaxData(url,type,data,ajaxoption)
//         .then(function(res){
//             return Promise.resolve(res);
//         })
//         .catch(function (error) {
//             console.log(error);
//             return Promise.reject(error);
//         });
//     // return auth()
//     //     .then(function(user){
//     //         return getAjaxData(url,type,data,ajaxoption,loadam)
//     //             .then(function(res){
//     //                 res.user = user;
//     //                 return Promise.resolve(res);
//     //             });
//     //     })
//     //     .catch(function (error) {
//     //         console.log(error);
//     //         return Promise.reject(error);
//     //     });
// }
//
// export function getKnowledgeListByPath(data){
//     var url = bugIntfc.getKnowledgeListByPath;
//     return getAuthData(url,'GET',data)
//         .then(function(res){
//             //console.log(JSON.stringify(res));
//             //console.log(res);
//             if(res.hasError){
//                 return Promise.reject(res);
//             } else {
//                 var be_list = res.data;
//                 var list = [];
//                 be_list.forEach(function(item){
//                     list.push({
//                         'id':item.Id,
//                         'value':item.KnowledgeText,
//                         'classify':item.LimitsType,
//                         'node_path':item.NodePath,
//                         'pid':item.PId,
//                         'cid':item.CId,
//                         'order_index':item.OrderIndex,
//                     })
//                 })
//                 return Promise.resolve(list);
//             }
//         })
//         .catch(function (error) {
//             console.log(error);
//             var err = error.error?error.error:error;
//             return Promise.reject(err);
//         });
// }
//
// export function getKnowledgeList(data){
//     var url = bugIntfc.getKnowledgeList;
//     return getAuthData(url,'GET',data)
//         .then(function(res){
//             //console.log(JSON.stringify(res));
//             //console.log(res);
//             if(res.hasError){
//                 return Promise.reject(res);
//             } else {
//                 var be_list = res.data;
//                 var list = [];
//                 var be_copy_list = res.Copy;
//                 var copy_list = [];
//                 be_list.forEach(function(item){
//                     list.push({
//                         'id':item.Id,
//                         'value':item.KnowledgeText,
//                         'classify':item.LimitsType,
//                         'node_path':item.NodePath,
//                         'pid':item.PId,
//                         'order_index':item.OrderIndex,
//                     })
//                 })
//
//                 if(be_copy_list && be_copy_list.length){
//                     return Promise.all(be_copy_list.map(function(item){
//                         return getKnowledgeListByPath({nodePath:item.NodePath,id:item.Id})
//                         .then(function(noderes){
//                             //console.log('nodeinfo');
//                             //console.log(noderes);
//                             if(noderes && noderes.length){
//                                 noderes.forEach(function(node){
//                                     copy_list.push(node);
//                                 })
//                             }
//                             return Promise.resolve();
//                         })
//                         .catch(function(err){console.log(err);return Promise.reject(err)})
//                     }))
//                     .then(function(){
//                         var new_list = list.concat(copy_list);
//                         //排序
//                         new_list.sort(function(a,b){
//                             if(a.order_index !== b.order_index){
//                                 return a.order_index - b.order_index;
//                             } else {
//                                 return a.id - b.id
//                             }
//                         })
//                         //添加路径与层级
//                         addPath(new_list);
//                         return Promise.resolve(new_list);
//                     })
//                     .catch(function(err){
//                         return Promise.reject(err);
//                     })
//                 } else {
//                     //排序
//                     list.sort(function(a,b){
//                         if(a.order_index !== b.order_index){
//                             return a.order_index - b.order_index;
//                         } else {
//                             return a.id - b.id
//                         }
//                     })
//                     //添加路径与层级
//                     addPath(list);
//                     return Promise.resolve(list);
//                 }
//             }
//         })
//         .catch(function (error) {
//             console.log(error);
//             var err = error.error?error.error:error;
//             return Promise.reject(err);
//         });
// }
//
// export function addKnowledge(data){
//     var url = bugIntfc.addKnowledge;
//     return getAuthData(url,'POST',data)
//         .then(function(res){
//             //console.log(JSON.stringify(res));
//             console.log(res);
//             if(res.hasError){
//                 return Promise.reject(res);
//             } else {
//                 return Promise.resolve(res.id);
//             }
//         })
//         .catch(function (error) {
//             console.log(error);
//             var err = error.error?error.error:error;
//             return Promise.reject(err);
//         });
// }
//
// export function delKnowledge(data){
//     var url = bugIntfc.delKnowledge;
//     return getAuthData(url,'POST',data)
//         .then(function(res){
//             //console.log(JSON.stringify(res));
//             //console.log(res);
//             if(res.hasError){
//                 return Promise.reject(res);
//             } else {
//                 return Promise.resolve();
//             }
//         })
//         .catch(function (error) {
//             console.log(error);
//             var err = error.error?error.error:error;
//             return Promise.reject(err);
//         });
// }
//
// export function delKnowledgeCopy(data){
//     var url = bugIntfc.delKnowledgeCopy;
//     console.log(url);
//     return getAuthData(url,'POST',data)
//         .then(function(res){
//             //console.log(JSON.stringify(res));
//             //console.log(res);
//             if(res.hasError){
//                 return Promise.reject(res);
//             } else {
//                 return Promise.resolve();
//             }
//         })
//         .catch(function (error) {
//             console.log(error);
//             var err = error.error?error.error:error;
//             return Promise.reject(err);
//         });
// }
//
// export function copyKnowledge(data){
//     var url = bugIntfc.copyKnowledge;
//     return getAuthData(url,'POST',data)
//         .then(function(res){
//             //console.log(JSON.stringify(res));
//             //console.log(res);
//             if(res.hasError){
//                 return Promise.reject(res);
//             } else {
//                 return Promise.resolve();
//             }
//         })
//         .catch(function (error) {
//             console.log(error);
//             var err = error.error?error.error:error;
//             return Promise.reject(err);
//         });
// }
//
// export function orderKnowledge(data){
//     var url = bugIntfc.orderKnowledge;
//     return getAuthData(url,'POST',data)
//         .then(function(res){
//             //console.log(JSON.stringify(res));
//             //console.log(res);
//             if(res.hasError){
//                 return Promise.reject(res);
//             } else {
//                 return Promise.resolve();
//             }
//         })
//         .catch(function (error) {
//             console.log(error);
//             var err = error.error?error.error:error;
//             return Promise.reject(err);
//         });
// }
