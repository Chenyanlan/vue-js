<template>
  <el-row type="flex" justify="center">
    <el-form ref="registerForm" :model= "user" :rules= "rules" status-icon label-width="80px">
      <el-form-item label="用户名" prop="name">
        <el-input v-model= "user.name"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input v-model= "user.pass" type="password" show-password></el-input>
      </el-form-item>
        <el-form-item label="确认密码" prop="checkpass">
             <el-input v-model= "user.checkpass" type="password" show-password></el-input>
        </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-upload" @click= "register">注册</el-button>
      </el-form-item>
    </el-form>
  </el-row>
</template>

<script>
export default {
    data(){
        return {
            user:{},
            rules:{
                name:[
                    {required:true,message:'用户名不能为空',tiggter:'blur'}
                ],
                pass:[
                    {required:true,message:'密码不能为空',tiggter:'blur'}
                ],
                checkpass:[
                    {required:true,message:'确认密码不能为空',tiggter:'blur'}
                ]
            }
        }
    },
    methods:{
        register(){
            this.$refs.registerForm.validate((valid)=>{
                if(valid){
                    this.$ajax.post('/users/validate',this.user).then((req,res)=>{
                        console.log(res.data)
                        if(res.data){
                            this.data.push(res.data)
                        }
                    }).catch((err)=>this.$notify({
                        type:'error',
                        message:err
                    }))
                }
            })
        }
    }
};
</script>

<style>
</style>
