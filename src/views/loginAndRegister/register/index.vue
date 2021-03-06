<template>
  <el-form :model="registerForm" :rules="registerRules" ref="registerForm">
    <el-form-item prop="email" class="login-register-input">
      <el-input name="email" v-model="registerForm.email" type="text" placeholder="请输入电子邮箱">
        <i slot="prefix">
          <svg-icon icon-class="email"></svg-icon>
        </i>
      </el-input>
    </el-form-item>
    <el-form-item prop="username" class="login-register-input">
      <el-input name="username" v-model="registerForm.username" type="text" placeholder="请输入用户名">
        <i slot="prefix">
          <svg-icon icon-class="user"></svg-icon>
        </i>
      </el-input>
    </el-form-item>
    <el-form-item prop="password" class="login-register-input">
      <el-input name="password" v-model="registerForm.password" type="password" placeholder="请输入密码">
        <i slot="prefix">
          <svg-icon icon-class="password"></svg-icon>
        </i>
      </el-input>
    </el-form-item>
    <el-form-item prop="checkPwd" class="login-register-input">
      <el-input name="checkPwd" v-model="registerForm.checkPwd" type="password" placeholder="请确认密码">
        <i slot="prefix">
          <svg-icon icon-class="password"></svg-icon>
        </i>
      </el-input>
    </el-form-item>
    <el-button type="danger" class="login-btn" :loading="loading" @click="handleSignUp">注册</el-button>
  </el-form>
</template>

<script>
  import { isValidUsername, isValidateEmail } from '@/utils/validate'
  import { signUp } from '../../../api/login'
  import { Message } from 'element-ui'

  export default {
    name: 'MyRegister',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!isValidUsername(value)) {
          callback(new Error('请输入只包含数字、字母的用户名'))
        } else if (value.length > 9) {
          callback(new Error('昵称的长度不能超过 9 位'))
        } else {
          callback()
        }
      }
      const validatePass = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('密码不能少于 6 位'))
        } else {
          callback()
        }
      }
      const validateEmail = (rule, value, callback) => {
        if (!isValidateEmail(value)) {
          callback(new Error('请输入正确的邮箱'))
        } else {
          callback()
        }
      }
      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.registerForm.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }
      return {
        registerForm: {
          email: '',
          username: '',
          password: '',
          checkPwd: ''
        },
        registerRules: {
          email: [{ required: true, trigger: 'blur', validator: validateEmail }],
          username: [{ required: true, trigger: 'blur', validator: validateUsername }],
          password: [{ required: true, trigger: 'blur', validator: validatePass }],
          checkPwd: [{ required: true, trigger: 'blur', validator: validatePass2 }]
        },

        loading: false
      }
    },
    mounted: function() {
      this.$emit('register')
    },
    methods: {
      handleSignUp() {
        this.$refs.registerForm.validate(valid => {
          if (valid) {
            this.loading = true

            new Promise((resolve, reject) => {
              signUp(this.registerForm.email, this.registerForm.username, this.registerForm.password).then(responseToken => {
                // 注册成功，自动跳转到登录界面
                this.$router.push('/loginAndRegister/login')
                this.loading = false
                Message({
                  message: '注册成功，请验证后登录～',
                  type: 'success',
                  duration: 3 * 1000,
                  center: true,
                  showClose: true
                })
                resolve()
              }).catch(() => {
                this.loading = false
              })
            }).then()
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>

<style scoped>
  @import "../common.css";
</style>
