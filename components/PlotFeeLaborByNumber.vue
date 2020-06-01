<template>
    <div>
        {{updateChart}}
        <vue-apex-charts 
            width = "100%"
            :options = "options"
            :series = "series"
            :fee = "fee"
            :labor = "labor"
        >
        </vue-apex-charts>
    </div>
</template>


<script>
import VueApexCharts from 'vue-apexcharts'

export default {
    name:'ChartBillings',
    components:{
            VueApexCharts,
    },
    props: {
      fee: {type: Array, default: []},
      labor: {type: Array, default: []},
    //   width : {type: Number, default: 500},
    //   height : {type: Number, default: 500},
    },
        data(){
            return{
                //CHART PARAMETERS
                chartType : 'line',
                options: {
                    chart: {
                        //height: 250,
                        id: 'feelabor-chart',
                        type: 'line',
                        background:'#2b2d3e',
                        foreColor:'#fff',
                        toolbar:{show: false},
                    },//CHART
                    dataLabels : {
                       enabled : false,
                    },//DATALABELS
                    fill: {
                        colors: ['#ff0','#f0f','#cdd'],
                        opacity: 0.7,
                        type: 'solid',
                    },//FILL
                    markers: {
                        colors: ['#FFF']
                    },//MARKERS
                    colors : ['#F9C80E', '#FA4443', '#66C7F4', '#0680de'],
                    tooltip: {
                        y: {
                            formatter: function(val) {
                                return "$" + (val).toFixed(0)
                            }
                        }
                    },//TOOLTIP
                    legend: {
                        position: 'top',
                        horizontalAlign: 'left',
                        offsetX: 40
                    },//LEGEND
                    stroke: {
                        show: true,
                        width: 2,
                        colors: ['transparent']
                    },
                    plotOptions: {
                        
                    },//PLOT OPTIONS
                    xaxis: {
                        type: "datetime",
                        labels: {
                            datetimeFormatter: {
                               
                                month: 'MMM'
                               
                                }
                            }
                        // categories: ['FEE', 'LABOR', 'INVOICE'],
                        // labels: {
                        //     formatter: function(val) {
                        //         return "$" + val 
                        //     }
                        // }
                    },//X-AXIS
                    yaxis:[
                       {
                            title: {
                                text: undefined
                            },
                       },
                    ]//Y-AXIS
                },//OPTIONS
                series: [
                    {name: 'Fee', data: [{x:'2019-03-22',y:2345},{x:'2019-04-22',y:2345}]}, 
                    {name: 'Labor', data: [{x:'2019-03-22',y:345},{x:'2019-04-22',y:3456}]}, 
                ],
            }//RETURN
        },//DATA
        mounted(){
            
        },//MOUNTED
        created(){
            
        },
        beforeDestroy() {
            
        },
        computed:{
           updateChart(){
                this.series[0].data = []
                this.series[1].data = []

                // this.chartType = "line"
                this.series[0].data =  this.fee
                this.series[1].data = this.labor
                
            },//UPDATE CHART

        },//COMPUTED
        methods:{
            
           
        }//METHODS

}//EXPORT DEFAULT
</script>

<style scoped>

</style>

