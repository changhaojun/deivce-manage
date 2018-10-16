<template>
    <div class="out-stock">
        <el-form>
            <el-form-item label="出库客户：" label-width="100px">
              <el-select  placeholder="请选择客户" v-model="OutOrBackStockParams.customer_id" value-key="_id">
                <el-option :label="customers.customer_name" :value="customers._id" v-for="(customers,index) in customer" :key="index"></el-option>
              </el-select>
            </el-form-item>
        </el-form> 
        <div slot="footer" class="dialog-footer">
            <el-button @click="Cancel">取 消</el-button>
            <el-button type="primary" @click="SureOutStock">确 定</el-button>
        </div>  
    </div>
</template>
<script>
export default {
    name: 'OutStock',
    props:["item"],
    data(){
        return{
            customer:[],
            OutOrBackStockParams:{ //出库或者退库参数
                customer_id:"",
                type:"outstock",
                user_id:sessionStorage.getItem('user_id')
            },
        }
    },
    methods:{
        //获取客户
        async getCustomer(){
            const {result} = await this.$http('customer');
            this.customer = result.rows;
        },
        //确定出库
        async SureOutStock(){
            const {result} = await this.$http.put('devices/'+this.item._id,this.OutOrBackStockParams);
            this.$message({
                message: '成功出库',
                type: 'success'
            })  
            this.Cancel();
            this.$emit("getTypeList");
        },
        initData(){
             this.OutOrBackStockParams.customer_id = "";
        },
         Cancel(){
            this.$emit("Cancel")
            this.initData()
        },

    },
    created(){
         this.getCustomer();
    }
}
</script>
<style lang="scss" scoped>
 .out-stock{
      .dialog-footer{
        text-align: right;
    }
 }
</style>


