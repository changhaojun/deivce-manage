<template>
    <div class="back-stock">
        <el-form>
            <el-form-item label="退库原因：" label-width="100px">
              <el-select  placeholder="请选择原因" v-model="OutOrBackStockParams.fault_id" value-key="_id">
                <el-option :label="item.fault_name" :value="item._id" v-for="(item,index) in faultList" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-form> 
           <div slot="footer" class="dialog-footer">
            <el-button @click="Cancel">取 消</el-button>
            <el-button type="primary" @click="SureBackStock">确 定</el-button>
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
                customer_id:this.item.customer_id,
                type:"backstock",
                fault_id:"",
                user_id:sessionStorage.getItem('user_id')
            },
        }
    },
    methods:{
        //获取故障列表
        async getFault(){
            const {result} = await this.$http('fault');
            this.faultList = result.rows;
        },
        //确定出库
        async SureBackStock(){
            if(this.OutOrBackStockParams.fault_id){
                const {result} = await this.$http.put('devices/'+this.item._id,this.OutOrBackStockParams);
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
    created(){
        this.getFault()
    }
}
</script>
<style lang="scss" scoped>
.back-stock{
    margin-top:20px;
    .dialog-footer{
        text-align: right;
    }
}
</style>


