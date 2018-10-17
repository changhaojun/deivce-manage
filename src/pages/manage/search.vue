<template>
    <div class="search">
        <!-- <div class="search-filter"> -->
            <el-form ref="form"  size="medium" :inline='true'>
                <el-form-item label="BOX编号：" label-width="85px" v-if="BoxNumber">
                <mu-text-field v-model="params.like.collector_id" placeholder="请输入"></mu-text-field>
                </el-form-item>
                <el-form-item label="BOX型号：" label-width="85px"  v-if="BoxModel">
                <mu-text-field v-model="params.like.collector_model" placeholder="请输入"></mu-text-field>
                </el-form-item>      
                <el-form-item label="所属客户：" label-width="85px" v-if="Customer">
                <mu-text-field v-model="params.like.customer_name" placeholder="请输入"></mu-text-field>
                </el-form-item> 
                <el-form-item label="是否合格：" label-width="85px" v-if="Checked">
                <mu-select v-model="check_result">
                    <mu-option  
                    v-for="item in check_option"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </mu-option>
                </mu-select>
                </el-form-item>  
                <el-form-item label="库存状态：" label-width="90px" v-if="Status">
                <mu-select v-model="stcokStatus">
                    <mu-option  
                    v-for="item in stock_status"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </mu-option>
                </mu-select>
                </el-form-item> 
                <el-form-item label="入库时间：" v-if="Dates">
                    <el-col :span="11">
                        <mu-date-input v-model="params.date.start_time" label="开始日期" label-float full-width></mu-date-input>
                    </el-col>
                    <el-col class="line" :span="1" style="text-align:center">-</el-col>
                    <el-col :span="11">
                        <mu-date-input v-model="params.date.end_time" label="结束日期" label-float full-width></mu-date-input>
                    </el-col>
                </el-form-item>  
            </el-form>
            <el-row justify="end" type="flex">
                <mu-button color="primary" @click="search">搜索</mu-button>
                <mu-button flat @click="reset" class="reset">重置</mu-button>
            </el-row>
        <!-- </div> -->
    </div>
</template>
<script>
export default {
    name:"search",
    props:['BoxNumber','BoxModel','Customer','Checked','Status','Dates'],
    data(){
        return{
            check_result: '',
            stcokStatus: '',
            params: {
                like: {
                collector_id: '',
                customer_name: '',
                collector_model: ''
                },
                filter: {
                },
                date: {
                    start_time: '',
                    end_time: ''
                },
            },
            check_option:[
                {
                id: 0,
                name: '不合格'
                },
                {
                id: 1,
                name: '合格'
                }
            ],
            stock_status:[
                {
                id: 'outstock',
                name: '出库'
                },
                {
                id: 'instock',
                name: '未出库'
                }
            ]
        }
    },
    methods:{
        reset(){
            this.params.like.collector_id = '';
            this.params.like.collector_model = '';
            this.params.like.customer_name = '';
            this.check_result = '';
            this.stcokStatus = '';
            delete this.params.filter['check_result'];
            delete this.params.filter['type']
            this.$emit("reset",this.params)
        },
        search(){
             if(this.check_result !== ''){
                this.params.filter['check_result']=this.check_result;
            }
            if(this.stcokStatus !== ''){
                this.params.filter['type']=this.stcokStatus;
            }
            this.$emit("search",this.params)
        }
    }
}
</script>
<style lang="scss" scoped>
.search{
    align-items: center;
    border:1px solid #a9abaf;
    border-radius: 6px;
    padding:10px 10px;
    margin:10px 0;
    .el-form-item {
      margin-bottom: 0;
      margin-top:10px;
    }
    .mu-button{
      border-radius: 6px;
      height:36px;
    } 
    .reset{
      margin-left:20px;
    }
    .el-row{
      margin-top: 20px;
      padding-right:40px;
      margin-bottom:10px;
    }
  }
</style>


