<template>
<div :ref="textnames"></div>
</template>

<script>
import E from 'wangeditor'
import { intfc } from 'common/js/common-interface.js'
export default {
    name: 'RTE-wangeditor',
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
    },
    data(){
        return {
            editor:'',
            textnames: 'wangeditor' + new Date().getTime(),//这里防止多个富文本发生冲突
            inside_content:''
        }
    },
    mounted(){
        var self = this;
        self.createEditor();
    },
    watch:{
        value(newV,oldV){
            var self = this;
            //console.log(newV);
            //console.log(self.inside_content);
            if(newV != self.inside_content){
                self.editor.txt.html(newV);
            }
            //self.editor.txt.html(newV);
            //self.editor.txt.append(newV);
        }
    },
    methods:{
        createEditor(){
            var self = this;
            self.editor = new E(self.$refs[self.textnames]);
            self.editor.customConfig.menus = [
                'head',  // 标题
                'bold',  // 粗体
                'fontSize',  // 字号
                'fontName',  // 字体
                'italic',  // 斜体
                'underline',  // 下划线
                'strikeThrough',  // 删除线
                'foreColor',  // 文字颜色
                'backColor',  // 背景颜色
                'link',  // 插入链接
                'list',  // 列表
                'justify',  // 对齐方式
                'quote',  // 引用
                'image',  // 插入图片
                'table',  // 表格
                'code',  // 插入代码
                'undo',  // 撤销
                'redo'  // 重复
            ];
            self.editor.customConfig.onchange = function(html){
                self.inside_content = html;
                self.$emit('input',html);
            }
            self.editor.customConfig.debug = true;
            self.editor.customConfig.uploadImgServer = self.upload_url;
            self.editor.customConfig.uploadFileName = self.upload_file_field;
            self.editor.customConfig.uploadImgHooks = {
                // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
                customInsert: function (insertImg, result, editor) {
                    // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
                    // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
                    //var url = self.upload_file_path + '/' + result
                    //insertImg(url)
                    // result 必须是一个 JSON 格式字符串！！！否则报错
                }
            }
            self.editor.create();
            self.editor.txt.html(self.value);
        }
    }
}
</script>

<style scoped>
    /* 高度自适应 */
    .wangEditor-txt{
        height:auto!important;
        min-height:200px;
        max-height:1000px;
    }
</style>
