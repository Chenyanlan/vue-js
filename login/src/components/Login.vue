<template>
    <el-row type="flex" justify="center">
       <el-form ref="loginForm" :model="user" :rules="rules" status-icon label-width="80px">
           <el-form-item label="用户名" prop="name">
               <el-input v-model="user.name"></el-input>
           </el-form-item>
            <el-form-item label="密码" prop="pass">
               <el-input v-model="user.pass" type="password" show-password></el-input>
           </el-form-item>
            <el-form-item>
               <el-button type="primary" icon="el-icon-upload" @click= "login">登录</el-button>
           </el-form-item>
           <el-form-item>
               <el-button type = "primary" icon = "el-icon-user" @click= "register">注册</el-button>
           </el-form-item>
       </el-form>
    </el-row>
</template>
<script>
export default {
    methods:{ 
        // login(){
        //    this.$refs.loginForm.validate((valid)=>{
        //        if(valid){
        //             if(this.user.name==='admin'&&this.user.pass==='123'){
        //                 //dispatch 采用Promise链式调用
        //                this.$store.dispatch('login',this.user).then(()=>{
        //                     this.$notify({
        //                     type:'success',
        //                     message:'Welcome '+this.user.name+" !",
        //                     duration:3000
        //                 })
        //                  this.$router.replace('/')
        //                })
                       
        //             }
        //             else{
        //                 this.$message({
        //                     type:'error',
        //                     message:'用户名或密码错误',
        //                     showClose:true
        //                 })
        //             }
        //        }
        //        else{
        //            return false
        //        }
        //    })
        // }
        login(){
            this.$refs.loginForm.validate((valid)=>{
                if(valid){
                    this.$ajax.post('/users/validate',this.user).then((res)=>{
                        if(res.data){
                            this.$store.dispatch('login',res.data).then(()=>{
                                this.$notify({
                                    type:'success',
                                    message:'Welcome '+res.data.name+ ' !',
                                    duration:3000
                                })
                                this.$router.replace('/')
                            })
                        }else{
                            this.$message({
                                type:'error',
                                message:'用户名或密码错误',
                                showClose:true
                            })
                        }
                    }).catch((err)=>{
                        this.$message({
                            type:'error',
                            message:'网络错误,请重试',
                            showClose:true
                        })
                    })
                }else{
                    return false
                }
            })
        },
        register(){
            this.$router.replace('/register')
        }
    },
    data(){
        return {
            user:{},
            rules:{//表单验证规则
                name:[
                    {required:true,message:'用户名不能为空',trigger:'blur'}
                ],
                pass:[
                    {required:true,message:'密码不能为空',trigger:'blur'}
                ]
            }
        }
    }
}
</script>
