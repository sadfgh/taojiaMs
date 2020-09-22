<template>
    <div>
        <!-- 查询表格  -->
         <div style="width:100%;background:#fff;padding:20px 20px 0;">
            <a-table
                :pagination="pagination"
                :columns="columns"
                :dataSource="dataSource"
                rowKey="id"
                @change="onChange"
            >
                <!-- <span slot="picture" slot-scope="text, record">
                    <img style="width:50px;heigth:50px" :src="record.avatar" />
                </span> -->
                <span  slot="picture" slot-scope="text, record">
                    <img v-if="record.avatar" style="width:50px;heigth:50px" :src="photoDomain + record.avatar" alt="">
                    <img style="width:50px;heigth:50px" v-else :src="photoDomain + backimg" alt="">
                </span>
                <div slot="action" slot-scope="text,record">
                    <a-button  v-if="getPromiss.includes('userLockOrUnlock')" style="margin-right:5px" @click="isLock(record)">{{record.lockStatus === 0 ? '锁定' : '解锁'}}</a-button>
                    <a-button  v-if="getPromiss.includes('userQueryById')" type="primary" @click="details(record)">更多详情</a-button>
                </div>
            </a-table>
         </div>

        <a-modal width="800px" destroyOnClose v-model="visible" okText="授权" @ok="userAuthorization" @cancel ='clearData'>
             <a-descriptions :column=2 title="详情信息" bordered>
                <a-descriptions-item label="用户头像">
                 <img v-if="userDetails.avatar" style="width:50px;heigth:50px" :src="photoDomain + userDetails.avatar" alt="">
                  <img v-else style="width:50px;heigth:50px" :src="photoDomain + backimg" alt="">
                  <!-- <img style="width:50px;heigth:50px" :src="userDetails.avatar" alt=""> -->
                </a-descriptions-item>
                <a-descriptions-item label="用户名称">
                    {{userDetails.userName}}
                </a-descriptions-item>
                <a-descriptions-item label="手机号码">
                    {{userDetails.phone}}
                </a-descriptions-item>
                <a-descriptions-item label="电子邮箱">
                   {{userDetails.email}}
                </a-descriptions-item>
                <a-descriptions-item label="创建时间">
                {{userDetails.creationTime}}
                </a-descriptions-item>
                <a-descriptions-item label="更新时间">
                {{userDetails.updatedTime}}
                </a-descriptions-item>
              
                <a-descriptions-item label="角色配置" :span=2>
                  <template>
                      <div>
                      <template v-for="(tag, index) in userDetails.roles">
                        <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag">
                          <a-tag :key="tag.roleEnname" :closable="index !== -1" @close="() => handleClose(tag)">
                            {{ `${tag.slice(0, 20)}...` }}
                          </a-tag>
                        </a-tooltip>
                        <a-tag v-else :key="tag.roleEnname " :closable="index !== -1" @close="() => handleClose(tag)">
                          {{ tag.roleEnname }}
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
                              {{item.roleName}}
                            </div>
                            <div style="float:right;">
                              {{item.roleEnname}}
                            </div>
                          </a-select-option>
                      </a-select>
                      <a-tag v-else style="background: #fff; borderStyle: dashed;" @click="showInput">
                        <a-icon type="plus" /> 添加授权
                      </a-tag>
                    </div>
                  </template>
                </a-descriptions-item>
                <!-- <a-descriptions-item>
                  
                </a-descriptions-item> -->
            </a-descriptions>
        </a-modal>

    </div>
</template>
<script>
import api from '@/api/axisoConfig'
const columns = [
  {
    title: '用户头像',
    // dataIndex: 'avatar',
    scopedSlots: { customRender: 'picture' }
  },
  {
    title: '用户名称',
    dataIndex: 'userName',
  },
  {
    title:"绑定的手机号",
    dataIndex: 'phone',
  },
  {
    title:"邮箱",
    dataIndex: 'email',
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
               backimg:'/admin/2/other/86da3479f8a12f25bdc351ab0abc350b.jpg',
                photoDomain : 'https://shop.itaojia.com/img/Taojia',


                getPromiss: JSON.parse(localStorage.getItem(process.env.VUE_APP_FUNCLIST_KEY)) ,
                 // 查询角色授权
                selectData:[],
                 // 显示,隐藏修改权限授权查询
                inputVisible: false,
                // 用户ID
                userId:'',

                // 表头
                columns: columns,
                // 表身
                dataSource: [],
                userDetails:{},
                // 显示,隐藏弹出框
                visible:false,
                // 查询列表分页选项
                pagination:{
                  total:0,
                  defaultCurrent:1,
                  defaultPageSize:10
                },
                //  查询角色列表页数
                pageNumber:1,
                // 查询角色列表条数
                pageSize:10,
                // 查询角色列表总条数
                total:0
            }
        },
        async created(){
          const res = await api.role.list({pageNumber:this.pageNumber,pageSize:this.pageSize})
          if (res.code === 200) {
            this.selectData = res.data.content
          }
        },
        mounted(){
          console.log(this)
           this.getData()
        },
        methods:{

            //用户授权
          async  userAuthorization(){
              console.log(this.userDetails)
              let parms = {}
              let roleId = []
              parms.userId = this.userDetails.id;
              this.userDetails.roles.forEach(item => {
                  roleId.push(item.id)
              });
              parms.roleIds = roleId

              console.log(parms)
              const res = await api.user.authorizationToUser(parms);
              if (res.code === 200) {
                 this.$notification['success']({
                      message: '授权成功',
                      description:res.message
                    });
                     this.getData();
              }else{
                 this.$notification['error']({
                      message: '授权失败',
                      description:res.message
                    });
              }
              this.visible = false
            },
















             // 修改授权(删)
            handleClose(removedTag) {
              console.log(removedTag)
              this.userDetails.roles = this.userDetails.roles.filter(item => item != removedTag)
              console.log(this.userDetails.roles)
              },
            // 显示select
             async showInput() {
                this.inputVisible = true;
                // const res = await api.role.list({pageNumber:this.pageNumber,pageSize:this.pageSize})
                //   if (res.code === 200) {
                //     this.selectData = res.data.content
                //   }
                  this.$nextTick(function() {
                    this.$refs.select.focus();
                  });
              },
            // 修改授权 (增)
              handleInputChange(item) {
                console.log(item)
                let value = JSON.parse(item)
               const isExist = this.userDetails.roles.some(item =>{
                  if (item.roleEnname === value.roleEnname) {
                    return true
                  }
                })
                if(!isExist){
                  this.userDetails.roles.push(value)
                }else{
                  this.$notification['error']({
                          message: '该授权已存在！',
                        });
                }
                this.inputVisible = false
                console.log(this.userDetails.roles)
              },

         async isLock(record){
                console.log(record)
                const res = await api.user.lockOrUnlock({id:record.id}); 
                  if (res.code === 200) {
                        this.$notification['success']({
                          message: '操作成功',
                          description:res.message
                        });
                        this.getData();
                    }else{
                       this.$notification['error']({
                          message: '操作失败',
                          description:res.message
                        });
                         this.getData();
                    }
            },

        async details(record){
              console.log(record)
              const res = await api.user.queryById({id:record.id}); 
               const res1 = await api.role.list({pageNumber:this.pageNumber,pageSize:this.pageSize})
                  if (res1.code === 200) {
                    this.selectData = res1.data.content
                  }
              console.log(res)
                if (res.code === 200) {
                      this.visible = true;
                      this.userDetails = res.data
                      this.userId = res.data.id
                      console.log(this.userDetails)
                      console.log(this.userId)
                  }else{
                      this.$notification['error']({
                        message: '查询详情失败',
                        description:res.message
                      });
                  }
        },
          // 选择框到底部，加载查询
        async popupScroll(e) {
                if(this.total === this.selectData.length){
                  return 
                }else{
                if (e.target.scrollTop === e.target.scrollHeight-250) {
                    this.selectPage++;
                    const res = await await api.role.list({pageNumber:this.selectPage,pageSize:this.pageSize})
                    if (res.code === 200) {
                       let roleData = res.data.data.content
                        this.selectData = this.selectData.concat(roleData)
                    }
                  }
                   
                }
            },
        // 请求角色查询列表
        async  getData(){
            const res = await api.user.list({pageNumber:this.pageNumber,pageSize:this.pageSize});
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
          clearData(){
            this.userDetails = {}
          }
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

 .permissionList{
   float:left;
   width:23%;
   border:1px solid #eee;
   margin:1%;
   padding:0 10px 10px 10px;
   border-radius: 4px;
    li{
      padding-top: 10px;
      list-style: none;
    }
 }
.ant-table-thead > tr > th, .ant-table-tbody > tr > td {
  padding: 10px;
}
</style>

 