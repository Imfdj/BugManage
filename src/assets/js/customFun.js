function HTMLEncode(html) {
    var temp = document.createElement("div");
    (temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html);
    var output = temp.innerHTML;
    temp = null;
    return output;
}

function HTMLDecode(text) {
    var temp = document.createElement("div");
    temp.innerHTML = text;
    var output = temp.innerText || temp.textContent;
    temp = null;
    return output;
}

//封装过期控制代码
function setLocalStorageDeadline(key,value){
    var curTime = new Date().getTime();
    console.log(value);
    localStorage.setItem(key,JSON.stringify({data:value,time:curTime}));
    console.log(JSON.parse(localStorage.getItem(key)));
}

function getLocalStorageDeadline(key,exp){
    var data = localStorage.getItem(key);
    var dataObj = JSON.parse(data);
    if(dataObj) {
        if (new Date().getTime() - dataObj.time>exp) {
            console.log('信息已过期');
            return false;
            //alert("信息已过期")
        }else{
            //console.log("data="+dataObj.data);
            //console.log(JSON.parse(dataObj.data));
            // var dataObjDatatoJson = JSON.parse(dataObj.data);
            var dataObjDatatoJson = dataObj.data;
            return dataObjDatatoJson;
        }
    }
}

function TaskTypeFilter(value) {
    switch (value) {
        case '开发':
            value = '<span style="color: #409EFF;">开发</span>'
            break;
        case '修复':
            value = '<span style="color: #ff0000;">修复</span>'
            break;
        case '测试':
            value = '<span style="color: #E6A23C;">测试</span>'
            break;
    }
    return value;
}

export {
    HTMLEncode,
    HTMLDecode,
    getLocalStorageDeadline,
    setLocalStorageDeadline,
    TaskTypeFilter,
}
