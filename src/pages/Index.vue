<template>
    <div style="display: flex;">
        <div class="router-view-menu">
            <!--<el-menu default-active="situation" class="el-menu-vertical-demo" @select="handleSelect" @open="handleOpen"-->
                     <!--@close="handleClose" :collapse="isCollapse" :router="true" background-color="#545c64"-->
                     <!--text-color="#fff" active-text-color="#ffd04b">-->
                <!--<el-menu-item index="/bug"><i class="el-icon-location"></i><span slot="title">项目概况</span>-->
                <!--</el-menu-item>-->
                <!--&lt;!&ndash;<el-submenu index="1">&ndash;&gt;-->
                <!--&lt;!&ndash;<template slot="title">&ndash;&gt;-->
                <!--&lt;!&ndash;<i class="el-icon-location"></i>&ndash;&gt;-->
                <!--&lt;!&ndash;<span slot="title">项目概要</span>&ndash;&gt;-->
                <!--&lt;!&ndash;</template>&ndash;&gt;-->
                <!--&lt;!&ndash;<el-menu-item-group>&ndash;&gt;-->

                <!--&lt;!&ndash;</el-menu-item-group>&ndash;&gt;-->


                <!--&lt;!&ndash;<el-submenu index="1-4">&ndash;&gt;-->
                <!--&lt;!&ndash;<span slot="title">选项4</span>&ndash;&gt;-->
                <!--&lt;!&ndash;<el-menu-item index="1-4-1">选项1</el-menu-item>&ndash;&gt;-->
                <!--&lt;!&ndash;</el-submenu>&ndash;&gt;-->
                <!--&lt;!&ndash;</el-submenu>&ndash;&gt;-->
                <!--<el-menu-item index="">-->
                    <!--<i class="el-icon-menu"></i>-->
                    <!--<span slot="title">配置管理</span>-->
                <!--</el-menu-item>-->
                <!--<el-menu-item index="companyInfo">-->
                    <!--<i class="el-icon-menu"></i>-->
                    <!--<span slot="title">企业信息</span>-->
                <!--</el-menu-item>-->
                <!--<el-menu-item index="/knowledge">-->
                    <!--<i class="el-icon-menu"></i>-->
                    <!--<span slot="title">知识库</span>-->
                <!--</el-menu-item>-->
            <!--</el-menu>-->
        </div>
        <div class="router-view-content" style="flex: 1;">
            <div class="hearder">

                <el-row type="flex" class="row-bg" justify="space-between" style="padding-left: 15px;">
                    <el-col :span="6">
                        <!--<span @click="backPage"><i class="fa fa-bars"-->
                                                   <!--style="font-size: 21px;color: #909399;cursor: pointer;"></i></span>-->
                        <!--<span>项目名称</span>-->
                        <!--<span>项目名称 &#45;&#45; {{title}}</span>-->
                    </el-col>
                    <el-col :span="6" style="text-align: right">
                        <!--<span style="padding-right: 15px;"><el-button size="mini" @click="gotoKnowledge">知识库</el-button></span>-->
                        <el-dropdown trigger="click" @command="handleCommand" style="padding-right: 15px">
                             <span class="el-dropdown-link">
                                 项目<i class="el-icon-arrow-down el-icon-caret-bottom"></i>
                             </span>
                            <el-dropdown-menu slot="dropdown">
                                <!--<el-dropdown-item command="1">项目一</el-dropdown-item>-->
                                <!--<el-dropdown-item command="1" divided>项目二</el-dropdown-item>-->
                                <el-dropdown-item command="projectList" >项目中心</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <el-dropdown trigger="click" @command="handleCommand" style="padding-right: 15px">
                             <span class="el-dropdown-link">
                                 {{EmployeeNickName}}<i class="el-icon-arrow-down el-icon-caret-bottom"></i>
                             </span>
                            <el-dropdown-menu slot="dropdown">
                                <!--<el-dropdown-item command="0" divided disabled>{{EmployeeNickName}}</el-dropdown-item>-->
                                <el-dropdown-item command="mysettings" >个人设置</el-dropdown-item>
                                <el-dropdown-item command="myTeam">我的团队</el-dropdown-item>
                                <el-dropdown-item command="companyInfo">企业信息</el-dropdown-item>
                                <el-dropdown-item command="quit"><span style="color: #F56C6C">退出</span></el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-col>
                </el-row>
            </div>
            <router-view/>
        </div>
        <div>
            <el-dialog title="系统登录" :visible.sync="dialogCreatBugVisible"
                       @close="dialogCreatBugVisibleClose" width="34%">
                <div class="announcement-content">
                    <el-form :model="loginForm" status-icon ref="loginFormEl" label-width="70px" class="demo-ruleForm"
                             style="width: 370px">
                        <el-form-item label="帐号" prop="UserName"
                                      :rules="[{ required: true, message: '请输入帐号', trigger: 'blur' }]">
                            <el-input type="text" v-model="loginForm.UserName" @keyup.enter.native="submitForm('loginFormEl')" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="Password"
                                      :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
                            <el-input type="password" v-model="loginForm.Password" @keyup.enter.native="submitForm('loginFormEl')" auto-complete="off"></el-input>
                            <el-checkbox v-model="checkedPwd">记住密码</el-checkbox>
                        </el-form-item>
                        <el-form-item>
                            <el-button style="width: 100%;" type="primary" @click="submitForm('loginFormEl')">登录</el-button>
                        </el-form-item>
                    </el-form>
                </div>

            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "index",
        data() {
            return {
                baseUrl: this.$intfcUrl,

                EmployeeNickName: '',

                isCollapse: false,
                title: '',
                loginForm: {
                    UserName: null
                },
                checkedPwd: false

            }
        },
        computed: {
            dialogCreatBugVisible: {
                get: function () {
                    var self = this;
                    return self.$store.state.isRegister;
                },
                set: function () {
                }
            }
        },
        beforeMount() {
            var self = this;
            var Bug_LoginUser = JSON.parse(localStorage.getItem('Bug_LoginUser'));
            if(Bug_LoginUser) {
                self.loginForm.UserName =Bug_LoginUser.EmployeeAccount;
                self.loginForm.Password =Bug_LoginUser.EmployeePassword;
                self.checkedPwd = Bug_LoginUser.checkedPwd;
                self.EmployeeNickName = Bug_LoginUser.EmployeeNickName;
            }
        },
        methods: {
            backPage() {
                var self = this;
                self.isCollapse = !self.isCollapse;
                // self.$router.go(-1);
            },
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            },
            handleCommand(value) {
                if (value == 'mysettings') {
                    this.$router.push('/' + value);
                }
                if (value == 'myTeam') {
                    this.$router.push('/' + 'myteam');
                }
                if (value == 'projectList') {
                    this.$router.push('/' + value);
                }
                if (value == 'bugList') {
                    this.$router.push('/' + value);
                }
                if (value == 'quit') {
                    sessionStorage.removeItem('EmployeeInfo');
                    localStorage.removeItem('EmployeeInfo');
                    localStorage.removeItem('Bug_ProjectID');
                    this.$router.push({
                        path: '/login'
                    });
                }if (value == 'companyInfo') {
                    this.$router.push({
                        path: '/companyInfo'
                    });
                }

            },
            gotoKnowledge() {
                this.$router.push('/knowledge');
            },
            submitForm(formName) {
                var self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        self.$http.get(self.baseUrl + '/Services/BugManageServices.ashx?method=Login', {
                            params: {
                                UserName: self.loginForm.UserName,
                                Password: self.loginForm.Password
                            },
                        }).then(function (res) {
                            if(res.data.EmployeeInfo) {
                                if (res.data.EmployeeInfo.CompanyCode) {
                                    self.$store.commit('isRegisterChange', false);

                                    var configs = self.$store.state.response_configs;
                                    console.log(configs);
                                    configs.forEach(function (v,i) {
                                        if(v.params.method && v.params.method === 'GetBugForID') {
                                            window.location.reload(true);
                                        }
                                        // self.$http(v);
                                        if(i === configs.length -1) {
                                            // 清空conifg
                                            self.$store.commit('response_configClear');
                                        }
                                    });

                                    var loginUser = res.data.EmployeeInfo;
                                    sessionStorage.setItem('EmployeeInfo', JSON.stringify(res.data.EmployeeInfo));
                                    localStorage.setItem('EmployeeInfo', JSON.stringify(res.data.EmployeeInfo));
                                    if(self.checkedPwd) {
                                        loginUser.EmployeePassword = self.loginForm.Password;
                                        loginUser.checkedPwd = true;
                                    }else {
                                        loginUser.EmployeePassword = null;
                                        loginUser.checkedPwd = false;
                                    }
                                    localStorage.setItem('Bug_LoginUser', JSON.stringify(loginUser));
                                    console.log(JSON.parse(localStorage.getItem('Bug_LoginUser')).CompanyCode);
                                }
                            } else {
                                self.$message({
                                    message: '帐号或是密码错误',
                                    type: 'error'
                                });
                            }
                        }).catch(function (err) {
                            console.log(err);
                            self.$message({
                                message: '服务器繁忙，请稍候再试',
                                type: 'error'
                            });
                        });
                    } else {
                    }
                });
            },
            dialogCreatBugVisibleClose() {
                var self = this;
                self.$store.commit('isRegisterChange', false);
            }

        },
        watch: {

            '$route'(to, from) {
                var self = this;
                if (to.meta.title) {
                    self.title = to.meta.title;
                    console.log(to.meta.title);
                }
            }
        },
    }
</script>

<style scoped>
    .router-view-content {
    }

    .hearder {
        background-color: #ffffff;
        width: 100%;
        padding: 7px 0;
        font-size: 19px;
        line-height: 35px;
        border-bottom: 1px solid #e5e5e5;
        color: #767e8d;
    }

    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;
    }

    .el-dropdown-link {
        cursor: pointer;
        font-size: 16px;
    }
</style>
