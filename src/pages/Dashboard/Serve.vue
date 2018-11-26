
<template>
    <div class="serve">
        <!-- <div class="top">
            <div class="list">最近到期的客户<span></span></div>
            <div class="list">BOX型号：<span></span></div>
            <div class="list">到期时间：<span></span></div>
        </div>
        <div class="top">
            <div class="list">最近到期数量最多客户<span></span></div>
            <div class="list">BOX型号：<span></span></div>
            <div class="list">到期时间：<span></span></div>
            <div class="list">到期个数：<span></span></div>
        </div> -->
        <!-- 服务到期统计 -->
        <div class="troubleContent">
            <div class="header">服务到期统计 
                <el-tooltip class="item"  content="点击数据跳转相应详情页面"  placement="bottom-start" effect="light">
                    <i class="iconfont icon-bangzhu"></i>
                </el-tooltip>    
            </div>
            <div class="trouble-count" ref="expireCount"></div>
        </div>
    </div>
</template>
<script>
import {screenPie} from './../../components/charts.js'
export default {
    data(){
        return{
            expireCount:"",
            chartColor:['#003366','#e5323e','#4cabce'],
        }
    },
    methods:{
        //获取服务到期
        async getExpireCount(){
        const {result} = await this.$http('expireDatas/expireCount');
        result.rows.forEach((item)=>{
            item.value = item.item.length;
            item.type = item.name;
            item.name = (item.name === "three" ? "3个月" : item.name === "two" ? "2个月" : item.name === "one" ? "1个月" : "大于3个月");
        })
        this.expireCount = screenPie(this.$refs.expireCount,result.rows,this.chartColor,3);
        },
    },
    mounted(){
        window.addEventListener('resize', () => {  
            this.expireCount.resize();
        })
    },
    created(){
        this.getExpireCount();
    }
}
</script>
<style lang="scss">
.serve{
     padding:20px;
    .top{
        height:100px;
        width:100%;
        background: #fff;
        margin-bottom: 20px;
        line-height: 100px;
        padding-left:20px;
        font-size:18px;
        display: flex;
        .list{
            width:250px;
            margin-right:50px;
        }
        span{
           font-size:22px;
        }
        
    }
    .header{
      line-height: 60px;
      padding-left:30px;
      font-size:18px;
      .icon-bangzhu{
          cursor: pointer;
          &:hover .text{
              display: block;
          }
      }
    }
    .troubleContent{
      display: inline-block;
      background: #fff;
      width:100%;
      margin-right:2%;
    }
    .trouble-count{
        width: 90%;
        height: 300px;
        display: inline-block;
    }
    .troubleContent:last-child{
        margin-right: 0
    } 
}
</style>


