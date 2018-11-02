<template>
    <div class="add-contract">
        <el-form>
            <el-form-item label="合同编号：" label-width="100px">
                <el-input placeholder="请输入内容" v-model="params.pact_number"> </el-input>
            </el-form-item>
            <el-form-item label="项目名称：" label-width="100px">
                <el-input placeholder="请输入内容" v-model="params.items"> </el-input>
               
            </el-form-item>
            <el-form-item label="采集器数量：" label-width="100px">
                <el-input-number placeholder="请输入内容" v-model="params.collector_amount" controls-position="right" :min="0">
                 </el-input-number>
            </el-form-item>
            <el-form-item label="签订日期：" label-width="100px">
                <el-date-picker
                    v-model="params.signing_date"
                    type="date"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="签订人：" label-width="100px">
                <el-input placeholder="请输入内容" v-model="params.signatory">
                 </el-input>
            </el-form-item>
            <el-form-item label="服务时长：" label-width="100px">
                <el-input-number placeholder="请输入内容" v-model="params.viability" controls-position="right" :min="0">
                </el-input-number>
                <span class="note">单位：月</span> 
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="Cancel">取 消</el-button>
            <el-button type="primary" @click="surePostContract">确 定</el-button>
        </div>
    </div>
</template>
<script>
export default {
    name: "AddContract",
    props:['itemData'],
    data(){
        return{
            params:{
                pact_number:this.itemData.pact_number?this.itemData.pact_number:"",
                collector_amount:this.itemData.collector_amount?this.itemData.collector_amount:"",
                signing_date:this.itemData.signing_date?this.itemData.signing_date:"",
                signatory:this.itemData.signatory?this.itemData.signatory:"", //签订人
                items:this.itemData.items?this.itemData.items:"",
                viability: this.itemData.viability?this.itemData.viability:"",
            }
        }
    },
    methods:{
        reset(){
            this.params.pact_number = '';
            this.params.collector_amount = '';
            this.params.signing_date = '';
            this.params.signatory = '';
            this.params.viability = '';
            this.params.items = '';
        },
        Cancel(){
            this.$emit("Cancel");
            if(!this.itemData){
                this.reset();
            }
        },
        async surePostContract(){
            if(this.params.pact_number === '' || this.params.signing_date === '' || this.params.signatory === '' || this.params.items === ''){
                this.$message({
                    message: '请完善信息',
                    type: 'warning'
                })
            }else{
                if(this.itemData){
                    const {result} = await this.$http.put('pact/'+this.itemData._id,this.params)
                }else{
                    const {result} = await this.$http.post('pact',this.params);
                }
                this.$message({
                    message: '添加成功',
                    type: 'success'
                })
                this.$emit("Cancel");
                this.$emit('getContract');
            } 
        },
    },
    watch:{  
       itemData(item){
           if(item){
                this.params =JSON.parse(JSON.stringify(item)) ; 
           }
       }
    },
    created(){    
    }
    
}
</script>
<style lang="scss">
.add-contract{
    .el-form-item{
      margin-bottom:10px;
    }
    .dialog-footer{
        text-align:right
    }
}
</style>


