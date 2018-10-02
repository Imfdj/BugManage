<template>
    <div>
        <div v-show="!isNone">
            <div style="padding: 10px;font-size: 15px;">
                <el-card style="position: relative;">
                    <div class="content">
                        <div>
                            <span class="titel">项目名称</span><span
                            style="font-weight: 600;">{{bugData.PprojectName}}</span>
                        </div>
                        <div>
                            <span class="titel">Bug标题</span><span
                            style="display: inline-block;width: calc(100% - 110px);color: #7b7b7b;">{{bugData.BugTitle}}</span>
                        </div>
                        <div>
                            <span class="titel">时间</span><span
                            style="color: #7b7b7b;">{{bugData.InputDate |dateFormat}}</span>
                        </div>
                        <div>
                            <span class="titel">模块</span><span style="color: #7b7b7b;">{{bugData.ModuleName}}</span>
                        </div>
                        <div>
                            <span class="titel">版本</span><span style="color: #7b7b7b;">{{bugData.ProjectVerno}}</span>
                        </div>
                        <div>
                            <span class="titel">优先级</span><span style="color: #7b7b7b;">{{bugData.PriorityLevel}}</span>
                        </div>
                        <div>
                            <span class="titel">状态</span><span style="color: #7b7b7b;">{{bugData.BugState}}</span>
                        </div>
                        <div>
                            <span class="titel">分配人</span><span style="color: #7b7b7b;">{{bugData.CMaker}}</span>
                        </div>
                        <div>
                            <span class="titel">处理人</span><span
                            style="color: #7b7b7b;">{{bugData.ProcessingPerson}}</span>
                        </div>
                        <div>
                            <span class="titel">任务类别</span><span
                            style="color: #7b7b7b;">{{bugData.TaskType}}</span>
                        </div>
                        <div>
                            <span class="titel">处理所需时间</span><span
                            style="color: #7b7b7b;" v-if="bugData.NeedTime">{{bugData.NeedTime}} 小时</span>
                        </div>
                        <div style="display: flex">
                            <span class="titel">描述与截图</span>
                            <el-card v-show="bugData.describeImageCotent" class="simditor" style="width: 100%;">
                                <div style="display: inline-block;" class="describe-content-bugInfo simditor-body"
                                     v-html="bugData.describeImageCotent"></div>
                            </el-card>
                        </div>
                        <div style="display: flex;margin-bottom: 30px">
                            <span class="titel">处理过程</span>
                            <div style="width: 100%">
                                <div v-for="(item ,index) in bugDealInfoData" :key="index"
                                     style="width: 100%;margin-bottom: 5px">
                                    <el-card style="width: 100%">
                                        <el-row :gutter="5" style="width: 100%">
                                            <el-col :span="2">
                                                <span v-if="item.BugState == '未修复' && index == 0"
                                                      style="background-color: #0066FF;color: #fff;padding: 3px;">已分配</span>
                                                <span v-if="item.BugState == '未修复' && index != 0"
                                                      style="background-color: #F56C6C;color: #fff;padding: 3px;">{{item.BugState}}</span>
                                                <span v-if="item.BugState == '已解决'"
                                                      style="background-color: #67C23A;color: #fff;padding: 3px;">{{item.BugState}}</span>
                                                <span v-if="item.BugState == '待审核'"
                                                      style="background-color: #ffa900;color: #fff;padding: 3px;">{{item.BugState}}</span>
                                            </el-col>
                                            <el-col :span="4">
                                                <div v-if="item.BugState != '已解决'">{{item.CMaker}} <i
                                                    class="fa fa-long-arrow-right"></i>
                                                    {{item.ProcessingPerson}}
                                                </div>
                                                <div v-if="item.BugState == '已解决'">{{bugData.CMaker}}</div>
                                            </el-col>
                                            <el-col :span="1">
                                                <div v-html="TaskTypeFilter(item.TaskType)"></div>
                                            </el-col>
                                            <el-col :span="13" style="overflow: hidden">
                                                <div :style="'visibility:' + item.isVisibility"
                                                     class="describe-content-bugInfo" v-html="item.ReMark"></div>
                                            </el-col>
                                            <el-col :span="4">
                                                <div>{{item.InputDate | dateFormat}}</div>
                                            </el-col>
                                        </el-row>
                                    </el-card>
                                </div>
                                <div v-if="bugDealInfoData_last.BugState != '已解决'">
                                    <el-card style="width: 100%">
                                        <el-row :gutter="5" style="width: 100%">
                                            <el-col :span="2">
                                                    <span v-if="bugDealInfoData_last.BugState == '未修复'"
                                                          style="background-color: #F56C6C;color: #fff;padding: 3px;">{{bugDealInfoData_last.BugState}}</span>
                                                <span v-if="bugDealInfoData_last.BugState == '待审核'"
                                                      style="background-color: #ffa900;color: #fff;padding: 3px;">{{bugDealInfoData_last.BugState}}</span>
                                            </el-col>
                                            <el-col :span="4">
                                                <div>{{bugDealInfoData_last.ProcessingPerson}}</div>
                                            </el-col>
                                            <el-col :span="13">
                                            </el-col>
                                            <el-col :span="5">
                                            </el-col>
                                        </el-row>
                                    </el-card>
                                </div>
                            </div>
                        </div>
                        <div v-if="bugData.BugState != '已解决' && (bugData.ProcessingPerson_ID == LoginerEmployeeID)">
                            <div style="display: flex;margin-bottom: 30px">
                                <span class="titel">状态</span>
                                <div style="display: inline-block;">
                                    <el-radio v-model="radio" label="1">已解决</el-radio>
                                    <el-radio v-model="radio" label="3" v-if="bugData.BugState == '待审核'">未修复</el-radio>
                                    <el-radio v-model="radio" label="2" v-if="bugData.BugState == '未修复'">转发</el-radio>
                                    <el-radio v-model="radio" label="2" v-if="bugData.BugState == '待审核'">未修复并转发
                                    </el-radio>
                                    <div style="margin: 0px;display: inline-block;" v-show="radio == 2">
                                        <div class="task-categories-div">
                                            <el-select v-model="disposeBug_form.ProcessingPerson"
                                                       placeholder="请选择类型" size="mini"
                                                       style="width: 120px;margin-left: 10px">
                                                <el-option
                                                    v-for="item in ProcessingPerson_options"
                                                    :key="item.MemberID"
                                                    :label="item.EmployeeNickName"
                                                    :value="item.EmployeeID">
                                                </el-option>
                                            </el-select>
                                            <span style="margin-left: 10px;">任务类别：</span>
                                            <el-radio-group v-model="disposeBug_form.TaskType">
                                                <el-radio label="开发">开发</el-radio>
                                                <el-radio label="修复">修复</el-radio>
                                                <el-radio label="测试">测试</el-radio>
                                            </el-radio-group>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style="display: flex">
                                <span class="titel">备注</span>
                                <div style="display: inline-block; width: 100%">
                                    <el-tabs v-model="tabsActiveName" type="border-card">
                                        <el-tab-pane label="文本" name="textarea">
                                            <el-input
                                                type="textarea"
                                                :rows="4"
                                                placeholder="请输入内容"
                                                v-model="disposeBug_form.textarea">
                                            </el-input>
                                        </el-tab-pane>
                                        <el-tab-pane label="HTML" name="html">
                                            <rte :upload_url="baseUrl+ '/Services/FilesUploadService.ashx'"
                                                 :upload_file_path="baseUrl+ '/uploads'"
                                                 v-model="disposeBug_form.htmlContent"></rte>
                                        </el-tab-pane>
                                    </el-tabs>

                                    <el-button size="small" type="primary" style="margin-top: 20px"
                                               @click="AddBugDealInfoClick">提交
                                    </el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bug-handle">
                        <span style="padding-right: 10px;"><el-button size="mini" type="success" @click="copyClick">复制创建新的BUG</el-button></span>
                        <span v-if="(bugData.CMaker_ID == LoginerEmployeeID && bugData.BugState == '未修复') ||
                     (bugDealInfoData_last.CMaker_ID == LoginerEmployeeID && bugData.BugState == '待审核') || IsAdministor">
                            <el-button style="display: none" size="mini" type="primary" @click="creatBug"
                                       v-show="bugData.BugState != '已解决'">修改</el-button>
                            <el-button size="mini" type="danger" @click="deleteBug">删除</el-button>
                        </span>
                    </div>
                </el-card>
            </div>
            <div>
                <el-dialog title="编辑BUG" :visible.sync="dialogEditBugVisible" width="80%">
                    <div class="announcement-content">
                        <el-form :model="creatBug_form" ref="editBugForm" label-width="90px" :rules="rules3"
                                 :inline-message="true"
                                 class="demo-ruleForm">
                            <!--,{ max: 30, message: '长度不能超过30', trigger: 'blur' }-->
                            <el-form-item
                                label="标题"
                                prop="BugTitle"
                                style="margin: 0px"
                                :rules="[{ required: true, message: '标题不能为空',trigger: 'blur'}]"
                            >
                                <el-input type="age" v-model="creatBug_form.BugTitle" size="mini"
                                          auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item
                                label="模块"
                                prop="ModuleID"
                                style="margin: 0px"
                                :rules="[{ required: true, message: '请选择模块',trigger: 'change'}]"
                            >
                                <el-select v-model="creatBug_form.ModuleID"
                                           placeholder="请选择类型" size="small">
                                    <el-option
                                        v-for="item in Module_options"
                                        :key="item.ModuleID"
                                        :label="item.ModuleName"
                                        :value="item.ModuleID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                label="版本"
                                prop="ProjectVerID"
                                style="margin: 0px"
                                :rules="[{ required: true, message: '请选择版本',trigger: 'change'}]"
                            >
                                <el-select v-model="creatBug_form.ProjectVerID"
                                           placeholder="请选择类型" size="small">
                                    <el-option
                                        v-for="item in ProjectVer_options"
                                        :key="item.ProjectVerID"
                                        :label="item.ProjectVerNO"
                                        :value="item.ProjectVerID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                label="优先级"
                                style="margin: 0px;display: inline-block;"
                            >
                                <el-radio-group v-model="creatBug_form.PriorityLevel">
                                    <el-radio label="低">低</el-radio>
                                    <el-radio label="中">中</el-radio>
                                    <el-radio label="高">高</el-radio>
                                    <el-radio label="紧急">紧急</el-radio>
                                    <el-radio label="严重">严重</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item
                                prop="NeedTime"
                                label-width="20px"
                                style="margin: 0px;display: inline-block;"
                            >
                                <span style="color: red;">处理所需时间： </span>
                                <el-input v-model="creatBug_form.NeedTime" size="small"
                                          style="width: 130px;"></el-input>
                                小时
                            </el-form-item>
                            <el-form-item
                                label="描述与截图"
                                style="margin: 0px"
                            >
                                <rte :upload_url="baseUrl+ '/Services/FilesUploadService.ashx'"
                                     :upload_file_path="baseUrl+ '/uploads'" v-model="describeImageCotent"></rte>
                            </el-form-item>
                            <el-form-item
                                label="重新分配"
                                style="margin: 0px"
                            >
                                <el-select v-model="creatBug_form.ProcessingPerson_ID" :disabled="!reallocate"
                                           placeholder="请选择类型" size="small" style="width: 120px">
                                    <el-option
                                        v-for="item in ProcessingPerson_options"
                                        :key="item.MemberID"
                                        :label="item.EmployeeNickName"
                                        :value="item.EmployeeID">
                                    </el-option>
                                </el-select>
                                <div style="margin: 0px;display: inline-block;margin-left: 10px;">
                                    <div class="task-categories-div">
                                        <span>任务类别：</span>
                                        <el-radio-group v-model="creatBug_form.TaskType" :disabled="!reallocate">
                                            <el-radio label="开发">开发</el-radio>
                                            <el-radio label="修复">修复</el-radio>
                                            <el-radio label="测试">测试</el-radio>
                                        </el-radio-group>
                                    </div>
                                </div>
                                <span style="position: absolute;top: 0px;left: -88px;">
                                <el-checkbox v-model="reallocate"></el-checkbox>
                            </span>
                                <div v-show="reallocate">
                                    <el-tabs v-model="tabsActiveName_creatBug" type="border-card">
                                        <el-tab-pane label="文本" name="textarea">
                                            <el-input
                                                type="textarea"
                                                :rows="4"
                                                placeholder="请输入内容"
                                                v-model="creatBug_form.textarea">
                                            </el-input>
                                        </el-tab-pane>
                                        <el-tab-pane label="HTML" name="html">
                                            <rte :upload_url="baseUrl+ '/Services/FilesUploadService.ashx'"
                                                 :upload_file_path="baseUrl+ '/uploads'"
                                                 v-model="creatBug_form.htmlContent"></rte>
                                        </el-tab-pane>
                                    </el-tabs>
                                </div>
                            </el-form-item>
                            <el-form-item
                                style="margin: 0px"
                            >
                                <el-button type="primary" size="small" @click="bugSubmit('editBugForm')">提交</el-button>
                            </el-form-item>
                        </el-form>
                    </div>

                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
    var {dateFormat} = require('../../assets/js/vue-filters')
    var {HTMLEncode, HTMLDecode, TaskTypeFilter} = require('../../assets/js/customFun')

    export default {
        name: "bug-info",
        components: {},
        data() {
            var validatePass_NeedTime = (rule, value, callback) => {
                var self = this;
                console.log(typeof  value);
                if (!Number.isFinite(value - 0)) {
                    callback(new Error('请输入数字值'));
                } else {
                    callback();
                }
            };
            return {
                baseUrl: this.$intfcUrl,
                ProjectID: '',
                LoginerEmployeeID: JSON.parse(localStorage.getItem('Bug_LoginUser')).EmployeeID,
                LoginerAccount: JSON.parse(localStorage.getItem('Bug_LoginUser')).EmployeeAccount,

                isNone: false,
                IsAdministor: false,

                dialogEditBugVisible: false,
                bugData: {},
                bugDealInfoData: [],
                bugDealInfoData_last: {},
                creatBug_form: {},
                describeImageCotent: "",
                describeImageCotent1: "",
                ProjectVer_options: [],
                Module_options: [],
                ProcessingPerson_options: [],
                radio2: 3,
                bugId: '',


                radio: '1',
                disposeBug_form: {
                    ProcessingPerson: '',
                    textarea: '',
                    TaskType: '',
                    htmlContent: ''
                },

                reallocate: false,
                tabsActiveName: 'textarea',
                tabsActiveName_creatBug: 'textarea',

                rules3: {
                    NeedTime: [
                        {validator: validatePass_NeedTime, trigger: 'blur'}
                    ],

                },

            }
        },
        beforeMount() {
            var self = this;
            // 处理bugId
            var path = self.$route.path;
            self.bugId = path.substr(path.lastIndexOf('/') + 1);
            self.GetBugForID();
            self.GetBugDealInfo();

        },
        mounted() {
            var self = this;
            // self.bugData = JSON.parse(sessionStorage.getItem('bug_data'));
            // self.bugData.describeImageCotent = HTMLDecode(self.bugData.describeImageCotent);
            // self.describeImageCotent1 = self.bugData.describeImageCotent;
            // console.log(self.describeImageCotent);
            // self.creatBug_form = JSON.parse(JSON.stringify(self.bugData));
            // 默认处理人转发为登录者
            self.disposeBug_form.ProcessingPerson = self.LoginerEmployeeID;
        },
        methods: {
            // 处理bug
            AddBugDealInfoClick() {
                var self = this;
                var htmlContent = HTMLEncode(self.disposeBug_form.htmlContent);
                var ReMark = self.tabsActiveName == 'textarea' ? self.disposeBug_form.textarea : htmlContent;
                if (self.radio == 1) {
                    if (self.bugDealInfoData_last.ProcessingPerson_ID == self.bugData.CMaker_ID) {
                        let ProcessingPerson = ''
                        // 如果是待审核后解决， 处理人为上一个CMaker_ID；
                        if (self.bugDealInfoData_last.BugState == '待审核') {
                            ProcessingPerson = self.bugDealInfoData_last.CMaker_ID;
                        } else {
                            ProcessingPerson = self.bugDealInfoData_last.ProcessingPerson_ID;
                        }
                        var jsonData = {
                            BugID: self.bugId,
                            BugState: '已解决',
                            ProcessingPerson: ProcessingPerson,
                            CMaker: self.bugDealInfoData_last.CMaker_ID,
                            ReMark: ReMark,
                            TaskType: self.disposeBug_form.TaskType || ''
                        };
                        self.AddBugDealInfo(jsonData);
                    } else {
                        var jsonData = {
                            BugID: self.bugId,
                            BugState: '待审核',
                            ProcessingPerson: self.bugData.CMaker_ID,
                            CMaker: self.bugDealInfoData_last.ProcessingPerson_ID,
                            ReMark: ReMark,
                            TaskType: self.disposeBug_form.TaskType || ''
                        };
                        self.AddBugDealInfo(jsonData);
                        self.SendEmail(self.ProjectID, self.bugData.CMaker_ID, false, self.bugId, 0);
                    }
                } else if (self.radio == 2) {
                    var jsonData = {
                        BugID: self.bugId,
                        BugState: '未修复',
                        ProcessingPerson: self.disposeBug_form.ProcessingPerson,
                        CMaker: self.bugDealInfoData_last.ProcessingPerson_ID,
                        ReMark: ReMark,
                        TaskType: self.disposeBug_form.TaskType || ''
                    };
                    self.AddBugDealInfo(jsonData);
                    self.SendEmail(self.ProjectID, self.disposeBug_form.ProcessingPerson, false, self.bugId, 0);
                } else {
                    var jsonData = {
                        BugID: self.bugId,
                        BugState: '未修复',
                        ProcessingPerson: self.bugDealInfoData_last.CMaker_ID,
                        CMaker: self.bugDealInfoData_last.ProcessingPerson_ID,
                        ReMark: ReMark,
                        TaskType: self.disposeBug_form.TaskType || ''
                    };
                    self.AddBugDealInfo(jsonData);
                }
            },
            creatBug() {
                var self = this;
                self.reallocate = false;
                self.dialogEditBugVisible = true;
                self.$nextTick(function () {
                    self.describeImageCotent = self.describeImageCotent1
                })
            },
            deleteBug() {
                var self = this;
                self.$confirm('确定?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    self.DeleteBugInfo();
                }).catch(() => {
                });
            },
            copyClick() {
                var self = this;
                self.$router.push({
                    path: '/bug/situation',
                });
                self.$store.commit('updateCopy_bug_data', self.bugData)
            },
            bugSubmit(formName) {
                var self = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var CompanyCode = JSON.parse(localStorage.getItem("Bug_LoginUser")).CompanyCode;
                        var CMaker = JSON.parse(localStorage.getItem("Bug_LoginUser")).EmployeeAccount;
                        var ProjectID = self.ProjectID;
                        if (CompanyCode && ProjectID) {


                            var describeImageCotent = HTMLEncode(self.describeImageCotent)
                            var jsondata = {
                                CompanyCode: CompanyCode,
                                BugID: self.creatBug_form.BugID,
                                ProjectID: ProjectID,
                                BugTitle: self.creatBug_form.BugTitle,
                                ProjectVerID: self.creatBug_form.ProjectVerID,
                                ModuleID: self.creatBug_form.ModuleID,
                                PriorityLevel: self.creatBug_form.PriorityLevel,
                                ProcessingPerson: self.reallocate ? self.creatBug_form.ProcessingPerson_ID : self.creatBug_form.ProcessingPerson_ID_old,
                                describeImageCotent: describeImageCotent,
                                // describeImageCotent: 'asdfas',
                                CMaker: self.LoginerEmployeeID,
                                BugState: '未修复',
                                NeedTime: self.creatBug_form.NeedTime || '',
                                TaskType: self.reallocate ? self.creatBug_form.TaskType : self.creatBug_form.TaskType_old
                            };
                            console.log(jsondata);
                            self.creatBug_form.htmlContent = self.creatBug_form.htmlContent == null ? '' : self.creatBug_form.htmlContent;
                            self.creatBug_form.textarea = self.creatBug_form.textarea == null ? '' : self.creatBug_form.textarea;
                            var htmlContent = HTMLEncode(self.creatBug_form.htmlContent);
                            var ReMark = self.tabsActiveName_creatBug == 'textarea' ? self.creatBug_form.textarea : htmlContent;

                            if (self.reallocate && jsondata.CMaker == jsondata.ProcessingPerson) {
                                self.$confirm('是否确认安排你本人处理当前问题?', '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                    self.ModifyBugInfo(jsondata, self.reallocate ? 1 : 0, ReMark);
                                }).catch(() => {
                                });
                            } else {
                                self.ModifyBugInfo(jsondata, self.reallocate ? 1 : 0, ReMark);
                            }
                        }
                    }
                });
            },
            // 修改bug
            ModifyBugInfo(jsondata, newType, ReMark) {
                var self = this;
                self.$http.post(self.baseUrl + '/Services/BugManageServices.ashx', {
                    method: 'ModifyBugInfo',
                    jsondata: JSON.stringify(jsondata),
                    newType: newType,
                    ReMark: ReMark,
                }).then(function (res) {
                    if (res.data.code > 0) {
                        // 修改成功需要邮件提醒
                        self.SendEmail(jsondata.ProjectID, jsondata.ProcessingPerson, false, jsondata.BugID, 0);
                        self.GetBugForID();
                        self.GetBugDealInfo();
                        self.dialogEditBugVisible = false;
                        self.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                    } else {
                        self.$message({
                            message: '修改失败',
                            type: 'error'
                        });
                    }
                }).catch(function (err) {
                    self.$message({
                        message: '修改失败',
                        type: 'error'
                    });
                });
            },
            // 删除bug
            DeleteBugInfo() {
                var self = this;
                self.$http.post(self.baseUrl + '/Services/BugManageServices.ashx', {
                    method: 'DeleteBugInfo',
                    BugID: self.creatBug_form.BugID,
                }).then(function (res) {
                    if (res.data.code > 0) {
                        self.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        setTimeout(function () {
                            window.close();
                        }, 1000)
                    } else {
                        self.$message({
                            message: '删除失败',
                            type: 'error'
                        });
                    }
                }).catch(function (err) {
                    self.$message({
                        message: '删除失败',
                        type: 'error'
                    });
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
                        // res.data.data.unshift({
                        //     "ProjectID": 0,
                        //     "ProjectVerID": -1,
                        //     "ProjectVerNO": "全部"
                        // });
                        self.ProjectVer_options = res.data.data;
                        self.$store.state.ProjectVer_options = res.data.data;
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
                        // res.data.data.unshift({
                        //     "ProcessingPerson": "全部",
                        //     "ModuleID": -1,
                        //     "ProjectID": 0,
                        //     "ModuleName": "全部"
                        // });
                        self.Module_options = res.data.data;
                        self.$store.state.Module_options = res.data.data;
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
                        // res.data.data.unshift({
                        //     "EmployeeAccount1": null,
                        //     "EmployeeNickName": null,
                        //     "PersonDetailID": null,
                        //     "ProjectID": 0,
                        //     "EmployeeAccount": "全部",
                        //     "MemberID": 0
                        // });
                        self.ProcessingPerson_options = res.data.data;
                        console.log(self.ProcessingPerson_options);
                    }
                }).catch(function (err) {

                });
            },
            // 获取团队人员
            GetTeamPerson(TeamID) {
                var self = this;
                self.$http.get(self.baseUrl + '/Services/BugManageServices.ashx?', {
                    params: {
                        'method': 'GetTeamPerson',
                        'TeamID': TeamID,
                    },
                }).then(function (res) {
                    if (res.data.code > 0) {
                        res.data.data.forEach(function (v, i) {
                            if (v.EmployeeAccount == self.LoginerAccount) {
                                self.IsAdministor = v.IsAdministor;
                            }
                        });
                    } else {
                    }
                }).catch(function (err) {

                });
            },
            GetBugForID() {

                var self = this;
                // self.$http.get(self.baseUrl + '/Services/BugManageServices.ashx?', {
                self.$http.get(self.baseUrl + '/static/data/GetBugForID.json', {
                    params: {
                        'method': 'GetBugForID',
                        'BugID': self.bugId,
                    },
                }).then(function (res) {
                    console.log(res);
                    if (res.data.code > 0) {
                        window.document.title = 'Bug-' + res.data.data[0].BugTitle;
                        var s = res.data.data[0].describeImageCotent;
                        res.data.data[0].describeImageCotent = HTMLDecode(s);
                        self.bugData = res.data.data[0];
                        // 获取编辑bug相关数据
                        self.ProjectID = self.bugData.ProjectID;
                        var TeamID = self.bugData.TeamID;
                        self.GetProjectVerson(self.ProjectID);
                        self.GetProjectModule(self.ProjectID);
                        self.GetMember(self.ProjectID, TeamID);
                        self.GetTeamPerson(TeamID);

                        self.describeImageCotent1 = self.bugData.describeImageCotent;
                        // 转发时， 任务类别赋原值
                        self.disposeBug_form.TaskType = self.bugData.TaskType || '';
                        // 保存原始处理人id
                        self.bugData.ProcessingPerson_ID_old = self.bugData.ProcessingPerson_ID;
                        self.bugData.TaskType_old = self.bugData.TaskType;
                        self.bugData.NeedTime = self.bugData.NeedTime ? self.bugData.NeedTime : '';
                        self.creatBug_form = JSON.parse(JSON.stringify(self.bugData));
                    } else {
                        if (res.data.error == '没有登录， 不能调用') {
                            self.$message({
                                message: '请登录',
                                type: 'success'
                            });
                        } else {
                            self.isNone = true;
                            self.$message({
                                // message: '此Bug已被删除',
                                message: 'Bug不存在',
                                type: 'success'
                            });
                            // setTimeout(function () {
                            //     window.close();
                            // }, 1000)
                        }
                    }
                }).catch(function (err) {

                });
            },
            GetBugDealInfo() {
                var self = this;
                // self.$http.get(self.baseUrl + '/Services/BugManageServices.ashx?', {
                self.$http.get(self.baseUrl + '/static/data/GetBugDealInfo.json', {
                    params: {
                        'method': 'GetBugDealInfo',
                        'BugID': self.bugId,
                    },
                }).then(function (res) {
                    if (res.data.code > 0) {
                        var data = res.data.data;
                        data.forEach(function (v, i) {
                            if (v.ReMark == null || v.ReMark == '') {
                                v.ReMark = "-1111";
                                v.isVisibility = 'hidden';
                            } else {
                                v.ReMark = HTMLDecode(v.ReMark);
                                v.isVisibility = 'visible';
                            }
                        });
                        self.bugDealInfoData = data;
                        self.bugDealInfoData_last = data[data.length - 1];
                    }
                }).catch(function (err) {

                });
            },
            AddBugDealInfo(json) {
                var self = this;
                self.$http.post(self.baseUrl + '/Services/BugManageServices.ashx', {
                    'method': 'AddBugDealInfo',
                    'json': JSON.stringify(json),
                    // 'state': '已解决',
                }).then(function (res) {
                    if (res.data.code > 0) {
                        self.$message({
                            message: '提交成功',
                            type: 'success'
                        });
                        self.GetBugForID();
                        self.GetBugDealInfo();
                    } else {
                        self.$message({
                            message: '提交失败，请重试',
                            type: 'error'
                        });
                    }
                }).catch(function (err) {
                    self.$message({
                        message: '提交失败，请重试',
                        type: 'error'
                    });
                });
            },
            SendEmail(ProjectID, ProcessingPersonID, isSendAllPeople, bugID, isUpdate) {
                let self = this;
                let path = window.location.href;
                path = path.substr(0, path.indexOf('#/') - 1) + '/bugInfo/' + bugID;
                let MemberID = null;
                self.ProcessingPerson_options.forEach(function (v, i) {
                    if (v.EmployeeID == ProcessingPersonID) {
                        MemberID = v.MemberID;
                        return false;
                    }
                });
                self.$http.post(self.baseUrl + '/Services/BugAssignServices.ashx?method=SendEmail', {
                    ProjectID: ProjectID,
                    MemberID: MemberID,
                    Getall: isSendAllPeople === true ? 1 : 0,
                    address: path,
                    isUpdate: isUpdate
                }).then(function (res) {
                    if (res.data == true) {

                    } else {

                    }
                }).catch(function (err) {

                });
            },
            TaskTypeFilter(value) {
                return TaskTypeFilter(value);
            }

        },
        watch: {
            // radio(newValue, oldValue) {
            //     if (newValue == 2) {
            //
            //     }
            // }
        },
        filters: {
            dateFormat

        }
    }
</script>

<style>
    .describe-content-bugInfo img {
        max-width: 100% !important;
        height: 100% !important;
    }
</style>

<style scoped>
    .content > div {
        margin: 15px 0px;
    }

    .titel {
        display: inline-block;
        margin-right: 10px;
        width: 100px;
    }

    .bug-handle {
        position: absolute;
        top: 7px;
        right: 7px;
    }


</style>
