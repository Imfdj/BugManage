<template>
    <div style="padding: 30px 10px 10px 10px">
        <el-card>
            <div style="height: 40px;font-weight: 600">个人信息</div>
            <el-form :model="user_settings_parmas" status-icon ref="user_settings_parmas" label-width="100px"
                     class="demo-ruleForm"
                     style="width: 470px">
                <el-form-item label="帐号：" prop="EmployeeAccount"
                >
                    <div>
                        <span v-text="user_settings_parmas.EmployeeAccount" class="input-s" v-show="!isShow1"></span>
                        <el-button icon="el-icon-edit" type="primary" circle @click="isShow1 = true" v-show="isShow1"
                                   style="margin-left: 10px; padding: 10px;"></el-button>
                        <div v-show="isShow1">
                            <el-input :autofocus="true" v-model="user_settings_parmas.EmployeeAccount"
                                      style="width: 200px"></el-input>
                            <el-button icon="el-icon-check" type="primary"
                                       @click="EditClick(user_settings_parmas.EmployeeAccount, 1)"></el-button>
                            <el-button @click="isShow1 = false" icon="el-icon-close"></el-button>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="昵称：" prop="EmployeeNickName">
                    <div>
                        <span v-text="user_settings_parmas_edit.EmployeeNickName" class="input-s"
                              v-show="!isShow2"></span>
                        <el-button icon="el-icon-edit" type="primary" circle @click="isShow2 = true" v-show="!isShow2"
                                   style="margin-left: 10px; padding: 10px;"></el-button>
                        <div v-show="isShow2">
                            <el-input :autofocus="true" v-model="user_settings_parmas.EmployeeNickName"
                                      style="width: 200px"></el-input>
                            <el-button icon="el-icon-check" type="primary"
                                       @click="EditClick(user_settings_parmas.EmployeeNickName, 3)"></el-button>
                            <el-button @click="isShow2 = false" icon="el-icon-close"></el-button>
                        </div>
                    </div>
                </el-form-item>
                <!--<el-form-item label="职务" prop="pass">-->
                <!--<el-input type="text" v-model="user_settings_parmas.EmployeePosition" auto-complete="off"></el-input>-->
                <!--</el-form-item>-->
                <el-form-item label="修改密码：" prop="newpwd">
                    <el-input type="password" v-model="user_settings_parmas.newpwd" auto-complete="off" size="small" s
                              style="width: 250px"></el-input>
                    <el-button type="primary" @click="EditClick(user_settings_parmas.newpwd, 2)"
                               :disabled="!user_settings_parmas.newpwd" size="small">提交
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "user-settings",
        data() {
            return {
                baseUrl: this.$intfcUrl,

                user_settings_parmas: JSON.parse(sessionStorage.getItem('EmployeeInfo')),
                user_settings_parmas_edit: {},
                isShow1: false,
                isShow2: false,
            }
        },
        mounted() {
            this.user_settings_parmas_edit = JSON.parse(JSON.stringify(this.user_settings_parmas));
        },
        methods: {
            EditClick(value, mType) {
                var self = this;
                this.$refs.user_settings_parmas.validate((valid) => {
                    if (valid) {
                        self.ModifyPersonInfo(value, mType);
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            submitForm(formName) {
                var self = this;
                console.log(self.$store.state.personInfo);
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        self.ModifyPersonInfo();

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            ModifyPersonInfo(value, mType) {
                var self = this;
                if (!value) {
                    self.$message({
                        message: '不能为空',
                        type: 'error'
                    });
                    return;
                }
                self.$http.post(self.baseUrl + '/Services/BugManageServices.ashx', {
                    'method': 'ModifyPersonInfo',
                    'EmployeeID': self.user_settings_parmas.EmployeeID,
                    'NickName': mType == 3 ? value : '',
                    'newpwd': mType == 2 ? value : '',
                    'Account': mType == 1 ? value : '',
                    'mType': mType,
                }).then(function (res) {
                    if (res.data.code > 0) {
                        if (mType == 1) {
                            self.isShow1 = false;
                        } else if (mType == 3) {
                            self.isShow2 = false;
                        }
                        self.$message({
                            message: '修改成功,请重新登录',
                            type: 'success'
                        });
                        setTimeout(function () {
                            sessionStorage.removeItem('EmployeeInfo');
                            self.$router.push('/login')
                        }, 1000)
                    } else {
                        self.$message({
                            message: '修改失败，请重试',
                            type: 'error'
                        });
                    }
                }).catch(function (err) {
                    self.$message({
                        message: '修改失败，请重试',
                        type: 'error'
                    });
                });
            }
        },
    }
</script>

<style scoped>

</style>
