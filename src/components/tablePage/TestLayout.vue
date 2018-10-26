<template>
    <div class="test-layout">
         <el-form>
            <el-form-item label="测试结果：" label-width="100px">
                <el-select placeholder="请选择" v-model="params.check_result" value-key="id" filterable>
                    <el-option :label="item.label" :value="item.id" v-for="(item,index) in checkOption" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="SIM卡号：" label-width="100px">
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
                check_result: "",
                SIM:this.item.SIM? this.item.SIM:"",
                remark: this.item.remark? this.item.remark:"", 
                collector_id:this.item.collector_id   
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
            ]
        }
    },
    methods:{
        initData(){
            this.params.check_result = "";
            this.params.SIM = "";
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
            }else{
                if(this.params.check_result === 1 && this.params.SIM === ''){
                    this.$message({
                        message: '请填写SIM卡号', 
                        type: 'warning'
                    }) 
                }else{
                     this.$emit("Cancel")
                }

            }
            
        }

    },
    created(){

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


