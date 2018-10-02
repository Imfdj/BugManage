<template>
<div class="component-box">
    <div>
        <el-input placeholder="请输入关键词" v-model="keyword" size="small" @keyup.enter.native="searchKnowledge">
            <el-button slot="append" icon="el-icon-search" @click="searchKnowledge"></el-button>
        </el-input>
    </div>
    <div style="margin-top:10px;margin-bottom:10px;">
        <el-radio v-model="knowledge_base_type" :label="3">个人</el-radio>
        <el-radio v-model="knowledge_base_type" :label="1">公司</el-radio>
        <!--<el-radio-group v-model="knowledge_base_type" size="mini">
            <el-radio-button :label="3" data="personal">个人</el-radio-button>
            <el-radio-button :label="2" data="department">部门</el-radio-button>
            <el-radio-button :label="1" data="company">公司</el-radio-button>
            <el-radio-button :label="0" data="group">集团</el-radio-button> 
        </el-radio-group>-->
        <div class="right-box">
            <table>
                <tr>
                    <td><span class="link-hand" @click="show_add = true">新增</span></td>
                    <td style="padding:0px 5px;"><span class="link-hand" @click="show_order = !show_order">排序</span></td>
                        <!-- <div style="margin-top:-6px;">
                            <div class="link-hand sort-box" @click="handleSort" title="正序">
                                <i class="fa fa-caret-up"></i>
                            </div>
                            <div class="link-hand sort-box" @click="handleSort('backward')" title="逆序">
                                <i class="fa fa-caret-down"></i>
                            </div>
                        </div> -->
                    </td>
                    <td>
                        <span @click="exportExcel" class="link-hand">
                            下载
                        </span>
                    </td>
                </tr>
            </table>
            <!--<span class="link-hand op-icon-box" @click="handleSort" title="正序">
                <i class="fa fa-sort-amount-asc"></i>
            </span>
            <span class="link-hand op-icon-box" @click="handleSort('backward')" title="逆序">
                <i class="fa fa-sort-amount-desc"></i>
            </span>
             <el-button plain size="mini" @click="show_add = true">新增</el-button>
            <el-button plain size="mini">排序</el-button>--> 
        </div>
    </div>
    <input-dialog :show="show_add" @close="show_add = false" :value="add_value" @confirm="addRootKnowledge"></input-dialog>
    <ul class="root-ul">
        <draggable 
        v-model="root_data" 
        :options="{'disabled':!show_order}">
           <knowledge-item
                v-for="model in root_data"
                @delRootData="delRootData"
                :key="model.id"
                :order="show_order"
                :knowledge_type="$ajax.getKnowledgeClassify(knowledge_base_type)"
                :model="model">
            </knowledge-item>
        </draggable>
    </ul>
</div>
</template>

<script>

import InputDialog from './input-dialog'
import KnowledgeItem from './knowledge-item'
import draggable from 'vuedraggable'
import XLSX from 'xlsx'
import FileSaver from 'file-saver'
export default {
    name: '',
    components: {
        KnowledgeItem, InputDialog, draggable
    },
    data(){
        return {
            temptext:'001',
            dialogShow:false,
            show_add:false,
            add_value:'',
            knowledge_base_type:1,
            keyword:'',
            raw_data:[],
            root_data:[],
            show_order:false,
        }
    },
    computed:{

    },
    watch:{
        knowledge_base_type(newV){
            var self = this;
            self.getKnowledgeList(newV);
        },
        raw_data(){
            var self = this;
            self.root_data = self.Gmethod.tree(self.raw_data);
        },
        show_order(newV,oldV){
            var self = this;
            if(newV == false && oldV === true){
                var id_list = [];
                //console.log(self.root_data);
                var plist = self.Gmethod.parallel(self.root_data);
                plist.forEach(function(item){
                    id_list.push(item.id);
                })
                //console.log(id_list);
                self.$ajax.orderKnowledge({
                    'idlist':id_list.toString(),
                })
                .then()
                .catch(function(err){
                    self.$message.error(err);
                })
            }
        }
    },
    mounted(){
        var self = this;
        self.getKnowledgeList(self.knowledge_base_type)
        .then(function(){
            self.root_data = self.Gmethod.tree(self.raw_data);
        })
    },
    methods:{
        exportExcel(){
            var self = this;
            //新建excel工作簿与插入一个工作表
            var wb=XLSX.utils.book_new();
            wb.SheetNames.push('sheet1');
            //转换数据
            var edata = [];
            edata.push(['序号','内容']);
            for(var i=0;i<self.raw_data.length;i++){
                edata.push([
                    i+1,self.raw_data[i].value
                ])
            }
            //将数据填充到工作表
            var ws = XLSX.utils.aoa_to_sheet(edata);
            wb.Sheets['sheet1'] = ws;
            //生成二进制文件
            var wopts = { bookType:'xlsx', bookSST:false, type:'array' };
            var wbout = XLSX.write(wb,wopts);
            //下载文件
            
            FileSaver.saveAs(new Blob([wbout],{type:"application/octet-stream"}), "知识库.xlsx");
        },
        delRootData(id){
            var self = this;
            var dindex = self.root_data.findIndex((item) => {
                return item.id == id
            })
            self.root_data.splice(dindex, 1);
        },
        searchKnowledge(){
            var self = this;
            self.getKnowledgeList(self.knowledge_base_type);
        },
        handleSort(mode = 'forward'){
            var self = this;
            self.raw_data.sort(self.Gmethod.compareByCnSpell('value', mode))
        },
        getKnowledgeList(type){
            var self = this;
            var cloading = self.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0)'
            });
            self.root_data = [];
            return self.$ajax.getKnowledgeList({t:type,key:self.keyword})
            .then(function(res){
                //console.log(res);
                cloading.close();
                self.raw_data = res;
            })
            .catch(function(err){
                cloading.close();
                self.$message.error(err);
            })
        },
        addRootKnowledge(data){
            var self = this;
            var sdata = {
                'id':0,
                'pid':0,
                'knowledgeText':data,
                't':self.knowledge_base_type
            }
            //console.log(sdata);
            self.$ajax.addKnowledge(sdata)
            .then(function(res){
                self.raw_data.push({
                    id:res,
                    value:data,
                    classify:self.$ajax.getKnowledgeClassify(self.knowledge_base_type),
                    pid:0,
                    path:'0_'
                })
                self.add_value = '';
                self.show_add = false;
            })
            .catch(function(err){
                self.$message.error(err);
            })
        }
    }
}
</script>

<style scoped>
    .root-ul {
        padding-left: 0px;
    }
    .component-box {
        padding:10px;
        /*background-color:#f0f0f0;*/
    }
    .el-radio+.el-radio {
        margin-left: 5px;
    }
    .sort-box {
        padding:0px 3px;
        max-height: 8px;
    }
    .sort-box i {
        padding: 0;
        margin:0;
        font-size: 8px;
    }
</style>
