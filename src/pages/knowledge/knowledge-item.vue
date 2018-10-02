<template>
<li :key="model.id" class="item-li">
    <div :class="{'div-li':!order, 'drag-li':order }" :style="{ 'padding-left1':(level-1)*18 + 'px',}">
        <span :class="{'li-style':true,'li-style-bg':is_parent && open}">
<!--             <i style="width:16px;display:inline-block;"><img src="~common/img/tree-li-style.gif" alt=""></i> -->
            <i :class="{'el-icon-caret-right':!open,'el-icon-caret-bottom':open}" @click="toggle" v-if="is_parent"></i>
<!--             <i v-else></i> -->
        </span>
        <span v-html="model.value.replace(/\n|\r\n/g,'<br />')" style="display:inline-block;"></span>
        <span @click="show_add = true" class="op-icon-box op-add-box" title="新增"><i class="fa fa-plus"></i></span>
        <span style="display:inline-block;" @click="show_edit = true" class="op-icon-box op-edit-box" title="编辑"><i class="fa  fa-edit"></i></span>
        <span @click="cloneItem" v-if="knowledge_type !== '个人'" class="op-icon-box op-clone-box" title="添加到个人库"><i class="fa fa-sign-in" ></i></span>
        <span @click="copyItem" v-if="!is_parent" class="op-icon-box op-copy-box" title="复制到剪贴板"><i class="fa fa-copy"></i></span>
        <span @click="delItem" class="op-icon-box op-del-box" :title="knowledge_type == '个人'?'移除':'删除'" v-if="(knowledge_type == '个人' && model.level == 1) || (knowledge_type !== '个人')"><i class="fa  fa-remove"></i></span>
    </div>
    <ul v-show="open" v-if="is_parent" class="item-ul">
        <draggable 
        v-model="model.children" 
        :options="{'disabled':!order}">
            <knowledge-item
                v-for="submodel in model.children"
                :order="order"
                :key="submodel.id"
                :knowledge_type="knowledge_type"
                :model="submodel">
            </knowledge-item>
        </draggable>
    </ul>
    <input-dialog :show="show_edit" :value="model.value" @close="show_edit = false" @confirm="editItem"></input-dialog>
    <input-dialog :show="show_add" :value="add_value" @close="show_add = false" @confirm="addChild"></input-dialog>
</li>
</template>

<script>
import InputDialog from './input-dialog'
import ClipboardJS from 'clipboard'
import draggable from 'vuedraggable'
export default {
    name: 'KnowledgeItem',
    components: {
        InputDialog, draggable
    },
    props: {
        model: Object,
        knowledge_type: String,
        order:Boolean
    },
    data(){
        return {
            open:false,
            show_edit:false,
            show_add:false,
            add_value:''
        }
    },
    computed: {
        is_parent(){
            var self = this;
            return self.model.children && self.model.children.length
        },
        level(){
            return this.model.path.split('-').length - 1
        }
    },
    mounted(){
        var self = this;
    },
    methods:{
        toggle(){
            var self = this;
            self.open = !self.open;
        },
        addChild(data){
            var self = this;
            var sdata = {
                id:0,
                pid:self.model.id,
                knowledgeText:data,
                t:self.$ajax.getKnowledgeClassify(self.model.classify)
            }
            //console.log(sdata);
            self.$ajax.addKnowledge(sdata)
            .then(function(res){
                if (!self.is_parent) {
                    self.$set(self.model, 'children', []);   
                }
                self.open = true;
                self.model.children.push({
                    id:res,
                    value:data,
                    classify:self.model.classify,
                    pid:self.model.pid,
                    path:self.model.path + res + '-'
                })
                self.show_add = false;
                self.add_value = '';
            })
            .catch(function(err){
                self.$message.error(err);
            })
            
        },
        editItem(data){
            var self = this;
            var sdata = {
                id:self.model.id,
                pid:self.model.pid,
                knowledgeText:data,
                t:self.$ajax.getKnowledgeClassify(self.model.classify)
            }
            //console.log(sdata);
            self.$ajax.addKnowledge(sdata)
            .then(function(res){
                self.model.value = data;
                self.show_edit = false;
            })
            .catch(function(err){
                self.$message.error(err);
            })

        },
        delItem(){
            var self = this;
            self.$confirm(self.knowledge_type == '个人'?'是否确认要移除?':'是否删除？', '提示', {type: 'warning'})
            .then(function(){
                if('cid' in self.model){
                    self.$ajax.delKnowledgeCopy({id:self.model.cid})
                    .then(function(){
                        self.delLocalItem();
                    })
                    .catch(function(err){
                        self.$message.error(err);
                    })
                } else {
                    self.$ajax.delKnowledge({id:self.model.id})
                    .then(function(){
                        self.delLocalItem();
                    })
                    .catch(function(err){
                        self.$message.error(err);
                    })
                }
                
            })
            .catch(function(info){})
            
        },
        delLocalItem(){
            var self = this;
            if (self.$parent.model) {
                self.$parent.model.children.forEach((item, index) => {
                    if (item.id == self.model.id) {
                        self.$parent.model.children.splice(index, 1);
                    }
                })
            } else {
                self.$emit('delRootData',self.model.id);
                // if('root_data' in self.$parent){
                //     var dindex = self.$parent.root_data.findIndex((item) => {
                //         return item.id == self.model.id
                //     })
                //     self.$parent.root_data.splice(dindex, 1);
                // } else {
                //     self.$emit('delRootData',self.model.id);
                //     //self.$router.go(0)
                // }
            }
        },
        copyItem(e){
            var self = this;
            new ClipboardJS('.op-copy-box', {
                text: function(trigger) {
                    return self.model.value
                    //return self.Gmethod.escapeHtml(self.model.value);
                }
            });
            self.$message('已复制到剪贴板');
        },
        cloneItem(){
            var self = this;
            var sdata = {
                id:self.model.id,
                t:3
            }
            self.$ajax.copyKnowledge(sdata)
            .then(function(){
                self.$message('已添加至个人知识库');
            })
            .catch(function(err){
                self.$message.error('添加失败');
            })
        }
    }
}
</script>

<style scoped>
    .op-icon-box {
        /*display: inline-block;
        padding: 5px;
        border-radius: 5px;
        text-align: center;*/
    }
    .op-icon-box i {
        color: #aaa;
    }
    .op-add-box {
        /*background-color: #cfedf5;*/
    }
    .op-edit-box {
        /*background-color: #c3d7eb;*/
    }
    .op-clone-box {
        /*background-color: #c3d7eb;*/
    }
    .op-copy-box {
        /*background-color: #cfebcf;*/
    }
    .op-del-box {
        /*background-color: #fbe7cb;*/
    }
    .el-message-box {
        width:300px;
    }
    .li-style {
        display: inline-block;
        height: 100%;
    }
    .li-style-bg {
        background: url(~common/img/tree-li-style2.gif) 0 0 no-repeat;
    }
</style>
