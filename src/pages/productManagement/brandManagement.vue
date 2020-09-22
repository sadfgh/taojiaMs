<template>
    <div>
       <!-- <h1 style="margin-top:0px;font-size:32px;font-weight:600">角色管理</h1> -->
       <!-- 新增功能 -->
        <div style="width:100%;height:60px;background:#fff;margin-bottom:24px;margin-top:24px;line-height:60px;padding-left:20px">
            <a-button type="primary" @click="newMessage" v-if="isPromiss('mallAddBrand')">新增</a-button>
        </div>
        <!-- 查询表格 -->
         <div style="width:100%;background:#fff;padding:20px 20px 0;">
            <a-table
                :pagination="pagination"
                :columns="columns"
                :dataSource="dataSource"
                rowKey="id"
                @change="onChange"
            >
                <div slot="brandLogo" slot-scope="text,record">
                    <img v-if="record.logo" style="width:50px;heigth:50px" :src="photoDomain + record.logo" alt="">
                </div>
                <div slot="showStatus" slot-scope="text,record">

                    <a-switch @change="showOrHideBrand(record)" :checked="record.showStatus === 0 ? true : false  " style="margin-bottom:5px" />
                </div>
                <div slot="action" slot-scope="text,record">
                    <a-button style="margin-right:5px" @click="edMessage(record)" v-if="isPromiss('mallUpdateBrand')">编辑</a-button>
                    <a-button type="danger" @click="delMessage(record)" v-if="isPromiss('mallDeleteBrandById')">删除</a-button>
                </div>
            </a-table>
         </div>
      <!-- 对话框 -->
        <a-modal destroyOnClose @cancel="close" :footer="null" v-model="visible" title="权限管理">
           <a-form-model ref="ruleForm" :model="form"  :rules="rules" >
                 <a-form-model-item label="品牌Logo">
                    <template>
                        <a-upload
                        name="logo"
                        list-type="picture-card"
                        class="avatar-uploader"
                        :show-upload-list="false"
                        :customRequest="customRequest" 
                        >
                        <img style=" width: 128px;height: 128px;" v-if="form.logo" :src="photoDomain+form.logo" alt="logo" />
                        <div v-else>
                            <a-icon :type="loading ? 'loading' : 'plus'" />
                            <div class="ant-upload-text">
                            上传图片
                            </div>
                        </div>
                        </a-upload>
                    </template>
                     
                </a-form-model-item>
                <a-form-model-item label="品牌名称" prop="brandName" >
                    <a-input v-model="form.brandName" placeholder="请输入品牌名称"/>
                </a-form-model-item>
                <a-form-model-item label="显示状态" >
                    <template>
                        <a-radio-group v-model="form.showStatus" name="radioGroup" @change="getShowStatus">
                            <!-- <a-radio checked :value="0">
                            显示{{form.showStatus}}
                            </a-radio> -->
                            <a-radio :checked="form.showStatus === 0 ? false : true" :value="0">
                            显示
                            </a-radio>
                            <a-radio :checked="form.showStatus === -1 ? true : false" :value="-1">
                            隐藏
                            </a-radio>
                        </a-radio-group>
                    </template>
                    
                </a-form-model-item>
                <a-form-model-item>
                  <a-button @click="cancel">取消</a-button>
                  <a-button type="primary" @click="onSubmit">确定</a-button>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>
</template>
<script>
import api from '@/api/axisoConfig'
const columns = [
 {
    title: '品牌LOGO',
   scopedSlots: { customRender: 'brandLogo' }
  },
  {
    title: '品牌名称',
    dataIndex: 'brandName',
  },
 
  {
    title: '是否显示',
    scopedSlots: { customRender: 'showStatus' }
  },
 
  {
    title: '创建时间',
    dataIndex: 'creationTime',
  },
  {
    title: '更新时间',
    dataIndex: 'updatedTime',
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' },
    align:'center'

  }
]
    export default {
        data(){
            return {
                 photoDomain : 'http://shop.itaojia.com/img/Taojia',
                 loading: false,
                // 表头
                columns: columns,
                // 表身
                dataSource: [],
                // 显示,隐藏弹出框
                visible:false,
                // 查询列表分页选项
                pagination:{
                  total:0,
                  defaultCurrent:1,
                  defaultPageSize:10
                },
                // 表单信息
                form: {
                  id:'',
                  brandName:'',
                  logo:'',
                  showStatus:0,
                },
                // 正则验证
                rules: {
                  brandName:[{ required: true, message: '请输入品牌名称', trigger: 'blur' }],
                 },
                //  查询角色列表页数
                pageNumber:1,
                // 查询角色列表条数
                pageSize:10,
                // 查询角色列表总条数
                total:0
            }
        },
        created(){
         
        },
        mounted(){
          console.log(this)
           this.getData()
        },
        methods:{

           async showOrHideBrand(values){
               const res = await api.brand.showOrHideBrand({id:values.id})
               if (res.code === 200) {
                    this.$notification['success']({
                        message: '状态修改成功',
                        description:res.message
                    });
                    if (values.showStatus === 0) {
                        values.showStatus = -1
                    }else{
                       values.showStatus = 0
                    }
               }else{
                   this.$notification['success']({
                        message: '状态修改失败',
                        description:res.message
                    });
               }
            },




            getShowStatus(event){
                console.log(event)
                this.form.showStatus = event.target.value
            },

            edMessage(item){
                console.log(item)
                this.form = item
                this.visible = true;
                console.log(this.form)
            },






            // 图片上传
            customRequest(data){ // 上传提交
                let url = 'https://shopping.itaojia.com/Taojia/file/upload/image.do'
                const formData = new FormData() 
                formData.append('file', data.file)
                formData.append('kind','other')
                formData.append('owner','admin')
                formData.append('operator_id','2')
                formData.append('device','1')
                formData.append('state','1')
                formData.append('operator_token','O17fUfAHFz48gT58m6Lr8waprA8AofTI_1')
            // operator_token: 2u2oLMYICXARXDpC1auQg1qad3ebNmkB_1
                const xhr = new XMLHttpRequest();  // XMLHttpRequest 对象
                xhr.open("post", url, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
                xhr.send(formData); //开始上传，发送form数据
                xhr.onload = () => {
                    const res = JSON.parse(xhr.response)
                    let imgUrl = res.data[0].url
                    console.log(imgUrl)
                    this.form.logo = imgUrl
                    console.log(this.form.logo)
                }
            },


          // 点击x,蒙版层关闭时，清除数据
          close(){
           this.form = {
                  id:'',
                  brandName:'',
                  logo:'',
                  showStatus:0,
                }
          },
          // 点击取消时，清除数据
            cancel(){
             this.visible = false;
              this.form = {
                  id:'',
                  brandName:'',
                  logo:'',
                  showStatus:0,
                }
          },
        
        // 请求品牌查询列表
        async  getData(){
            const res = await api.brand.list({pageNumber:this.pageNumber,pageSize:this.pageSize});
            console.log(res)
              if(res.code === 200){
                this.dataSource = res.data.content
                this.pagination.total = res.data.total
              }
          },
          // 点击分页
          onChange(e){
            console.log(e)
            this.pageNumber = e.current;
            this.getData();
          },
        // 点击确定
         onSubmit() {
            this.$refs.ruleForm.validate(async valid => {
              if (valid) {
                  console.log(this.form)
                // 新增
                if(this.form.id === ''){
                   const res = await api.brand.add(this.form);

                    if (res.code === 200) {
                        this.$notification['success']({
                          message: '新增品牌成功',
                          description:res.message
                        });
                        this.getData();
                    }else{
                       this.$notification['error']({
                          message: '新增品牌失败',
                          description:res.message
                        });
                         this.getData();
                    }
                    this.visible = false
                }else{
                  // 修改
                  console.log(this.form)
                  const res = await api.brand.update(this.form);
                   if (res.code === 200) {
                        this.$notification['success']({
                          message: '修改品牌成功',
                          description:res.message
                        });
                        this.getData();
                    }else{
                       this.$notification['error']({
                          message: '修改品牌失败',
                          description:res.message
                        });
                         this.getData();
                    }
                    this.visible = false
                }
              } else {
                console.log('error submit!!');
                return false;
              }
            });
          },
          // 删除
        async delMessage(data){
              console.log(data)
               const res = await api.brand.del({id:data.id});
              console.log(res)
              if (res.code === 200) {
                this.$notification['success']({
                  message: '删除授权成功',
                  description:res.message
                });
                this.getData();
              }else{
                  this.$notification['error']({
                    message: '删除授权失败',
                    description:res.message
                  });
                    this.getData();
              }
          },
          // 新增弹出框
          newMessage() {
              this.visible = true;
               this.form = {
                  id:'',
                  brandName:'',
                  logo:'',
                  showStatus:0,
                }
          },
        }
    }
</script>
<style style lang="less" scoped>
 .clearfix:after,
  .clearfix:before {
      content: "";
      display: block;
      clear: both;
  }

  // .ant-form-item{
  //   margin-bottom: 15px;
  // }
.permission{
  width:48%;
  height:100%;
  float:left;
  margin:1%;
  h4{
    font-weight:700;
    width:100%;
    text-align:center;
  }
}
.ant-table-thead > tr > th, .ant-table-tbody > tr > td {
  padding: 10px;
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

 