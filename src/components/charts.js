import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/graphic';
import router from '../router';
const splitLine = {
    show: true,
    lineStyle: {
        color: '#2a3a6b'
    }
};
const lineStyle = {
    type: 'solid',
    color: '#868fab',
    width: '1'
};

const areaStyle = {
    normal: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(12,97,146,.5)'
            },
            {
                offset: 0.5,
                color: 'rgba(12,97,146,.8)'
            },
            {
                offset: 0.9,
                color: 'rgba(11,157,198,1)'
            }
        ])
    }
};

const grid = {
    left: '4%',
    right: '4%',
    bottom: '10%',
    top: '10%',
    containLabel: true
};
//柱状图
export const barCharts = (el, dataX, dataY, legend, barColor) => {
    // const labelOption = {
    //     normal: {
    //         show: true,
    //         position: 'insideBottom',
    //         distance: 15,
    //         align: 'left',
    //         verticalAlign: 'middle',
    //         rotate: 90,
    //         formatter: '{name|{a}}  {c}',
    //         fontSize: 16,
    //         rich: {
    //             name: {
    //                 textBorderColor: '#fff'
    //             }
    //         }
    //     }
    // };
    // dataY.forEach(item => {
    //     item.label = labelOption;
    // });
    const barOption = {
        grid: grid,
        color: barColor,
        tooltip: { 
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: legend
        },
        xAxis: [{
            data: dataX,
            axisTick: {
                show: false
            },
        }],
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value}'
            }
        },
        series:dataY
    };
    const bar = echarts.init(el);
    bar.setOption(barOption);
    // var rotation = 0;
    // setInterval(function () {
    //     bar.setOption({
    //         graphic: {
    //             id: 'textGroup',
    //             rotation: (rotation += Math.PI / 360) % (Math.PI * 2)
    //         }
    //     });
    // }, 30);
    return bar;
};

//折线图
export const lineCharts = (el, dataX, dataY,legend) => {
    const lineOption = {
        grid: grid,
        tooltip: {
            trigger: 'axis',
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        legend: {
            data: legend
        },
        xAxis: {
            data: dataX,
            type: 'category', 
            boundaryGap: false,
        },
        yAxis: { 
            type: 'value',
        },
        series:dataY
    };
    const lineCharts = echarts.init(el);
    lineCharts.setOption(lineOption);
    return lineCharts;
};

//折柱混合
export const lineBar = (el, dataX, dataY1, dataY2) => {
    const lineBarOption = {
        grid: grid,
        xAxis: [{
            type: 'category',
            data: dataX,
            axisLine: {
                lineStyle: lineStyle
            },
            splitLine: splitLine
        }],
        yAxis: [
            //line
            {
                type: 'value',
                name: '进水量',
                splitLine: splitLine,
                axisLine: {
                    lineStyle: lineStyle
                }
            },
            //bar
            {
                type: 'value',
                name: '处理量',
                axisLine: {
                    lineStyle: lineStyle
                }
            },
        ],
        series: [{
                type: 'line',
                data: dataY2,
                symbol: 'circle',
                symbolSize: 10,
                itemStyle: {
                    normal: {
                        color: '#01bdda',
                        radius: 20,
                        lineStyle: {
                            color: '#3d779f',
                            width: 3
                        }
                    }
                },
                areaStyle: areaStyle
            },
            {
                type: 'bar',
                data: dataY1,
                itemStyle: {
                    normal: {
                        color: '#ffd23b'
                    }
                },
                barWidth: 30
            }
        ]
    };
    const lineBar = echarts.init(el);
    lineBar.setOption(lineBarOption);
    return lineBar;
};

//饼图
export const screenPie = (el, data, pieColor,type) => {
    const w = document.body.clientWidth;
    console.log(w)
    let len = w < 1366 ? 10 : 30;
    let radius = w < 1366 ? ['45%', '60%'] : ['60%', '80%'];
    // const radius = [0, '62%']
    let fz = w < 1366 ? 12 : 15;
    const colors = ['#b5b5b5', '#00d2eb', '#f2bf0f'];
    const screenPieOption = {
        tooltip: {
            show: true,
            trigger: 'item',
            formatter: "{b}: {c} ({d}%)"
        },
        grid: grid,
        series: [{
            type: 'pie',
            center: ['50%', '50%'],
            radius: radius,
            data: data,
            labelLine: {
                normal: {
                    length: len
                }
            },
            label: {
                show: true,
                fontSize: fz
            }
        }],
    };
    const pie = echarts.init(el);
    pie.setOption(screenPieOption);
    pie.on('click',(param)=>{
        if(type){
            router.push({path: '/expireManage',query:param.data});
        }
    })
    return pie;
};