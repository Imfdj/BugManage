<template>
    <div>
        <el-row type="flex" class="row-bg" justify="space-between" style="margin: 0px">
            <el-col style="display: flex;">
                <div style="display: inline-block;margin-left: 20px;">
                    <img src="../../assets/logo.png" alt="" width="80px" height="80px">
                    <!--<div style="width: 80px;height: 80px;border: 1px solid #ccc;margin: 0 auto;"></div>-->
                </div>
                <div style="display: inline-block;padding: 20px;">
                    <el-select v-model="project_selected" style="min-width: 270px;" filterable placeholder="请选择" @change="project_selectedChange">
                        <el-option
                            v-for="item in options_project"
                            :key="item.ProjectID"
                            :label="item.ProjectName"
                            :value="item.ProjectID">
                        </el-option>
                    </el-select>
                </div>
                <div style="display: inline-block;padding: 20px;padding-left: 0px;">
                    <el-button type="primary" @click="creatBug">提交Bug</el-button>
                </div>
            </el-col>
            <el-col style="margin-right: 13px;">
                <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect"
                         :router="true">
                    <el-menu-item index="/bug/bugStatistics">
                        <div class="menu-icon-div">
                            <div class="menu-icon-div">
                                <i class="fa fa-signal menu-icon" aria-hidden="true"
                                   style="color: rgb(10, 174, 84);"> </i>
                            </div>
                        </div>
                        <span class="menu-title">Bug统计</span>
                    </el-menu-item>
                    <el-menu-item index="/bug/allBug">
                        <div class="menu-icon-div">
                            <div class="myCreatBug allBug menu-icon">
                                <i class="fa fa-bug bug-i-1" aria-hidden="true" style="color: rgb(10, 174, 84);"></i>
                                <i class="fa fa-bug bug-i-2" aria-hidden="true" style="color: rgb(10, 174, 84);"></i>
                                <i class="fa fa-bug bug-i-3" aria-hidden="true" style="color: rgb(10, 174, 84);"></i>
                            </div>
                        </div>
                        <span class="menu-title">所有Bug</span>
                    </el-menu-item>
                    <el-menu-item index="/bug/mySubmit">
                        <div class="menu-icon-div">
                            <div class="myCreatBug menu-icon">
                                <i class="fa fa-bug bug-i" aria-hidden="true"></i>
                                <i class="fa fa-plus plus-i" aria-hidden="true"></i>
                            </div>
                        </div>
                        <span class="menu-title">我创建的Bug</span>
                    </el-menu-item>
                    <el-menu-item index="/bug/myDispose">
                        <div class="menu-icon-div">
                            <div class="myCreatBug menu-icon">
                                <i class="fa fa-bug" aria-hidden="true"
                                   style="color: #0aae54;font-size: 35px;position: absolute;left: 8px;"></i>
                            </div>
                        </div>
                        <span class="menu-title">分配给我的Bug</span>
                    </el-menu-item>
                    <el-menu-item index="/bug/situation">
                        <div class="menu-icon-div">
                            <i class="fa fa-home menu-icon" aria-hidden="true" style="color: rgb(10, 174, 84);"> </i>
                        </div>
                        <span class="menu-title">项目概况</span>
                    </el-menu-item>
                </el-menu>
            </el-col>
        </el-row>
        <div>
            <el-dialog title="新建BUG" :visible.sync="dialogCreatBugVisible" width="80%" @open="dialogCreatBugVisibleOpen"
                       @close="dialogCreatBugVisibleClose">
                <div class="announcement-content">
                    <el-form :model="creatBug_form" ref="numberValidateForm" label-width="90px" :rules="rules3"
                             :inline-message="true"
                             class="demo-ruleForm">
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
                            label="版本"
                            prop="ProjectVerID"
                            style="margin: 0px"
                            :rules="[{ required: true, message: '请选择版本',trigger: 'change'}]"
                        >
                            <el-select v-model="creatBug_form.ProjectVerID"
                                       placeholder="请选择版本" size="small">
                                <el-option
                                    v-for="item in ProjectVer_options"
                                    :key="item.ProjectVerID"
                                    :label="item.ProjectVerNO"
                                    :value="item.ProjectVerID">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                            label="模块"
                            prop="ModuleID"
                            style="margin: 0px"
                            :rules="[{ required: true, message: '请选择模块',trigger: 'change'}]"
                        >
                            <el-select v-model="creatBug_form.ModuleID"
                                       placeholder="请选择模块" size="small">
                                <el-option
                                    v-for="item in Module_options"
                                    :key="item.ModuleID"
                                    :label="item.ModuleName"
                                    :value="item.ModuleID">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                            label="优先级"
                            style="margin: 0px"
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
                            label="处理人"
                            prop="ProcessingPerson"
                            style="margin: 0px;display: inline-block;"
                            :rules="[{ required: true, message: '请选择处理人',trigger: 'change'}]"
                        >
                            <el-select v-model="creatBug_form.ProcessingPerson"
                                       placeholder="请选择处理人" size="small">
                                <el-option
                                    v-for="item in ProcessingPerson_options"
                                    :key="item.MemberID"
                                    :label="item.EmployeeNickName"
                                    :value="item.EmployeeID">
                                </el-option>
                            </el-select>
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
                            label="任务类别："
                            prop="TaskType"
                            label-width="90px"
                            style="margin: 0px;display: inline-block;margin-left: 10px;"
                        >
                            <div class="task-categories-div">
                                <el-radio-group v-model="creatBug_form.TaskType">
                                    <el-radio label="开发">开发</el-radio>
                                    <el-radio label="修复">修复</el-radio>
                                    <el-radio label="测试">测试</el-radio>
                                </el-radio-group>
                            </div>
                        </el-form-item>
                        <el-form-item
                            label="描述与截图"
                            style="margin: 0px"
                        >
                            <div style="padding-top: 10px">
                                <rte :upload_url="baseUrl+ '/Services/FilesUploadService.ashx'"
                                     :upload_file_path="baseUrl+ '/uploads'"
                                     v-model="creatBug_form.describeImageCotent"></rte>

                            </div>
                        </el-form-item>
                        <el-form-item
                            style="margin: 0px"
                        >
                            <div>
                                <el-checkbox v-model="isSendAllPeople">发送邮件到项目所有成员</el-checkbox>
                            </div>
                            <el-button type="primary" size="small" @click="bugSubmit('numberValidateForm')">提交
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>

            </el-dialog>
        </div>
        <router-view/>
    </div>
</template>

<script>
    // import rte from '../../components/rte'
    import custom_event from '../../assets/js/events'


    export default {
        name: "bug",
        components: {
            // rte,
        },
        data() {
            var validatePass_NeedTime = (rule, value, callback) => {
                var self = this;
                if (!Number.isFinite(value - 0)) {
                    console.log(typeof  value);
                    callback(new Error('请输入数字值'));
                } else {
                    callback();
                }
            };
            return {
                baseUrl: this.$intfcUrl,
                ProjectID: localStorage.getItem('Bug_ProjectID'),
                TeamID: localStorage.getItem('Bug_TeamID'),
                Bug_LoginUser: JSON.parse(localStorage.getItem('Bug_LoginUser')),

                dialogCreatBugVisible: false,
                creatBug_form: {
                    PriorityLevel: '低',
                    ModuleID: null,
                    ProjectVerID: null,
                    ProcessingPerson: null,
                    NeedTime: '',
                    TaskType: '开发'
                },
                ProjectVer_options: [],
                Module_options: [],
                ProcessingPerson_options: [],
                radio2: 3,
                project_selected: '',

                options_project: [],
                activeIndex: '/bug/situation',
                isSendAllPeople: false,
                rules3: {
                    NeedTime: [
                        {validator: validatePass_NeedTime, trigger: 'blur'}
                    ],

                },
            }
        },

        beforeMount() {
            var self = this;
            console.log(self.$store.state.copy_bug_data);
            var copy_bug_data = self.$store.state.copy_bug_data;
            if(copy_bug_data) {
                self.creatBug_form = copy_bug_data;
                self.creatBug_form.ProcessingPerson = self.creatBug_form.ProcessingPerson_ID;
                self.dialogCreatBugVisible = true;
                self.$store.commit('updateCopy_bug_data', null);
            }

            self.activeIndex = self.$route.path;
        },
        mounted() {

            var self = this;
            self.GetProject();
            if (self.ProjectID) {
                // self.GetProjectVerson(self.ProjectID);
                // self.GetProjectModule(self.ProjectID);
                // self.GetMember(self.ProjectID, self.TeamID);
            }
        },
        methods: {
            dialogCreatBugVisibleClose() {
                var self = this;
                // 重置bug 提交表单
                self.creatBug_form = {
                    PriorityLevel: '低',
                    ModuleID: null,
                    ProjectVerID: null,
                    ProcessingPerson: null,
                    describeImageCotent: '',
                    NeedTime: '',
                    TaskType: '开发'
                };
                self.isSendAllPeople = false;
                self.$refs.numberValidateForm.resetFields();
            },
            dialogCreatBugVisibleOpen() {
                var self = this;

                self.creatBug_form.ModuleID = self.Module_options[0] && self.Module_options[0].ModuleID;
                self.creatBug_form.ProjectVerID = self.ProjectVer_options[0] && self.ProjectVer_options[0].ProjectVerID;
                self.creatBug_form.ProcessingPerson = self.Bug_LoginUser.EmployeeID;
                self.$nextTick(function () {

                })

            },

            // 改变所选项目
            project_selectedChange(value) {
                var self = this;
                var path = self.$route.path;
                var event = path.substr(path.lastIndexOf('/') + 1);
                // 同时保存TeamID 供GetMember接口使用
                self.options_project.forEach(function (v, i) {
                    if (v.ProjectID === value) {
                        localStorage.setItem('Bug_TeamID', v.TeamID);
                        self.TeamID = v.TeamID;
                        return;
                    }
                });
                custom_event.$emit(event, value);

                localStorage.setItem('Bug_ProjectID', value);
                self.ProjectID = value;
                // 项目变动需要 重新查询
                if (self.ProjectID) {
                    self.GetProjectVerson(self.ProjectID);
                    self.GetProjectModule(self.ProjectID);
                    self.GetMember(self.ProjectID, self.TeamID);
                }
            },
            // 获取当下为什么项目
            getProject_selected() {
                var self = this;
                var ProjectID = localStorage.getItem('Bug_ProjectID');
                var data = '';
                self.options_project.forEach(function (v, i) {
                    if (ProjectID == v.ProjectID) {
                        data = v.ProjectName;
                    }
                });
                self.project_selected = data;
            },
            handleSelect(key, keyPath) {
                var self = this;
                var path = self.$route.path;
                var event = path.substr(path.lastIndexOf('/') + 1);
                var key = key.substr(key.lastIndexOf('/') + 1);
                // 当是当前页面时，刷新
                if(event === key) {
                    custom_event.$emit(event, self.ProjectID);
                }
                console.log(key);
            },
            creatBug() {
                var self = this;
                self.dialogCreatBugVisible = true;
            },
            bugSubmit(formName) {
                var self = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var CompanyCode = JSON.parse(localStorage.getItem("Bug_LoginUser")).CompanyCode;
                        var EmployeeID = JSON.parse(localStorage.getItem("Bug_LoginUser")).EmployeeID;
                        var ProjectID = self.ProjectID;
                        if (CompanyCode && ProjectID) {
                            function HTMLEncode(html) {
                                var temp = document.createElement("div");
                                (temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html);
                                var output = temp.innerHTML;
                                temp = null;
                                return output;
                            }

                            var describeImageCotent = HTMLEncode(self.creatBug_form.describeImageCotent)
                            var jsondata = {
                                CompanyCode: CompanyCode,
                                ProjectID: ProjectID,
                                BugTitle: self.creatBug_form.BugTitle,
                                ProjectVerID: self.creatBug_form.ProjectVerID,
                                ModuleID: self.creatBug_form.ModuleID,
                                PriorityLevel: self.creatBug_form.PriorityLevel,
                                ProcessingPerson: self.creatBug_form.ProcessingPerson,
                                describeImageCotent: describeImageCotent,
                                // describeImageCotent: 'asdfas',
                                CMaker: EmployeeID,
                                BugState: '未修复',
                                NeedTime: self.creatBug_form.NeedTime,
                                TaskType: self.creatBug_form.TaskType || ''
                            };
                            if(EmployeeID == self.creatBug_form.ProcessingPerson) {
                                self.$confirm('是否确认安排你本人处理当前问题?', '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                    self.AddBugInfo(jsondata);
                                }).catch(() => {
                                });
                            }else {
                                self.AddBugInfo(jsondata);
                            }

                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
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
            GetProject() {
                var self = this;
                // self.$http.get(self.baseUrl + '/Services/BugManageServices.ashx?method=GetProject', {
                self.$http.get(self.baseUrl + '/static/data/GetProject.json', {
                    params: {},
                }).then(function (res) {
                    if (res.data.code > 0) {
                        self.options_project = res.data.data;
                        self.getProject_selected();
                        // localStorage.setItem('Bug_ProjectID', self.options_project[0].ProjectID);
                    } else {
                        self.options_project = [];
                        // localStorage.removeItem('Bug_ProjectID');
                    }
                }).catch(function (err) {

                });
            },
            // 创建bug
            AddBugInfo(jsondata) {
                var self = this;
                self.$http.post(self.baseUrl + '/Services/BugManageServices.ashx?method=AddBugInfo', {
                    jsondata: JSON.stringify(jsondata),
                }).then(function (res) {
                    if (res.data.code > 0) {
                        // 创建成功后 查询
                        var path = self.$route.path;
                        var event = path.substr(path.lastIndexOf('/') + 1);
                        custom_event.$emit(event, self.ProjectID);
                        // 发送邮件
                        self.SendEmail(jsondata.ProjectID, jsondata.ProcessingPerson, self.isSendAllPeople, res.data.data, 1);
                        self.dialogCreatBugVisible = false;
                        self.$message({
                            message: '创建成功',
                            type: 'success'
                        });
                    } else {
                        self.$message({
                            message: '创建失败',
                            type: 'error'
                        });
                    }
                }).catch(function (err) {
                    self.$message({
                        message: '创建失败',
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
                        self.ProcessingPerson_options = res.data.data;
                    } else {
                        self.ProcessingPerson_options = [];
                    }
                }).catch(function (err) {

                });
            },

        },
        watch: {
            ProjectID(newValue, oldValue) {
                // alert(newValue)
            },
            '$route'(newValue, oldValue) {
                this.activeIndex = newValue.path;
            }
        },
    }
</script>

<style scoped>
    .el-menu--horizontal {
        background-color: transparent;
        border-bottom: none;
    }

    .el-menu--horizontal > .el-menu-item.is-active {
        border-top: 2px solid #409EFF;
    }

    .el-menu--horizontal > .el-menu-item {
        line-height: 77px;
        height: 77px;
        width: 105px;
        padding: 0px;
        text-align: center;
        border-radius: 17px;
        box-shadow: 1px 1px 3px #ccc;
        margin-right: 10px;
        float: right;
        background-color: #fff;
    }

    .menu-icon-div {
        width: 51px;
        height: 51px;
        font-size: 35px;
        margin: -13px auto;
        color: #409eff;
    }

    .menu-icon {
        border-radius: 50%;
        box-shadow: 2px 2px 5px #a4a1a1;
        padding: 8px;
    }

    .menu-title {
        font-size: 13px;
        font-weight: 600;
        user-select: none
    }

    .myCreatBug {
        position: relative;
        display: inline-block;
        width: 30px;
        height: 30px;
    }

    .myCreatBug .bug-i {
        color: rgb(10, 174, 84);
        font-size: 28px;
        position: absolute;
        left: 11px;
    }

    .myCreatBug .plus-i {
        color: rgb(10, 174, 84);
        font-size: 15px;
        position: absolute;
        bottom: 3px;
        right: 6px;
    }

    .is-active .menu-title {
        color: #409eff;
    }

    .el-menu-item.is-active i {
        color: inherit !important;
    }

    .allBug {
        position: relative;
        width: 35px;
        height: 35px;
    }

    .allBug .bug-i-1 {
        position: absolute;
        top: 8px;
        left: 16px;
        transform: rotatez(-31deg);
        font-size: 15px;
    }

    .allBug .bug-i-2 {
        position: absolute;
        top: 15px;
        left: 26px;
        transform: rotatez(27deg);
        font-size: 18px;
    }

    .allBug .bug-i-3 {
        position: absolute;
        top: 23px;
        left: 10px;
        font-size: 23px;
        transform: rotatez(-46deg);
    }



    /*ceshi*/

    .el-row {
        margin-bottom: 20px;

    &
    :last-child {
        margin-bottom: 0;
    }

    }
    .el-col {
        border-radius: 4px;
    }

    .bg-purple-dark {
        background: #99a9bf;
    }

    .bg-purple {
        background: #d3dce6;
    }

    .bg-purple-light {
        background: #e5e9f2;
    }

    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }

    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
</style>
