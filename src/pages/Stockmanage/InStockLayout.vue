<template>
    <div class="in-stock">
        <el-form>
          <el-form-item label="Box型号：" label-width="80px"  >
            <el-select  placeholder="请选择Box型号" v-model="inStock.collector_model" value-key="collector_model">
              <el-option :label="item.collector_model" :value="item.collector_model" v-for="(item,index) in collectorData" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="采集器id：" label-width="80px">
            <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入内容(注：多个id回车隔开)"
            v-model="collector_id">
            </el-input>
          </el-form-item>
          <el-form-item label="测试：" label-width="80px">
            <el-select  placeholder="请选择" v-model="inStock.check_result"> 
              <el-option :label="item.label" :value="item.id" v-for="(item,index) in options" :key="index"></el-option>
            </el-select>
          </el-form-item>
          
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="Cancel">取 消</el-button>
            <el-button type="primary" @click="InStock" >确 定</el-button>
        </div>
    </div>
</template>
<script>
export default {
name: 'InStock',
data(){
    return{
        collectorData:[],
        collector_id:"",
        inStock:{
            collector_model:"",
            collector_id:[],
            check_result:""
        },
        options:[
            {
            id:0,
            label:"不合格"
            },
            {
            id:1,
            label:"合格"
            }
        ]
    }
},
methods:{
    async getBoxModel(){
         const {result} = await this.$http('models');
         this.collectorData=result.rows
    },
    async InStock(){
        this.inStock.collector_id=this.collector_id.split("\n");
        const {result} = await this.$http.post('devices',this.inStock);
        this.$message({
            message: '成功入库',
            type: 'success'
        })  
        this.Cancel();
        this.$emit("getTypeList");
    },
    Cancel(){
       this.$emit("Cancel")
       this.inData()
    },
    inData(){
        this.inStock.collector_model = '';
        this.inStock.check_result = '';
        this.collector_id = '';
    }

},
created(){
    this.getBoxModel()
    this.inData()
}
}
</script>
<style lang="scss" scoped>
.in-stock{
    .dialog-footer{
        text-align: right;
    }
    .el-textarea{
        width:98%;
    }
    .el-select{
        width:370px;
    }
}
</style>


