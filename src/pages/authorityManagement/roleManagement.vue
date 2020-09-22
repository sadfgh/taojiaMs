<template>
    <div>
       <!-- <h1 style="margin-top:0px;font-size:32px;font-weight:600">角色管理</h1> -->
       <!-- 新增功能 -->
        <div style="width:100%;height:60px;background:#fff;margin-bottom:24px;margin-top:24px;line-height:60px;padding-left:20px">
            <a-button type="primary" @click="newMessage" v-if="isPromiss('roleAdd')">新增</a-button>
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
                <div slot="action" slot-scope="text,record">
                    <a-button style="margin-right:5px" @click="edMessage(record)" v-if="isPromiss('roleQueryById')">更多详情</a-button>
                    <a-button type="danger" @click="delMessage(record)" v-if="isPromiss('roleDeleteById')">删除</a-button>
                </div>
            </a-table>
         </div>
      <!-- 对话框 -->
        <a-modal destroyOnClose @cancel="close" :footer="null" v-model="visible" title="权限管理">
           <a-form-model ref="ruleForm" :model="form"  :rules="rules" >
                 <a-form-model-item label="角色编号(唯一)" prop="roleEnname" >
                     <a-input :disabled="isFunction ? false : true"  v-model="form.roleEnname" placeholder="请输入唯一角色编号"/>
                </a-form-model-item>
                <a-form-model-item label="角色名称" prop="roleName" >
                    <a-input v-model="form.roleName" placeholder="请输入角色名称"/>
                </a-form-model-item>
                <!-- 新增角色授权 -->
                <a-form-model-item v-if="isFunction === 1" label="角色的授权">
                     <a-select
                      mode="multiple"
                      size="default"
                      placeholder="请选择角色授权"
                      style="width: 100%"
                      @change="handleChange"
                      @popupScroll="popupScroll"
                    >
                      <a-select-option v-for="item in selectData" :key="JSON.stringify(item)">
                        <div style="float:left;">
                           {{item.permissionName}}
                        </div>
                        <div style="float:right;">
                           {{item.permissionEnname}}
                        </div>
                      </a-select-option>
                    </a-select>
                </a-form-model-item>
                <!-- 修改角色授权 -->
                <a-form-model-item v-if="isFunction === 0"  label="角色的授权">
                  <template>
                    <div>
                      <template v-for="(tag, index) in form.permissions">
                        <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag">
                          <a-tag :key="tag.permissionEnname " :closable="index !== -1" @close="() => handleClose(tag)">
                            {{ `${tag.slice(0, 20)}...` }}
                          </a-tag>
                        </a-tooltip>
                        <a-tag v-else :key="tag.permissionEnname " :closable="index !== -1" @close="() => handleClose(tag)">
                          {{ tag.permissionEnname }}
                        </a-tag>
                      </template>
                      <a-select  
                        v-if="inputVisible"
                        ref="select" 
                        style="width: 100%"
                        defaultValue="请选择"
                        @change="handleInputChange"
                        @popupScroll="popupScroll"
                        >
                         <a-select-option v-for="item in selectData" :key="JSON.stringify(item)">
                            <div style="float:left;">
                              {{item.permissionName}}
                            </div>
                            <div style="float:right;">
                              {{item.permissionEnname}}
                            </div>
                          </a-select-option>
                      </a-select>
                      <a-tag v-else style="background: #fff; borderStyle: dashed;" @click="showInput">
                        <a-icon type="plus" /> 添加授权
                      </a-tag>
                    </div>
                  </template>

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
import api from '@/api/axisoConfig'
const columns = [
  {
    title: '角色编号(唯一)',
    dataIndex: 'roleEnname',
  },
  {
    title: '角色名称',
    dataIndex: 'roleName',
  },
  {
    title:"备注",
    dataIndex: 'description',
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
                // getPromiss: JSON.parse(localStorage.getItem(process.env.VUE_APP_FUNCLIST_KEY)) ,

              // 查询权限授权
                selectData:[],
                // 查询权限授权页码
                selectPage:1,
                // 判断显示新增,修改
                isFunction:0,

                // 显示,隐藏修改权限授权查询
                inputVisible: false,
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
                  roleEnname:'',
                  roleName:'',
                  permissions:[],
                  description:'',
                },
                // 正则验证
                rules: {
                  roleEnname:[{ required: true, message: '请输入唯一角色编号', trigger: 'blur' }],
                  roleName:[{ required: true, message: '请输入角色名称', trigger: 'blur' }],
                  // description:[{ required: true, message: '请输入备注信息', trigger: 'blur' }],
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
          // 查询授权列表
             this.axios.get(`/permission/queryAll/${this.selectPage}/${this.pageSize}`)
            .then(res => {
              if(res.data.code === 200){
                this.selectData = res.data.data.content
                this.total = res.data.total
              }
                })
           
        },
        mounted(){
          console.log(this)
           this.getData()
        },
        methods:{
          // 修改授权(删)
            handleClose(removedTag) {
              console.log(removedTag)
              this.form.permissions = this.form.permissions.filter(item => item != removedTag)
              console.log(this.form.permissions)
              },
            // 显示select
              showInput() {
                this.inputVisible = true;
                this.$nextTick(function() {
                  this.$refs.select.focus();
                });
              },
            // 修改授权 (增)
              handleInputChange(item) {
                console.log(item)
                let value = JSON.parse(item)
               const isExist = this.form.permissions.some(item =>{
                  if (item.permissionEnname === value.permissionEnname) {
                    return true
                  }
                })
                if(!isExist){
                  this.form.permissions.push(value)
                }else{
                  this.$notification['error']({
                          message: '该授权已存在！',
                        });
                }
                this.inputVisible = false
                console.log(this.form.permissions)
              },

          // 点击x,蒙版层关闭时，清除数据
          close(){
           this.form = {
                  id:'',
                  roleEnname:'',
                  roleName:'',
                  permissions:[],
                  description:'',
                }
          },
          // 点击取消时，清除数据
            cancel(){
             this.visible = false;
              this.form = {
                id:'',
                  roleEnname:'',
                  roleName:'',
                  permissions:[],
                  description:'',
                }
          },
          // 新增权限管理
          handleChange(value) {
            console.log(value);
            let seletItem = [];
            value.forEach(item => {
              const newItem = JSON.parse(item);
              seletItem.push(newItem) 
            });
            console.log(seletItem)
            this.form.permissions = seletItem
            console.log(this.form.permissions)
          },
          // 选择框到底部，加载查询
            popupScroll(e) {
                if(this.total === this.selectData.length){
                  return 
                }else{
                if (e.target.scrollTop === e.target.scrollHeight-250) {
                    this.selectPage++;
                    this.axios.get(`/permission/queryAll/${this.selectPage}/${this.pageSize}`)
                    .then(res => {
                        if(res.data.code === 200){
                          let permissData = res.data.data.content
                          this.selectData = this.selectData.concat(permissData)
                       
                        }
                      })
                  }
                   
                }
            },
        // 请求角色查询列表
        async  getData(){
            const res = await api.role.list({pageNumber:this.pageNumber,pageSize:this.pageSize});
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
                // 新增
                if(this.form.id === ''){
                   const res = await api.role.add(this.form);
                    if (res.code === 200) {
                        this.$notification['success']({
                          message: '新增授权成功',
                          description:res.message
                        });
                        this.getData();
                    }else{
                       this.$notification['error']({
                          message: '新增授权失败',
                          description:res.message
                        });
                         this.getData();
                    }
                    this.visible = false
                }else{
                  // 修改
                  console.log(this.form)
                  const res = await api.role.update(this.form);
                   if (res.code === 200) {
                        this.$notification['success']({
                          message: '修改角色成功',
                          description:res.message
                        });
                        this.getData();
                    }else{
                       this.$notification['error']({
                          message: '修改角色失败',
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
          // 查询详细列表
          async edMessage(data){
             this.visible = true;
             this.isFunction = 0;
             console.log(data)
             const res = await api.role.queryById({id:data.id});
             console.log(res)
             if (res.code === 200) {
               this.form = {
                   id:res.data.id,
                  roleEnname:res.data.roleEnname,
                  roleName:res.data.roleName,
                  permissions:res.data.permissions,
                  description:res.data.description,
              }
             }else{
                  this.$notification['error']({
                    message: '加载数据失败',
                    description:res.message
                  });
             }
              
              console.log(data)
          },
          // 删除
        async delMessage(data){
              console.log(data)
               const res = await api.role.del({id:data.id});
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
              this.isFunction = 1;
               this.form = {
                id:'',
                  roleEnname:'',
                  roleName:'',
                  permissions:[],
                  description:'',
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
</style>

 