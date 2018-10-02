<template>
<textarea :id="textnames" ref="simditor" rows="10" cols="80">
</textarea>
</template>

<script>
// import { intfc } from 'common/js/common-interface.js'

export default {
    name: 'RTE',
    props: {
        value:null,
        // upload_url:{
        //     type: String,
        //     default:intfc.uploadImg
        // }, //上传图片后端接口
        // upload_file_path:{
        //     type:String,
        //     default:intfc.commonImgUrl
        // }, //图片存放的后端路径,以/开头
        // upload_file_field:{
        //     type:String,
        //     default:'Filedata'
        // } //上传图片接口表单字段

    },
    data(){
        return {
            inside_content:'',
            textnames: 'simditor' + new Date().getTime(),//这里防止多个富文本发生冲突
            editor:'',//保存simditor对象   ///  'image',
            toolbar: ['title','bold','italic','underline','fontScale','color','ol','ul','table','link','hr','indent','outdent','alignment']
        }
    },
    mounted(){
        var self = this;
        self.createEditor();
    },
    watch:{
        value(newV,oldV){
            var self = this;
            var inside_content = self.editor.sync(newV); //这个同步值会比实时慢一拍，因此可根据这个进行赋值
            if(inside_content !== newV){
                if(newV !== null && newV !== undefined){
                    self.editor.setValue(newV);
                }

            }
        }
    },
    methods:{
        createEditor() {
            var self = this
            self.editor = new Simditor({
                textarea: self.$refs.simditor,
                toolbar: self.toolbar,
                pasteImage:true,
                // upload:{
                //     url: self.upload_url,
                //     params: null,
                //     fileKey: self.upload_file_field,
                //     connectionCount: 3,
                //     leaveConfirm: '正在上传中，确定离开本页？',
                //     baseFilePath: self.upload_file_path
                // },

            });

            self.editor.on("valuechanged", function(e, src) {
                self.$emit('input',self.editor.getValue());
            })
        },
    },
    destroyed(){
        var self = this;
    }
}
</script>

<style scoped>
</style>
