<template>
    <div>
        {{updateChart}}
        <vue-apex-charts 
            width = "100%"
            :options = "options"
            :series = "series"
            :fee = "fee"
            :asr = "asr"
            :labor = "labor"
            :invoice = "invoice"
            :ar = "ar"
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
      fee: {type: Number, default: 1000},
      asr: {type: Number, default: 0},
      labor: {type: Number, default: 500},
      invoice : {type: Number, default: 500},
      ar : {type: Number, default: 0},
    //   width : {type: Number, default: 500},
    //   height : {type: Number, default: 500},
    },
        data(){
            return{
                //CHART PARAMETERS
                chartType : 'bar',
                options: {
                    chart: {
                        //height: 250,
                        id: 'billings-chart',
                        type: 'bar',
                        columnWidth: 2,
                        stacked : false,
                        background:'#2b2d3e',
                        foreColor:'#fff',
                        toolbar:{show: false},
                    },//CHART
                    dataLabels : {
                       enabled : true,
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
                                return "$" + val 
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
                        bar: {
                            horizontal: true,
                            columnWidth : '10%',
                            distributed : false,
                            dataLabels: {
                                position: '50%',
                            }
                        }
                    },//PLOT OPTIONS
                    xaxis: {
                        categories: ['FEE', 'LABOR', 'INVOICE'],
                        labels: {
                            formatter: function(val) {
                                return "$" + val 
                            }
                        }
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
                    {name: 'Fee', data: [4400]}, 
                    {name: 'Labor', data: [2000]}, 
                    {name: 'Invoice', data: [1900]}
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
                let totalFee = this.fee + this.asr
                this.series[0].data = []
                this.series[1].data = []
                this.series[2].data = []

                this.chartType = "bar"
                this.series[0].data[0] =  totalFee
                this.series[1].data[0] = this.labor
                this.series[2].data[0] = this.invoice
                
            },//UPDATE CHART

        },//COMPUTED
        methods:{
            
           
        }//METHODS

}//EXPORT DEFAULT
</script>

<style scoped>

</style>

