<template>
    <div class="test-layout">
         <el-form>
            <el-form-item label="测试结果：" label-width="100px">
                <el-select placeholder="请选择" v-model="params.check_result" value-key="id" filterable>
                    <el-option :label="item.label" :value="item.id" v-for="(item,index) in checkOption" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="故障原因：" label-width="100px" v-if="params.check_result === 0">
              <el-select  placeholder="请选择原因" v-model="params.fault_id" value-key="_id">
                <el-option :label="item.fault_name" :value="item._id" v-for="(item,index) in faultList" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="SIM卡号：" label-width="100px" v-if="params.check_result === 1">
               <el-input  placeholder="请输入内容" v-model="params.SIM">  </el-input>
            </el-form-item>
            <el-form-item label="备注：" label-width="100px">
               <el-input   type="textarea" placeholder="请输入内容" v-model="params.remark">  </el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="Cancel">取 消</el-button>
            <el-button type="primary" @click="postTestResult">确 定</el-button>
        </div>
    </div>
</template>
<script>
export default {
    name: "TestLayout",
    props: ['item'],
    data(){
        return{
            params: {
                check_result:this.item.check_result >= 2 ? "" : this.item.check_result,
                fault_id:this.item.fault_id?this.item.fault_id:"",
                SIM:this.item.SIM?this.item.SIM:"",
                remark:"", 
                type:"test",
                collector_id:[this.item.collector_id],
                user_id:sessionStorage.getItem('user_id'),
                user_name:sessionStorage.getItem('fullname')  
            },
            checkOption: [
                {
                    id: 0,
                    label: "不合格"
                },
                {
                    id: 1,
                    label: "合格"
                }
            ],
            faultList:[]
        }
    },
    methods:{
        initData(){
            this.params.check_result = "";
            this.params.SIM = "";
            this.params.fault_id = "";
            this.params.remark = "";
        },
        Cancel() {
            this.$emit("Cancel")
        },
        async postTestResult(){
            if(this.params.check_result === ""){
                this.$message({
                    message: '请选择检测结果', 
                    type: 'warning'
                }) 
            }else if(this.params.check_result === 1 && this.params.SIM === ''){
                this.$message({
                    message: '请填写SIM卡号', 
                    type: 'warning'
                })  
            }else if(this.params.check_result === 0 && this.params.fault_id === ''){
                this.$message({
                    message: '请填写故障原因', 
                    type: 'warning'
                })   
            }else{
                 const { result } = await this.$http.put('devices', this.params);
                 this.$message({
                    message: '修改成功', 
                    type: 'success'
                }) 
                this.Cancel();
                this.$emit("getTypeList");
            }    
        },
        //获取故障列表
        async getFault(){
            const {result} = await this.$http('fault');
            this.faultList = result.rows;
        },
    },
    watch:{
        item(val){
            this.params.collector_id = [];
            this.params.check_result = (val.check_result >= 2 ? "" :val.check_result);
            this.params.SIM = (val.SIM ? val.SIM :"");
            this.params.fault_id = (val.fault_id ? val.fault_id :"" )
            this.params.collector_id.push(val.collector_id);
        }
    },
    created(){
        this.getFault()
    }
}
</script>
<style lang="scss" scoped>
.test-layout{
    margin-top:20px;
    .el-select,.el-input,.el-textarea{
        width:68%
    }
}
</style>


