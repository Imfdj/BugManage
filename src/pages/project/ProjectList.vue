<template>
    <div style="padding-top: 20px;">
        <div style="padding: 10px;">
            <el-card>
                <el-row type="flex" class="row-bg" justify="space-between">
                    <el-col :span="6">
                        <span style="font-weight: 600">项目中心</span>
                    </el-col>
                    <el-col :span="6" style="text-align: right;padding-right: 10px;">
                        <el-button @click="GetProject" icon="el-icon-refresh"></el-button>
                        <el-button type="primary" @click="creatProject" v-if="IsAdministor == '是'">创建项目</el-button>
                    </el-col>
                </el-row>
                <div>
                    <el-table
                        :data="project_data"
                        v-loading="project_data_loading"
                        style="width: 98%;">
                        <el-table-column
                            prop="ProjectName"
                            label="项目名称">
                        </el-table-column>
                        <el-table-column
                            prop="JoinDate"
                            label="加入日期">
                            <template slot-scope="scope">
                                <span>{{scope.row.JoinDate | dateFormat}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="JoinDate"
                            label="待我处理">
                            <template slot-scope="scope">
                                <div style="font-size: 15px;font-weight: 600;">
                                    <span v-if="scope.row.bugCount == 0">{{scope.row.bugCount}}</span>
                                    <span style="color: red;" v-else>{{scope.row.bugCount}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="address"
                            label="操作">
                            <template slot-scope="scope">
                                <el-button size="small" @click="projectSelect(scope.row)">进入</el-button>
                                <!--<el-button type="text" size="small">退出项目</el-button>-->
                                <el-button type="primary" size="small" @click="projectEdit(scope.row)"
                                           v-if="IsAdministor == '是'">编辑
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div>
                    <el-dialog title="创建新项目" :visible.sync="dialogAddProjectVisible">
                        <el-form :model="addProjectForm" status-icon ref="addProjectForm" label-width="100px"
                                 class="demo-ruleForm"
                                 style="width: 670px">
                            <el-form-item label="当前团队" prop="TeamID"
                                          :rules="[{ required: true, message: '当前团队不能为空',trigger: 'change'}]">
                                <el-select v-model="addProjectForm.TeamID" @change="currentTeamChange"
                                           placeholder="请选择">
                                    <el-option
                                        v-for="item in current_team_options"
                                        :key="item.TeamID"
                                        :label="item.TeamName"
                                        :value="item.TeamID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="项目名称" prop="ProjectName"
                                          :rules="[{ required: true, message: '项目名称不能为空',trigger: 'blur'}]">
                                <el-input v-model="addProjectForm.ProjectName" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="人员选择" prop="persons">
                                <el-transfer v-model="addProjectForm.persons" :data="current_team_persons_options"
                                             :titles="['团队人员', '已选择人员']" @change="currentTeamPersonsChange"
                                ></el-transfer>
                            </el-form-item>
                            <el-form-item label="添加新成员" prop="new_persons">
                                <el-input v-model="addProjectForm.new_persons" placeholder="多个帐号请以空格隔开"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitaddProjectForm('addProjectForm')">提交</el-button>
                            </el-form-item>
                        </el-form>
                    </el-dialog>
                    <el-dialog title="编辑项目" :visible.sync="dialogEditProjectVisible" width="90%">
                        <div>
                            <div style="margin: 10px;">
                                <el-card>
                                    <el-form :model="editProjectForm" ref="ProjectNameValidateForm" label-width="90px"
                                             :inline-message="true"
                                             class="demo-ruleForm">
                                        <el-form-item
                                            label="项目名称"
                                            prop="ProjectName"
                                            style="margin: 0px"
                                            :rules="[{ required: true, message: '项目名称不能为空',trigger: 'blur'}]"
                                        >
                                            <el-input type="age" v-model="editProjectForm.ProjectName" size="mini"
                                                      auto-complete="off" style="width: 300px"></el-input>
                                            <el-button size="mini" type="primary"
                                                       @click="ModifyProjectClick('ProjectNameValidateForm')">保存
                                            </el-button>
                                        </el-form-item>
                                    </el-form>
                                </el-card>
                            </div>
                            <div style="display: flex;margin: 10px;">
                                <div style="margin-right: 10px">
                                    <el-card>
                                        <div style="flex: 1">
                                            <el-table
                                                :data="tableData_ProjectVerson"
                                                v-loading="loading_ProjectVerson"
                                                size="mini"
                                                style="width: 100%">
                                                <el-table-column
                                                    prop="ProjectVerNO"
                                                    label="版本"
                                                    width="350">
                                                    <template slot-scope="scope">
                                                <span>
                                                    <span v-show="!scope.row.inputShow" class="input-s"><span>{{scope.row.ProjectVerNO + ''}}</span><i
                                                        class="el-icon-edit input-s-i"></i></span>
                                                    <el-input :autofocus="true" v-show="scope.row.inputShow"
                                                              style="width: 200px"
                                                              v-model="scope.row.ProjectVerNO_edit"></el-input>
                                                    <span @click="scope.row.inputShow = true"></span>
                                                    <span v-show="scope.row.inputShow">
                                                        <el-button icon="el-icon-check" type="primary"
                                                                   @click="ProjectVersonEditClick(scope.row)"></el-button>
                                                        <el-button @click="scope.row.inputShow = false"
                                                                   icon="el-icon-close"></el-button>
                                                    </span>
                                                </span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column
                                                    label="修改"
                                                    width="50">
                                                    <template slot-scope="scope">
                                                        <el-button type="text" size="small"
                                                                   @click="scope.row.inputShow = true">
                                                            修改
                                                        </el-button>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column
                                                    label="删除">
                                                    <template slot-scope="scope">
                                                        <el-button type="text" size="small"
                                                                   @click="deleteVersionClick(scope.row.ProjectVerID)">
                                                            删除
                                                        </el-button>
                                                    </template>
                                                </el-table-column>
                                            </el-table>
                                            <div style="padding: 5px">
                                                <div v-show="addVersionParams.isShow" style="padding-bottom: 5px">
                                                    <el-input size="small"
                                                              style="width: 200px"
                                                              placeholder="请输入版本号"
                                                              v-model="addVersionParams.ProjectVerNO"></el-input>
                                                    <el-button icon="el-icon-check" type="primary" size="small"
                                                               @click="addVersionClick"></el-button>
                                                    <el-button @click="addVersionParams.isShow = false" size="small"
                                                               icon="el-icon-close"></el-button>
                                                </div>
                                                <el-button size="mini" type="primary"
                                                           @click="addVersionParams.isShow = true"
                                                           v-show="!addVersionParams.isShow">添加
                                                </el-button>
                                            </div>
                                        </div>
                                    </el-card>
                                </div>
                                <el-card>
                                    <div style="flex: 1;">
                                        <el-table
                                            :data="tableData_ProjectModule"
                                            size="mini"
                                            v-loading="loading_ProjectModule"
                                            style="width: 100%">
                                            <el-table-column
                                                prop="ModuleName"
                                                label="模块"
                                                width="150">
                                                <template slot-scope="scope">
                                                <span>
                                                    <span v-show="!scope.row.inputShow" class="input-s"><span>{{scope.row.ModuleName + ''}}</span><i
                                                        class="el-icon-edit input-s-i"></i></span>
                                                    <el-input :autofocus="true" v-show="scope.row.inputShow"
                                                              style="width: 130px"
                                                              v-model="scope.row.ModuleName_edit"></el-input>
                                                    <span @click="scope.row.inputShow = true"></span>
                                                </span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                prop="ProcessingPerson"
                                                label="处理人"
                                                width="300">
                                                <template slot-scope="scope">
                                                <span>
                                                    <span v-show="!scope.row.inputShow" class="input-s"><span>{{scope.row.ProcessingPerson + ''}}</span><i
                                                        class="el-icon-edit input-s-i"></i></span>
                                                    <el-select v-model="scope.row.ProcessingPerson_ID" placeholder="请选择"
                                                               v-show="scope.row.inputShow" style="width: 150px">
                                                        <el-option
                                                            v-for="item in MemberData"
                                                            :key="item.MemberID"
                                                            :label="item.EmployeeNickName"
                                                            :value="item.EmployeeID">
                                                        </el-option>
                                                    </el-select>
                                                    <span @click="scope.row.inputShow = true"></span>
                                                    <span v-show="scope.row.inputShow">
                                                        <el-button icon="el-icon-check" type="primary"
                                                                   @click="ProjectModuleEditClick(scope.row)"></el-button>
                                                        <el-button @click="scope.row.inputShow = false"
                                                                   icon="el-icon-close"></el-button>
                                                    </span>
                                                </span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                label="修改"
                                                width="50">
                                                <template slot-scope="scope">
                                                    <el-button type="text" size="small"
                                                               @click="scope.row.inputShow = true">修改
                                                    </el-button>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                label="删除">
                                                <template slot-scope="scope">
                                                    <el-button type="text" size="small"
                                                               @click="deleteModuleClick(scope.row.ModuleID)">删除
                                                    </el-button>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                        <div style="padding: 5px">
                                            <div v-show="addModuleParams.isShow" style="padding-bottom: 5px">
                                                <el-input size="small"
                                                          style="width: 200px"
                                                          placeholder="请输入模块名"
                                                          v-model="addModuleParams.ModuleName"></el-input>
                                                <el-select v-model="addModuleParams.ProcessingPerson" size="small"
                                                           placeholder="请选择处理人" style="width: 150px">
                                                    <el-option
                                                        v-for="item in MemberData"
                                                        :key="item.MemberID"
                                                        :label="item.EmployeeNickName"
                                                        :value="item.EmployeeID">
                                                    </el-option>
                                                </el-select>
                                                <el-button icon="el-icon-check" type="primary" size="small"
                                                           @click="addModuleClick"></el-button>
                                                <el-button @click="addModuleParams.isShow = false" size="small"
                                                           icon="el-icon-close"></el-button>
                                            </div>
                                            <el-button size="mini" type="primary"
                                                       @click="addModuleParams.isShow = true"
                                                       v-show="!addModuleParams.isShow">添加
                                            </el-button>
                                        </div>
                                    </div>
                                </el-card>
                            </div>
                            <div style="margin: 10px;">
                                <el-card>

                                    <div style="display: flex">
                                        <div style="flex: 1">
                                            <div>项目人员</div>
                                            <div>
                                                <el-transfer v-model="editProjectFormPersons"
                                                             :data="current_team_persons_options_edit"
                                                             :titles="['团队人员', '已选择人员']"
                                                             @change="currentTeamPersonsChangeEdit"
                                                ></el-transfer>
                                            </div>
                                        </div>
                                        <div style="flex: 1">
                                            <div style="line-height: 50px">添加项目成员</div>
                                            <div>
                                                <el-input width="200px"
                                                          placeholder="多个帐号请以空格隔开"
                                                          v-model="editProjectForm.pushPersons"></el-input>
                                                <el-button @click="AddMemberClick" size="small" type="primary"
                                                           style="margin-top: 20px">提交
                                                </el-button>
                                            </div>
                                        </div>
                                    </div>
                                </el-card>

                            </div>
                        </div>
                    </el-dialog>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
    var {dateFormat} = require('../../assets/js/vue-filters')

    var _ = require('lodash');
    export default {
        name: "project-list",
        components: {},
        data() {
            return {
                baseUrl: this.$intfcUrl,
                ProjectID: '',
                TeamID: '',
                CompanyCode: JSON.parse(localStorage.getItem('Bug_LoginUser')).CompanyCode,
                IsAdministor: JSON.parse(localStorage.getItem('Bug_LoginUser')).IsAdministor,

                project_data: [],
                project_data_loading: false,
                dialogAddProjectVisible: false,
                dialogEditProjectVisible: false,
                addProjectForm: {
                    persons: []
                },
                current_team_options: [],
                current_team_persons_options: [],
                current_team_persons_options_edit: [],
                // 编辑
                editProjectForm: {
                    persons: []
                },
                addVersionParams: {
                    isShow: false
                },
                addModuleParams: {
                    isShow: false
                },
                currentProjectRow: {},
                editProjectFormPersons: [],
                MemberData: [],
                tableData_ProjectVerson: [],
                loading_ProjectVerson: false,
                tableData_ProjectModule: [],
                loading_ProjectModule: false,

                isMounted: null

            }
        },
        mounted() {
            var self = this;
            self.isMounted = true;
            self.GetProject();
        },
        methods: {
            deleteVersionClick(ProjectVerID) {
                var self = this;
                self.$confirm('确定?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    self.deleteProjectVerson(ProjectVerID);
                }).catch(() => {
                });
            },
            deleteProjectVerson(ProjectVerID) {
                var self = this;
                self.$http.post(self.baseUrl + '/Services/BugManageServices.ashx', {
                    'method': 'deleteProjectVerson',
                    'ProjectVerID': ProjectVerID,
                }).then(function (res) {
                    if (res.data.code > 0) {
                        self.GetProjectVerson(self.ProjectID);
                        self.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                    } else {
                        self.$message({
                            message: '删除失败',
                            type: 'success'
                        });
                    }
                }).catch(function (err) {
                    self.$message({
                        message: '删除失败',
                        type: 'success'
                    });
                });
            },
            deleteModuleClick(ModuleID) {
                var self = this;
                self.$confirm('确定?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    self.DeleteProjectModule(ModuleID);
                }).catch(() => {
                });
            },
            DeleteProjectModule(ModuleID) {
                var self = this;
                self.$http.post(self.baseUrl + '/Services/BugManageServices.ashx', {
                    'method': 'DeleteProjectModule',
                    'ModuleID': ModuleID,
                }).then(function (res) {
                    if (res.data.code > 0) {
                        self.GetProjectModule(self.ProjectID);
                        self.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                    } else {
                        self.$message({
                            message: '删除失败',
                            type: 'success'
                        });
                    }
                }).catch(function (err) {
                    self.$message({
                        message: '删除失败',
                        type: 'success'
                    });
                });
            },
            addVersionClick() {
                var self = this;
                if (!self.addVersionParams.ProjectVerNO) {
                    self.$message({
                        message: '版本号不能为空',
                        type: 'error'
                    });
                    return;
                }
                self.$http.post(self.baseUrl + '/Services/BugManageServices.ashx', {
                    'method': 'AddProjectVerson',
                    'ProjectID': self.ProjectID,
                    'ProjectVerNO': self.addVersionParams.ProjectVerNO,
                }).then(function (res) {
                    if (res.data.code > 0) {
                        self.GetProjectVerson(self.ProjectID);
                        self.$message({
                            message: '添加成功',
                            type: 'success'
                        });
                    } else {
                        self.$message({
                            message: '添加失败',
                            type: 'error'
                        });
                    }
                }).catch(function (err) {
                    self.$message({
                        message: '添加失败',
                        type: 'error'
                    });
                });
            },
            addModuleClick() {
                var self = this;
                if (!self.addModuleParams.ModuleName) {
                    self.$message({
                        message: '模块名不能为空',
                        type: 'error'
                    });
                    return;
                }
                if (!self.addModuleParams.ProcessingPerson) {
                    self.$message({
                        message: '请选择处理人',
                        type: 'error'
                    });
                    return;
                }
                self.$http.post(self.baseUrl + '/Services/BugManageServices.ashx', {
                    'method': 'AddProjectModule',
                    'ProjectID': self.ProjectID,
                    'ModuleName': self.addModuleParams.ModuleName,
                    'ProcessingPerson': self.addModuleParams.ProcessingPerson,
                }).then(function (res) {
                    if (res.data.code > 0) {
                        self.GetProjectModule(self.ProjectID);
                        self.$message({
                            message: '添加成功',
                            type: 'success'
                        });
                    } else {
                        self.$message({
                            message: '添加失败',
                            type: 'error'
                        });
                    }
                }).catch(function (err) {
                    self.$message({
                        message: '添加失败',
                        type: 'error'
                    });
                });
            },
            //修改项目
            ModifyProjectClick(formName) {
                var self = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var jsonData = {
                            ProjectID: self.ProjectID,
                            CompanyCode: self.CompanyCode,
                            ProjectName: self.editProjectForm.ProjectName,
                        };
                        self.ModifyProject(jsonData);
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            // 修改版本click
            ProjectVersonEditClick(row) {
                var self = this;
                if (!row.ProjectVerNO) {
                    self.$message({
                        message: '版本号不能为空',
                        type: 'error'
                    });
                    return;
                }
                self.$http.post(self.baseUrl + '/Services/BugManageServices.ashx', {
                    'method': 'ModifyProjectVerson',
                    'ProjectVerID': row.ProjectVerID,
                    'ProjectID': row.ProjectID,
                    'ProjectVerNO': row.ProjectVerNO_edit
                }).then(function (res) {
                    if (res.data.code > 0) {
                        self.GetProjectVerson(self.ProjectID);
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
            // 修改模块click
            ProjectModuleEditClick(row) {
                var self = this;
                if (!row.ModuleName) {
                    self.$message({
                        message: '模块名不能为空',
                        type: 'error'
                    });
                    return;
                }
                self.$http.post(self.baseUrl + '/Services/BugManageServices.ashx', {
                    'method': 'ModifyProjectModule',
                    'ModuleID': row.ModuleID,
                    'ProjectID': row.ProjectID,
                    'ModuleName': row.ModuleName_edit,
                    'ProcessingPerson': row.ProcessingPerson_ID
                }).then(function (res) {
                    if (res.data.code > 0) {
                        self.GetProjectModule(self.ProjectID);
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
            creatProject() {
                this.dialogAddProjectVisible = true;
                this.current_team_persons_options = [];
                // this.$router.push('/' + 'CreatProject');
                this.GetMyTeam();
            },
            // 选择团队人员变更
            currentTeamPersonsChange(value, s, d) {
                console.log(value);
                console.log(s);
                console.log(d);
                var self = this;
                var data = [];
                self.current_team_persons_options.forEach(function (v, i) {
                    value.forEach(function (vv, ii) {
                        if (v.key == vv) {
                            data.push(v.label)
                        }
                    })
                });
                self.addProjectForm.persons_new = data;
            },
            // 编辑 选择团队人员变更
            currentTeamPersonsChangeEdit(v, s, d) {
                console.log(v);
                console.log(s);
                console.log(d);
                var self = this;
                self.editProjectForm.persons = [];
                d.forEach(function (v, i) {
                    self.editProjectForm.persons.push(v);
                })
                if (s == 'left') {
                    console.log(d);
                    d.forEach(function (v, i) {
                        self.MemberData.forEach(function (vv, ii) {
                            if (vv.PersonDetailID == v) {
                                console.log(vv.MemberID);
                                self.DeleteMember(vv.MemberID);
                                return false;
                            }
                        })
                    });
                } else {
                    var ProjectID = self.currentProjectRow.ProjectID;
                    // console.log(self.editProjectForm.persons);
                    // console.log(self.current_team_persons_options);
                    var EmployeeAccounts = [];
                    var EmployeeNickNames = [];
                    var jsonData = [];
                    self.editProjectForm.persons.forEach(function (v, i) {
                        self.current_team_persons_options.forEach(function (vv, ii) {
                            if (vv.key == v) {
                                EmployeeNickNames.push(vv.label)
                            }
                        })
                    });
                    // 将穿梭框值的昵称转变为 帐号
                    EmployeeNickNames.forEach(function (v, i) {
                        self.current_team_persons_options.forEach(function (vv, ii) {
                            if (v == vv.EmployeeNickName) {
                                EmployeeAccounts.push(vv.EmployeeAccount);
                                return false;
                            }
                        })
                    })
                    EmployeeAccounts.forEach(function (v, i) {
                        jsonData.push({
                            "ProjectID": ProjectID,
                            "EmployeeAccount": v
                        })
                    });
                    self.AddMember(jsonData);
                }


            },
            // 团队变更
            currentTeamChange(v) {
                var self = this;
                self.GetTeamPerson(v);
            },
            // 获取团队人员
            GetTeamPerson(id) {
                var self = this;
                self.$http.get(self.baseUrl + '/Services/BugManageServices.ashx?', {
                    params: {
                        'method': 'GetTeamPerson',
                        'TeamID': id,
                    },
                }).then(function (res) {
                    if (res.data.code > 0) {
                        const data = [];
                        const data_edit = [];
                        res.data.data.forEach(function (v, i) {
                            if (v.EmployeeAccount == JSON.parse(localStorage.getItem('Bug_LoginUser')).EmployeeAccount) {
                                self.addProjectForm.persons = [v.PersonDetailID];
                            }
                        });
                        res.data.data.forEach(function (v, i) {
                            data_edit.push({
                                key: v.PersonDetailID,
                                label: v.EmployeeNickName,
                                // disabled: v.IsAdministor,
                                disabled: v.PersonDetailID == self.addProjectForm.persons,
                                EmployeeAccount: v.EmployeeAccount,
                                EmployeeNickName: v.EmployeeNickName
                            });
                            data.push({
                                key: v.PersonDetailID,
                                label: v.EmployeeNickName,
                                disabled: v.PersonDetailID == self.addProjectForm.persons,
                                EmployeeAccount: v.EmployeeAccount,
                                EmployeeNickName: v.EmployeeNickName
                            });
                        });
                        console.log(self.addProjectForm.persons);
                        console.log(data);
                        self.current_team_persons_options = data;
                        self.current_team_persons_options_edit = data_edit;
                    } else {
                        self.current_team_persons_options = [];
                    }
                }).catch(function (err) {

                });
            },
            // 获取团队信息
            GetMyTeam() {
                var self = this;
                self.$http.get(self.baseUrl + '/Services/BugManageServices.ashx?', {
                    params: {
                        'method': 'GetMyTeam',
                        'method': 'GetMyTeam',
                        'method': 'GetMyTeam',
                        'method': 'GetMyTeam',
                    },
                }).then(function (res) {
                    console.log(res.data);
                    if (res.data.code > 0) {
                        self.current_team_options = res.data.data;
                    }
                }).catch(function (err) {

                });
            },
            projectEdit(row) {
                // this.$router.push('/' + 'projectEdit');
                var self = this;
                self.ProjectID = row.ProjectID;
                self.TeamID = row.TeamID;
                self.GetTeamPerson(self.TeamID);
                self.GetMember(self.ProjectID, self.TeamID);
                self.GetProjectVerson(self.ProjectID);
                self.GetProjectModule(self.ProjectID);
                self.dialogEditProjectVisible = true;
                self.currentProjectRow = row;
                self.editProjectForm.ProjectName = row.ProjectName;
            },
            projectSelect(row) {
                var self = this;
                localStorage.setItem('Bug_ProjectID', row.ProjectID);
                localStorage.setItem('Bug_TeamID', row.TeamID);
                if(row.bugCount > 0) {
                    self.$router.push('/bug/myDispose');
                }else {
                    self.$router.push('/bug/situation');
                }
            },
            GetProject() {
                var self = this;
                self.project_data_loading = true;
                // self.$http.get(self.baseUrl + '/Services/BugManageServices.ashx?', {
                self.$http.get(self.baseUrl + '/static/data/GetProject.json', {
                    params: {
                        'method': 'GetProject',
                        'CompanyCode': self.CompanyCode,
                    },
                }).then(function (res) {
                    self.project_data_loading = false;
                    console.log(res.data);
                    if (res.data.code > 0) {
                        self.project_data = res.data.data;

                        var bugCount_project = [];
                        self.project_data.forEach(function (v, i) {
                            if(v.bugCount > 0) {
                                bugCount_project.push(v);
                            }
                        })
                        // 如果只有一个处理项目，并且是刚登录，条转到分配给我的
                        if(bugCount_project.length === 1 && !localStorage.getItem('Bug_ProjectID')) {
                            localStorage.setItem('Bug_ProjectID', bugCount_project[0].ProjectID);
                            localStorage.setItem('Bug_TeamID', bugCount_project[0].TeamID);
                            self.$router.push('/bug/myDispose');
                        }
                    }
                }).catch(function (err) {

                });
            },
            submitaddProjectForm(formName) {
                var self = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        self.AddProject();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            AddProject() {
                var self = this;
                // 输入框
                var new_persons = self.addProjectForm.new_persons;
                // 穿梭框
                var persons_new = self.addProjectForm.persons_new;
                console.log(new_persons);
                console.log(persons_new);
                var json = [];
                var EmployeeAccounts = [];
                var Account = JSON.parse(localStorage.getItem('Bug_LoginUser')).EmployeeAccount;
                var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
                var isReturn = false;

                persons_new = _.uniq(persons_new);
                persons_new = _.compact(persons_new)
                // 将穿梭框值的昵称转变为 帐号
                persons_new.forEach(function (v, i) {
                    self.current_team_persons_options.forEach(function (vv, ii) {
                        if (v == vv.EmployeeNickName) {
                            EmployeeAccounts.push(vv.EmployeeAccount);
                            return false;
                        }
                    })
                })
                // 剔除当前创建者帐号
                var index = EmployeeAccounts.indexOf(Account);
                EmployeeAccounts.splice(index, 1);
                if (new_persons) {
                    var data = new_persons.split(' ');
                    data.forEach(function (v, i) {
                        if (!reg.test(v)) {
                            self.$message({
                                message: '帐号必须是邮箱，请确认',
                                type: 'error'
                            });
                            isReturn = true;
                            return false;
                        }
                        EmployeeAccounts.push(v)
                    })
                }
                if (isReturn) {
                    return;
                }
                console.log(EmployeeAccounts);

                // 将数组转为提交json格式
                EmployeeAccounts.forEach(function (v, i) {
                    json.push({
                        "EmployeeAccount": v
                    })
                });
                self.$http.post(self.baseUrl + '/Services/BugManageServices.ashx', {
                    'method': 'AddProject',
                    'TeamID': self.addProjectForm.TeamID,
                    'ProjectName': self.addProjectForm.ProjectName,
                    'json': JSON.stringify(json),
                }).then(function (res) {
                    if (res.data.code > 0) {
                        self.GetProject();
                        self.$message({
                            message: '创建成功',
                            type: 'success'
                        });
                        self.dialogAddProjectVisible = false;
                    } else {
                        self.$message({
                            message: '创建失败，请重试',
                            type: 'error'
                        });
                    }
                }).catch(function (err) {
                    self.$message({
                        message: '创建失败，请重试',
                        type: 'error'
                    });
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
                        self.editProjectFormPersons = [];
                        res.data.data.forEach(function (v, i) {
                            self.editProjectFormPersons.push(v.PersonDetailID);
                        });
                        self.MemberData = res.data.data;
                        console.log(res.data.data);
                    }
                }).catch(function (err) {

                });
            },
            // 成员修改click
            AddMemberClick() {
                var self = this;
                var pushPersons = self.editProjectForm.pushPersons;
                var EmployeeAccounts = [];
                var jsonData = [];
                var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
                var isReturn = false;
                if (pushPersons) {
                    var data = pushPersons.split(' ');
                    data.forEach(function (v, i) {
                        if (!reg.test(v)) {
                            self.$message({
                                message: '帐号必须是邮箱，请确认',
                                type: 'error'
                            });
                            isReturn = true;
                            return false;
                        }
                        EmployeeAccounts.push(v)
                    })
                }
                if (isReturn) {
                    return;
                }
                EmployeeAccounts.forEach(function (v, i) {
                    jsonData.push({
                        "ProjectID": self.ProjectID,
                        "EmployeeAccount": v
                    })
                });
                if (jsonData.length > 0) {
                    // 同时添加团队成员和项目成员
                    self.AddMember(jsonData, callback);

                    function callback() {
                        console.log(EmployeeAccounts);
                        EmployeeAccounts.forEach(function (v, i) {
                            self.AddTeamPerson(self.TeamID, v);
                        });
                    }
                } else {
                    self.$message({
                        message: '请输入成员帐号',
                        type: 'error'
                    });
                }
            },
            // 添加团队成员
            AddTeamPerson(TeamID, EmployeeAccount) {
                var self = this;
                self.$http.post(self.baseUrl + '/Services/BugManageServices.ashx', {
                    'method': 'AddTeamPerson',
                    'TeamID': TeamID,
                    'EmployeeAccount': EmployeeAccount
                }).then(function (res) {
                    if (res.data.code > 0) {
                        self.GetTeamPerson(self.TeamID);
                        self.GetMember(self.ProjectID, self.TeamID);
                    } else {
                        self.GetTeamPerson(self.TeamID);
                        self.GetMember(self.ProjectID, self.TeamID);
                    }
                }).catch(function (err) {
                    // self.$message({
                    //     message: '添加失败，请重试',
                    //     type: 'error'
                    // });
                });
            },
            // 添加项目成员
            AddMember(jsonData, callback) {
                var self = this;
                self.$http.post(self.baseUrl + '/Services/BugManageServices.ashx', {
                    'method': 'AddMember',
                    'json': JSON.stringify(jsonData)
                }).then(function (res) {
                    if (res.data.code > 0) {
                        if (callback) {
                            callback();
                        }
                        self.$message({
                            message: '添加成功',
                            type: 'success'
                        });
                    } else {
                        self.$message({
                            message: '添加失败，请重试',
                            type: 'error'
                        });
                    }
                }).catch(function (err) {
                    self.$message({
                        message: '添加失败，请重试',
                        type: 'error'
                    });
                });
            },
            DeleteMember(MemberID) {
                var self = this;
                self.$http.post(self.baseUrl + '/Services/BugManageServices.ashx', {
                    'method': 'DeleteMember',
                    'MemberID': MemberID
                }).then(function (res) {
                    if (res.data.code > 0) {
                        self.$message({
                            message: '移除成功',
                            type: 'success'
                        });
                    } else {
                        self.$message({
                            message: '移除失败，请重试',
                            type: 'error'
                        });
                    }
                }).catch(function (err) {
                    self.$message({
                        message: '移除失败，请重试',
                        type: 'error'
                    });
                });
            },
            // 获取项目版本
            GetProjectVerson(ProjectID) {
                var self = this;
                self.loading_ProjectVerson = true;
                self.$http.get(self.baseUrl + '/Services/BugAssignServices.ashx?', {
                    params: {
                        'method': 'GetProjectVerson',
                        'ProjectID': ProjectID
                    },
                }).then(function (res) {
                    self.loading_ProjectVerson = false;
                    if (res.data.code > 0) {
                        res.data.data.forEach(function (v, i) {
                            v.inputShow = false;
                            v.ProjectVerNO_edit = v.ProjectVerNO;
                        });
                        self.tableData_ProjectVerson = res.data.data;
                    } else {
                        self.tableData_ProjectVerson = [];
                    }
                }).catch(function (err) {

                });
            },
            // 获取项目模板
            GetProjectModule(ProjectID) {
                var self = this;
                self.loading_ProjectModule = true;
                self.$http.get(self.baseUrl + '/Services/BugAssignServices.ashx?', {
                    params: {
                        'method': 'GetProjectModule',
                        'ProjectID': ProjectID
                    },
                }).then(function (res) {
                    self.loading_ProjectModule = false;
                    if (res.data.code > 0) {
                        res.data.data.forEach(function (v, i) {
                            v.inputShow = false;
                            v.ModuleName_edit = v.ModuleName;
                        })
                        self.tableData_ProjectModule = res.data.data;
                    } else {
                        self.tableData_ProjectModule = [];
                    }
                }).catch(function (err) {

                });
            },
            // 修改项目
            ModifyProject(jsondata) {
                var self = this;
                self.$http.post(self.baseUrl + '/Services/BugManageServices.ashx', {
                    'method': 'ModifyProject',
                    'jsondata': JSON.stringify(jsondata)
                }).then(function (res) {
                    if (res.data.code > 0) {
                        self.GetProject();
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
            }
        },
        filters: {
            dateFormat

        }
    }
</script>

<style scoped>
    .input-s {
        position: relative;
        -webkit-appearance: none;
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: #606266;
        border: 1px solid #fff;
        display: inline-block;
        font-size: inherit;
        height: 40px;
        line-height: 40px;
        outline: 0;
        padding: 0 15px;
        -webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
        transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
        width: 100%;
        width: 200px
    }

    .input-s-i {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 8px;
        display: none;
    }

    /*.input-s:hover {*/
    /*border: 1px solid #dcdfe6;*/
    /*}*/
    /*.input-s:hover .input-s-i {*/
    /*display: inline-block;*/
    /*}*/
</style>
