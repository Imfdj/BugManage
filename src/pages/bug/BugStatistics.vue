<template>
    <div style="background-color: rgb(245, 245, 245);">
        <div style="padding: 10px 20px" class="head">
            <el-card>
                <div>
                    <el-select v-model="task_executionReport_params.dateType" size="small" style="width: 150px;">
                        <el-option label="分配时间" value="1"></el-option>
                        <el-option label="已解决时间" value="2"></el-option>
                    </el-select>
                    <el-date-picker
                        v-model="task_executionReport_params.value_date"
                        type="daterange"
                        size="small"
                        align="right"
                        unlink-panels
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        style="width: 230px"
                        :picker-options="pickerOptions2">
                    </el-date-picker>
                    <el-select v-model="task_executionReport_params.ProcessingPerson" size="small"
                               style="width: 150px;">
                        <el-option
                            v-for="item in ProcessingPerson_options"
                            :key="item.MemberID"
                            :label="item.EmployeeNickName"
                            :value="item.EmployeeID">
                        </el-option>
                    </el-select>
                    <el-button type="primary" size="small" @click="task_executionReportClick"
                               style="margin-left: 10px;">查询
                    </el-button>
                    <el-button size="small" @click="exportExcel">导出</el-button>

                </div>
                <div style="margin-top: 10px;">
                    <el-table
                        :data="task_executionReport_data"
                        v-loading="task_executionReport_loading"
                        border
                        size="mini"
                        style="width: 98%">
                        <el-table-column
                            prop="ModuleName"
                            label="模块">
                        </el-table-column>
                        <el-table-column
                            prop="EmployeeNickName"
                            label="任务执行人"
                            width="130">
                        </el-table-column>
                        <el-table-column
                            prop="kaifaCount"
                            label="开发任务数"
                            width="130">
                        </el-table-column>
                        <el-table-column
                            prop="kaifaTime"
                            label="开发时间 / h"
                            width="100">
                        </el-table-column>
                        <el-table-column
                            prop="xiufuCount"
                            label="修复任务数"
                            width="170">
                        </el-table-column>
                        <el-table-column
                            prop="xiufuTime"
                            label="修复时间 / h"
                            width="170">
                        </el-table-column>
                        <el-table-column
                            prop="ceshiCount"
                            label="测试任务数"
                            width="170">
                        </el-table-column>
                    </el-table>
                </div>
                <!--<div style="margin: 15px;" v-show="page_total > 1 || page_size > 10">-->
                <!--<el-pagination-->
                <!--@current-change="setPage"-->
                <!--:current-page="page_index"-->
                <!--@size-change="setSize"-->
                <!--:page-size="page_size"-->
                <!--:page-sizes="[10, 20, 30, 50]"-->
                <!--layout="sizes, prev, pager, next, jumper"-->
                <!--:page-count="page_total">-->
                <!--</el-pagination>-->
                <!--</div>-->
                <div style="padding-top: 10px;" v-if="Math.ceil(page_data_total/page_size) > 1 || page_size > 10">
                    <el-pagination
                        :current-page="page_index"
                        @size-change="setSize"
                        @current-change="handleCurrentChange_task_executionReport"
                        :page-size="page_size"
                        :page-sizes="[10, 20, 30, 50]"
                        layout="total,  prev, pager, next, sizes"
                        :total="page_data_total"
                    >
                    </el-pagination>
                </div>
            </el-card>
        </div>
        <div style="padding: 10px 20px">
            <el-card>
                <div style="margin-bottom: 10px;">
                    <span>日期</span>
                    <el-date-picker
                        v-model="value_date"
                        type="daterange"
                        align="right"
                        unlink-panels
                        size="small"
                        range-separator="至"
                        style="width: 250px;"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions2">
                    </el-date-picker>

                    <el-button type="primary" size="small" @click="onSubmit">搜索</el-button>
                </div>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-card style="padding: 10px;">
                            <div id="priorityCharts" style="height: 400px"></div>
                        </el-card>
                    </el-col>
                    <el-col :span="12">
                        <el-card style="padding: 10px;">
                            <div id="stateCharts" style="height: 400px"></div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-card>

        </div>
    </div>

</template>

<script>
    import XLSX from 'xlsx'
    import FileSaver from 'file-saver'
    import custom_event from '../../assets/js/events'

    var echarts = require('echarts');
    var _ = require('lodash');

    export default {
        name: "bug-statistics",
        data() {
            return {
                baseUrl: this.$intfcUrl,
                ProjectID: localStorage.getItem('Bug_ProjectID'),

                pickerOptions2: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                value_date: [
                    new Date(Date.now() - 3600 * 1000 * 24 * 30).toLocaleDateString(),
                    new Date().toLocaleDateString()
                ],
                SearchBugForDate_data: [],

                priorityCharts: '',

                stateCharts: '',
                ProcessingPerson_options: null,
                task_executionReport_loading: false,

                page_index: 1,
                page_size: 10,
                page_total: 1,
                page_data_total: 0,

                task_executionReport_data: [],
                task_executionReport_data_ExportExcel: [],
                // Task_executionReport_data_limit: [],
                task_executionReport_params: {
                    dateType: '1',
                    ProcessingPerson: '全部',
                    value_date: [
                        new Date(Date.now() - 3600 * 1000 * 24 * 30).toLocaleDateString(),
                        new Date().toLocaleDateString()
                    ]
                }


            }
        },
        beforeMount() {
            var self = this;
            self.onSubmit();
            self.task_executionReport();
            // 改变项目 联动查询
            if (custom_event._events.bugStatistics) {
                custom_event._events.bugStatistics.length = 0;
            }
            custom_event.$on('bugStatistics', function (ProjectID) {
                self.ProjectID = ProjectID;
                self.onSubmit();
                self.task_executionReport();
            })
        },
        mounted() {
            var self = this;
            // 基于准备好的dom，初始化echarts实例
            self.priorityCharts = echarts.init(document.getElementById('priorityCharts'));
            self.stateCharts = echarts.init(document.getElementById('stateCharts'));
            // 绘制图表
            self.priorityCharts.setOption({
                title: {
                    text: '优先级',
                },
                tooltip: {
                    trigger: 'item',
                    // formatter: "{a} <br/>{b} : {c} ({d}%)"
                    formatter: "{b} : {c} ({d}%)"
                },

                series: [
                    {
                        name: '优先级',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: [],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            });
            self.stateCharts.setOption({
                title: {
                    text: '状态',
                },
                tooltip: {
                    trigger: 'item',
                    // formatter: "{a} <br/>{b} : {c} ({d}%)"
                    formatter: "{b} : {c} ({d}%)"
                },

                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: [],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            });
        },
        methods: {
            // setPage(page) {
            //     var self = this;
            //     self.page_index = page;
            //     // 分割
            //     self.getTask_executionReport_data_limit();
            // },
            // setSize(size) {
            //     var self = this;
            //     self.page_size = size;
            //     self.page_total = Math.ceil(self.task_executionReport_data.length / self.page_size);
            //     self.page_index = 1;
            //     self.getTask_executionReport_data_limit();
            // },
            task_executionReportClick() {
                var self = this;
                self.page_index = 1;
                self.task_executionReport();
            },
            setSize(size) {
                var self = this;
                self.page_size = size;
                self.page_index = 1;
                self.task_executionReport();
            },
            handleCurrentChange_task_executionReport(page) {
                var self = this;
                self.page_index = page;
                self.task_executionReport();
            },
            // getTask_executionReport_data_limit() {
            //     var self = this;
            //     self.Task_executionReport_data_limit = self.task_executionReport_data.slice((self.page_index - 1) * self.page_size, self.page_index * self.page_size);
            // },
            exportExcel() {
                var self = this;
                //新建excel工作簿与插入一个工作表
                var wb = XLSX.utils.book_new();
                wb.SheetNames.push('sheet1');
                //转换数据
                var edata = [];
                edata.push(['模块', '任务执行人', '开发任务数', '开发时间', '修复任务数', '修复时间', '测试任务数']);
                self.task_executionReportExportExcel(function () {
                    self.task_executionReport_data_ExportExcel.forEach(function (v, i) {
                        edata.push([
                            v.ModuleName, v.EmployeeNickName, v.kaifaCount, v.kaifaTime, v.xiufuCount, v.xiufuTime, v.ceshiCount
                        ])
                    })

                    //将数据填充到工作表
                    var ws = XLSX.utils.aoa_to_sheet(edata);
                    wb.Sheets['sheet1'] = ws;
                    //生成二进制文件
                    var wopts = {bookType: 'xlsx', bookSST: false, type: 'array'};
                    var wbout = XLSX.write(wb, wopts);
                    //下载文件
                    FileSaver.saveAs(new Blob([wbout], {type: "application/octet-stream"}), "任务执行统计表.xlsx");
                });
            },
            onSubmit() {
                var self = this;
                console.log(self.value_date);
                self.SearchBugForDate(self.ProjectID, self.value_date && self.value_date[0], self.value_date && self.value_date[1]);
                self.GetMember(self.ProjectID, localStorage.getItem('Bug_TeamID'));

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
            SearchBugForDate(ProjectID, start, end) {
                var self = this;
                // self.$http.get(self.baseUrl + '/Services/BugManageServices.ashx?method=SearchBugForDate', {
                self.$http.get(self.baseUrl + '/static/data/SearchBugForDate.json', {
                    params: {
                        ProjectID: ProjectID,
                        startdate: start,
                        enddate: end,
                    }
                }).then(function (res) {
                    if (res.data.msg == '成功！') {
                        self.SearchBugForDate_data = res.data.data;
                        self.getPriorityChartsData(self.SearchBugForDate_data);
                        self.getStateChartsData(self.SearchBugForDate_data);
                    } else {
                        self.SearchBugForDate_data = [];
                    }
                }).catch(function (err) {

                });
            },
            task_executionReport() {
                var self = this;
                self.task_executionReport_loading = true;
                self.$http.get(self.baseUrl + '/Services/BugManageServices.ashx', {
                    params: {
                        method: 'task_executionReport',
                        ProjectID: self.ProjectID,
                        dateType: self.task_executionReport_params.value_date && self.task_executionReport_params.dateType,
                        ProcessingPerson: self.task_executionReport_params.ProcessingPerson,
                        startDate: self.task_executionReport_params.value_date && self.task_executionReport_params.value_date[0],
                        endDate: self.task_executionReport_params.value_date && self.task_executionReport_params.value_date[1],
                        pageSize: self.page_size,
                        pageIndex: self.page_index,
                    }
                }).then(function (res) {
                    self.task_executionReport_loading = false;
                    if (res.data.code == 1) {
                        var data_all = res.data;
                        var data = res.data.data;
                        var heji = {
                            ModuleName: '合计',
                            kaifaCount: data_all.kfTaskHeJi,
                            kaifaTime: data_all.kfTimeHeJi,
                            xiufuCount: data_all.xfTaskHeJi,
                            xiufuTime: data_all.xfTimeHeJi,
                            ceshiCount: data_all.csTaskHeJi,
                        }
                        if (data.length > 0) {
                            data.push(heji);
                        }
                        self.task_executionReport_data = data;
                        self.page_data_total = res.data.count;

                        // return
                        //
                        //
                        // var data = res.data.data;
                        // var same = [];
                        // var result = [];
                        // _.forEach(_.groupBy(data, function (value) {
                        //     return value.ModuleID
                        // }), function (v) {
                        //     same.push(_.groupBy(v, function (value) {
                        //         return value.EmployeeID
                        //     }))
                        // });
                        // _.forEach(same, function (v, key) {
                        //     _.forEach(v, function (vv, key) {
                        //         var kaifaTime = 0;
                        //         var xiufuTime = 0;
                        //
                        //         var count = _.countBy(vv, function (value) {
                        //             if (value.TaskType == '开发') {
                        //                 if (_.isNumber(value.NeedTime - 0)) {
                        //                     kaifaTime += (value.NeedTime - 0);
                        //                 }
                        //             }
                        //             if (value.TaskType == '修复') {
                        //                 if (_.isNumber(value.NeedTime - 0)) {
                        //                     xiufuTime += (value.NeedTime - 0);
                        //                 }
                        //             }
                        //             return value.TaskType
                        //         });
                        //         var json = JSON.stringify(count).replace('开发', 'kaifaCount').replace('修复', 'xiufuCount').replace('测试', 'ceshiCount')
                        //         json = JSON.parse(json);
                        //         var data = {
                        //             kaifaTime: kaifaTime,
                        //             xiufuTime: xiufuTime,
                        //             ModuleName: vv[0].ModuleName,
                        //             EmployeeNickName: vv[0].EmployeeNickName,
                        //             ...json,
                        //         }
                        //         result.push(data)
                        //     });
                        //
                        // });
                        //
                        // var count1 = 0;
                        // var count2 = 0;
                        // var count3 = 0;
                        // var count4 = 0;
                        // var count5 = 0;
                        // _.forEach(result, function (value) {
                        //     if(!value.kaifaCount) {
                        //         value.kaifaCount = 0;
                        //     }
                        //     if (!value.xiufuCount) {
                        //         value.xiufuCount = 0;
                        //     }
                        //     if (!value.ceshiCount) {
                        //         value.ceshiCount = 0;
                        //     }
                        //     count1 = (count1 +value.kaifaTime).toFixed(1) - 0;
                        //     count2 = (count2 +value.xiufuTime).toFixed(1) - 0;
                        //     count3 += value.kaifaCount;
                        //     count4 += value.xiufuCount;
                        //     count5 += value.ceshiCount;
                        // })
                        // if (data.length > 0) {
                        //     result.push({
                        //         ModuleName: '总计',
                        //         kaifaTime: count1,
                        //         xiufuTime: count2,
                        //         kaifaCount: count3,
                        //         xiufuCount: count4,
                        //         ceshiCount: count5,
                        //     })
                        // }
                        // console.log(result);
                        // self.task_executionReport_data = result;
                        // self.getTask_executionReport_data_limit();
                        // self.page_total = Math.ceil(self.task_executionReport_data.length / self.page_size);
                    }
                }).catch(function (err) {

                });
            },
            task_executionReportExportExcel(cb) {
                var self = this;
                self.$http.get(self.baseUrl + '/Services/BugManageServices.ashx', {
                    params: {
                        method: 'task_executionReport',
                        ProjectID: self.ProjectID,
                        dateType: self.task_executionReport_params.value_date && self.task_executionReport_params.dateType,
                        ProcessingPerson: self.task_executionReport_params.ProcessingPerson,
                        startDate: self.task_executionReport_params.value_date && self.task_executionReport_params.value_date[0],
                        endDate: self.task_executionReport_params.value_date && self.task_executionReport_params.value_date[1],
                        pageSize: 999,
                        pageIndex: 1,
                    }
                }).then(function (res) {
                    if (res.data.code == 1) {
                        var data_all = res.data;
                        var data = res.data.data;
                        var heji = {
                            ModuleName: '合计',
                            kaifaCount: data_all.kfTaskHeJi,
                            kaifaTime: data_all.kfTimeHeJi,
                            xiufuCount: data_all.xfTaskHeJi,
                            xiufuTime: data_all.xfTimeHeJi,
                            ceshiCount: data_all.csTaskHeJi,
                        }
                        if (data.length > 0) {
                            data.push(heji);
                        }
                        self.task_executionReport_data_ExportExcel = data;
                        cb();
                    }
                }).catch(function (err) {

                });
            },
            getPriorityChartsData(data) {
                var self = this;
                var value1 = 0;
                var value2 = 0;
                var value3 = 0;
                var value4 = 0;
                var value5 = 0;
                data.forEach(function (v, i) {
                    switch (v.PriorityLevel) {
                        case '低':
                            value1++;
                            break;
                        case '中':
                            value2++;
                            break;
                        case '高':
                            value3++;
                            break;
                        case '紧急':
                            value4++;
                            break;
                        case '严重':
                            value5++;
                            break;
                    }
                });
                let priorityCharts_data = [
                    {value: value1, name: '低'},
                    {value: value2, name: '中'},
                    {value: value3, name: '高'},
                    {value: value4, name: '紧急'},
                    {value: value5, name: '严重'},
                ];
                self.priorityCharts.setOption({
                    series: [{
                        data: priorityCharts_data
                    }],
                });
            },
            getStateChartsData(data) {
                var self = this;
                var value1 = 0;
                var value2 = 0;
                var value3 = 0;
                data.forEach(function (v, i) {
                    switch (v.BugState) {
                        case '未修复':
                            value1++;
                            break;
                        case '已解决':
                            value2++;
                            break;
                        case '待审核':
                            value3++;
                            break;
                    }
                });
                let stateCharts_data = [
                    {value: value1, name: '未修复'},
                    {value: value2, name: '已解决'},
                    {value: value3, name: '待审核'},
                ];
                self.stateCharts.setOption({
                    series: [{
                        data: stateCharts_data
                    }],
                });
            }

        }
    }
</script>

<style scoped>
    .head .el-form-item {
        margin: 0px;
    }
</style>
