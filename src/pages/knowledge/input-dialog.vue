<template>
    <el-dialog :visible.sync="show_" :modal="false" @close="setShow(false)">
        <!-- <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入内容"
            v-model="value_"
        >
        </el-input> -->
            <rte v-model="value_" :upload_url="$intfcUrl + '/Services/FilesUploadService.ashx'"></rte>
        <div slot="footer" class="dialog-footer">
            <el-button @click="setShow(false)">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>

export default {
    name: '',
    components: {

    },
    props:['show','value'],
    data(){
        return {
            show_:this.show,
            value_:this.value
        }
    },
    watch:{
        value(newV){
            var self = this;
            self.value_ = newV
        },
        show(newV){
            var self = this;
            self.show_ = newV
        }
    },
    mounted(){
        var self = this;
    },
    methods:{
        setShow(v){
            var self = this;
            self.show_ = v;
            self.value_ = self.value;
            self.$emit('close', v);
        },
        confirm(){
            var self = this;
            self.$emit('confirm', self.value_);
            self.setShow(false);
            self.value_ = '';
        }
    }
}
</script>

<style scoped>

</style>
