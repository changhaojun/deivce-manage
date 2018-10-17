<template>
    <div class="tableList">
        <d2-crud
            :columns="columns"
            :data="data.rows"
            :rowHandle="rowHandle"
            @custom-emit-1="OutStockDialog"
            @custom-emit-2="BackStockDialog"
            @custom-emit-3="ViewPathDialog" 
        />
        <el-pagination
            @current-change="handleCurrentChange"
            layout="total, prev, pager, next, jumper"
            :total="data.total">
        </el-pagination>
        <!-- 弹窗 -->
        <el-dialog :title="title" :visible.sync="dialogFormVisible" :width="dialogWidth" @close="Cancel">
            <!-- 入库 -->
            <!-- <div v-if="type===0">
                <in-stock-layout v-on:Cancel="Cancel" v-on:getTypeList="getTypeList"></in-stock-layout>
            </div> -->
            <!-- 出库 -->
            <div  v-if="type === 1">
                <out-stock v-on:Cancel="Cancel" v-on:getTypeList="getTypeList" :item="itemDevicesData"></out-stock>
            </div>
            <!-- 退库 -->
            <div  v-if="type === 2">
                <back-stock v-on:Cancel="Cancel" v-on:getTypeList="getTypeList" :item="itemDevicesData"></back-stock>
            </div>
            <!-- 查看轨迹 -->
            <div  v-if="type === 3">
                <view-path v-on:Cancel="Cancel" :item.sync="itemDevicesData"></view-path>
            </div>
        </el-dialog>
    </div>
</template>
<script>
// import InStockLayout from "./InStockLayout.vue";
import OutStock from "./OutStock.vue";
import BackStock from "./BackStock.vue";
import ViewPath from "./ViewPath.vue";
import moment from 'moment';
export default {
    name:"tableList",
    props:['data','edit'],
    components:{OutStock,BackStock,ViewPath},
    data(){
        return{
            title: "",
            type: 0,
            dialogWidth: '500px',
            dialogFormVisible:false,
            // total:this.data.total,
            columns: [
                {
                    title: 'BOX编号',
                    key: 'collector_id'
                },
                {
                    title: 'BOX型号',
                    key: 'collector_model'
                },
                {
                    title: '所属客户',
                    key: 'customer_name'
                },
                {
                    title: '入库时间',
                    key: 'indate'
                },
                {
                    title: '库存状态',
                    key: 'type'
                },
                {
                    title: '是否合格',
                    key: 'description'
                }
            ],
            rowHandle: {
                custom: []
            },
            params:{
                page_size: 10,
                page_number: 1,
            },
            itemDevicesData:""
        }
    },
    methods:{
        getTypeList(){
            this.$emit("getTypeList");
        },
        //出库
        OutStockDialog ({index, row}) {
            // console.log(row)
        this.title = '出库' ;
        this.type = 1;
        this.showDialog();
        this.dialogWidth = '500px';
        this.itemDevicesData = row;
        },
        //退库
        BackStockDialog({index, row}){
        this.title = '退库' ;
        this.type = 2;
        this.dialogWidth = '500px';
        this.itemDevicesData = row;
        if(this.data.rows[index].type==='出库'){
            this.showDialog();
        } else{
            this.$message({
                message: '请先出库',
                type: 'warning'
            }) 
        } 
        },
        //查看
        ViewPathDialog({index, row}){
        this.title ='轨迹 - '+ row.collector_id ;
        this.type = 3;
        this.showDialog();
        this.dialogWidth = '800px';
        this.getDevicesPath(row) 
        },
        //获取查看轨迹
        async getDevicesPath(item){
        const {result} = await this.$http('deviceTrack',{data:{collector_id:item.collector_id}});
        this.itemDevicesData = result.rows;
        } ,
        //改变页码
        handleCurrentChange(val){
        this.params.page_number = val;
        this.$emit('changePage',this.params)
        },
        showDialog(){
            this.dialogFormVisible = true;
        },  
        //取消
        Cancel(){
            this.dialogFormVisible = false
        },
        editList(){
            for(let i=0;i<this.edit.length;i++){
                if(this.edit[i] === '出库'){
                    this.rowHandle.custom.push(
                        {
                                text: '出库',
                                type: 'primary',
                                size: 'mini',
                                emit: 'custom-emit-1'
                            }
                    )
                } 
                if(this.edit[i] === '退库'){
                    this.rowHandle.custom.push(
                        {
                                text: '退库',
                                type: 'primary',
                                size: 'mini',
                                emit: 'custom-emit-2'
                            }
                    )
                }
                if(this.edit[i] === '查看'){
                        this.rowHandle.custom.push(
                        {
                                text: '查看',
                                type: 'primary',
                                size: 'mini',
                                emit: 'custom-emit-3'
                            }
                        )
                }
            }
        }
    },
    created(){
       this.editList()
    }
}
</script>

