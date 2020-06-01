<template>
    <div>
        <v-toolbar flat color="orange">
            <v-toolbar-title class="black--text headline font-weight-bold">BACKLOG</v-toolbar-title>
        </v-toolbar>
        <v-container fluid>
        <!-- +++++++++++++++++++++++++++++++++++++++ -->
        <!-- CHART 1 -->
        <!-- +++++++++++++++++++++++++++++++++++++++ -->
        <v-layout col wrap justify-center align-start class="mt-2">
            <v-flex xs12 sm8 md6>
                <v-card class="mr-2" height="100%">
                    <v-card-title>
                        USER BACKLOG HOURS 
                    </v-card-title>
                </v-card>
                <v-card-text>
                    <plot-backlog-component 
                        :plotData = "userHoursPlotData"
                        chartType = 'bar'
                        @clickFromChildComponent = "handleClick"
                    >
                    </plot-backlog-component>
                </v-card-text>
                <v-card-actions>
                    <v-combobox :items="usersList" label="User" v-model="user" prepend-icon="person" @change="updateData"></v-combobox>
                    <v-text-field label="No of Weeks" v-model="userHoursWeekRange" prepend-icon="date_range"></v-text-field>
                </v-card-actions>
            </v-flex>
        <!-- +++++++++++++++++++++++++++++++++++++++ -->
        <!-- CHART 2 -->
        <!-- +++++++++++++++++++++++++++++++++++++++ -->
            <v-flex xs12 sm8 md6>
                <v-card class="ml-2" height="100%">
                    <v-card-title>
                        USER BACKLOG HOURS PER WEEK
                    </v-card-title>
                </v-card>
                <v-card-text>
                    <table id="t01" width="100%">
						<tr>
						    <th v-for="(header,i) in chartData.tableHeaders" :key="i">
								{{header}}
							</th>		
						</tr>
						<tr v-for="(data,j) in chartData.tableData" :key="j+'ab'">
							<td v-for="(item,k) in data" :key="k+'zx'" class="text-xs-center">
								{{item}}
							</td>
						</tr>
					</table>
                </v-card-text>
                <v-card-actions>
                    <!-- <v-combobox :items="usersList" label="User" v-model="user" prepend-icon="person" @change="updateData"></v-combobox> -->
                    <v-combobox :items="dateList" v-model="mondayDate" label="weekNo" prepend-icon="date_range"></v-combobox>
                </v-card-actions>
            </v-flex>
        <!-- +++++++++++++++++++++++++++++++++++++++ -->
        <!-- CHART 3 -->
        <!-- +++++++++++++++++++++++++++++++++++++++ -->
            <v-flex xs12 sm8 md6>
                <v-card class="ml-2" height="100%">
                    <v-card-title>
                        AVERAGE UTILIZATION
                    </v-card-title>
                </v-card>
                <v-card-text>
                    <plot-backlog-component 
                        :plotData = "averageUtilizationPlotData"
                        chartType = 'line'
                    >
                    </plot-backlog-component>
                </v-card-text>
                <v-card-actions>
                    <v-text-field label="No of Weeks" v-model="averageUtilizationWeekRange" prepend-icon="date_range"></v-text-field>
                </v-card-actions>
            </v-flex>

        <!-- +++++++++++++++++++++++++++++++++++++++ -->
        <!-- CHART 3 -->
        <!-- +++++++++++++++++++++++++++++++++++++++ -->
            <!-- <v-flex xs12 sm8 md12>
                <v-card class="ml-2" height="100%">
                    <v-card-title>
                        TIMELINE
                    </v-card-title>
                </v-card>
                <v-card-text>
                    <plot-backlog-component 
                        :plotData = "timelinePlotData"
                        chartType = "rangeBar"
                        :barHorizontal = true
                        xAxisType = "datetime"
                    >
                    </plot-backlog-component>
                </v-card-text>
                <v-card-actions>
                    
                </v-card-actions>
            </v-flex> -->
       
        <!-- +++++++++++++++++++++++++++++++++++++++ -->
        <!-- CHART 4 -->
        <!-- +++++++++++++++++++++++++++++++++++++++ -->
            <v-flex xs12 sm8 md6>
                <v-card class="ml-2" height="100%">
                    <v-card-title>
                        METRICS
                    </v-card-title>
                </v-card>
                <v-card-text class="display-1">
                   Department Weeks : {{departmentWeeks(chartData.totalBillableHours)}}
                </v-card-text>
               
                <v-card-actions>
                  
                </v-card-actions>
            </v-flex>
        </v-layout>
        </v-container>
    </div>
    
</template>

<script>
import Backlog from '@/classes/backlog'
import PlotBacklogComponent from '@/components/PlotBacklogComponent.vue'
import {metrics} from '@/mixins/metricsMixin'
import {map,range} from "lodash"

import * as moment from 'moment'

export default {
    middleware : ['loadSchedules'],
    components:{PlotBacklogComponent},
    mixins : [metrics],
    layout:'default',
    data(){
        return{
            scheduleList : [],
            user : 'Alpesh Chavda',
            //CHART 1
            userHoursPlotData : [],
            userHoursWeekRange : 4,
            //CHART 2
            mondayDate : '2020-01-06',
            weekNo : moment().week(),
            //CHART 3
            averageUtilizationPlotData : [],
            averageUtilizationWeekRange : 4,
            //CHART 4
            timelinePlotData : [],
            gnattData : [],

            // test : new Date("2020-01-03").getTime(),
            // timelineStart : moment().unix()*1000,
            // timelineEnd : moment().add(365,'d').unix()*1000,
            //testData : []
        }//RETURN
    },//DATA
    async asyncData({store}){
        let uid = store.getters.uid
        let displayName = store.getters.displayName
        let email = store.getters.email
        let noUsers = store.getters['count']
       
        return {uid, displayName, email, noUsers}
    },//ASYNC
    fetch({store}){

    },
    created(){
        
    },//CREATED
    mounted(){
        this.scheduleList = this.$store.getters['schedules/list'],['completed','end','name'],['asc']
        this.updateData()
    },//MOUNTED
    watch: {
        //CHART 1
        userHoursWeekRange: function () {
            this.updateData()
        },
        //CHART 1
        averageUtilizationWeekRange: function (){
            this.updateData()
        }
    },//WATCH
    computed:{
        //CHART 3
        dateList(){
			return _.map(_.range(51),item =>{
				return moment().week(item+1).subtract(2,'day').format("YYYY-MM-DD")
			})
        },//DATE LIST
        
        chartData(){
            let B = new Backlog(this.scheduleList)

             //CHART 3
            let wkNo = this.getWeekNo(this.mondayDate)
            //console.log(this.weekNo)
            //this.weekNo = this.handleClick()
            let tableData = B.UserBillableHoursByWeekNo(this.user, wkNo)
            
            return{
                tableHeaders : B.GetDataKeys(tableData),
                tableData :tableData,
                totalBillableHours : B.TotalBillableHours()
            }
        }
       
    },//COMPUTED
    methods:{
        handleClick(index){
            console.log(index)
            return index + 1
        },
        //ALL CHARTS
        updateData(){
            let B = new Backlog(this.scheduleList)

            //CHART 1
            this.userHoursPlotData =  [
                {name: 'userHoursPerWeek', data: B.PlotUserHoursPerWeek(this.user, this.userHoursWeekRange)},
            ]

            //CHART 2
            this.averageUtilizationPlotData =  [
                {name: 'averageUtilization', data: B.PlotAverageUtilizationPerWeek(this.averageUtilizationWeekRange,this.noUsers)},
            ]

            this.timelinePlotData =  [
                {name: 'timeline', data: B.PlotTimeline()},
            ]

        },//UPDATE DATA

        getWeekNo(date){
			return moment(date).week()
		},
		// formatNumber(num, deci){
		// 	return num.toFixed(deci)
		// },
		// userUtilization(billableHours){
		// 	return ((billableHours/40)*100).toFixed(0) + "%"
		// },
		// teamUtilization(billableHours){
		// 	return ((billableHours/(this.noUsers*40))*100).toFixed(0) + "%"
		// },
		departmentWeeks(billableHours){
			return (billableHours/this.noUsers/40).toFixed(2)
		}

    },//METHODS  
}
</script>

<style scoped>
table, th, td {
    border: 1px solid rgb(107, 107, 107);
    border-collapse: collapse;
}

th, td {
  padding: 5px;
}

table#t01 tr:nth-child(even) {
  background-color: rgb(43, 25, 25);
}
table#t01 tr:nth-child(odd) {
 background-color: rgb(54, 53, 53);
}
table#t01 th {
  background-color: #302e1a;
  color: yellow;
}

</style>


