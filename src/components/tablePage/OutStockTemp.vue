<template>
    <div class="out-stock">
        <el-form>
            <el-form-item label="出库客户：" label-width="100px">
                <el-select placeholder="请选择客户" v-model="OutOrBackStockParams.customer_name" value-key="_id" filterable @change="changeCustomerSelect">
                    <el-option :label="customers.customer_name" :value="customers" v-for="(customers,index) in customer" :key="index"></el-option>
                </el-select>
                <!-- <el-select placeholder="请选择客户" v-model="OutOrBackStockParams.customer_name" value-key="_id" filterable @change="changeCustomerSelect">
                    <el-option :label="companys.companyName" :value="companys" v-for="(companys,index) in company" :key="index"></el-option>
                </el-select> -->
            </el-form-item>
            <el-form-item label="合同编号：" label-width="100px">
                <el-select placeholder="请选择合同" v-model="OutOrBackStockParams.pact_number" value-key="id" filterable>
                    <el-option :label="item.pact_number" :value="item.pact_number" v-for="(item,index) in pact" :key="index"></el-option>
                </el-select>
            </el-form-item>
        </el-form>  
        <div slot="footer" class="dialog-footer">
            <mu-button @click="Cancel" flat class="cancel" normal>取 消</mu-button>
            <mu-button color="primary" @click="SureOutStock" normal>确 定</mu-button>
        </div>
    </div>
</template>
<script>
export default {
    name: 'OutStock',
    props: ["item", 'batch'],
    data() {
        return {
            customer: [],//出库的客户
            company:[],//出库的公司
            pact:[],//出库的合同
            OutOrBackStockParams: { //出库参数
                customer_id: "", //客户id
                type: "outstock", // 修改类型
                snList:[], // 采集器id
                customer_name:"", //客户名
                user_name: sessionStorage.getItem('fullname'), 
                user_id: sessionStorage.getItem('user_id'), 
                pact_number:""// 合同编号
            }
        }
    },
    methods: {
        //获取客户
        async getCustomer() {
            const customerResult = await this.$http('customer');
            const companyResult = await this.$http('company'); 
            this.customer = customerResult.result.rows;
            this.company = companyResult.result.rows;
            console.log(this.customer)
        },
        //出库合同
        async getPact(){
            const { result } = await this.$http('pact');
            this.pact = result.rows;
        },
        //确定出库
        async SureOutStock() {
            console.log(this.OutOrBackStockParams);
            if(this.OutOrBackStockParams.customer_name === '' || this.OutOrBackStockParams.pact_number === '') {
                this.$message({
                    message: '请完善出库信息',
                    type: 'warning'
                })
            }else {
                const { result } = await this.$http.put('gauge', this.OutOrBackStockParams);
                this.$message({
                    message: '成功出库',
                    type: 'success'
                })
                this.Cancel();
                this.$emit("getTypeList");
            }    
        },
        initData() {
            this.OutOrBackStockParams.customer_id = "";
            this.OutOrBackStockParams.snList = [];
            this.OutOrBackStockParams.customer_name = "";
            this.OutOrBackStockParams.pact_number = "";
        },
        Cancel() {
            this.$emit("Cancel")
            this.initData()
        },
        //是否批量出库
        Isbacth(val){
            console.log(val)
            this.OutOrBackStockParams.snList = [];
            if(this.batch){ //批量出库
               val.forEach((item) =>{
                   this.OutOrBackStockParams.snList.push(item.sn);
               })
            }else{ //单个出库
                this.OutOrBackStockParams.snList.push(val.sn);
            }
        },
        changeCustomerSelect(val) {
            this.OutOrBackStockParams.customer_name = val.customer_name;
            this.OutOrBackStockParams.customer_id = val._id;
        }
    },
    watch:{
        item(val){
            this.Isbacth(val);
        }
    },
    created() {
        this.getCustomer();
        this.getPact();
        this.Isbacth(this.item);
    }
}
</script>
<style lang="scss" scoped>
.out-stock {
    margin-bottom:20px;
    .el-input,.el-input-number,.el-textarea,.el-select{
        width:60%;
    }
    .dialog-footer {
        text-align: right;
         .mu-button{
            margin-right:10px;
        }
        .cancel{
            border:1px solid #ccc
        }
    }
    .note{
        color:#cdcdcd
    }
}
</style>


