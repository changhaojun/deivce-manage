
<template>
    <div class="model">
        <div class="top">
            型号类别总计：<span>{{sum}}</span>
        </div>
        <div class="modelContent">
            <div class="header">型号类型统计</div>
            <div class="stock-count" ref="model"> </div>
        </div>  
         <!-- 每个型号每月统计 -->
        <div class="modelContent" style="margin-right:0;">
            <div class="header">
                型号每月出库统计
                <el-date-picker
                v-model="params.year"
                type="year"
                value-format="yyyy"
                placeholder="选择年" @change="selectYear">
                </el-date-picker>
            </div>
            <div class="stock-count" ref="modelOutStock"> </div>
        </div>
        <!-- 出库客户类型统计 -->
        <div class="modelContent">
            <div class="header">出库型号客户统计</div>
            <div class="stock-count" ref="outmodel"> </div>
        </div>
    </div>
</template>

<script>
import {barCharts,lineCharts} from './../../components/charts.js'
export default {
    data(){
        return{
            params:{
                year:"2018"
            },
            model:"",
            monthCount:"",
            chartColor:['#003366','#e5323e','#4cabce'],
            itemStyle:{
                normal:{ 
                    color:'rgba(128, 128, 128, 0)' 
                } 
            },
            label: { 
                normal: { 
                offset:['50', '80'], 
                show: true, 
                position: 'insideBottom', 
                formatter:'{c}', 
                textStyle:{ color:'#000' } 
                }
            },
            sum:0,
            modelCustomer:""
        }
    },
    methods:{
        //获取型号
        async getDevicesModels(){
            const {result} = await this.$http('modelDatas/modelsCount');
            const legend=[];
            this.sum = result.name.length
            result.value.reverse();
            result.value.forEach((item,index,arr)=>{
                item.name =(item.type === 1 ? '已出库' : item.type ==='all'? "全部" :"未出库");
                item.type = 'bar';
                item.barWidth = 45;
                item.stack = 'data';
                if(item.name==="全部"){
                    item.itemStyle = this.itemStyle;
                    item.label = this.label;    
                }else{
                    legend.push(item.name)
                }
            })
            this.model = barCharts(this.$refs.model,result.name,result.value,legend,this.chartColor);
        },
         // 获取型号每月出库统计
        async getMonthCount(){
            const {result} = await this.$http('modelDatas/monthCount',{data:{year:this.params.year}});
            result.rows.forEach((item)=>{
                item.type="line";
                item.data = item.value
            })
            const dataX = [];
            for(let i=0;i<12;i++){
                dataX.push((i+1)+`月`)
            }
            this.monthCount = lineCharts(this.$refs.modelOutStock,dataX,result.rows)
        },
        selectYear(year){
            this.getMonthCount();
        },
        //获取出库型号客户统计
        async getOutModelCustomer(){
            let {keys, values, entries} = Object;
            const {result} = await this.$http('modelDatas/modelCustomer');
            const dataX = [];
            let name = [];
            const res = [];
            let arr =[];
            result.rows.forEach((item, index) => {
                let origin = new Array(5).fill(0);
                const { data ,model} = item;
                arr=[];
                for(let key in data){
                    arr.push( {
                        value:data[key],
                        name:key
                    })
                }
                arr=arr.sort((a,b)=>{
                 return b.value-a.value
                }).slice(0,5);
                dataX.push(model)
                if (arr.length > 0) {
                    arr.forEach(item => {
                        const value = item.value;
                        origin[index] = value;
                        res.push({
                            name:item.name,
                            type:"bar",
                            barWidth : 45,
                            stack : 'data',
                            data:origin
                        });
                        origin = new Array(5).fill(0);
                    });
                } else {
                    res.push({
                            name:"",
                            type:"bar",
                            barWidth : 45,
                            stack : 'data',
                            data:origin
                        });
                }
            });
           this.modelCustomer = barCharts(this.$refs.outmodel,dataX,res);     
        }
    },
    mounted() {
        window.addEventListener('resize', () => {
        this.model.resize();
        this.monthCount.resize();
        this.modelCustomer.resize();
        }) 
    },
    created(){
        this.getDevicesModels();
        this.getMonthCount();
        this.getOutModelCustomer();
    }
}
</script>
<style lang="scss">
.model{
    padding:20px;
    .top{
        height:100px;
        width:100%;
        background: #fff;
        margin-bottom: 20px;
        line-height: 100px;
        padding-left:20px;
        font-size:18px;
        span{
           font-size:22px;
        }
        
    }
    .header{
      line-height: 60px;
      padding-left:30px;
      font-size:18px;
    }
    .modelContent{
      background: #fff;
      width:100%;
      display: inline-block;
      margin-bottom:20px;
        .stock-count{
          width:100%;
          display: inline-block;
          height: 600px;
        }
        .el-date-editor--year{
          float: right;
          margin-right:20px;
          width:20%
        }
    }
}
    
</style>

