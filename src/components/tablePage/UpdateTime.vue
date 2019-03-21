<template>
    <div>
        <el-form>
            <el-form-item label="采集周期：" label-width="100px">
                <el-input v-model="params.collect_interval" placeholder="请输入内容"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <mu-button @click="Cancel" flat class="cancel" normal>取 消</mu-button>
            <mu-button  @click="postUpdataResult" color="primary" normal>确 定</mu-button>
        </div>
    </div>
</template>
<script>
export default {
    props: ["item", "batch"],
    data() {
        return {
            params: {
                type: 'updateTime',
                snList: [],
                user_name: sessionStorage.getItem('fullname'), 
                user_id: sessionStorage.getItem('user_id'),  
                collect_interval: null
            }
        }
    },
    methods: {
        async postUpdataResult() {
            if(this.params.collect_interval === '') {
                this.params.collect_interval = null;
            }
            const itemReg = /^([1-9]\d*|[0]{1,1})$/;
            if(itemReg.test(this.params.collect_interval)) {
                this.params.collect_interval = Number(this.params.collect_interval);
                // console.log(this.params);
                const { result } = await this.$http.put('gauge', this.params);
                this.$message({
                    message: '采集周期修改成功',
                    type: 'success'
                })
                this.Cancel();
                this.$emit("getTypeList");
            }else {
                this.$message({
                    message: '采集周期不能为空或格式不正确', 
                    type: 'warning'
                })
            }
        },
        Isbacth() {
            if(this.batch) {
                this.params.collect_interval = null;
                this.item.forEach((item) =>{
                   this.params.snList.push(item.sn);
                })
            }else {
                this.params.collect_interval = this.item.collect_interval;
                this.params.snList.push(this.item.sn);
            }
        },
        Cancel() {
            this.$emit("Cancel");
            this.params.snList = [];
        },
    },
    watch:{
        item(){
            this.Isbacth();
        }
    },
    created() {
        this.Isbacth();
    }
}
</script>
<style lang="scss" scoped>
    .el-form-item {
        margin-top: 20px;
    }
    .el-input {
        width: 80%;
    }
    .dialog-footer{
          .mu-button{
            margin-right:10px;
        }
        .cancel{
            border:1px solid #ccc
        }
    }
</style>
