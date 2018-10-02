<template>
    <el-table
        :data="tableData_limit"
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
                <!--style="color: #1077B5;font-weight: bold;" @click="titleClick(scope.$index)">{{scope.row.BugTitle}}</a>-->
            </template>
        </el-table-column>
        <el-table-column
            prop="BugState"
            width="80"
            label="状态">
            <template slot-scope="scope">
                <span style="padding: 3px;color: #fff;" :class="stateO(scope.row.BugState)">{{scope.row.BugState}}</span>
            </template>
        </el-table-column>
        <el-table-column
            prop="PriorityLevel"
            label="优先级/处理时间"
            width="130">
            <template slot-scope="scope">
                <div :class="stateX(scope.row.PriorityLevel)">{{scope.row.PriorityLevel}}</div>
                <div v-if="scope.row.NeedTime">{{scope.row.NeedTime}} 小时</div>
            </template>
        </el-table-column>
        <el-table-column
            prop="TaskType"
            width="130"
            label="处理人/任务类别">
            <template slot-scope="scope">
                <div v-html="scope.row.ProcessingPerson"></div>
                <div v-html="TaskTypeFilter(scope.row.TaskType)"></div>
            </template>
        </el-table-column>
        <el-table-column
            prop="ModuleName"
            label="版本/模块"
            width="120">
            <template slot-scope="scope">
                <div v-html="scope.row.ProjectVerno"></div>
                <div v-html="scope.row.ModuleName"></div>
            </template>
        </el-table-column>
        <el-table-column
            label="提交人/提交日期"
            width="150">
            <template slot-scope="scope">
                <div>{{scope.row.CMaker}}</div>
                <div>{{scope.row.InputDate | dateFormat}}</div>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    var {TaskTypeFilter} = require('../assets/js/customFun')
    var  {dateFormat} = require('../assets/js/vue-filters')

    export default {
        name: "Bug-table",
        props: [
            'tableData_limit',
            'loading'
        ],
        methods: {
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
            TaskTypeFilter(value) {
                return TaskTypeFilter(value);
            }
        },
        filters: {
            dateFormat

        }
    }
</script>

<style scoped>

</style>
