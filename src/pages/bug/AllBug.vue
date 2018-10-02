<template>
    <div style="background-color: rgb(245, 245, 245);">
        <div style="padding: 10px 20px" class="head">
            <el-card>
                <el-form :inline="true" :model="screen" class="demo-form-inline">
                    <el-form-item label="优先级">
                        <el-select v-model="screen.priority" placeholder="活动区域" size="small" style="width: 90px;">
                            <el-option label="全部" value="全部"></el-option>
                            <el-option label="低" value="低"></el-option>
                            <el-option label="中" value="中"></el-option>
                            <el-option label="高" value="高"></el-option>
                            <el-option label="紧急" value="紧急"></el-option>
                            <el-option label="严重" value="严重"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="分配人">
                        <el-select v-model="screen.assigner" placeholder="活动区域" size="small" style="width: 115px;">
                            <el-option
                                v-for="item in ProcessingPerson_options"
                                :key="item.MemberID"
                                :label="item.EmployeeNickName"
                                :value="item.EmployeeID">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="模块">
                        <el-select v-model="screen.module" placeholder="活动区域" size="small" style="width: 200px;">
                            <el-option
                                v-for="item in Module_options"
                                :key="item.ModuleID"
                                :label="item.ModuleName"
                                :value="item.ModuleID">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="版本">
                        <el-select v-model="screen.versions" placeholder="活动区域" size="small" style="width: 130px;">
                            <el-option
                                v-for="item in ProjectVer_options"
                                :key="item.ProjectVerID"
                                :label="item.ProjectVerNO"
                                :value="item.ProjectVerID">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="screen.state" placeholder="活动区域" size="small" style="width: 90px;">
                            <el-option label="全部" value="全部"></el-option>
                            <el-option label="未修复" value="未修复"></el-option>
                            <el-option label="待审核" value="待审核"></el-option>
                            <el-option label="已解决" value="已解决"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="处理人">
                        <el-select v-model="screen.conductor" placeholder="活动区域" size="small" style="width: 115px;">
                            <el-option
                                v-for="item in ProcessingPerson_options"
                                :key="item.MemberID"
                                :label="item.EmployeeNickName"
                                :value="item.EmployeeID">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="关键字">
                        <el-input size="small" v-model="screen.keyWord" style="width: 150px;"></el-input>
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
                    <BugTable :tableData_limit="tableData_limit" :loading="tableData_loading"></BugTable>
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
        name: "all-bug",
        components: {
            BugTable
        },
        data() {
            return {
                baseUrl: this.$intfcUrl,
                ProjectID: localStorage.getItem('Bug_ProjectID'),
                TeamID: localStorage.getItem('Bug_TeamID'),

                ProjectVer_options: null,
                Module_options: null,
                ProcessingPerson_options: null,

                screen: {
                    conductor: '全部',
                    assigner: '全部',
                    module: '全部',
                    versions: '全部',
                    priority: '全部',
                    state: '全部',
                },
                tableData: [],
                tableData_limit: [],
                tableData_loading: false,

                page_index: 1,
                page_size: 10,
                page_total: 1,
            }
        },
        beforeMount() {
            var self = this;
            // if(!self.ProjectVer_options) {
            //     console.log(self.ProjectVer_options);
            //     var timer = setInterval(function () {
            //         var data = self.$store.state.ProjectVer_options;
            //         if(data) {
            //             data.unshift({
            //                 "ProjectID": 0,
            //                 "ProjectVerID": -1,
            //                 "ProjectVerNO": "全部"
            //             });
            //             self.ProjectVer_options = data;
            //             clearInterval(timer);
            //         }
            //     }, 111);
            // }
            // if(!self.Module_options) {
            //     var timer1 = setInterval(function () {
            //         var data = self.$store.state.Module_options;
            //         if(data) {
            //             data.unshift({
            //                 "ProcessingPerson": "全部",
            //                 "ModuleID": -1,
            //                 "ProjectID": 0,
            //                 "ModuleName": "全部"
            //             });
            //             self.Module_options = data;
            //             clearInterval(timer1);
            //         }
            //     }, 111);
            // }
            // if(!self.ProcessingPerson_options){
            //     var timer2 = setInterval(function () {
            //         if (data) {
            //             data.unshift({
            //                 "EmployeeAccount1": null,
            //                 "EmployeeNickName": null,
            //                 "PersonDetailID": null,
            //                 "ProjectID": 0,
            //                 "EmployeeAccount": "全部",
            //                 "MemberID": 0
            //             });
            //             self.ProcessingPerson_options = data;
            //             clearInterval(timer2);
            //         }
            //     }, 111);
            // }

            self.GetProjectVerson(self.ProjectID);
            self.GetProjectModule(self.ProjectID);
            self.GetMember(self.ProjectID, self.TeamID);
            this.screen.state = this.$store.state.allBugState;
            if (this.$store.state.allBugState != '全部') {
                this.$store.state.allBugState = '全部'
            }
            self.onSubmit();
            // 改变项目 联动查询
            if (custom_event._events.allBug) {
                custom_event._events.allBug.length = 0;
            }
            custom_event.$on('allBug', function (ProjectID) {
                self.ProjectID = ProjectID;
                self.SearchBugInfo(ProjectID);
                self.GetProjectVerson(ProjectID);
                self.GetProjectModule(ProjectID);
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
            titleClick(index) {
                var self = this;
                // self.$store.state.bugListIndex = index;
            },
            onSubmit() {
                var self = this;
                self.SearchBugInfo(self.ProjectID);
            },
            SearchBugInfo(ProjectID) {
                var self = this;
                self.page_index = 1;
                self.tableData_loading = true;
                // self.$http.get(self.baseUrl + '/Services/BugManageServices.ashx?method=SearchBugInfo', {
                self.$http.get(self.baseUrl + '/static/data/SearchBugInfo.json', {
                    params: {
                        PriorityLevel: self.screen.priority,
                        ProcessingPerson: self.screen.conductor,
                        BugState: self.screen.state,
                        ProjectVerID: self.screen.versions == '全部' ? -1 : self.screen.versions,
                        keyword: self.screen.keyWord === null ? '' : self.screen.keyWord,
                        ProjectID: ProjectID,
                        ModuleID: self.screen.module == '全部' ? -1 : self.screen.module,
                        CMaker: self.screen.assigner,
                    },
                }).then(function (res) {
                    self.tableData_loading = false;
                    self.tableData = res.data.data;
                    console.log(self.tableData);
                    self.getTableData_limit();
                    self.page_total = Math.ceil(self.tableData.length / self.page_size);
                    self.$store.state.bugList = res.data.data;
                    // if (res.data.allstate > 0) {
                    // } else {
                    //     self.tableData = [];
                    // }
                }).catch(function (err) {

                });
            },
            // 获取项目版本
            GetProjectVerson(ProjectID) {
                var self = this;
                self.$http.get(self.baseUrl + '/Services/BugAssignServices.ashx?', {
                    params: {
                        'method': 'GetProjectVerson',
                        'ProjectID': ProjectID
                    },
                }).then(function (res) {
                    if (res.data.code > 0) {
                        res.data.data.unshift({
                            "ProjectID": 0,
                            "ProjectVerID": -1,
                            "ProjectVerNO": "全部"
                        });
                        self.ProjectVer_options = res.data.data;
                        self.$store.state.ProjectVer_options = res.data.data;
                    } else {
                        self.ProjectVer_options = [];
                    }
                }).catch(function (err) {

                });
            },
            // 获取项目模板
            GetProjectModule(ProjectID) {
                var self = this;
                self.$http.get(self.baseUrl + '/Services/BugAssignServices.ashx?', {
                    params: {
                        'method': 'GetProjectModule',
                        'ProjectID': ProjectID
                    },
                }).then(function (res) {
                    if (res.data.code > 0) {
                        res.data.data.unshift({
                            "ProcessingPerson": "全部",
                            "ModuleID": -1,
                            "ProjectID": 0,
                            "ModuleName": "全部"
                        });
                        self.Module_options = res.data.data;
                        self.$store.state.Module_options = res.data.data;
                    } else {
                        self.Module_options = [];
                    }
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
                        self.$store.state.ProcessingPerson_options = res.data.data;
                    } else {
                        self.ProcessingPerson_options = [];
                    }
                }).catch(function (err) {

                });
            }
        },
    }
</script>

<style scoped>
    .head .el-form-item {
        margin: 0px;
    }

</style>
