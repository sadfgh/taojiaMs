<template>
<div>
  <a-dropdown>
    <div class="header-avatar" style="cursor: pointer">
      <a-avatar v-if="form.avatar" class="avatar" size="small" shape="circle" :src="photoDomain + form.avatar"/>
      <a-avatar v-else class="avatar" size="small" shape="circle" :src="photoDomain + a"/>
      <span class="name">{{form.userName}}</span>
    </div>
    <a-menu :class="['avatar-menu']" slot="overlay">
      <a-menu-item @click="personal">
        <a-icon type="user" />
        <span>个人中心</span>
      </a-menu-item>
      <a-menu-item>
        <a-icon type="setting" />
        <span>设置</span>
      </a-menu-item>
      <a-menu-divider />
      <a-menu-item>
        <a @click="logout">
          <a-icon type="poweroff" />
          <span>退出登录</span>
        </a>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
   <a-modal :footer="null" v-model="isPersonal" title="个人中心">
      <a-tabs default-active-key="1" @change="callback">
        <a-tab-pane key="1" tab="修改个人信息">
          <!-- <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol"> -->
          <a-form-model ref="ruleForm" :rules="rules" :model="form">

            <a-form-model-item prop="avatar">
              <template>
                <a-upload
                  name="avatar"
                  list-type="picture-card"
                  class="avatar-uploader"
                  :show-upload-list="false"
                   :customRequest="customRequest" 
                   @change="monitor"
                >
                  <img style=" width: 128px;height: 128px;" v-if="form.avatar" :src="photoDomain+form.avatar" alt="avatar" />
                  <div v-else>
                    <a-icon :type="loading ? 'loading' : 'plus'" />
                    <div class="ant-upload-text">
                      上传图片
                    </div>
                  </div>
                </a-upload>
              </template>
              <div ref="verify" class="verify" style="display:none;color: #f5222d">请选择上传图片</div>
            </a-form-model-item>
            <a-form-model-item label="姓名" prop="userName">
              <a-input v-model="form.userName" placeholder="请输入姓名"/>
            </a-form-model-item>
             <a-form-model-item v-if="form.phone" label="手机号码" prop="phone">
              <a-input disabled v-model="form.phone" placeholder="请输入手机号码"/>
            </a-form-model-item>
             <a-form-model-item v-if="form.email" label="电子邮箱" prop="email">
              <a-input disabled v-model="form.email" placeholder="请输入电子邮箱"/>
            </a-form-model-item>
             <a-form-model-item :wrapper-col="{ span: 9, offset: 9 }">
              <a-button type="primary" @click="onPersonal">
                修改
              </a-button>
              <a-button @click="() =>{this.isPersonal=false} " style="margin-left: 10px;">
                取消
              </a-button>
            </a-form-model-item>
          </a-form-model>

        </a-tab-pane>

         <a-tab-pane key="2" tab="解绑手机" force-render>

          <a-form-model ref="ruleForm2" :rules="rules2" :model="form2">
              <a-form-model-item label="手机号码" prop="phone">
                <a-input disabled v-model="form2.phone" placeholder="请输入手机号码"/>
              </a-form-model-item>
              <a-form-model-item label="手机验证" prop="note">
                  <a-row :gutter="8" style="margin: 0 -4px">
                    <a-col :span="16">
                      <a-input v-model="form2.note" placeholder="输入6位验证码">
                      </a-input>
                    </a-col>
                    <a-col :span="8" style="padding-left: 4px">
                      <a-button :disabled="isNote" style="width: 100%" type="primary" class="captcha-button" @click="getNote">{{noteText}}</a-button>
                    </a-col>
                  </a-row>
                </a-form-model-item>
              <a-form-model-item :wrapper-col="{ span: 9, offset: 9 }">
                <a-button type="primary" @click="onChangePhone">
                  解绑
                </a-button>
                <a-button style="margin-left: 10px;">
                  取消
                </a-button>
              </a-form-model-item>
          </a-form-model>
            
        </a-tab-pane>



        <!-- <a-tab-pane key="3" tab="修改密码" force-render>

          <a-form-model ref="ruleForm3" :rules="rules2" :model="form2">
              <a-form-model-item label="新密码" prop="pwd">
                <a-input type="password" v-model="form3.pwd" placeholder="请输入密码"/>
              </a-form-model-item>
              <a-form-model-item  label="确认密码" prop="repwd">
                <a-input type="password" v-model="form3.repwd" placeholder="请再次输入确认密码"/>
              </a-form-model-item>
              <a-form-model-item label="手机号码" prop="phone">
                <a-input v-model="form3.phone" placeholder="请输入手机号码"/>
              </a-form-model-item>
              <a-form-model-item label="手机验证" prop="note">
                  <a-row :gutter="8" style="margin: 0 -4px">
                    <a-col :span="16">
                      <a-input v-model="form3.note" placeholder="输入6位验证码">
                      </a-input>
                    </a-col>
                    <a-col :span="8" style="padding-left: 4px">
                      <a-button :disabled="isNote" style="width: 100%" type="primary" class="captcha-button" @click="getNote">{{noteText}}</a-button>
                    </a-col>
                  </a-row>
                </a-form-model-item>
              <a-form-model-item :wrapper-col="{ span: 9, offset: 9 }">
                <a-button type="primary" @click="onChangePwd">
                  确定
                </a-button>
                <a-button style="margin-left: 10px;">
                  取消
                </a-button>
              </a-form-model-item>
          </a-form-model>
            
        </a-tab-pane> -->
        
        <!-- <a-tab-pane key="3" tab="Tab 3">
          Content of Tab Pane 3
        </a-tab-pane> -->
      </a-tabs>
     
    </a-modal>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {logout} from '@/services'
import api from '@/api/axisoConfig'
import {mapMutations} from 'vuex'


export default {
  name: 'HeaderAvatar',
  computed: {
    ...mapGetters('account', ['user']),
  },
  data(){
    return {
      photoDomain : 'http://shop.itaojia.com/img/Taojia',
       //验证倒计时
      totalTime: 60,
      noteText:'获取验证码',
      isNote:true,
      isPersonal:false,

      loading: false,
      // imageUrl: '',
      a:'/admin/2/other/cbea5c19b7b9fddd3f4e4e8b16565878.png',
      // user:{},

      form: {
        userName: '小明1号',
        phone: '',
        email:'',
        avatar:'/admin/2/other/cbea5c19b7b9fddd3f4e4e8b16565878.png',
        id:'',
        lockStatus:'0',
        roles:[]
      },
      form2:{
        phone:'',
        note:''

      },
       form3:{
        pwd:'',
        repwd:'',
        phone:'',
        note:''

      },
      rules: {
        avatar:[{ required: true, validator: this.handUpload }],
        userName:[{ required: true, message: '请输入姓名', trigger: 'blur'}],
        phone:[{ required: true, message: '手机号格式不正确', trigger: 'blur', max:11 , pattern: /^1(3|4|5|6|7|8|9)\d{9}$/  }],
        email:[{ required: true, message: '电子邮箱格式不正确', trigger: 'blur',pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/ }],
      },
       rules2: {
        pwd:[{ required: true, message: '请输入新密码', trigger: 'blur'}],
        repwd:[{ required: true, trigger: 'blur', validator: this.handPassword }],
        phone:[{ required: true,trigger: 'change', max:11 ,validator:this.MobileNumberValidator}],
        note:[{ required: true, message: '验证码格式不正确',max:6, trigger: 'blur',pattern:/^\d{6}$/ }],
      },
    }
  },
  created(){
      const user = localStorage.getItem(process.env.VUE_APP_USER_KEY)
      this.form = JSON.parse(user)
      console.log(this.form)

       
      this.form2.phone = this.form.phone
  },


  methods: {
      ...mapMutations('account', ['setUser']),

    //监听上传状态
    monitor(){
      document.querySelector('.verify').innerHTML = ''
    },





    //个人信息提交
    onPersonal(){
      this.$refs.ruleForm.validate(async valid => {
        console.log(valid)
        if (valid) {
          // this.form.avatar = this.imageUrl
          // this.form.roles = []
          // this.form.lockStatus='0'
          console.log(this.form)
          const res = await api.user.updateUser(this.form)
            if (res.code === 200) {
              let user = this.form
            this.setUser(user)
            this.isPersonal = false
             this.$notification['success']({
                message: '修改个人信息成功',
                description: res.message
              });

          }else{
             this.isPersonal = false
             this.$notification['error']({
                message: '修改个人信息失败',
                description:res.message
              });
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

  //解绑手机号提交
  onChangePhone(){
        this.$refs.ruleForm2.validate(async valid => {
        console.log(valid)
        if (valid) {
          console.log(this.form2)
          let data = {}
          data.phone = this.form2.phone
          data.verificationCode = this.form2.note
          console.log(data)
          const res = await api.user.updatePassword(data)
          if (res.code === 200) {
             this.isPersonal = false
             this.$notification['success']({
                message: '解绑手机成功',
                description:res.message
              });
              logout()
              this.$router.push('/login')
          }else{
             this.isPersonal = false
             this.$notification['error']({
                message: '解绑手机失败',
                description:res.message
              });
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
  },









  //修改密码提交
    onChangePwd(){
        this.$refs.ruleForm3.validate(async valid => {
        console.log(valid)
        if (valid) {
          console.log(this.form3)
          let data = {}
          data.password = this.form3.repwd
          data.verificationCode = this.form3.note
          console.log(data)
          const res = await api.user.updatePassword(data)
          if (res.code === 200) {
             this.isPersonal = false
             this.$notification['success']({
                message: '修改密码成功',
                description:'修改密码成功，重启生效'
              });
          }else{
             this.isPersonal = false
             this.$notification['error']({
                message: '修改密码失败',
                description:res.message
              });
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },




  //图片上传验证
  handUpload(avatar,value,callback){
    console.log(this.form.avatar)
    let imgavatar = ''
    setTimeout(() => {
      imgavatar = this.form.avatar
    }, 0);
    if (imgavatar === value) {
      this.$refs.verify.style.display = 'block'
      callback(' ')
    }else if (imgavatar !== value) {
      callback()
    }
  },

  //密码验证
  handPassword(repwd , value , callback){
      console.log(value)
      if (!value) {
         callback('请输入确认密码')
      }
      if (value && value !== this.form2.pwd) {
        callback('两次密码不一致！')
      }
      callback()
  },

  //手机号码验证
   MobileNumberValidator (phone, value, callback) {
      const idcardReg = /^1(3|4|5|6|7|8|9)\d{9}$/
       if (!value) {
         callback('请输入手机号码')
      }
      if (!idcardReg.test(value)) {
         this.isNote = true;
          callback('手机号格式不正确')
      }else{
        this.isNote = false;
        this.form2.phone = value
        callback()
        console.log("可以了？")

      }
   },

  //短信验证处理
    getNote(){
      this.noteText = '发送中...'
      this.isNote = true
      console.log(this.form2.phone)
      this.axios.get(`/verificationCode/getSmsVerificationCode/${this.form2.phone}`).then(response =>{
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








    // 退出登录
    logout() {
      logout()
      const routesConfig = localStorage.getItem(process.env.VUE_APP_ROUTES_KEY)
      console.log(routesConfig)
      console.log(this.$store.state)
      this.$router.push('/login')
    },
    personal(){
      this.isPersonal = true
    },
    callback(key) {
      console.log(key);
    },

// 图片上传
    customRequest(data){ // 上传提交
     let url = 'https://shopping.itaojia.com/Taojia/file/upload/image.do'
      const formData = new FormData() 
      formData.append('file', data.file)
      // formData.append('token', "token")
      formData.append('kind','other')
      formData.append('owner','admin')
       formData.append('operator_id','2')
        formData.append('device','1')
         formData.append('state','1')
      formData.append('operator_token','O17fUfAHFz48gT58m6Lr8waprA8AofTI_1')
      // operator_token: 2u2oLMYICXARXDpC1auQg1qad3ebNmkB_1
      const xhr = new XMLHttpRequest();  // XMLHttpRequest 对象
      xhr.open("post", url, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
      //  xhr.setRequestHeader('Authorization','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIxNTAxMzM1NTMyOSIsImV4cCI6MTU5OTAyOTc0ODM0NCwiaWF0IjoxMjA5NjAwLCJpc3MiOiJmZW5yaXIiLCJzdWIiOiJjZDc5YmYxZjgyZDU0ZjBhOGI1NDkwNmE2NDY1OTE4NCIsInV1aWQiOiIzZWI1YzlhYjVhMDM0NDRkOWJkYThiOWI3NmE0MGFiNCJ9.S8TyJIh8ujep0VFCyZC1MeN58aho2WQbYfuRH_4oiCQ')
      // xhr.onload = scope.uploadSuccess; //请求完成
    xhr.send(formData); //开始上传，发送form数据
//      xhr.onreadystatechange = function(){
//     //若响应完成且请求成功
//     if(xhr.readyState === 4 && xhr.status === 200){
//         const res = JSON.parse(xhr.response)
//         let imgUrl = res.data[0].url
//         console.log(imgUrl)
//         this.imageUrl = imgUrl
//         console.log(this.imageUrl)
//     }
   
// }
xhr.onload = () => {
        const res = JSON.parse(xhr.response)
        let imgUrl = res.data[0].url
        console.log(imgUrl)
        this.form.avatar = imgUrl
        console.log(this.form.avatar)
}
      },
  }
}
</script>

<style lang="less">
  .header-avatar{
    display: inline-flex;
    .avatar, .name{
      align-self: center;
    }
    .avatar{
      margin-right: 8px;
    }
    .name{
      font-weight: 500;
    }
  }
  .avatar-menu{
    width: 150px;
  }

// 图片上传
  .avatar-uploader > .ant-upload {
    width: 128px;
    height: 128px;
    margin: 0 auto;
     float: none;
  }
 
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }



</style>
