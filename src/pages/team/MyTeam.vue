<template>
    <div>
        <!--<div class="table-card">-->
        <!--<el-card style="margin: 10px">-->
        <!--<div>-->
        <!--<label class="table-label">团队名称</label>-->
        <!--{{team_data.TeamName}}-->
        <!--</div>-->
        <!--<div>-->
        <!--<label class="table-label">Logo</label>-->
        <!--{{team_data.Logo}}-->
        <!--</div>-->
        <!--<div>-->
        <!--<label class="table-label">联系人</label>-->
        <!--{{team_data.Contacts}}-->
        <!--</div>-->
        <!--<div>-->
        <!--<label class="table-label">联系方式</label>-->
        <!--{{team_data.Telephone}}-->
        <!--</div>-->
        <!--<div>-->
        <!--<label class="table-label"></label>-->
        <!--<el-button size="mini" type="primary">修改</el-button>-->
        <!--</div>-->

        <!--</el-card>-->
        <!--</div>-->

        <div style="padding-top: 20px">
            <el-card style="margin: 10px">
                <div>
                    <el-row type="flex" class="row-bg" justify="space-between">
                        <el-col :span="6">
                            <span style="font-weight: 600">我的团队</span>
                        </el-col>
                        <el-col :span="6" style="text-align: right;padding-right: 10px;">
                            <el-button type="primary" @click="openAddTeam" v-if="IsAdministor == '是'">创建团队</el-button>
                        </el-col>
                    </el-row>
                </div>
                <el-table
                    :data="team_data"
                    v-loading="loading"
                    @expand-change="expandChange"
                    style="width: 98%">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <div style="display: flex">
                                <div style="flex: 1;">
                                    <el-table
                                        :data="props.row.TeamPersonData">
                                        <el-table-column
                                            prop="EmployeeNickName"
                                            label="昵称"
                                            width="180">
                                        </el-table-column>
                                        <el-table-column
                                            prop="EmployeeAccount"
                                            label="人员帐号"
                                            width="180">
                                        </el-table-column>
                                        <el-table-column
                                            prop="JoinDate"
                                            label="加入时间"
                                            width="180">
                                            <template slot-scope="scope">
                                                <span>{{scope.row.JoinDate | dateFormat}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            label="操作"
                                            v-if="IsAdministor == '是'"
                                            width="100">
                                            <template slot-scope="propss">
                                                <el-button size="mini" type="danger" plain
                                                           :disabled="propss.row.EmployeeAccount == propss.row.Account
                                                             || propss.row.EmployeeAccount == Loginer_Account"
                                                           @click="DeleteTeamPersonEV(propss.row,props.row.index)">删除
                                                </el-button>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            label="管理员"
                                            v-if="IsAdministor == '是'"
                                            width="80">
                                            <template slot-scope="propss">
                                                <el-checkbox v-model="propss.row.IsAdministor"
                                                             :data-EmployeeAccount="propss.row.EmployeeAccount"
                                                             @change="isAdministorChange"
                                                             :disabled="propss.row.EmployeeAccount == propss.row.Account
                                                             || propss.row.EmployeeAccount == Loginer_Account"></el-checkbox>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                                <div style="flex: 1;padding: 20px   " v-if="IsAdministor == '是'">
                                    <el-input size="small" style="width: 150px"
                                              :ref="'EmployeeAccount' + props.row.TeamID" placeholder="人员帐号"></el-input>
                                    <el-button size="mini" type="primary" @click="AddTeamPersonEV(props.row)">添加成员
                                    </el-button>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="TeamName"
                        label="团队名称"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="Logo"
                        label="Logo"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="Contacts"
                        label="地址">
                    </el-table-column>
                    <el-table-column
                        prop="Telephone"
                        label="联系方式">
                    </el-table-column>
                    <el-table-column
                        v-if="IsAdministor == '是'"
                        label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" @click="openEditTeam(scope.row)">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </div>
        <div>
            <el-dialog title="添加团队" :visible.sync="dialogAddTeamVisible">
                <el-form :model="addTeamForm" status-icon ref="addTeamForm" label-width="80px" class="demo-ruleForm"
                         style="width: 370px; margin: 0 auto;">
                    <el-form-item label="团队名称" prop="TeamName"
                                  :rules="[{ required: true, message: '团队名称不能为空',trigger: 'blur'}]">
                        <el-input v-model="addTeamForm.TeamName" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="Logo" prop="pass">
                        <el-input v-model="addTeamForm.Logo" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="联系人" prop="pass">
                        <el-input v-model="addTeamForm.Contacts" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话" prop="Telephone">
                        <el-input v-model.number="addTeamForm.Telephone" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitAddTeamForm('addTeamForm')">提交</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <el-dialog title="编辑团队" :visible.sync="dialogEditTeamVisible">
                <el-form :model="editTeamForm" status-icon ref="editTeamForm" label-width="80px" class="demo-ruleForm"
                         style="width: 370px; margin: 0 auto;">
                    <el-form-item label="团队名称" prop="TeamName"
                                  :rules="[{ required: true, message: '团队名称不能为空',trigger: 'blur'}]">
                        <el-input v-model="editTeamForm.TeamName" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="Logo" prop="pass">
                        <el-input v-model="editTeamForm.Logo" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="联系人" prop="pass">
                        <el-input v-model="editTeamForm.Contacts" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话" prop="checkPass">
                        <el-input v-model="editTeamForm.Telephone" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitEditTeamForm('editTeamForm')">提交</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    var {dateFormat} = require('../../assets/js/vue-filters')

    export default {
        name: "my-team",
        data() {
            return {
                baseUrl: this.$intfcUrl,
                IsAdministor: JSON.parse(localStorage.getItem('Bug_LoginUser')).IsAdministor,
                Loginer_Account: JSON.parse(localStorage.getItem('Bug_LoginUser')).EmployeeAccount,


                team_data: [],
                dialogAddTeamVisible: false,
                dialogEditTeamVisible: false,
                addTeamForm: {
                    Logo: '',
                    Telephone: '',
                    Contacts: '',
                },
                editTeamForm: {
                    Logo: '',
                    Telephone: '',
                    Contacts: '',
                },
                current_expand_count: 0,
                loading: true
            }
        },
        mounted() {
            var self = this;
            self.GetMyTeam();
        },
        methods: {
            // 管理员变更
            isAdministorChange(value, event) {
                var self = this;
                var EmployeeAccount = event.target.parentNode.parentNode.dataset.employeeaccount;
                self.IsAdministrator(value ? 1 : 0, EmployeeAccount);

                // console.log(event.target.parentNode);
                // var classes1 = [];
                // var classes2 = [];
                // var classList1 = event.target.parentNode.classList;
                // var classList2 = event.target.parentNode.parentNode.classList;
                // classList1.forEach(function (v,i) {
                //     classes1.push(v);
                // });
                // classList2.forEach(function (v,i) {
                //     classes2.push(v);
                // });
                // if(classes1.indexOf('is-checked') == -1) {
                //     classes1.push('is-checked')
                //     event.target.parentNode.classList.add('is-checked');
                //     event.target.parentNode.parentNode.classList.add('is-checked');
                // }else {
                //     event.target.parentNode.classList.remove('is-checked');
                //     event.target.parentNode.parentNode.classList.remove('is-checked');
                // }
                // console.log(classes1);
                // console.log(classes2);
                // self.$confirm('确定?', '提示', {
                //     confirmButtonText: '确定',
                //     cancelButtonText: '取消',
                //     type: 'warning'
                // }).then(() => {
                // }).catch(() => {
                //     value = false;
                // });
            },
            IsAdministrator(IsTrue, EmployeeAccount) {
                var self = this;
                self.$http.post(self.baseUrl + '/Services/BugManageServices.ashx', {
                    'method': 'IsAdministrator',
                    'IsTrue': IsTrue,
                    'EmployeeAccount': EmployeeAccount,
                }).then(function (res) {
                    if (res.data.code > 0) {
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
            expandChange(row, expandedRows) {
                var self = this;
                console.log(row);
                if (expandedRows.length > self.current_expand_count) {
                    self.GetTeamPerson(row.TeamID, row.index);
                }

                self.current_expand_count = expandedRows.length;

            },
            openAddTeam() {
                this.dialogAddTeamVisible = true;
            },
            openEditTeam(item) {
                this.editTeamForm = JSON.parse(JSON.stringify(item));
                this.dialogEditTeamVisible = true;
            },
            GetMyTeam() {
                var self = this;
                if (sessionStorage.getItem('EmployeeInfo')) {
                    self.loading = true;
                    // self.$http.get(self.baseUrl + '/Services/BugManageServices.ashx?method=GetMyTeam', {
                    self.$http.get(self.baseUrl + '/static/data/GetMyTeam.json', {
                        params: {
                            'CompanyCode': JSON.parse(sessionStorage.getItem('EmployeeInfo')).CompanyCode,
                        },
                    }).then(function (res) {
                        self.loading = false;
                        if (res.data.code > 0) {
                            res.data.data.forEach(function (v, i) {
                                v['index'] = i;
                                v['TeamPersonData'] = [];
                            });
                            self.team_data = res.data.data;
                        }

                    }).catch(function (err) {

                    });
                } else {
                    self.$message({
                        message: '登录已超时，请重新登录',
                        type: 'error'
                    });
                    self.$router.push('/' + 'login');
                }

            },
            GetTeamPerson(TeamID, index) {
                var self = this;
                // self.$http.get(self.baseUrl + '/Services/BugManageServices.ashx?method=GetTeamPerson', {
                self.$http.get(self.baseUrl + '/static/data/GetTeamPerson.json', {
                    params: {
                        'TeamID': TeamID,
                    },
                }).then(function (res) {
                    if (res.data.code > 0) {
                        var data = res.data.data;
                        var Account = ''; // 当前团队的创建人
                        self.team_data.forEach(function (v, i) {
                            if (v.TeamID == TeamID) {
                                Account = v.Account;
                            }
                        });
                        data.forEach(function (v, i) {
                            v['Account'] = Account;
                        });
                        self.team_data[index].TeamPersonData = data
                    } else {
                        self.team_data[index].TeamPersonData = [];
                    }

                }).catch(function (err) {

                });


            },
            submitAddTeamForm(formName) {
                var self = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        self.AddMyTeam();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            submitEditTeamForm(formName) {
                var self = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        self.Modify_MyTeam();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            AddMyTeam() {
                var self = this;
                self.$http.post(self.baseUrl + '/Services/BugManageServices.ashx', {
                    method: 'AddMyTeam',
                    jsondata: JSON.stringify(self.addTeamForm)
                })
                    .then(function (response) {
                        if (response.data.code > 0) {
                            self.GetMyTeam();
                            self.dialogAddTeamVisible = false;
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
                    })
                    .catch(function (error) {
                        self.$message({
                            message: '添加失败，请重试',
                            type: 'error'
                        });
                    });
            },
            Modify_MyTeam() {
                var self = this;
                self.$http.post(self.baseUrl + '/Services/BugManageServices.ashx', {
                    method: 'Modify_MyTeam',
                    jsondata: JSON.stringify(self.editTeamForm)
                })
                    .then(function (response) {
                        if (response.data.code > 0) {
                            self.GetMyTeam();
                            self.dialogEditTeamVisible = false;
                            self.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                        } else {
                            self.$message({
                                message: '修改失败，请重试',
                                type: 'error'
                            });
                        }
                    })
                    .catch(function (error) {
                        self.$message({
                            message: '修改失败，请重试',
                            type: 'error'
                        });
                    });
            },
            DeleteTeamPersonEV(row, index) {
                var self = this;
                self.$confirm('确定?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    self.DeleteTeamPerson(row, index);
                }).catch(() => {
                });
            },
            DeleteTeamPerson(row, index) {
                var self = this;
                self.$http.post(self.baseUrl + '/Services/BugManageServices.ashx', {
                    method: 'DeleteTeamPerson',
                    PersonDetailID: row.PersonDetailID
                }).then(function (res) {
                    if (res.data.code > 0) {
                        self.GetTeamPerson(row.TeamID, index);
                        self.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                    } else {
                        self.$message({
                            message: '删除失败，请重试',
                            type: 'error'
                        });
                    }
                }).catch(function (err) {
                    self.$message({
                        message: '删除失败，请重试',
                        type: 'error'
                    });
                });
            },
            AddTeamPersonEV(row) {
                var self = this;
                self.AddTeamPerson(row);
            },
            AddTeamPerson(row) {
                var self = this;
                var ref = 'EmployeeAccount' + row.TeamID;
                var data = self.$refs[ref].$refs.input.value;
                if (!data) {
                    self.$message({
                        message: '人员帐号不能为空',
                        type: 'error'
                    });
                    return;
                } else {
                    var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
                    if (!reg.test(data)) {
                        self.$message({
                            message: '帐号必须是邮箱，请确认',
                            type: 'error'
                        });
                        return;
                    }
                }
                self.$http.post(self.baseUrl + '/Services/BugManageServices.ashx', {
                    'method': 'AddTeamPerson',
                    'TeamID': row.TeamID,
                    'EmployeeAccount': data,
                }).then(function (res) {
                    if (res.data.code > 0) {
                        self.GetTeamPerson(row.TeamID, row.index);
                        self.$message({
                            message: '添加成功',
                            type: 'success'
                        });
                    } else {
                        self.$message({
                            message: res.data.error,
                            type: 'error'
                        });
                    }
                }).catch(function (err) {
                    self.$message({
                        message: '添加失败，请重试',
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
    .table-card .el-card__body > div {
        font-size: 14px;
        margin-bottom: 10px;
    }

    .table-label {
        text-align: left;
        width: 90px;
        margin-right: 35px;
        float: left;
    }
</style>
