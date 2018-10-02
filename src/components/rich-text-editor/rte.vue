<template>
<textarea :id="textnames" :ref="textnames">
</textarea>
</template>

<script>
/*  使用该组件前需要安装或者引入simditor及其依赖链
    使用方法
    直接v-model绑定
*/
// import { intfc } from 'common/js/common-interface.js'
// import { intfc } from '@/assets/js/interface.js'
// var Simditor = require('/static/plugins/simditor/simditor.js')
// console.log(Simditor);
var intfc = {
    uploadImg: '',
    commonImgUrl: '',
}
export default {
    name: 'RTE',
    props: {
        value:null,
        upload_url:{
            type: String,
            default:intfc.uploadImg
        }, //上传图片后端接口
        upload_file_path:{
            type:String,
            default:intfc.commonImgUrl
        }, //图片存放的后端路径,以/开头
        upload_file_field:{
            type:String,
            default:'Filedata'
        }, //上传图片接口表单字段
        min_height:{
            type:String, //最小高度
            default:'300px'
        },
        class_name:{
            type:String, //编辑器样式名
        }
    },
    data(){
        return {
            inside_content:'',
            changed_value:'',
            textnames: 'simditor' + new Date().getTime(),//这里防止多个富文本发生冲突
            editor:'',//保存simditor对象
            toolbar: ['title','bold','italic','underline','fontScale','color','ol','ul','table','link','image','hr','indent','outdent','alignment','html']
        }
    },
    mounted(){
        var self = this;
        self.createEditor();
    },
    watch:{
        value(newV,oldV){
            //console.log('new:' + newV);
            var self = this;
            var changed_value2 = self.editor.getValue();
            var inside_content = self.editor.sync(newV);
            // console.log('changed_value:' + self.changed_value);
            // console.log('changed_value2:' + changed_value2);
            // console.log('inside_content:' + inside_content);
            //如果是外部value改变的话，这个同步值会跟实时值不同，因此可根据这个进行赋值
            //但是有一个例外是上传图片的时候实时值也与同步值不同,需要再进一步判断
            if(inside_content !== newV){
                //console.log('赋值');
                if(newV == '' || newV == null || newV == undefined){
                    self.editor.setValue('');
                } else if(newV !== null && newV !== undefined && (!self.changed_value || changed_value2 == self.changed_value)){
                    //上传图片时或者外部改变Value时
                    self.editor.setValue(newV);
                }
            }
        }
    },
    methods:{
        createEditor() {
            var self = this
            self.editor = new Simditor({
                textarea: self.$refs[self.textnames],
                toolbar: self.toolbar,
                pasteImage:true,
                //cleanPaste:true,
                upload:{
                    url: self.upload_url,
                    params: null,
                    fileKey: self.upload_file_field,
                    connectionCount: 3,
                    leaveConfirm: '正在上传中，确定离开本页？',
                    baseFilePath: self.upload_file_path
                },

            });
            if(self.value || self.value == 0){
                self.editor.setValue(self.value);
            } else {
                self.editor.setValue('');
            }

            self.editor.on("valuechanged", function(e, src) {
                self.changed_value = self.editor.getValue();
                self.$emit('input',self.editor.getValue());
            })

            var eel = self.editor.el[0];
            var swrap = eel.querySelectorAll("div.simditor-wrapper");
            var sbody = eel.querySelectorAll("div.simditor-body");
            var stoolbar = eel.querySelectorAll("div.simditor-toolbar");
            //设置编辑器最小高度
            for(var i=0;i<sbody.length;i++){
                sbody[i].setAttribute('style','min-height:'+ self.min_height);
            }
            //添加样式名称
            if(self.class_name){
                eel.className += ' ' + self.class_name;
            }
        },
    }
}
</script>

<style scoped>

</style>
