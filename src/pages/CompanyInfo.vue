<template>
    <div style="padding: 30px 10px 10px 10px">
        <el-card>
            <div style="height: 40px;font-weight: 600">企业信息</div>
            <el-form :model="CompamyInfoData" status-icon ref="CompamyInfoData" label-width="100px"
                     class="demo-ruleForm"
                     style="width: 370px">
                <el-form-item label="公司名称" prop="CompanyName"
                              :rules="[ { required: true, message: '请输入公司名称', trigger: 'blur' }]">
                    <el-input type="text" v-model="CompamyInfoData.CompanyName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="CompanyContacts">
                    <el-input type="text" v-model="CompamyInfoData.CompanyContacts" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="CompanyAddress">
                    <el-input type="text" v-model="CompamyInfoData.CompanyAddress" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="CompanyTelephone">
                    <el-input type="text" v-model="CompamyInfoData.CompanyTelephone" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('CompamyInfoData')">提交</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "company-info",
        data() {
            return {
                baseUrl: this.$intfcUrl,

                CompamyInfoData: {},
            }
        },
        beforeMount() {
            var self = this;
            self.GetCompamyInfo();
        },
        methods: {
            submitForm(formName) {
                var self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        var jsondata = {
                            ID: self.CompamyInfoData.ID,
                            CompanyCode: self.CompamyInfoData.CompanyCode,
                            CompanyName: self.CompamyInfoData.CompanyName,
                            CompanyContacts: self.CompamyInfoData.CompanyContacts,
                            CompanyAddress: self.CompamyInfoData.CompanyAddress,
                            CompanyTelephone: self.CompamyInfoData.CompanyTelephone,
                        };
                        self.ModifyCompanyInfo(jsondata);
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            GetCompamyInfo() {
                var self = this;
                self.$http.get(self.baseUrl + '/Services/BugManageServices.ashx?method=GetCompamyInfo', {}).then(function (res) {
                    if (res.data.code > 0) {
                        self.CompamyInfoData = res.data.data[0];
                    } else {
                        self.CompamyInfoData = {};
                    }
                }).catch(function (err) {

                });
            },
            ModifyCompanyInfo(jsondata) {
                var self = this;
                self.$http.post(self.baseUrl + '/Services/BugManageServices.ashx', {
                    method: 'ModifyCompanyInfo',
                    jsondata: JSON.stringify(jsondata)
                }).then(function (res) {
                    self.GetCompamyInfo();
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
            }

        },
    }
</script>

<style scoped>

</style>
