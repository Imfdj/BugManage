<template>
    <div>
        <div class="login-wrap">
            <div class="login-title">系统登录</div>
            <el-form :model="loginForm" status-icon ref="loginFormEl" label-width="70px" class="demo-ruleForm"
                     style="width: 370px">
                <el-form-item label="帐号" prop="UserName"
                              :rules="[{ required: true, message: '请输入帐号', trigger: 'blur' }]">
                    <el-input type="text" v-model="loginForm.UserName" @keyup.enter.native="submitForm('loginFormEl')"
                              auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="Password"
                              :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
                    <el-input type="password" v-model="loginForm.Password"
                              @keyup.enter.native="submitForm('loginFormEl')" auto-complete="off"></el-input>
                    <el-checkbox v-model="checkedPwd">记住密码</el-checkbox>
                </el-form-item>
                <el-form-item>
                    <el-button style="width: 100%;" type="primary" @click="submitForm('loginFormEl')">登录</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button style="width: 100%;" type="primary" @click="openRegister">注册</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div>
            <el-dialog title="注册" :visible.sync="dialogRegisterVisible">
                <el-form :model="registerForm" status-icon ref="registerForm" label-width="80px" class="demo-ruleForm"
                         style="width: 370px; margin: 0 auto;">
                    <el-form-item label="邮箱账号" prop="AdministratorAccount"
                                  :rules="[{ required: true, message: '请输入邮箱账号', trigger: 'blur' },
                                  { type: 'email', message: '格式有误', trigger: 'blur' }]">
                        <el-input v-model="registerForm.AdministratorAccount" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="AdministratorPassword"
                                  :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
                        <el-input v-model="registerForm.AdministratorPassword" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="公司名称" prop="CompanyName"
                                  :rules="[{ required: true, message: '请输入公司名称', trigger: 'blur' }]">
                        <el-input v-model="registerForm.CompanyName" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="公司编号" prop="CompanyCode"
                                  :rules="[{ required: true, message: '请输入公司编号', trigger: 'blur' }]">
                        <el-input v-model="registerForm.CompanyCode" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="联系人" prop="checkPass">
                        <el-input v-model="registerForm.CompanyContacts" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="地址" prop="checkPass">
                        <el-input v-model="registerForm.CompanyAddress" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="电话" prop="checkPass">
                        <el-input v-model="registerForm.CompanyTelephone" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitRegisterForm('registerForm')">提交</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "login",
        data() {
            return {
                baseUrl: this.$intfcUrl,

                loginForm: {
                    UserName: null,
                    Password: null
                },
                dialogRegisterVisible: false,
                registerForm: {
                    CompanyContacts: '',
                    CompanyAddress: '',
                    CompanyTelephone: '',
                },
                checkedPwd: false
            }
        },
        beforeMount() {
            var self = this;
            var Bug_LoginUser = JSON.parse(localStorage.getItem('Bug_LoginUser'));
            if (Bug_LoginUser) {
                console.log(Bug_LoginUser);
                self.loginForm.UserName = Bug_LoginUser.EmployeeAccount;
                self.loginForm.Password = Bug_LoginUser.EmployeePassword;
                self.checkedPwd = Bug_LoginUser.checkedPwd;
            }
        },
        methods: {
            openRegister() {
                this.dialogRegisterVisible = true;
            },
            submitRegisterForm(formName) {
                var self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        self.$http.post(self.baseUrl + '/Services/registerServer.ashx', {
                            method: 'AddCompanyInfo',
                            jsondata: self.registerForm
                        }).then(function (res) {
                            if (res.data.code > 0) {
                                self.dialogRegisterVisible = false;
                                self.$message({
                                    message: '注册成功',
                                    type: 'success'
                                });
                            } else {
                                if (res.data.data == '该公司已经存在！') {
                                    self.$message({
                                        message: '公司编号已存在',
                                        type: 'error'
                                    });
                                } else {
                                    self.$message({
                                        message: '帐号已存在',
                                        type: 'error'
                                    });
                                }
                            }
                        }).catch(function (err) {
                            self.$message({
                                message: '服务器繁忙，请稍候再试',
                                type: 'error'
                            });
                        });
                    }
                });
            },
            submitForm(formName) {
                var self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        // self.$http.get(self.baseUrl + '/Services/BugManageServices.ashx?method=Login', {
                        self.$http.get(self.baseUrl + '/static/data/user.json', {
                            params: {
                                UserName: self.loginForm.UserName,
                                Password: self.loginForm.Password,
                            },
                        }).then(function (res) {
                            if (res.data.EmployeeInfo) {
                                if (res.data.EmployeeInfo.CompanyCode) {
                                    var loginUser = res.data.EmployeeInfo;
                                    var lastPath = sessionStorage.getItem('lastPath');
                                    sessionStorage.setItem('EmployeeInfo', JSON.stringify(res.data.EmployeeInfo));
                                    localStorage.setItem('EmployeeInfo', JSON.stringify(res.data.EmployeeInfo));
                                    if (self.checkedPwd) {
                                        loginUser.EmployeePassword = self.loginForm.Password;
                                        loginUser.checkedPwd = true;
                                    } else {
                                        loginUser.EmployeePassword = null;
                                        loginUser.checkedPwd = false;
                                    }
                                    localStorage.setItem('Bug_LoginUser', JSON.stringify(loginUser));
                                    console.log(JSON.parse(localStorage.getItem('Bug_LoginUser')).CompanyCode);

                                    // 如果是其他页面跳转到登录页面，转到lastPath
                                    if (lastPath) {
                                        self.$router.push(lastPath);
                                        sessionStorage.removeItem('lastPath')
                                    } else {
                                        self.$router.push('/' + 'projectList');
                                    }
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

        },
    }
</script>


<style scoped>
    .login-wrap {
        position: absolute;
        left: 0;
        right: 0;
        width: 400px;
        padding: 35px 35px 15px 35px;
        margin: 120px auto;
    }

    .login-title {
        font-size: 25px;
        text-align: center;
        margin-bottom: 15px;
        padding-left: 30px;
    }
</style>

