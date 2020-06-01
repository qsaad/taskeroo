<template>
    <div>
      <vue-apex-charts 
        width="100%" 
        :type="chartType" 
        :options="chartOptions" 
        :series="plotData"
      ></vue-apex-charts>
    </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import * as moment from 'moment'

export default {
    middleware : [],
    components:{
        VueApexCharts
    },
    props: {
      plotData: {type: Array, default: []},
      chartType : {type: String, default: 'line'},
      // xAxisMin : {type: Number, default: 0},
      // xAxisMax : {type: Number, default: 0},
      barHorizontal : {type: Boolean, default: false},
      xAxisType : {type: String, default: 'category'},
    },
        data(){
            return{
                // chartOptions: {
                //     theme: {   
                //       mode: 'dark',   
                //       palette: 'palette3',
                //     },//THEME
                //     chart: {
                //         id: 'labor-backlog',
                //         //background: '#000',
                //         //foreColor: '#373d3f',
                //         events: {
                //           dataPointSelection : (event, chartContext, config) =>{
                //             //console.log(chartContext, config);
                //             this.handleClick(event, chartContext, config )
                //           }           
                //         },
                       
                //     },//CHART
                //     animations: {
                //       speed: 200
                //     },//ANIMATIONS
                //     title: {
                //       text: undefined,
                //     },
                //     fill: {
                //       //colors: ['blue', 'orange','red']
                //     },
                //     xaxis: {
                //       crosshairs: {
                //         width: 1
                //       },
                //       type: 'category',
                //       //type: 'datetime',
                //       //min : new Date('2020-01-01').getTime(),
                //       //max : new Date('2020-12-30').getTime(),
                //       labels: {
                //         // formatter: function (val) {
                //         //   return val.slice(0, 5)
                //         // },
                //         // datetimeFormatter: {
                //         //     year: '',
                //         //     month: "MMM",
                //         //     day: 'dd MMM',
                //         //     hour: '',
                //         // },
                //       }
                //     },//X AXIS
                //     yaxis: {
                //       show: true,
                //       labels: {
                //         show: true,
                //         align: 'right',
                //         //minWidth: 0,
                //         //maxWidth: 160,
                //         style: {
                //             color: '#FFF',
                //             fontSize: '12px',
                //             fontFamily: 'Helvetica, Arial, sans-serif',
                //             //cssClass: 'apexcharts-yaxis-label',
                //         },
                //         offsetX: 0,
                //         offsetY: 0,
                //         rotate: 0,
                //         //formatter: (value) => { return val.toFixed(0) },
                //       },//LABELS
                //     },//Y AXIS
                //     plotOptions: {
                //         bar: {
                //             //horizontal: false,
                //             dataLabels: {
                //               //enabled: false,
                //               position: 'top', // top, center, bottom
                //             },
                //         },
                      
                //     },//PLOT OPTIONS
                //     annotations: {
                //       yaxis: [
                //         {
                //           // y: 70,
                //           // y2: 90,
                //           // borderColor: 'yellow',
                //           // fillColor: 'yellow',
                //           // label: {
                //           //   text: "90%",
                //           //   style: {
                //           //     background: '#aaa',
                //           //   }
                //           // }
                //         }
                //       ],
                //       xaxis: [
                //       {
                //       }
                //       ]
                //     }//ANNOTATIONS
                // },
                // series: [
                //     {name: 'Alpesh', data: [{ x: '', y: 0}]},
                // ],//SERIES
               
            }//RETURN
        },//DATA
        mounted(){
            //this.updateOptions()
        },//MOUNTED
        created(){
          
        },
        beforeDestroy() {
            
        },
        computed:{
          chartOptions() {
              return {
                    theme: {   
                      mode: 'dark',   
                      palette: 'palette3',
                    },//THEME
                    chart: {
                        id: 'labor-backlog',
                        //background: '#000',
                        //foreColor: '#373d3f',
                        events: {
                          dataPointSelection : (event, chartContext, config) =>{
                            //console.log(chartContext, config);
                            this.handleClick(event, chartContext, config )
                          }           
                        },
                    },//CHART
                    animations: {
                      speed: 200
                    },//ANIMATIONS
                    title: {
                      text: undefined,
                    },
                    fill: {
                      //colors: ['blue', 'orange','red']
                    },
                    xaxis: {
                      crosshairs: {
                        width: 1
                      },
                      type : this.xAxisType,
                      // min : this.xAxisMin,
                      // max : this.xAxisMax,
                      //type: 'category',
                      //type: 'datetime',
                      min : new Date('2020-01-01').getTime(),
                      max : new Date(Date.now() + 365 * 24*60*60*1000).getTime(),
                      // min : moment().unix()*1000,
                      // max : moment().add(365,'d').unix()*1000,
                      labels: {
                        // formatter: function (val) {
                        //   return val.slice(0, 5)
                        // },
                        // datetimeFormatter: {
                        //     year: '',
                        //     month: "MMM",
                        //     day: 'dd MMM',
                        //     hour: '',
                        // },
                      }
                    },//X AXIS
                    yaxis: {
                      show: true,
                      labels: {
                        show: true,
                        align: 'right',
                        //minWidth: 0,
                        //maxWidth: 160,
                        style: {
                            color: '#FFF',
                            fontSize: '12px',
                            fontFamily: 'Helvetica, Arial, sans-serif',
                            //cssClass: 'apexcharts-yaxis-label',
                        },
                        offsetX: 0,
                        offsetY: 0,
                        rotate: 0,
                        //formatter: (value) => { return val.toFixed(0) },
                      },//LABELS
                    },//Y AXIS
                    plotOptions: {
                        bar: {
                            horizontal : this.barHorizontal,
                            //horizontal: false,
                            dataLabels: {
                              //enabled: false,
                              position: 'top', // top, center, bottom
                            },
                        },
                    },//PLOT OPTIONS
                    annotations: {
                      yaxis: [
                        {
                          // y: 70,
                          // y2: 90,
                          // borderColor: 'yellow',
                          // fillColor: 'yellow',
                          // label: {
                          //   text: "90%",
                          //   style: {
                          //     background: '#aaa',
                          //   }
                          // }
                        }
                      ],
                      xaxis: [
                      {
                      }
                      ]
                    }//ANNOTATIONS
              }//RETURN
          }//CHARTOPTIONS
        },//COMPUTED
        methods:{
          timelineXaxis(){
            if(this.chartType == "rangeBar"){
              return {
                min :  moment().format("x"),
                max : moment().add(365,'d').format("x")
              }
            }
          },
          // updateOptions(){
          //   this.chartOptions = {
          //       xaxis: {
          //           type : this.xAxisType,
          //           min : this.xAxisMin,
          //           max : this.xAxisMax,
          //       },//X AXIS
          //       plotOptions: {
          //               bar: {
          //                 horizontal : this.barHorizontal,
          //               }//BAR
          //        }//PLOT OPTIONS
          //   }//CHART OPTIONS
          // },
          handleClick(evt,ctx,cfg) {
            //console.log(evt.screenX)
            //console.log(ctx.series[0])
            //console.log(cfg.selectedDataPoints[0])
            //console.log(cfg.dataPointIndex)
            this.$emit("clickFromChildComponent",cfg.dataPointIndex)
          }
        }//METHODS

}//EXPORT DEFAULT
</script>

<style scoped>

</style>

