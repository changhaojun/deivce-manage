<template>
    <div class="out-stock">
        <el-tabs :tab-position="tabPosition" style="height: 200px;">
            <el-tab-pane label="正常出库">
                <el-form>
                    <el-form-item label="出库系统：" label-width="100px">
                        <el-select placeholder="请选择系统" v-model="OutOrBackStockParams.system" value-key="id" filterable>
                            <el-option :label="item.label" :value="item.id" v-for="(item,index) in systemOption" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="出库客户：" label-width="100px">
                        <el-select placeholder="请选择客户" v-model="OutOrBackStockParams.customer_id" value-key="_id" filterable v-if="OutOrBackStockParams.system!==3">
                            <el-option :label="customers.customer_name" :value="customers._id" v-for="(customers,index) in customer" :key="index"></el-option>
                        </el-select>
                        <el-select placeholder="请选择客户" v-model="OutOrBackStockParams.customer_id" value-key="_id" filterable v-if="OutOrBackStockParams.system===3">
                            <el-option :label="companys.customer_name" :value="companys._id" v-for="(companys,index) in company" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="替换出库">
                替换出库
            </el-tab-pane>
        </el-tabs>
        
        <div slot="footer" class="dialog-footer">
            <el-button @click="Cancel">取 消</el-button>
            <el-button type="primary" @click="SureOutStock">确 定</el-button>
        </div>
    </div>
</template>
<script>
export default {
    name: 'OutStock',
    props: ["item"],
    data() {
        return {
            tabPosition: 'top',
            customer: [],
            company:[],
            OutOrBackStockParams: { //出库或者退库参数
                customer_id: "",
                type: "outstock",
                user_id: sessionStorage.getItem('user_id'),
                system:"",
            },
            systemOption:[
                {
                   id:1,
                   label:"Box系统" 
                },
                {
                    id:2,
                    label:"揽月平台"
                },
                {
                    id:3,
                    label:'秦皇岛'
                }
            ]
        }
    },
    methods: {
        //获取客户
        async getCustomer() {
            const customerResult = await this.$http('customer');
            // const companyResult = await this.$http('company');  
            this.customer = customerResult.result.rows;
            // this.company = companyResult.result.rows;
            console.log(this.customer)
        },
        //确定出库
        async SureOutStock() {
            console.log(this.item)
            // if (this.OutOrBackStockParams.customer_id) {
            //     const { result } = await this.$http.put('devices/' + this.item._id, this.OutOrBackStockParams);
            //     this.$message({
            //         message: '成功出库',
            //         type: 'success'
            //     })
            //     this.Cancel();
            //     this.$emit("getTypeList");
            // } else {
            //     this.$message({
            //         message: '请选择出库公司',
            //         type: 'warning'
            //     })
            // }
        },

        initData() {
            this.OutOrBackStockParams.customer_id = "";
            this.OutOrBackStockParams.system = "";
        },
        Cancel() {
            this.$emit("Cancel")
            this.initData()
        },

    },
    created() {
        this.getCustomer();
    }
}
</script>
<style lang="scss" scoped>
.out-stock {
    .el-dialog{
         .el-dialog__body{
            padding-top:0
        }
    }
    .dialog-footer {
        text-align: right;
    }
    .note{
        color:#cdcdcd
    }
}
</style>


