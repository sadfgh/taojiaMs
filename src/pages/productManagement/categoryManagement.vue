<template>
    <div class="main">
        <template>
            <div style="margin:20px 0">
                <a-button @click="basiAdd()" class="btn" type="primary">新增根类别</a-button>
            </div>
            <a-tree 
            showLine
            blockNode
            :load-data="onLoadData" 
            :replaceFields="replace" 
            :tree-data="treeData">
                <template slot="columns" slot-scope="item">
                    <div class="action-modle">
                        <div class="action-left">
                            <!-- <span>类别名称：<strong>{{item.dataRef.categoryName}}</strong></span> -->
                            <span>类别名称：<strong>{{item.categoryName}}</strong></span> 
                            <span>显示状态：<a-switch @change="showOrHideCategorys(item)" :checked="item.dataRef.showStatus === 0 ? true : false "/></span>
                        </div>
                        <div class="action-right">
                            <a-button @click="add(item)" class="btn" type="primary">新增</a-button>
                            <a-button @click="editing(item)" class="btn">修改</a-button>
                            <a-button @click="del(item)" class="btn" style="background:#f5222d;color:#fff">删除</a-button>
                        </div>
                    </div>
                </template>
            </a-tree>
        </template>
        <template>
            <a-modal destroyOnClose v-model="visible" @cancel="cancel" @ok="onSubmit">
                <a-form-model ref="ruleForm" :model="form"  :rules="rules" >
                  <a-form-model-item label="类别名称" prop="categoryName" >
                    <a-input v-model="form.categoryName" placeholder="请输入类别名称"/>
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
                </a-form-model>
            </a-modal>
        </template>
    </div>
</template>
<script>
import api from '@/api/axisoConfig'

export default {
    data(){
        return {
            isAddorEdl:0,
            visible:false,
            form:{
               categoryName:'',
               showStatus:0,
               id:'' 
            },
            rules: {
                categoryName:[{ required: true, message: '请输入类别名称', trigger: 'blur' }],
                },
            replace:{
              children:'subordinate', 
                title:'categoryName', 
                key:'id' 
            },
            treeData: [],
        }
    },
    mounted(){
        this.getDataBais()
    },
    created(){
    },
    methods:{
      async getDataBais(data){
            if (data) {
                console.log(data)
                 const res = await api.category.list({id:data.id})
                   if (res.code === 200) {
                        let backData = res.data.content
                        if (backData) {
                            backData.forEach(item => {
                                item.scopedSlots = {title : 'columns'}
                            });
                        }
                    data.subordinate = backData
                    return backData
                    }else{
                        this.$notification['error']({
                            message: '请求数据失败',
                            description:res.message
                        });
                    }
                     this.treeData = [...this.treeData];
            }else{
                const res = await api.category.list()
                  if (res.code === 200) {
                    let backData = res.data.content
                    if (backData) {
                        backData.forEach(item => {
                            item.scopedSlots = {title : 'columns'}
                        });
                    }
                    this.treeData = backData
                    console.log(this.treeData)
                }else{
                    this.$notification['error']({
                        message: '请求数据失败',
                        description:res.message
                    });
                }
            }
          

        },

        basiAdd(){
            this.form = {id:'',showStatus:0}
            console.log(this.form)
            this.visible = true
        },









        cancel(){
            this.form = {}
            // this.getDataBais()
            this.treeData = [...this.treeData]
        },





     recursion(item , id , arr){
        //  let backid = id
         console.log(item)
        if (item) {
            item.forEach(item =>{
               console.log('实际id'+id)
               console.log('对比id'+ item.id)
               console.log("---------------------")
                if (id === item.id) {
                    item.subordinate = arr
                    return false
                }else {
                    this.recursion(item.subordinate ,id , arr)
                }
            })
        }
        // if (item) {
        //     item.forEach(item =>{
        //         if (id === item.id) {
        //             item.subordinate
        //         }
        //     })
        // }
    },



        //提交
        onSubmit(){
             this.$refs.ruleForm.validate(async valid => {
                console.log(valid)
                if (valid) {
                    if (this.isAddorEdl === 0) {
                        console.log(this.form)
                        //进入新增接口
                        const res = await api.category.add(this.form)
                         if (res.code === 200) {
                            this.visible = false
                            var arr = []
                            if (this.form.id === '') {
                                 arr = await this.getDataBais()
                            }else{
                                arr = await this.getDataBais(this.form)
                                
                            }
                            let treedata = this.treeData
                            console.log(arr)
                            this.recursion(treedata , this.form.id , arr)
                           
                            this.treeData = [...this.treeData]
                            this.$notification['success']({
                                message: '新增类别成功',
                                description: res.message
                            });

                        }else{
                            this.visible = false
                            this.$notification['error']({
                                message: '新增类别失败',
                                description:res.message
                            });
                        }

                    }else{
                        //进入修改接口
                         const res = await api.category.update(this.form)
                         if (res.code === 200) {
                            this.visible = false
                            if (this.form.pid === null) {
                                const res = await api.category.list()
                                let arr =[]
                                if (res.code === 200) {
                                    let backData = res.data.content
                                    if (backData) {
                                        backData.forEach(item => {
                                            item.scopedSlots = {title : 'columns'}
                                        });
                                    }
                                    arr = backData
                                }
                                this.treeData = arr
                                // let treedata = arr

                                // this.recursion(treedata , arr)
                            
                                // this.treeData = [...this.treeData]
                            }else{
                                const res = await api.category.list({id:this.form.pid})
                                let arr =[]
                                if (res.code === 200) {
                                    let backData = res.data.content
                                    if (backData) {
                                        backData.forEach(item => {
                                            item.scopedSlots = {title : 'columns'}
                                        });
                                    }
                                    arr = backData
                                }
                                let treedata = this.treeData

                                this.recursion(treedata , this.form.pid , arr)
                            
                                this.treeData = [...this.treeData]
                            }
                            


                            this.$notification['success']({
                                message: '修改类别成功',
                                description: res.message
                            });

                        }else{
                            this.visible = false
                            this.$notification['error']({
                                message: '修改类别失败',
                                description:res.message
                            });
                        }
                    }
                }
                return false
             })
        },


        async showOrHideCategorys(values){
            console.log(values)
               const res = await api.category.showOrHideCategory({id:values.dataRef.id})
               if (res.code === 200) {
                    this.$notification['success']({
                        message: '状态修改成功',
                        description:res.message
                    });
                    console.log(values.showStatus)
                    if (values.dataRef.showStatus === 0) {
                        values.dataRef.showStatus = -1
                    }else{
                       values.dataRef.showStatus = 0
                    }
               }else{
                   this.$notification['success']({
                        message: '状态修改失败',
                        description:res.message
                    });
               }
            },








        
        //显示隐藏
         getShowStatus(event){
                console.log(event)
                this.form.showStatus = event.target.value
            },


        // 增加
        add(item){
            this.form = {pid:item.dataRef.id,id:item.dataRef.id,showStatus:0}
            console.log(this.form)
            this.visible = true
            console.log(item)
        },
        // 修改
        editing(item){
            this.form =  {
                id:item.dataRef.id, 
                pid:item.dataRef.pid,
                categoryName:item.dataRef.categoryName,
                showStatus:item.dataRef.showStatus
                }
            console.log(this.form)
            this.isAddorEdl = -1
            this.visible = true
        },
        //删除
        async del(item){
            console.log(item)
            const res = await api.category.del({id:item.dataRef.id})
                if (res.code === 200) {
                    if (item.dataRef.pid === null) {
                        const res = await api.category.list()
                         let arr =[]
                        if (res.code === 200) {
                            let backData = res.data.content
                                if (backData) {
                                    backData.forEach(item => {
                                        item.scopedSlots = {title : 'columns'}
                                    });
                                }
                                arr = backData
                                this.treeData = arr

                            }
                        
                    }else{
                         const res = await api.category.list({id:item.dataRef.pid})
                            let arr =[]
                            if (res.code === 200) {
                                let backData = res.data.content
                                if (backData) {
                                    backData.forEach(item => {
                                        item.scopedSlots = {title : 'columns'}
                                    });
                                }
                                arr = backData
                            }
                            let treedata = this.treeData
                            this.recursion(treedata , item.dataRef.pid , arr)
                            this.treeData = [...this.treeData]
                    }
                   
                    this.$notification['success']({
                        message: '删除类别成功',
                        description: res.message
                    });

            }else{
                this.$notification['error']({
                    message: '删除类别失败',
                    description:res.message
                });
            }
        },
        //加载下级
        async onLoadData(treeNode) {
            let data  = treeNode.dataRef
            this.getDataBais(data)
            },
    },
    components:{

    }
}
</script>
<style lang="less" scoped>
.main{
    width: 100%;
    // height: 520px;
    background: #fff;
    padding: 20px;
}
.action-modle{
    display: flex;
    width: 100%;
}
.action-left{
    flex: 1;
    display: flex;
    span{
        margin-right: 40px;
        flex: 1;
    }
}
.action-right{
    flex: 1;
    text-align: right;
}


.btn{
    margin: 0 10px;
}
</style>


