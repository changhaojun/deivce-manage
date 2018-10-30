<template>
    <div class="in-stock">
        <el-form  > 
        <el-row :gutter="5">
            <el-col :span="12">
                <el-form-item label="Box型号：" label-width="130px"  >
                    <el-select  placeholder="请选择Box型号" v-model="inStock.collector_model" value-key="collector_model">
                        <el-option :label="item.collector_model" :value="item.collector_model" v-for="(item,index) in collectorData" :key="index"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="BOX起始编号：" label-width="130px">
                    <el-input
                    :rows="4"
                    placeholder="请输入内容"
                    v-model="inStock.collector_id">
                    </el-input>
                </el-form-item>
            </el-col>
            
        </el-row>
        <el-row :gutter="5">
            <el-col :span="12">
               <el-form-item label="采集器数量：" label-width="130px">
                    <el-input-number placeholder="请输入内容" v-model="inStock.collector_amount" controls-position="right" :min="0">
                    </el-input-number>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="PCB厂家：" label-width="130px"  >
                   <el-select  placeholder="请选择PCB厂家" v-model="inStock.PCB_supplier" value-key="inStock.PCB_supplier">
                        <el-option :label="item.supplier_name" :value="item._id" v-for="(item,index) in supplierOptions" :key="index"></el-option>
                    </el-select>
                </el-form-item>
           </el-col>
        </el-row>
        <el-row :gutter="5">
            <el-col :span="12">
                <el-form-item label="通讯模块供应商：" label-width="130px"  >
                    <el-select  placeholder="请选择通讯模块供应商" v-model="inStock.CM_supplier" value-key="inStock.CM_supplier">
                        <el-option :label="item.supplier_name" :value="item._id" v-for="(item,index) in supplierOptions" :key="index"></el-option>
                    </el-select>
                </el-form-item> 
            </el-col>
            <el-col :span="12">
                <el-form-item label="SIM供应商：" label-width="130px"  >
                    <el-select  placeholder="请选择SIM供应商" v-model="inStock.SIM_supplier" value-key="inStock.SIM_supplier">
                        <el-option :label="item.supplier_name" :value="item._id" v-for="(item,index) in supplierOptions" :key="index"></el-option>
                    </el-select>
                </el-form-item>  
            </el-col>
        </el-row>
        <el-row :gutter="5">
            <el-col :span="12">
                <el-form-item label="焊接厂家：" label-width="130px"  >
                     <el-select  placeholder="请选择焊接厂家" v-model="inStock.weld_supplier" value-key="inStock.weld_supplier">
                        <el-option :label="item.supplier_name" :value="item._id" v-for="(item,index) in supplierOptions" :key="index"></el-option>
                    </el-select>
                </el-form-item>  
            </el-col>
            <el-col :span="12">
                <el-form-item label="元器件供应商：" label-width="130px"  >
                   <el-select  placeholder="请选择元器件供应商" v-model="inStock.CAP_supplier" value-key="inStock.CAP_supplier">
                        <el-option :label="item.supplier_name" :value="item._id" v-for="(item,index) in supplierOptions" :key="index"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
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
        inStock:{
            collector_model:"", //Box型号
            collector_id:"", //BOX起始编号
            user_id:sessionStorage.getItem('user_id'), 
            PCB_supplier: "", //PCB厂家
            CAP_supplier :"", //元器件供应商
            CM_supplier:"", //通讯模块供应商
            SIM_supplier:"", // SIM供应商
            weld_supplier:"", //焊接厂家
            collector_amount:"", // 采集器数量
            user_name:sessionStorage.getItem('fullname') 
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
        supplierOptions:[]  //供应商数据
    }
},
methods:{
    async getBoxModel(){
         const {result} = await this.$http('models');
         this.collectorData=result.rows
    },
    async InStock(){
        const itemReg = /\D/
        if(this.inStock.collector_id===''||this.inStock.collector_model==="" || this.inStock.PCB_supplier === '' || this.inStock.CAP_supplier === '' || this.inStock.SIM_supplier === '' || this.inStock.weld_supplier === ''){
            this.$message({
                message: '请完善信息', 
                type: 'warning'
            }) 
        }else{       
            this.inStock.collector_id = this.inStock.collector_id.length ?  this.inStock.collector_id : JSON.stringify(this.inStock.collector_id);//当返回重复id时，需要转成字符串
            if(this.inStock.collector_id.length !== 8 || itemReg.test(this.inStock.collector_id)){
                this.$message({
                    message: 'Box编号长度或者格式不正确', 
                    type: 'warning'
                })   
            }else{
                this.inStock.collector_id = Number(this.inStock.collector_id);
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
        this.inStock.collector_id = '';
        this.inStock.PCB_supplier = '';
        this.inStock.CAP_supplier = '';
        this.inStock.CM_supplier = '';
        this.inStock.SIM_supplier = '';
        this.inStock.weld_supplier = '';
        this.inStock.collector_amount = '';
    },
    async getSupplierData(){ //
        const { result } = await this.$http('supplier');
        this.supplierOptions = result.rows;
    }
},
created(){
    this.getBoxModel()
    this.getSupplierData()
    this.inData()
}
}
</script>
<style lang="scss" scoped>
.in-stock{
    .dialog-footer{
        text-align: right;
    }
    .el-input-number,.el-input{
        width:90%;
    }
    .el-select{
        width:90%;
    }
}
</style>


