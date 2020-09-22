<template>
    <div>
       <!-- <h1 style="margin-top:0px;font-size:32px;font-weight:600">授权管理</h1> -->
        <div style="width:100%;height:60px;background:#fff;margin-bottom:24px;margin-top:24px;line-height:60px;padding-left:20px">
                
           <template v-if="isPromiss('permissionAdd')">
            <a-button type="primary" @click="newMessage">新增</a-button>
           </template>
        </div>
        <div style="width:100%;background:#fff;padding:20px 20px 0;">
            <a-table
                  :pagination="pagination"
                  :columns="columns"
                  :dataSource="dataSource"
                  rowKey="id"
                  @change="onChange"
              >
                  <div slot="description" slot-scope="text">
                  {{text}}
                  </div>
                  <div slot="action" slot-scope="text,record">
                      <a-button v-if="isPromiss('permissionUpdate')" style="margin-right:5px" @click="edMessage(record)">编辑</a-button>
                      <a-button v-if="isPromiss('permissionDeleteById')" type="danger" @click="delMessage(record)">删除</a-button>
                  </div>
            </a-table>
        </div>
         
      <!-- 对话框 -->
        <a-modal @cancel="close" :footer="null" v-model="visible" title="权限管理">
           <a-form-model ref="ruleForm" :model="form"  :rules="rules">
                 <a-form-model-item label="授权编号(唯一)" prop="permissionEnname" >
                <a-input v-model="form.permissionEnname" placeholder="请输入唯一授权编号"/>
                </a-form-model-item>
                <a-form-model-item label="授权名称" prop="permissionName" >
                <a-input v-model="form.permissionName" placeholder="请输入授权名称"/>
                </a-form-model-item>
                <a-form-model-item label="授权url" prop="permissionUrl" >
                <a-input v-model="form.permissionUrl" placeholder="请输入授权url"/>
                </a-form-model-item>
                <a-form-model-item label="备注" prop="description" >
                <a-input v-model="form.description" placeholder="请输入备注信息"/>
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

const columns = [
  {
    title: '授权编号(唯一)',
    dataIndex: 'permissionEnname',
    align:'center'

  },
  {
    title: '授权名称',
    dataIndex: 'permissionName',
    align:'center'

  },
  {
    title: '授权url',
    dataIndex: 'permissionUrl',
    align:'center'
  },
  {
    title:"备注",
    dataIndex: 'description',
    align:'center'
  },
  {
    title: '创建时间',
    dataIndex: 'creationTime',
    align:'center'
  },
  {
    title: '更新时间',
    dataIndex: 'updatedTime',
     align:'center'
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

                // getPromiss: JSON.parse(localStorage.getItem(process.env.VUE_APP_FUNCLIST_KEY)) ,

                columns: columns,
                dataSource: [],
                visible:false,
                pagination:{
                  total:0,
                  defaultCurrent:1,
                  defaultPageSize:10
                },
                form: {
                  id:'',
                  permissionEnname:'',
                  permissionName:'',
                  permissionUrl:'',
                  description:'',
                },
                rules: {
                  permissionEnname:[{ required: true, message: '请输入唯一授权编号', trigger: 'blur' }],
                  permissionName:[{ required: true, message: '请输入授权名称', trigger: 'blur' }],
                  permissionUrl:[{ required: true, message: '请输入授权url', trigger: 'blur' }],
                  // description:[{ required: true, message: '请输入备注信息', trigger: 'blur' }],
                 },
                pageNumber:1,
                pageSize:10,
                // total:0,
            }
        },
        created(){
            // this.getData()
            console.log(this)
            console.log(localStorage.getItem(process.env.VUE_APP_FUNCLIST_KEY))
            console.log(this.$store.state.setting.funcList)
        },
        mounted(){
           this.getData()
        },
        methods:{
          getData(){
             this.axios.get(`/permission/queryAll/${this.pageNumber}/${this.pageSize}`)
            .then(res => {
              if(res.data.code === 200){
                this.dataSource = res.data.data.content
                this.total = res.data.total
                this.pagination.total = res.data.data.total
              }
                })
          },
          onChange(e){
            console.log(e)
            this.pageNumber = e.current;
            this.getData();
          },
           close(){
           this.form = {
                id:'',
                  permissionEnname:'',
                  permissionName:'',
                  permissionUrl:'',
                  description:'',
                }
          },
          cancel(){
             this.visible = false;
              this.form = {
                  id:'',
                  permissionEnname:'',
                  permissionName:'',
                  permissionUrl:'',
                  description:'',
                }
          },

          onSubmit() {
            this.$refs.ruleForm.validate(valid => {
              if (valid) {
                if(this.form.id === ''){
                  this.axios.post(`/permission/add`,this.form)
                  .then(res =>{
                    if (res.data.code === 200) {
                       this.$notification['success']({
                          message: '新增授权成功',
                          description:res.data.message
                        });
                        this.getData();
                    }else{
                       this.$notification['error']({
                          message: '新增授权失败',
                          description:res.data.message
                        });
                         this.getData();
                    }
                  })
                  this.visible = false
                }else{
                  this.axios.post(`/permission/update`,this.form)
                  .then(res =>{
                    if (res.data.code === 200) {
                       this.$notification['success']({
                          message: '修改授权成功',
                          description:res.data.message
                        });
                        this.getData();
                    }else{
                       this.$notification['error']({
                          message: '修改授权失败',
                          description:res.data.message
                        });
                         this.getData();
                    }
                  })
                  this.visible = false
                }

                console.log(this.form)
              } else {
                console.log('error submit!!');
                return false;
              }
            });
          },
          edMessage(data){
             this.visible = true;
              this.form = {
                  id:data.id,
                  permissionEnname:data.permissionEnname,
                  permissionName:data.permissionName,
                  permissionUrl:data.permissionUrl,
                  description:data.description,
              }
              console.log(data)
          },
          delMessage(data){
              console.log(data)
               this.axios.get(`/permission/deleteById/${data.id}`)
                  .then(res =>{
                    if (res.data.code === 200) {
                       this.$notification['success']({
                          message: '删除授权成功',
                          description:res.data.message
                        });
                        this.getData();
                    }else{
                       this.$notification['error']({
                          message: '删除授权失败',
                          description:res.data.message
                        });
                         this.getData();
                    }
                  })

          },
          newMessage() {
              this.visible = true;

          },
        }
    }
</script>
 <style lang="less" scoped>
  .ant-table-thead > tr > th, .ant-table-tbody > tr > td {
  padding: 10px;
}
</style>
