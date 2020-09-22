<template>
    <div>
       
          <!-- 新增功能 -->
        <div style="width:100%;height:60px;background:#fff;margin-bottom:24px;margin-top:24px;line-height:60px;padding-left:20px">
            <a-button type="primary" @click="newMessage" v-if="isPromiss('mallAddBrand')">新增</a-button>
        </div>
        <!-- 查询表格 -->
         <div style="width:100%;background:#fff;padding:20px 20px 0;">
            <a-table
                :pagination="pagination"
                :columns="headerTable"
                :dataSource="dataSource"
                rowKey="id"
                @change="onChange"
            >
                <div slot="isDefault" slot-scope="text,record">
                    <a-switch @change="showOrHideBrand(record)" :checked="record.isDefault === 0 ? true : false  " style="margin-bottom:5px" />
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

        <!-- 查询sku列表 -->
        <a-modal>
            <template>
                 <a-table
                    :pagination="pagination"
                    :columns="headerTable"
                    :dataSource="dataSource"
                    rowKey="id"
                    @change="onChange"
                >
                    <div slot="cover" slot-scope="text,record">
                        <img v-if="record.cover" style="width:50px;heigth:50px" :src="photoDomain + record.cover" alt="">
                    </div>
                    <div slot="details" slot-scope="text,record">
                        <img v-if="record.details" style="width:50px;heigth:50px" :src="photoDomain + record.details" alt="">
                    </div>
                    <div slot="sellStatus" slot-scope="text,record">
                        <a-switch @change="showOrHideBrand(record)" :checked="record.sellStatus === 0 ? true : false  " style="margin-bottom:5px" />
                    </div>
                    <div slot="showStatus" slot-scope="text,record">
                        <a-switch @change="showOrHideBrand(record)" :checked="record.showStatus === 0 ? true : false  " style="margin-bottom:5px" />
                    </div>
                    <div slot="action" slot-scope="text,record">
                        <a-button style="margin-right:5px" @click="edMessage(record)" v-if="isPromiss('mallUpdateBrand')">编辑</a-button>
                        <a-button type="danger" @click="delMessage(record)" v-if="isPromiss('mallDeleteBrandById')">删除</a-button>
                    </div>
                </a-table>

            </template>
        </a-modal>
       





        <!-- 新增修改弹出框 -->
        <a-modal width="700px" :visible="isShow" @cancel="cancel" @ok="onSubmit">
           
            <a-form-model ref="ruleForm" :model="form" :label-col="labelCol" >
                <a-row>
                    <a-col :span="12">
                    <a-form-model-item label="品牌名称">
                        <a-select  v-model="form.brandName" @change="getBrandId" style="width: 48%">
                             <a-select-option v-for="item  in getBrand" :key="item.id" >
                               {{item.brandName}}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                    </a-col>

                    <a-col :span="12">
                    <a-form-model-item label="商品类别名称">
                        <a-tree-select
                            @change = "getCategoryID"
                            :replaceFields="replaceFields"
                            :load-data="onLoadData" 
                            v-model="form.categoryName"
                            style="width: 54%"
                            :tree-data="treeData"
                        >
                        </a-tree-select>
                    </a-form-model-item>
                    </a-col>
                </a-row>

            <a-row>
                <a-col :span="12">
                <a-form-model-item label="商品封面">
                <template>
                    <a-upload
                    name="cover"
                    list-type="picture-card"
                    class="avatar-uploader"
                    :show-upload-list="false"
                    :customRequest="requestCover"
                    >
                    <img style=" width: 128px;height: 128px;" v-if="form.cover" :src="photoDomain+form.cover" alt="cover" />
                    <div v-else>
                        <a-icon :type="loading ? 'loading' : 'plus'" />
                        <div class="ant-upload-text">
                        上传图片
                        </div>
                    </div>
                    </a-upload>
                </template>
                </a-form-model-item>
                </a-col>


                 <a-col :span="12">
                <a-form-model-item label="商品详情(落地页)">
                <template>
                    <a-upload
                    name="details"
                    list-type="picture-card"
                    class="avatar-uploader"
                    :show-upload-list="false"
                    :customRequest="requestDetails" 
                    >
                    <img style=" width: 128px;height: 128px;" v-if="form.details" :src="photoDomain+form.details" alt="details" />
                    <div v-else>
                        <a-icon :type="loading ? 'loading' : 'plus'" />
                        <div class="ant-upload-text">
                        上传图片
                        </div>
                    </div>
                    </a-upload>
                </template>
                </a-form-model-item>
                </a-col>
            </a-row>


             

            <a-row>
                <a-col :span="12">
                <a-form-model-item label="商品名称" :wrapper-col="{span: 10, offset: 0 }">
                <a-input v-model="form.productName" placeholder="请输入商品名称"/>
                </a-form-model-item>
                </a-col>

                <a-col :span="12">
                <a-form-model-item label="商品价格" :wrapper-col="{span: 10, offset: 0 }">
                    <a-input v-model="form.price" placeholder="请输入商品价格"> </a-input>
                </a-form-model-item>
                </a-col>
            </a-row>

            <a-row>
                <a-col :span="12">

                <a-form-model-item label="销售状态">
                    <template>
                        <a-radio-group v-model="form.sellStatus"  name="radioGroup" @change="getSellStatus">
                            <a-radio :checked="form.sellStatus === 0 ? false : true" :value="0">
                            上架
                            </a-radio>
                            <a-radio :checked="form.sellStatus === -1 ? true : false" :value="-1">
                            下架
                            </a-radio>
                        </a-radio-group>
                    </template>
                </a-form-model-item>
                </a-col>
                 <a-col :span="12">
                <a-form-model-item label="显示状态">
                    <template>
                        <a-radio-group v-model="form.showStatus" name="radioGroup" @change="getShowStatus">
                            <a-radio :checked="form.showStatus === 0 ? false : true" :value="0">
                            显示
                            </a-radio>
                            <a-radio :checked="form.showStatus === -1 ? true : false" :value="-1">
                            隐藏
                            </a-radio>
                        </a-radio-group>
                    </template>
                </a-form-model-item>
                 </a-col>
            </a-row>


            <a-form-model-item  label="商品图片" :label-col="{ span: 4, offset: 0 }" :wrapper-col="{span: 18, offset: 0 }">
            <template>
                <a-upload
                    list-type="picture-card"
                    :show-upload-list="false"
                    :customRequest="customRequest" 
                >

                    <div>
                    <a-icon type="plus" />
                    <div class="ant-upload-text">
                        上传图片
                    </div>
                    </div>
                </a-upload>
                <div class="photoList">
                    <div @mouseover="mouseOver(index)"  @mouseleave="mouseLeave()" v-for="(item , index) in imgList" :key="index"  class="imgModel" >
                    <img style="width:102px;height:102px"  :src=" photoDomain + item" alt="">
                    <div v-show="index === i ? true : false" class="iconModel"> 
                        <a-icon style="color:#fff; margin-right:20px;" @click="deleteImg(index)" type="delete" />
                        <a-icon style="color:#fff;"  type="eye" @click="previewImg(index)"/>
                    </div>
                </div>
                </div>

                <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                    <img alt="example" style="width: 100%" :src="previewImage" />
                </a-modal>
            </template>
            </a-form-model-item>
          </a-form-model>

        </a-modal>



    </div>



</template>
<script>
import api from '@/api/axisoConfig'

const headerTable =  [
  {
    title: 'sku名称',
    dataIndex: 'skuName',
  },
   {
    title: 'sku价格',
    dataIndex: 'skuPrice',
  },
  {
    title: '是否默认',
     scopedSlots: { customRender: 'isDefault' }
  },
  {
    title: '是否显示(显示，隐藏)',
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



const columns = [
  {
    title: '品牌名称',
    dataIndex: 'brandName',
  },
   {
    title: '类别名称',
    dataIndex: 'categoryName',
  },
   {
    title: '商品封面',
     scopedSlots: { customRender: 'cover' }
  },
   {
    title: '商品详情(落地页)',
     scopedSlots: { customRender: 'details' }
  },
   {
    title: '商品价格',
    dataIndex: 'price',
  },
   {
    title: '商品名称',
    dataIndex: 'productName',
  },
  {
    title: '销售状态(上架，下架)',
     scopedSlots: { customRender: 'sellStatus' }
  },
  {
    title: '是否显示(显示，隐藏)',
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
  data() {
    return {

    replaceFields:{
        children:'subordinate', 
        title:'categoryName', 
        key:'id', 
        value:'id'
        },


      getBrand:[],
      treeData:[],

      photoDomain : 'http://shop.itaojia.com/img/Taojia',
      // 表头
      columns: columns,
      // 表身
      dataSource: [],
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
      isIcon:false,
      previewVisible: false,
      previewImage: '',
      imgList:[],
      form:{
        brandId:"",
        brandName: "请选择",
        categoryId: "",
        categoryName: "请选择",
        cover: "",
        details: "",
        id: "",
        pic: "",
        price: 0,
        productName: "",
        sellStatus: 0,
        showStatus: 0,
        spu: "",
      },
    //   rules:[],

      labelCol: { span: 8 },
      wrapperCol: { span: 10 },
      loading:false,
      isShow:false,
      i:null,
    };
  },
  mounted(){
      this.getData()
      this.getBrands()
      this.getCategory()
  },
  methods: {
      cancel(){
          this.isShow = false
      },



      getCategoryID(value){
          this.form.categoryId = value
      },



      getBrandId(option){
        console.log(option)
        this.form.brandId  = option
      },





       // 点击确定
         onSubmit() {
            this.$refs.ruleForm.validate(async valid => {
              if (valid) {
                  this.form.pic = this.imgList.toString()
                  console.log(this.form)
                // 新增
                if(this.form.id === ''){
                   const res = await api.commodity.add(this.form);

                    if (res.code === 200) {
                        this.$notification['success']({
                          message: '新增商品成功',
                          description:res.message
                        });
                        this.getData();
                    }else{
                       this.$notification['error']({
                          message: '新增商品失败',
                          description:res.message
                        });
                         this.getData();
                    }
                    this.visible = false
                }else{
                  // 修改
                  console.log(this.form)
                  const res = await api.commodity.update(this.form);
                   if (res.code === 200) {
                        this.$notification['success']({
                          message: '修改商品成功',
                          description:res.message
                        });
                        this.getData();
                    }else{
                       this.$notification['error']({
                          message: '修改商品失败',
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


      newMessage(){
          this.isShow = true
      },




       getShowStatus(event){
            console.log(event)
            this.form.showStatus = event.target.value
        },

        getSellStatus(event){
            console.log(event)
            this.form.sellStatus = event.target.value
        },
        




      requestCover(data){
           console.log(data)
        let url = 'https://shopping.itaojia.com/Taojia/file/upload/image.do'
        const formData = new FormData() 
        formData.append('file', data.file)
        formData.append('kind','other')
        formData.append('owner','admin')
        formData.append('operator_id','2')
        formData.append('device','1')
        formData.append('state','1')
        formData.append('operator_token','GQkXoAorv1KZRqmCLJ537sTU97c3v7jP_1')
    // operator_token: 2u2oLMYICXARXDpC1auQg1qad3ebNmkB_1
        const xhr = new XMLHttpRequest();  // XMLHttpRequest 对象
        xhr.open("post", url, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
        xhr.send(formData); //开始上传，发送form数据
        xhr.onload = () => {
            const res = JSON.parse(xhr.response)
            let imgUrl = res.data[0].url
            this.form.cover = imgUrl
            console.log(this.form.cover)
        }
      },

    requestDetails(data){
         console.log(data)
        let url = 'https://shopping.itaojia.com/Taojia/file/upload/image.do'
        const formData = new FormData() 
        formData.append('file', data.file)
        formData.append('kind','other')
        formData.append('owner','admin')
        formData.append('operator_id','2')
        formData.append('device','1')
        formData.append('state','1')
        formData.append('operator_token','GQkXoAorv1KZRqmCLJ537sTU97c3v7jP_1')
    // operator_token: 2u2oLMYICXARXDpC1auQg1qad3ebNmkB_1
        const xhr = new XMLHttpRequest();  // XMLHttpRequest 对象
        xhr.open("post", url, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
        xhr.send(formData); //开始上传，发送form数据
        xhr.onload = () => {
            const res = JSON.parse(xhr.response)
            let imgUrl = res.data[0].url
            this.form.details = imgUrl
            console.log(this.form.details)
        }
    },



    async getBrands(){
        const res = await api.brand.list({pageNumber:this.pageNumber,pageSize:this.pageSize})
         if (res.code === 200) {
            console.log(res.data.content)
            this.getBrand = res.data.content
        }
      },

    async getCategory(){
        const res = await api.category.list()
        if (res.code === 200) {
            this.treeData = res.data.content
        }
    },

     async onLoadData(treeNode) {
            let data  = treeNode.dataRef
            const res = await api.category.list({id:data.id})
            if (res.code === 200) {
                data.subordinate = res.data.content
                this.treeData = [...this.treeData]
            }

        },




        // 点击分页
          onChange(e){
            console.log(e)
            this.pageNumber = e.current;
            this.getData();
          },

    async getData(){
        const res = await api.commodity.list({pageNumber:this.pageNumber,pageSize:this.pageSize})
        console.log(res)
        if (res.code === 200) {
            console.log(res.data.content)
            this.dataSource = res.data.content
        }
    },





      isShow1(){
          this.isShow = true
      },


      mouseOver(i){
          this.i = i
      
      },
    mouseLeave(){
           this.i = null
    },

    deleteImg(index){
        let img = this.imgList[index]
        console.log(img)
        this.imgList.splice(index ,1)
        console.log(this.imgList)
    },

    previewImg(index){
        this.previewVisible = true
        let img = this.imgList[index]
        this.previewImage = this.photoDomain + img
        console.log(this.previewImage)
    },
    handleCancel(){
        this.previewVisible = false
    },

    // 图片上传
    customRequest(data){ // 上传提交
    console.log(data)
        let url = 'https://shopping.itaojia.com/Taojia/file/upload/image.do'
        const formData = new FormData() 
        formData.append('file', data.file)
        formData.append('kind','other')
        formData.append('owner','admin')
        formData.append('operator_id','2')
        formData.append('device','1')
        formData.append('state','1')
        formData.append('operator_token','GQkXoAorv1KZRqmCLJ537sTU97c3v7jP_1')
    // operator_token: 2u2oLMYICXARXDpC1auQg1qad3ebNmkB_1
        const xhr = new XMLHttpRequest();  // XMLHttpRequest 对象
        xhr.open("post", url, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
        xhr.send(formData); //开始上传，发送form数据
        xhr.onload = () => {
            const res = JSON.parse(xhr.response)
            let imgUrl = res.data[0].url
            this.imgList.push(imgUrl)
            console.log(this.imgList)
        }
    },
  },
};
</script>
 <style lang="less" scoped>
    /* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.photoList{
    width: 100%;

}



.imgModel{
    float: left;
    width:102px;
    height:102px;
    margin-right: 10px;
    margin-top: 10px;
    position: relative;
}
.iconModel{
    position:absolute;
    top: 0;
    left: 0;
    width: 102px;
    height: 102px;
    background: rgb(0,0,0);
    opacity: 0.5;
    text-align: center;
    line-height: 102px;
    cursor: pointer;

}
</style>
