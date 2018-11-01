<template>
    <div class="out-stock">
        <el-tabs :tab-position="tabPosition" v-model="outStockType" @tab-click="Clicked">
            <el-tab-pane label="正常出库" name="normalStock">
                <el-form>
                    <el-form-item label="出库系统：" label-width="100px">
                        <el-select placeholder="请选择系统" v-model="OutOrBackStockParams.system" value-key="id" filterable @change="changeSystem">
                            <el-option :label="item.label" :value="item.id" v-for="(item,index) in systemOption" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="出库客户：" label-width="100px">
                        <el-select placeholder="请选择客户" v-model="OutOrBackStockParams.customer_name" value-key="_id" filterable v-if="OutOrBackStockParams.system==='manage'" @change="changeCustomerSelect">
                            <el-option :label="customers.customer_name" :value="customers" v-for="(customers,index) in customer" :key="index" v-if="OutOrBackStockParams.system"></el-option>
                        </el-select>
                        <el-select placeholder="请选择客户" v-model="OutOrBackStockParams.customer_name" value-key="_id" filterable v-if="OutOrBackStockParams.system!=='manage'" @change="changeCustomerSelect">
                            <el-option :label="companys.companyName" :value="companys" v-for="(companys,index) in company" :key="index" v-if="OutOrBackStockParams.system"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="合同编号：" label-width="100px">
                        <el-select placeholder="请选择合同" v-model="OutOrBackStockParams.pact_number" value-key="id" filterable>
                            <el-option :label="item.pact_number" :value="item.pact_number" v-for="(item,index) in pact" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注：" label-width="100px">
                        <el-input   type="textarea" placeholder="请输入内容" v-model="OutOrBackStockParams.remark">  </el-input>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="替换出库" v-if="!batch" name="replaceStock">
                <el-form>
                    <el-form-item label="替换目标采集器：" label-width="130px">
                        <el-input  placeholder="请输入内容" v-model="OutOrBackStockParams.replace_collector">  </el-input> 
                    </el-form-item> 
                    <el-form-item label="服务延长：" label-width="130px">
                        <el-input-number placeholder="请输入内容" v-model="OutOrBackStockParams.increase" controls-position="right" :min="0">
                        </el-input-number>
                        <span class="note">   单位：月</span> 
                    </el-form-item> 
                    <el-form-item label="备注：" label-width="130px">
                        <el-input   type="textarea" placeholder="请输入内容" v-model="OutOrBackStockParams.remark">  </el-input>
                    </el-form-item>
                </el-form>
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
    props: ["item", 'batch'],
    data() {
        return {
            tabPosition: 'top',
            copyCollectorId:"",
            customer: [],//出库的客户
            company:[],//出库的公司
            pact:[],//出库的合同
            OutOrBackStockParams: { //出库参数
                customer_id: "", //客户id
                customer_name:"", //客户名 system = manage  customer_name=客户名 ；system = lanyue customer_name=公司名
                type: "outstock", // 修改类型
                user_id: sessionStorage.getItem('user_id'), 
                user_name: sessionStorage.getItem('fullname'), 
                system:"", // 系统
                replace_collector:"", // 替换的采集器id
                increase:0, // 服务延长时间
                pact_number:"", // 合同编号
                collector_id:[], // 采集器id
                remark:"", //  备注
            },
            systemOption:[//出库的系统
                {
                   id:"manage",
                   label:"后台管理系统" 
                },
                {
                    id:"lanyue",
                    label:"秦皇岛老揽月"
                }
            ],
            outStockType:"normalStock"
        }
    },
    methods: {
        //获取客户
        async getCustomer() {
            const customerResult = await this.$http('customer');
            const companyResult = await this.$http('company'); 
            this.customer = customerResult.result.rows;
            this.company = companyResult.result.rows;
        },
        //出库合同
        async getPact(){
            const { result } = await this.$http('pact');
            this.pact = result.rows;
        },
        //确定出库
        async SureOutStock() {
             this.OutOrBackStockParams.collector_id.length === 0 ?  this.OutOrBackStockParams.collector_id.push(this.copyCollectorId) :this.OutOrBackStockParams.collector_id;//只有替换出库存在的时候才会执行，批量出库的length不可能等于0
            if(this.outStockType === 'normalStock'){//正常出库条件
                this.OutOrBackStockParams.type = 'outstock';          
                if(this.OutOrBackStockParams.customer_id ==='' ||  this.OutOrBackStockParams.system === "" || this.OutOrBackStockParams.pact_number === '' || this.OutOrBackStockParams.collector_id.length === 0 ){
                    this.$message({
                        message: '请完善正常出库信息',
                        type: 'warning'
                    })
                }else{ 
                    const { result } = await this.$http.put('devices', this.OutOrBackStockParams);
                    this.$message({
                        message: '成功出库',
                        type: 'success'
                    })
                    this.Cancel();
                    this.$emit("getTypeList");
                }
            }else{//替换出库条件
                const reg = /\D/;
                this.OutOrBackStockParams.type = 'change';
                if(this.OutOrBackStockParams.replace_collector === '' || this.OutOrBackStockParams.replace_collector.length !==8 || reg.test(this.OutOrBackStockParams.replace_collector)){
                    this.$message({
                        message: '请完善替换出库信息(或检查信息是否正确)',
                        type: 'warning'
                    })
                }else{
                    const { result } = await this.$http.put('devices', this.OutOrBackStockParams);
                    this.$message({
                        message: '成功出库',
                        type: 'success'
                    })
                    this.Cancel();
                    this.$emit("getTypeList");
                }
            }         
        },
        initData() {
            this.OutOrBackStockParams.customer_id = "";
            this.OutOrBackStockParams.system = "";
            this.OutOrBackStockParams.replace_collector = "";
            this.OutOrBackStockParams.increase = "";
            this.OutOrBackStockParams.pact_number = "";
            this.OutOrBackStockParams.collector_id = [];
            this.OutOrBackStockParams.remark = "";
            this.OutOrBackStockParams.customer_name = ""
        },
        Cancel() {
            this.$emit("Cancel")
            this.initData()
        },
        //是否批量出库
        Isbacth(val){
            this.OutOrBackStockParams.collector_id = [];
            if(this.batch){ //批量出库
               val.forEach((item)=>{
                   this.OutOrBackStockParams.collector_id.push(item.collector_id);
               })
            }else{ //单个出库
                this.OutOrBackStockParams.collector_id.push(val.collector_id);
                this.copyCollectorId = val.collector_id ;
            }
        },
        //不同的系统选择的客户不同this.OutOrBackStockParams.customer_name不同
        changeCustomerSelect(val){
            if(this.OutOrBackStockParams.system === 'manage'){ 
                this.OutOrBackStockParams.customer_name = val.customer_name;
            }else{
                this.OutOrBackStockParams.customer_name = val.companyName;
            }
            this.OutOrBackStockParams.customer_id = val._id;
        },
        //改变系统时将出库客户名和id清空
        changeSystem(){
            this.OutOrBackStockParams.customer_name = '';
            this.OutOrBackStockParams.customer_id = '';
        },
        Clicked(tab){//切换正常出库和替换出库
           this.outStockType = tab.name ; 
           this.initData()
        }
    },
    watch:{
        item(val){
           this.Isbacth(val);
           this.outStockType = 'normalStock'; //默认正常出库
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
    }
    .note{
        color:#cdcdcd
    }
}
</style>


