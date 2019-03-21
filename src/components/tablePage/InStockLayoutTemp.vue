<template>
    <div class="in-stock">
        <el-form> 
            <el-row :gutter="5">
                <el-col :span="12">
                    <el-form-item label="型号：" label-width="130px"  >
                        <el-select  placeholder="请选择型号" v-model="device.model" value-key="model">
                            <el-option :label="item.collector_model" :value="item.collector_model" v-for="(item,index) in collectorData" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="sn：" label-width="130px">
                        <el-input
                        :rows="4"
                        placeholder="请输入内容"
                        v-model="device.sn">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="5">
                <el-col :span="12">
                    <el-form-item label="imei：" label-width="130px">
                        <el-input
                        :rows="4"
                        placeholder="请输入内容"
                        v-model="device.imei">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="imsi：" label-width="130px">
                        <el-input
                        :rows="4"
                        placeholder="请输入内容"
                        v-model="device.imsi">
                        </el-input>
                    </el-form-item>
                </el-col>   
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <mu-button @click="Cancel" flat class="cancel" normal>取 消</mu-button>
            <mu-button color="primary" @click="InStock" normal>确 定</mu-button>
        </div>
    </div>
</template>
<script>
export default {
name: 'InStock',
data(){
    return{
        collectorData:[],
        datas: {
            devices: [],
            operator: {
                user_id: '',
                user_name: ''
            }
        },
        device: {
            model: "", 
            sn: "", 
            imei: '',
            imsi: ''
        }
    }
},
methods:{
    async getBoxModel(){
        const {result} = await this.$http('models');
        this.collectorData=result.rows;
    },
    async InStock(){
        this.datas.devices = [];
        this.datas.devices.push(this.device);
        if(this.device.model===''||this.device.sn==="" || this.device.imei === '' || this.device.imsi === ''){
            this.$message({
                message: '请完善信息', 
                type: 'warning'
            }) 
        }else{ 
            console.log(this.datas);
            const {result} = await this.$http.post('gauge',this.datas);   
            this.$message({
                message: '成功入库', 
                type: 'success'
            }) 
            this.Cancel();
            this.$emit("getTypeList"); 
        }
    },
    Cancel(){
       this.$emit("Cancel")
       this.inData()
    },
    inData(){
        this.device.model = '';
        this.device.sn = '';
        this.device.imei = '';
        this.device.imsi = '';
    }
},
created(){
    if(sessionStorage.getItem('user_id')) {
        this.datas.operator.user_id = sessionStorage.getItem('user_id');
        this.datas.operator.user_name = sessionStorage.getItem('fullname');
    }
    this.getBoxModel();
}
}
</script>
<style lang="scss" scoped>
.in-stock{
    .dialog-footer{
        text-align: right;
         .mu-button{
            margin-right:10px;
        }
        .cancel{
            border:1px solid #ccc
        }
    }
    .el-input-number,.el-input{
        width:90%;
    }
    .el-select{
        width:90%;
    }
}
</style>


