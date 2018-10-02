<template>
    <div style="background-color: rgb(245, 245, 245);">
        <div style="padding: 10px 20px" class="head">
            <el-card>
                <el-form :inline="true" :model="screen" class="demo-form-inline">
                    <el-form-item label="优先级">
                        <el-select v-model="screen.priority" size="small">
                            <el-option label="全部" value="全部"></el-option>
                            <el-option label="低" value="低"></el-option>
                            <el-option label="中" value="中"></el-option>
                            <el-option label="高" value="高"></el-option>
                            <el-option label="紧急" value="紧急"></el-option>
                            <el-option label="严重" value="严重"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="screen.state" placeholder="活动区域" size="small">
                            <el-option label="全部" value="全部"></el-option>
                            <el-option label="未修复" value="未修复"></el-option>
                            <el-option label="待审核" value="待审核"></el-option>
                            <el-option label="已解决" value="已解决"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="关键字">
                        <el-input size="small" v-model="screen.keyWord" style="width: 215px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="small" @click="onSubmit">搜索</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
        <div style="padding: 10px 20px">
            <el-card>
                <div>
                    <i class="el-icon-error " style="color: #F56C6C;font-size: 25px;margin-right: 10px;"></i><span
                    style="font-size: 25px;line-height: 25px">未解决的Bug</span>
                </div>
                <div>
                    <BugTable :tableData_limit="tableData_unsolved_limit" :loading="loading"></BugTable>
                </div>
                <div style="margin: 15px;" v-show="page_total > 1 || page_size > 10">
                    <el-pagination
                        @current-change="setPage"
                        :current-page="page_index"
                        @size-change="setSize"
                        :page-size="page_size"
                        :page-sizes="[10, 20, 30, 50]"
                        layout="sizes, prev, pager, next, jumper"
                        :page-count="page_total">
                    </el-pagination>
                </div>
            </el-card>
        </div>
        <div style="padding: 10px 20px">
            <el-card>
                <div>
                    <i class="el-icon-success " style="color: #67C23A;font-size: 25px;margin-right: 10px;"></i><span
                    style="font-size: 25px;line-height: 25px">已解决的Bug</span>
                </div>
                <div>
                    <BugTable :tableData_limit="tableData_resolved_limit" :loading="loading"></BugTable>
                </div>
                <div style="margin: 15px;" v-show="page_total_resolved > 1 || page_size_resolved > 10">
                    <el-pagination
                        @current-change="setPage_resolved"
                        :current-page="page_index_resolved"
                        @size-change="setSize_resolved"
                        :page-size="page_size_resolved"
                        :page-sizes="[10, 20, 30, 50]"
                        layout="sizes, prev, pager, next, jumper"
                        :page-count="page_total_resolved">
                    </el-pagination>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
    import BugTable from '../../components/Bug-table'
    import custom_event from '../../assets/js/events'

    export default {
        name: "my-dispose",
        components: {
            BugTable
        },
        data() {
            return {
                baseUrl: this.$intfcUrl,
                ProjectID: localStorage.getItem('Bug_ProjectID'),
                LoginerEmployeeID: JSON.parse(localStorage.getItem('Bug_LoginUser')).EmployeeID,

                screen: {
                    keyWord: '',
                    priority: '全部',
                    state: '全部'
                },
                tableData_resolved: [],
                tableData_resolved_limit: [],
                tableData_unsolved: [],
                tableData_unsolved_limit: [],
                loading: false,

                page_index: 1,
                page_size: 10,
                page_total: 1,
                page_index_resolved: 1,
                page_size_resolved: 10,
                page_total_resolved: 1,
            }
        },
        beforeMount() {
            var self = this;
            self.onSubmit();
            // 改变项目 联动查询
            if (custom_event._events.myDispose) {
                custom_event._events.myDispose.length = 0;
            }
            custom_event.$on('myDispose', function (ProjectID) {
                self.ProjectID = ProjectID;
                self.SearchBugInfo(ProjectID);
            })
        },
        methods: {
            setPage(page) {
                var self = this;
                self.page_index = page;
                // 分割
                self.getTableData_unsolved_limit();
            },
            setSize(size) {
                var self = this;
                self.page_size = size;
                self.page_total = Math.ceil(self.tableData_unsolved.length / self.page_size);
                self.page_index = 1;
                self.getTableData_unsolved_limit();
            },
            getTableData_unsolved_limit() {
                var self = this;
                self.tableData_unsolved_limit = self.tableData_unsolved.slice((self.page_index - 1) * self.page_size, self.page_index * self.page_size);
            },
            setPage_resolved(page) {
                var self = this;
                self.page_index_resolved = page;
                // 分割
                self.getTableData_resolved_limit();
            },
            setSize_resolved(size) {
                var self = this;
                self.page_size_resolved = size;
                self.page_total_resolved = Math.ceil(self.tableData_resolved.length / self.page_size_resolved);
                self.page_index_resolved = 1;
                self.getTableData_resolved_limit();
            },
            getTableData_resolved_limit() {
                var self = this;
                self.tableData_resolved_limit = self.tableData_resolved.slice((self.page_index_resolved - 1) * self.page_size_resolved, self.page_index_resolved * self.page_size_resolved);
            },
            onSubmit() {
                var self = this;
                self.SearchBugInfo(self.ProjectID);
            },
            SearchBugInfo(ProjectID) {
                var self = this;
                self.page_index = 1;
                self.loading = true;
                // self.$http.get(self.baseUrl + '/Services/BugManageServices.ashx?method=SearchBugInfo', {
                self.$http.get(self.baseUrl + '/static/data/SearchBugInfo.json', {
                    params: {
                        PriorityLevel: self.screen.priority,
                        ProcessingPerson: self.LoginerEmployeeID,
                        BugState: self.screen.state,
                        ProjectVerID: -1,
                        keyword: self.screen.keyWord === null ? '' : self.screen.keyWord,
                        ProjectID: ProjectID,
                        ModuleID: -1,
                        CMaker: '全部',
                    },
                }).then(function (res) {
                    self.loading = false;
                    var resolved = [];
                    var unsolved = [];
                    res.data.data.forEach(function (v, i) {
                        if (v.BugState == '已解决') {
                            resolved.push(v)
                        } else {
                            unsolved.push(v)
                        }
                    });
                    self.tableData_resolved = resolved;
                    self.tableData_unsolved = unsolved;
                    self.getTableData_unsolved_limit();
                    self.page_total = Math.ceil(self.tableData_unsolved.length / self.page_size);
                    self.getTableData_resolved_limit();
                    self.page_total_resolved = Math.ceil(self.tableData_resolved.length / self.page_size_resolved);
                }).catch(function (err) {

                });
            },

        }
    }
</script>

<style scoped>
    .head .el-form-item {
        margin: 0px;
    }

</style>
