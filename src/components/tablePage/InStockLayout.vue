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
            placeholder="请输入内容8位(注：多个id回车或者,或者空格或者、或者. 或者/或者\隔开)"
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
            check_result:"",
            user_id:sessionStorage.getItem('user_id')
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
        ],
        
    }
},
methods:{
    async getBoxModel(){
         const {result} = await this.$http('models');
         this.collectorData=result.rows
    },
    async InStock(){
        const inReg=/\n|,|，|\s+|;|；|'|’|”|"|\.|\/|\\|\|\。|-|`|~|、/
        const itemReg = /\D/
        this.inStock.collector_id=this.collector_id.split(inReg);
        if(this.inStock.collector_id===[]||this.inStock.check_result===""||this.inStock.collector_model===""){
            this.$message({
                message: '请完善信息', 
                type: 'warning'
            }) 
        }else{
            let len=0;
            this.inStock.collector_id.forEach((item,index,arr)=>{
                    if(item.length !== 8 || itemReg.test(item)){
                        this.$message({
                            message: 'id长度或者格式不正确', 
                            type: 'warning'
                        })   
                    }else{
                        len++;
                    }
            })
            if(len===this.inStock.collector_id.length){
                const {result} = await this.$http.post('devices',this.inStock);
                this.$message({
                    message: '成功入库', 
                    type: 'success'
                })  
                this.Cancel();
                this.$emit("getTypeList");
            }
        }
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
        width:98%;
    }
}
</style>


