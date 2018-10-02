var bugIntfc = {

  getKnowledgeList:'/Services/KnowledgeBaseService.ashx?method=GetKnowledgeList',

  getKnowledgeListByPath:'/Services/KnowledgeBaseService.ashx?method=GetKnowledgeListByPath',

  addKnowledge:'/Services/KnowledgeBaseService.ashx?method=SaveKnowledge',

  delKnowledge:'/Services/KnowledgeBaseService.ashx?method=DeleteKnowledge',

  delKnowledgeCopy:'/Services/KnowledgeBaseService.ashx?method=DeleteKnowledgeCopy',

  orderKnowledge:'/Services/KnowledgeBaseService.ashx?method=UpdateKnowledgeOrderIndex',

  copyKnowledge:'/Services/KnowledgeBaseService.ashx?method=CopyKnowledge',

};

// var baseUrl = process.env.NODE_ENV === 'production'?'':'/api'; //用于在开发中触发跨域转发服务器
var baseUrl = process.env.NODE_ENV === 'production'?'/BugManage':''; //用于在开发中触发跨域转发服务器
for(var x in bugIntfc){
    bugIntfc[x] = baseUrl + bugIntfc[x];
}


export { bugIntfc ,baseUrl }
