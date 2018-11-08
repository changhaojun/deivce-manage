<template>
    <div class="back-stock">
        <el-form>
            <el-form-item label="退库原因：" label-width="100px">
              <el-select  placeholder="请选择原因" v-model="OutOrBackStockParams.fault_id" value-key="_id">
                <el-option :label="item.fault_name" :value="item._id" v-for="(item,index) in faultList" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注：" label-width="100px">
                <el-input   type="textarea" placeholder="请输入内容" v-model="OutOrBackStockParams.remark">  </el-input>
            </el-form-item>
          </el-form> 
           <div slot="footer" class="dialog-footer">
                <mu-button @click="Cancel" flat class="cancel" normal>取 消</mu-button>
                <mu-button color="primary" @click="SureBackStock" normal>确 定</mu-button>
          </div> 
    </div>
</template>
<script>
export default {
    name: "BackStock",
    props:["item"],
    data(){
        return{
            faultList:[],
            OutOrBackStockParams:{ //出库或者退库参数
                // customer_id:this.item.customer_id,
                collector_id:[this.item.collector_id],
                type:"backstock",
                fault_id:"",
                remark:"",
                user_id:sessionStorage.getItem('user_id'),
                user_name:sessionStorage.getItem('fullname')
            },
        }
    },
    methods:{
        //获取故障列表
        async getFault(){
            const {result} = await this.$http('fault');
            this.faultList = result.rows;
        },
        //确定退库
        async SureBackStock(){
            if(this.OutOrBackStockParams.fault_id){
                const {result} = await this.$http.put('devices',this.OutOrBackStockParams);
                this.$message({
                    message: '成功退库',
                    type: 'success'
                })  
                this.Cancel();
                this.$emit("getTypeList");
            }else{
                this.$message({
                    message: '请选择退库原因',
                    type: 'warning'
                })
            }
        },
        initData(){
            this.OutOrBackStockParams.fault_id = "";
        },
         Cancel(){
            this.$emit("Cancel")
            this.initData()
        },
    },
    watch:{
        item(val){
            this.OutOrBackStockParams.collector_id = [];
            this.OutOrBackStockParams.collector_id.push(val.collector_id);
        }
    },
    created(){
        this.getFault()
    }
}
</script>
<style lang="scss" scoped>
.back-stock{
    margin-top:20px;
    .el-textarea,.el-select{
        width:60%;
    }
    .dialog-footer{
        text-align: right;
        .mu-button{
            margin-right:10px;
        }
        .cancel{
            border:1px solid #ccc
        }

    }
}
</style>


