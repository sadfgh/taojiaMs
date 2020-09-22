<template>
  <common-layout>
    <div class="top">
      <div class="header">
        <img alt="logo" class="logo" src="@/assets/img/logo.png" />
        <span class="title">广东淘家</span>
      </div>
      <div class="desc">淘家后台管理系统</div>
    </div>
    <div class="login">
      <a-form @submit="onSubmit" :form="form">
        <a-tabs size="large" :tabBarStyle="{textAlign: 'center'}" style="padding: 0 2px;" @change="callback">
           <a-tab-pane tab="免密码登录" key="1">
            <a-alert type="error" :closable="true" v-show="error" :message="error" showIcon style="margin-bottom: 24px;" />
             <div v-if="tabkey === '1'">
                      <a-form-item>
                  <a-input
                  autocomplete="autocomplete"
                  v-decorator="['phone',{rules: [{ required: true,max:11,message:'请输入正确格式的手机号码',validator:MobileNumberValidator}]}]"
                  size="large" 
                  placeholder="手机号" 
                  >
                    <a-icon slot="prefix" type="mobile" />
                  </a-input>
                </a-form-item>
                <a-form-item>
                  <a-row :gutter="8" style="margin: 0 -4px">
                    <a-col :span="16">
                      <a-input 
                      size="large" 
                      autocomplete="autocomplete"
                      placeholder="输入6位验证码"
                      v-decorator="['smsVerificationCode',{rules: [{ required: true,max:6, message: '请输入验证码',validator:NoteNumberValidator}]}]"
                      >
                        <a-icon slot="prefix" type="mail" />
                      </a-input>
                    </a-col>
                    <a-col :span="8" style="padding-left: 4px">
                      <a-button :disabled="isNote" style="width: 100%" class="captcha-button" size="large" @click="getNote">{{noteText}}</a-button>
                    </a-col>
                  </a-row>
                </a-form-item>
            </div>
           
          </a-tab-pane>

          
          <a-tab-pane tab="密码登录" key="2">
            <div v-if="tabkey === '2'">
                 <a-alert type="error" :closable="true" v-show="error" :message="error" showIcon style="margin-bottom: 24px;" />
            <a-form-item>
              <a-input
                autocomplete="autocomplete"
                size="large"
                defaultValue="admin"
                placeholder="admin"
               v-decorator="['name', {rules: [{ required: true, message: '请输入账户名', whitespace: true}]}]"
              >
                <a-icon slot="prefix" type="user" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input
                size="large"
                placeholder="888888"
                 defaultValue="888888"
                autocomplete="autocomplete"
                type="password"
                v-decorator="['password', {rules: [{ required: true, message: '请输入密码', whitespace: true}]}]"
              >

                <a-icon slot="prefix" type="lock" />
              </a-input>
            </a-form-item>
            </div>
           
          </a-tab-pane>
         
        </a-tabs>
        <div>
          <!-- <a-checkbox :checked="true" >自动登录</a-checkbox>
          <a style="float: right">忘记密码</a> -->
        </div>
        <a-form-item>
          <!-- <a-button :loading="logging" style="width: 100%;margin-top: 24px" size="large" htmlType="submit" type="primary"> 注册/登录 </a-button> -->
          <a-button :loading="logging" style="width: 100%;margin-top: 24px" size="large" htmlType="submit" type="primary">{{tabkey === "1" ? "注册/登录" : "登录"}} </a-button>
          <!-- <a-button @click="getData">权限控制登录</a-button><div></div> -->
          <!-- <a-button @click="getToken">测试登录请求TOKEN</a-button>
          <a-button @click="pushToken">测试登录请求TOKEN</a-button> -->
        </a-form-item>
        <div>
          <!-- 其他登录方式
          <a-icon class="icon" type="alipay-circle" />
          <a-icon class="icon" type="taobao-circle" />
          <a-icon class="icon" type="weibo-circle" /> -->
          <!-- <router-link style="float: right" to="/dashboard/workplace" >注册账户</router-link> -->
        </div>
      </a-form>
    </div>
  </common-layout>
</template>

<script>
import api from '@/api/axisoConfig'
import CommonLayout from '@/layouts/CommonLayout'
// import {login, getRoutesConfig} from '@/services'
import {setAuthorization} from '@/utils/request'
import {loadRoutes} from '@/utils/routerUtil'
import {dataProcessing} from '@/utils/dataProcessing'
import {mapMutations} from 'vuex'
// import axios from 'axios'
// import qs from 'qs'
export default {
  name: 'Login',
  components: {CommonLayout},
  data () {
    return {
      //验证倒计时
      totalTime: 60,
      //验证状态
      noteText:'获取验证码',
      //是否禁用
      isNote:true,
      //tab切换
      tabkey:"1",
      logging: false,
      error: '',
      form: this.$form.createForm(this),
      photo:'',
    }
  },
  computed: {
    systemName () {
      return this.$store.state.setting.systemName
    }
  },
  methods: {
    ...mapMutations('account', ['setUser']),
    //密码登录与免密码登录
    callback(key) {
      console.log(key);
      this.tabkey = key;
    },
    // 手机号验证正则
    MobileNumberValidator (rule, value, callback) {
      const idcardReg = /^1(3|4|5|6|7|8|9)\d{9}$/
      if (!idcardReg.test(value)) {
         this.isNote = true;
          callback('非法格式')
      }else{
        this.isNote = false;
        this.photo = value
        console.log("可以了？")

      }


      // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
      callback()
      console.log(callback())
    },
    // 短信验证正则
    NoteNumberValidator (rule, value, callback) {
      const idcardReg = /^\d{6}$/
      if (!idcardReg.test(value)) {
          callback('非法格式')
      }
      // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
      callback()
    },
    //短信验证处理
    getNote(){
      this.noteText = '发送中...'
      this.isNote = true
      console.log(this.photo)
      this.axios.get(`/verificationCode/getSmsVerificationCode/${this.photo}`).then(response =>{
        console.log(response)
        if (response.data.code === 200) {
          this.noteText = '重新获取'+ this.totalTime+'s';
          let timer = window.setInterval(() => {
            this.totalTime--;
                this.noteText = '重新获取'+ this.totalTime+'s';
            if(this.totalTime === 0){
              window.clearInterval(timer)
              this.noteText = '获取验证码';
              this.totalTime = 60;
              this.isNote = false;
            }
          }, 1000);
        }
      })
    },
    onSubmit (e) {
      e.preventDefault()
      console.log("登录进这里")
      //  const name = 'admin'
      //     const password = '888888'
      //     login(name, password).then(this.afterLogin)



      this.form.validateFields(async (err ,values) => {
        console.log(err)
        console.log(values)
        if (!err) {
          this.logging = true
          const res = await api.user.loginSms(values)
          console.log(res.data)
          if (res.code === 200) {
            // let user = {
            //   id:res.data.id,
            //   userName:res.data.userName,
            //   phone:res.data.phone,
            //   email:res.data.email,
            //   avatar:res.data.avatar
            // }
            //-------------这里有问题----------------
            setAuthorization({token:res.data.token})

            const parsm = await api.user.queryById({id:res.data.id})
            let user ={}
            console.log(parsm)
            if(parsm.code === 200){
              console.log(parsm)
                user = parsm.data
                this.setUser(user)

						}
            //这是我写的 start
             const routesTable = dataProcessing(res.data.authorities)
             const routesConfig = routesTable.leftFunc
             const funcList = routesTable.funcList
            console.log(funcList)
            this.$store.commit('setting/setFuncList' , funcList)
            loadRoutes({router: this.$router, store: this.$store, i18n: this.$i18n}, routesConfig)
            // end

          //这是鸣哥写的 start
          //   const routesConfig = dataProcessing(res.data.authorities)
          //   console.log('路由表的值')
          //   console.log(JSON.stringify(routesConfig))
          // loadRoutes({router: this.$router, store: this.$store, i18n: this.$i18n},routesConfig)
          // end
            this.$router.push('/dashboard/workplace')
          this.$message.success(res.message, 3)
          }else if (res.message === "Request failed with status code 500") {
             this.error = "短信验证码不匹配"
              this.logging = false
            //  this.$router.push('/login')
          }

        }
      })
    },
    //  afterLogin(res) {
    //   this.logging = false
    //   const loginRes = res.data
    //   console.log(loginRes)
    //   if (loginRes.code >= 0) {
    //     const user = loginRes.data.user
    //     this.setUser(user)
    //     setAuthorization({token: loginRes.data.token, expireAt: new Date(loginRes.data.expireAt)})
    //     // 获取路由配置
    //     getRoutesConfig().then(result => {
    //       // const routesConfig = result.data.data
    //       const routesConfig = dataProcessing(result.data.data)
    //       console.log(routesConfig) 
    //       loadRoutes({router: this.$router, store: this.$store, i18n: this.$i18n}, routesConfig)
    //       this.$router.push('/dashboard/workplace')
    //       this.$message.success(loginRes.message, 3)
    //     })
    //   } else {
    //     this.error = loginRes.message
    //   }
    // }
  }
}
</script>

<style lang="less" scoped>
  .common-layout{
    .top {
      text-align: center;
      .header {
        height: 44px;
        line-height: 44px;
        a {
          text-decoration: none;
        }
        .logo {
          height: 44px;
          vertical-align: top;
          margin-right: 16px;
        }
        .title {
          font-size: 33px;
          color: @title-color;
          font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
          font-weight: 600;
          position: relative;
          top: 2px;
        }
      }
      .desc {
        font-size: 14px;
        color: @text-color-second;
        margin-top: 12px;
        margin-bottom: 40px;
      }
    }
    .login{
      width: 368px;
      margin: 0 auto;
      @media screen and (max-width: 576px) {
        width: 95%;
      }
      @media screen and (max-width: 320px) {
        .captcha-button{
          font-size: 14px;
        }
      }
      .icon {
        font-size: 24px;
        color: @text-color-second;
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: @primary-color;
        }
      }
    }
  }
</style>
