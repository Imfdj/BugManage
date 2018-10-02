<template>
    <div>
        <el-card class="box-card" style="margin: 10px">
            <div class="bug-statistics">
                <span style="color: rgb(56, 52, 52)" @click="bugStateClick('全部')">BUG总数：<span>{{statistics.all}}</span></span>
                <span style="color: #CC3300" @click="bugStateClick('未修复')">未修复BUG数：<span>{{statistics.unsolved}}</span></span>
                <span style="color: #FEA900" @click="bugStateClick('待审核')">待审核BUG数：<span>{{statistics.checking}}</span></span>
                <span style="color: #339900" @click="bugStateClick('已解决')">已解决BUG数：<span>{{statistics.resolved}}</span></span>
            </div>
        </el-card>
        <div style="display: flex">
            <div style="flex: 1">
                <el-card class="box-card" style="margin: 10px">
                    <div class="bug-statistics">
                        <div>
                            <i class="fa fa-fire" style="font-size: 24px;color: red;"></i> <strong>紧急待处理BUG</strong>
                        </div>
                        <el-table
                            :data="tableData_urgency"
                            v-loading="loading"
                            style="width: 100%">
                            <el-table-column
                                prop="BugTitle"
                                label="标题">
                                <template slot-scope="scope">
                                    <router-link :to="'/bugInfo/'+scope.row.BugID" target="_blank"
                                                 style="color: #1077B5;font-weight: bold;"
                                                 @click="titleClick(scope.$index, 'tableData_resolved')">
                                        {{scope.row.BugTitle}}
                                    </router-link>
                                    <!--<a :href="'/bugInfo/'+scope.row.BugID" target="_blank"-->
                                    <!--style="color: #1077B5;font-weight: bold;"-->
                                    <!--@click="titleClick(scope.$index, 'tableData_urgency')">{{scope.row.BugTitle}}</a>-->
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="PriorityLevel"
                                label="优先级"
                                width="100">
                                <template slot-scope="scope">
                                    <span :class="stateX(scope.row.PriorityLevel)">{{scope.row.PriorityLevel}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="ProcessingPerson"
                                label="处理人"
                                width="100">
                            </el-table-column>
                        </el-table>
                    </div>
                </el-card>
            </div>
            <div style="flex: 1">
                <el-card class="box-card" style="margin: 10px">
                    <div class="bug-statistics">
                        <div>
                            <i class="fa fa-sun-o" style="font-size: 25px;color: #07e307;"></i> <strong>最新BUG</strong>
                        </div>
                        <el-table
                            :data="tableData_newest"
                            v-loading="loading"
                            style="width: 98%">
                            <el-table-column
                                prop="BugTitle"
                                label="标题">
                                <template slot-scope="scope">
                                    <router-link :to="'/bugInfo/'+scope.row.BugID" target="_blank"
                                                 style="color: #1077B5;font-weight: bold;"
                                                 @click="titleClick(scope.$index, 'tableData_resolved')">
                                        {{scope.row.BugTitle}}
                                    </router-link>
                                    <!--<a :href="'/bugInfo/'+scope.row.BugID" target="_blank"-->
                                    <!--style="color: #1077B5;font-weight: bold;"-->
                                    <!--@click="titleClick(scope.$index, 'tableData_newest')">{{scope.row.BugTitle}}</a>-->
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="BugState"
                                width="70"
                                label="状态">
                                <template slot-scope="scope">
                                    <span style="padding: 3px;color: #fff;" :class="stateO(scope.row.BugState)">{{scope.row.BugState}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="PriorityLevel"
                                label="优先级"
                                width="70">
                                <template slot-scope="scope">
                                    <span :class="stateX(scope.row.PriorityLevel)">{{scope.row.PriorityLevel}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="CMaker"
                                label="分配人"
                                width="100">
                            </el-table-column>
                        </el-table>
                    </div>
                </el-card>
            </div>

        </div>
    </div>
</template>

<script>
    import custom_event from '../../assets/js/events'

    export default {
        name: "situation",
        data() {
            return {
                baseUrl: this.$intfcUrl,
                ProjectID: localStorage.getItem('Bug_ProjectID'),

                screen: {
                    conductor: '全部',
                    assigner: '全部',
                    module: '全部',
                    versions: '全部',
                    priority: '全部',
                    state: '全部',
                },
                tableData_urgency: [],
                tableData_newest: [],
                statistics: {
                    all: 0,
                    unsolved: 0,
                    resolved: 0,
                    checking: 0,
                },
                loading: true
            }
        },
        beforeMount() {
            var self = this;
            self.SearchBugInfo(self.ProjectID);
        },
        mounted() {
            var self = this;
            // 改变项目 联动查询
            if (custom_event._events.situation) {
                custom_event._events.situation.length = 0;
            }
            custom_event.$on('situation', function (ProjectID) {
                self.ProjectID = ProjectID;
                self.SearchBugInfo(ProjectID);
            });
        },
        methods: {
            bugStateClick(state) {
                if (state == '未修复') {
                    this.$store.state.allBugState = '未修复';
                    this.$router.push('/bug/allBug');
                }
                if (state == '待审核') {
                    this.$store.state.allBugState = '待审核';
                    this.$router.push('/bug/allBug');
                }
                if (state == '已解决') {
                    this.$store.state.allBugState = '已解决';
                    this.$router.push('/bug/allBug');
                }
                if (state == '全部') {
                    this.$store.state.allBugState = '全部';
                    this.$router.push('/bug/allBug');
                }
            },
            SearchBugInfo(ProjectID) {
                var self = this;
                self.loading = true;
                // self.$http.get(self.baseUrl + '/Services/BugManageServices.ashx?method=SearchBugInfo', {
                self.$http.get(self.baseUrl + '/static/data/SearchBugInfo.json', {
                    params: {
                        PriorityLevel: self.screen.priority,
                        ProcessingPerson: self.screen.conductor,
                        BugState: self.screen.state,
                        ProjectVerID: self.screen.versions == '全部' ? -1 : self.screen.versions,
                        keyword: self.screen.keyWord,
                        ProjectID: ProjectID,
                        ModuleID: self.screen.module == '全部' ? -1 : self.screen.module,
                        CMaker: self.screen.assigner,
                    },
                }).then(function (res) {
                    self.loading = false;
                    var urgency = [];
                    var newest = [];
                    // if(res.data.data.length == 0) {
                    //     self.tableData_urgency = [];
                    //     self.tableData_newest = [];
                    //     return
                    // }
                    self.statistics.unsolved = 0;
                    self.statistics.resolved = 0;
                    self.statistics.checking = 0;
                    res.data.data.forEach(function (v, i) {
                        if (v.BugState == '未修复') {

                            self.statistics.unsolved++;
                        } else if (v.BugState == '已解决') {
                            self.statistics.resolved++;
                        } else if (v.BugState == '待审核') {
                            self.statistics.checking++;
                        }
                        if ((v.PriorityLevel == '高' || v.PriorityLevel == '紧急' || v.PriorityLevel == '严重') && v.BugState == '未修复') {
                            urgency.push(v)
                        }
                        if (true) {
                            newest.push(v)
                        }
                    });
                    self.statistics.all = res.data.data.length;
                    self.tableData_urgency = urgency.splice(0, 10);
                    self.tableData_newest = newest.splice(0, 10);
                }).catch(function (err) {

                });
            },
            titleClick(index, tabel) {
                var self = this;
                // self.$store.state.bugListIndex = index;
                // if (tabel == 'tableData_urgency') {
                //     sessionStorage.setItem('bug_data', JSON.stringify(self.tableData_urgency[index]))
                // } else {
                //     sessionStorage.setItem('bug_data', JSON.stringify(self.tableData_newest[index]))
                // }
            },
            stateX(priority) {
                if (priority == '低') {
                    return 'priority-339900';
                }
                if (priority == '中') {
                    return 'priority-999900';
                }
                if (priority == '高') {
                    return 'priority-996600';
                }
                if (priority == '紧急') {
                    return 'priority-cc3300';
                }
                if (priority == '严重') {
                    return 'priority-ff00ff';
                }

            },
            stateO(state) {
                if (state == '未修复') {
                    return 'state-Danger';
                }
                if (state == '已解决') {
                    return 'state-Success';
                }
                if (state == '待审核') {
                    return 'state-Warning';
                }

            }
        },
    }
</script>

<style scoped>
    .bug-statistics > span {
        margin-right: 29px;
    }

    .bug-statistics > span > span {
        font-size: 25px;
    }

    .bug-statistics > span:hover {
        border-bottom: 1px solid #ccc;
        cursor: pointer;
    }

</style>
