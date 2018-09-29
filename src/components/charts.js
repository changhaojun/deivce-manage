import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';

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
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(12,97,146,.5)' },
            { offset: 0.5, color: 'rgba(12,97,146,.8)' },
            { offset: 0.9, color: 'rgba(11,157,198,1)' }
        ])
    }
};

const grid = {
    left: '4%',  
    right: '4%',  
    bottom: '10%',
    top: '16%',  
    containLabel: true  
};

//柱状图
export const barCharts = (el, dataX, dataY, barColor) => {
    const barOption = {
        grid: grid,
        series: [{
            type: 'bar',
            data: dataY,
            itemStyle: {
                normal: {
                    color: barColor
                }
            }
        }],
        xAxis: {
            data: dataX,
            axisLine: {
                lineStyle: lineStyle
            },
            splitLine: splitLine
        },
        yAxis: {
            type: 'value',
            splitLine: splitLine,
            axisLine: {
                lineStyle: lineStyle
            }
        }
    };

    const bar = echarts.init(el);
    bar.setOption(barOption);
    return bar;
};

//折线图
export const lineCharts = (el, dataX, dataY) => {
    const lineOption = {
        grid: grid,
        xAxis: {
            data: dataX,
            axisLine: {
                lineStyle: lineStyle
            },
            type: 'category',
            splitLine: splitLine
        },
        yAxis: {
            splitLine: splitLine,
            axisLine: {
                lineStyle: lineStyle
            }
        },
        series: [{
            type: 'line',
            data: dataY,
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
        }]
    };
    const lineCharts = echarts.init(el);
    lineCharts.setOption(lineOption);
    return lineCharts;
};

//折柱混合
export const lineBar = (el, dataX, dataY1, dataY2) => {
    const lineBarOption = {
        grid: grid,
        xAxis: [
            {
                type: 'category',
                data: dataX,
                axisLine: {
                    lineStyle: lineStyle
                },
                splitLine: splitLine
            }
        ],
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
        series: [ 
            {
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
export const screenPie = (el, data) => {
    const w = document.body.clientWidth;
    let len = w < 1200 ? 10 : 30;
    let radius = w < 1200 ? ['30%', '44%'] : ['42%', '62%'];
    // const radius = [0, '62%']
    let fz = w < 1200 ? 10 : 15;
    const colors = ['#b5b5b5', '#00d2eb', '#f2bf0f'];
    const screenPieOption = {
        series: [
            {
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
            }
        ],
        // color: colors 
    };
    const pie = echarts.init(el);
    pie.setOption(screenPieOption);
    return pie;
};