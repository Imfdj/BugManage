<template>
    <div style="background-color: rgb(245, 245, 245);">
        <div style="padding: 10px 20px" class="head">
            <el-card>
                <el-form :inline="true" :model="screen" class="demo-form-inline">
                    <el-form-item label="优先级">
                        <el-select v-model="screen.priority" placeholder="活动区域" size="small">
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
                    <el-form-item label="处理人">
                        <el-select v-model="screen.conductor" size="small">
                            <el-option
                                v-for="item in ProcessingPerson_options"
                                :key="item.MemberID"
                                :label="item.EmployeeNickName"
                                :value="item.EmployeeID">
                            </el-option>
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
                    <BugTable :tableData_limit="tableData_limit" :loading="loading"></BugTable>
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
    </div>
</template>

<script>
    import custom_event from '../../assets/js/events'
    import BugTable from '../../components/Bug-table'

    export default {
        name: "my-submit",
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
                    conductor: '全部',
                    state: '全部'
                },
                tableData: [],
                tableData_limit: [],
                loading: false,

                page_index: 1,
                page_size: 10,
                page_total: 1,
                ProcessingPerson_options: null
            }
        },
        beforeMount() {
            var self = this;
            self.onSubmit();
            // 改变项目 联动查询
            if (custom_event._events.mySubmit) {
                custom_event._events.mySubmit.length = 0;
            }
            custom_event.$on('mySubmit', function (ProjectID) {
                self.ProjectID = ProjectID;
                self.SearchBugInfo(ProjectID);
                self.GetMember(ProjectID, localStorage.getItem('Bug_TeamID'));
            })
        },
        methods: {
            setPage(page) {
                var self = this;
                self.page_index = page;
                self.page_start = (self.page_index - 1) * self.page_size;
                self.page_end = (self.page_index) * self.page_size;
                // 分割
                self.getTableData_limit();
            },
            setSize(size) {
                var self = this;
                self.page_size = size;
                self.page_total = Math.ceil(self.tableData.length / self.page_size);
                self.page_index = 1;
                self.getTableData_limit();
            },
            getTableData_limit() {
                var self = this;
                self.tableData_limit = self.tableData.slice((self.page_index - 1) * self.page_size, self.page_index * self.page_size);
            },
            onSubmit() {
                var self = this;
                self.SearchBugInfo(self.ProjectID);
                self.GetMember(self.ProjectID, localStorage.getItem('Bug_TeamID'));
            },
            SearchBugInfo(ProjectID) {
                var self = this;
                self.page_index = 1;
                self.loading = true;
                // self.$http.get(self.baseUrl + '/Services/BugManageServices.ashx?method=SearchBugInfo', {
                self.$http.get(self.baseUrl + '/static/data/SearchBugInfo.json', {
                    params: {
                        PriorityLevel: self.screen.priority,
                        ProcessingPerson: self.screen.conductor,
                        BugState: self.screen.state,
                        ProjectVerID: -1,
                        keyword: self.screen.keyWord === null ? '' : self.screen.keyWord,
                        ProjectID: ProjectID,
                        ModuleID: -1,
                        CMaker: self.LoginerEmployeeID,
                    },
                }).then(function (res) {
                    self.loading = false;
                    self.tableData = res.data.data;
                    self.getTableData_limit();
                    self.page_total = Math.ceil(self.tableData.length / self.page_size);
                }).catch(function (err) {

                });
            },
            // 获取项目成员
            GetMember(ProjectID, TeamID) {
                var self = this;
                self.$http.get(self.baseUrl + '/Services/BugManageServices.ashx?', {
                    params: {
                        'method': 'GetMember',
                        'TeamID': TeamID,
                        'ProjectID': ProjectID
                    },
                }).then(function (res) {
                    if (res.data.code > 0) {
                        res.data.data.unshift({
                            "EmployeeAccount1": null,
                            "EmployeeNickName": "全部",
                            "PersonDetailID": null,
                            "ProjectID": 0,
                            "EmployeeAccount": "全部",
                            "MemberID": 0,
                            "EmployeeID": "全部"
                        });
                        self.ProcessingPerson_options = res.data.data;
                    } else {
                        self.ProcessingPerson_options = [];
                    }
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
