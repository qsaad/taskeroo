<template>
    <div>
    <v-toolbar flat color="orange">
      <v-toolbar-title class="black--text headline font-weight-bold">SCHEDULE</v-toolbar-title>
      <v-divider class="mx-2" color="black" inset vertical></v-divider>
      <v-text-field v-model="search" append-icon="search" class="black--text" label="Search" single-line hide-details clearable v-show="toggleView == 'list'"></v-text-field>
      <v-spacer></v-spacer>

    <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
    <!-- DIALOG BOX  -->
    <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on }" >
            <v-btn color="primary" dark class="mb-2" v-on="on" >New Item</v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
                <v-layout wrap>
                    <v-flex xs12>
                        <v-combobox label="By" :items="usersList" prepend-icon="person" v-model="editedItem.to"></v-combobox>
                    </v-flex>
                    <v-flex xs6>
                        <v-dialog ref="dialogStart" persistent v-model="modalStart" lazy full-width width="290px" :return-value.sync="editedItem.start">
                            <v-text-field slot="activator" label="Start" v-model="editedItem.start" prepend-icon="event" readonly></v-text-field>
                            <v-date-picker v-model="editedItem.start" scrollable>
                            <v-spacer></v-spacer>
                            <v-btn flat color="primary" @click="modalStart = false">Cancel</v-btn>
                            <v-btn flat color="primary" @click="$refs.dialogStart.save(editedItem.start)">OK</v-btn>
                            </v-date-picker>
                        </v-dialog>
                    </v-flex>
                    <v-flex xs6>
                        <v-dialog ref="dialogEnd" persistent v-model="modalEnd" lazy full-width width="290px" :return-value.sync="editedItem.end">
                            <v-text-field slot="activator" label="End" v-model="editedItem.end" prepend-icon="event" readonly></v-text-field>
                            <v-date-picker v-model="editedItem.end" scrollable>
                            <v-spacer></v-spacer>
                            <v-btn flat color="primary" @click="modalEnd = false">Cancel</v-btn>
                            <v-btn flat color="primary" @click="$refs.dialogEnd.save(editedItem.end)">OK</v-btn>
                            </v-date-picker>
                        </v-dialog>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field v-model="editedItem.number" label="Number" prepend-icon="work"></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field v-model="editedItem.name" label="Name" prepend-icon="work"></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field v-model="editedItem.description" label="Description" prepend-icon="description"></v-text-field>
                    </v-flex>
                    <v-flex xs6>
                        <v-text-field v-model.number="editedItem.hours" label="Hours" prepend-icon="access_time"></v-text-field>
                    </v-flex>
                    <v-flex xs6>
                        <v-checkbox v-model="editedItem.billable" label="Billable" prepend-icon="attach_money"></v-checkbox>
                    </v-flex>
                    
                </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click="copy" v-if="isCopy">Copy</v-btn>
            <v-btn color="blue darken-1" flat @click="save" v-else>Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
        <template>
            <v-btn
              fab
              color="indigo"
              bottom
              left
              absolute
              small
              @click="synchronizeData"
            >
              <v-icon>cached</v-icon>
            </v-btn>
        </template>
    </v-toolbar>

    <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
    <!-- BUTTONS  -->
    <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
    <v-layout row wrap justify-center align-center>
        <v-flex xs12 class="text-xs-center">
            <v-btn-toggle v-model="toggleView" class="mt-2">
                <v-btn value="currentWeek"><v-icon>date_range</v-icon></v-btn>
                <v-btn value="name"><v-icon>folder</v-icon></v-btn>
                <v-btn value="user"><v-icon>person</v-icon></v-btn>
                <v-btn value="timeline"><v-icon>timeline</v-icon></v-btn>
                <v-btn value="list"><v-icon>list</v-icon></v-btn>
                <v-btn value="module"><v-icon>view_module</v-icon></v-btn>
            </v-btn-toggle>
        </v-flex>
    </v-layout>

    <!-- <pre>{{filteredItems}}</pre> -->
    <!-- <pre>{{ userData }}</pre> -->
    <!-- <pre>{{test}}</pre> -->
    
    <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
    <!-- GROUP BY CURRENTWEEK -->
    <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
    <v-container fluid grid-list-md class="pa-0 ma-0" v-if="toggleView == 'currentWeek'">
        <v-layout row wrap justify-center>
            <v-flex xs12 sm6 md3 v-for="(item,key) in itemsByCurrentWeek" :key="key">
                <v-card height="100%" class="ma-2 pb-1">
                    <v-card-title class="yellow--text text-xs-center title">{{capitalizeText(key)}}</v-card-title>
                    <v-card-text v-for="data in item" :key="data.id" class="my-1 py-0">
                        <v-layout row wrap justify-center align-center>
                            <v-flex xs7 class="blue--text text-xs-left text-truncate">{{data.name}}</v-flex>
                            <v-flex xs5 class="teal--text text-xs-right text-truncate">{{data.description}}</v-flex>
                        </v-layout>
                    </v-card-text>

                </v-card>
                <!-- <pre>{{itemsByCurrentWeek}}</pre> -->
            </v-flex>
        </v-layout>
    </v-container>

    <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
    <!-- GROUP BY PROJECT NAME -->
    <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
    <v-container fluid grid-list-md class="pa-0 ma-0" v-if="toggleView == 'name'">
        <v-layout row wrap justify-center>
            <v-flex xs12 sm6 md3 v-for="(item,i) in itemsByName" :key="i +'nm'">
                <v-card height="100%" class="ma-2 pb-1">
                    <v-card-title class="yellow--text text-truncate title">
                        {{item.name}}
                    </v-card-title>
                    <v-card-text v-for="(data,j) in sortByDate(item.data)" :key="j + 'nmc'" class="my-1 py-0">
                        <v-layout row wrap justify-center align-center>
                            <v-flex xs2>
                                <v-avatar :color="avatarColor(data)" size="30" v-if="!data.completed">
                                    <v-img :src="avatarURL(data.to)" alt="item.to" v-if="avatarURL(data.to) != ''"></v-img>
                                    <span class="white--text subtitle-2" v-else>{{ userInitials(data.to) }}</span>
                                </v-avatar>
                            </v-flex>
                            <v-flex xs7 class="teal--text text-xs-left text-truncate">{{data.description}}</v-flex>
                            <v-flex xs3 class="red--text text-xs-right text-truncate">{{data.end}}</v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>

    <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
    <!-- GROUP BY USER NAME -->
    <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
    <v-container fluid grid-list-md class="pa-0 ma-0" v-if="toggleView == 'user'">
        <!-- <pre>{{itemsByUser}}</pre> -->
        <v-layout row wrap justify-center>
            <v-flex xs12 sm6 md3 v-for="(item,key) in itemsByUser" :key="key">
                <v-card height="100%" class="ma-2 pb-1">
                    <v-card-title class="yellow--text title">
                        {{item.to}}
                    </v-card-title>
                    <v-card-text v-for="data in sortByDate(item.data)" :key="data.id" class="py-1">
                        <v-layout row wrap justify-center align-center>
                            <v-flex xs12 class="blue--text text-xs-left pb-0">{{data.name}}</v-flex>
                            <v-flex xs8 class="teal--text text-xs-left text-truncate pt-0">{{data.description}}</v-flex>
                            <v-flex xs4 class="red--text text-xs-right text-truncate pt-0">{{data.end}}</v-flex>
                        </v-layout>
                        <v-divider class="mt-2"></v-divider>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
    <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
    <!-- TIMELINE -->
    <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
    <v-container fluid v-if="toggleView == 'timeline'">
        <!-- <pre>{{timelinePlotData}}</pre> -->
        <plot-backlog-component 
            :plotData = "timelinePlotData"
            chartType = "rangeBar"
            :barHorizontal = true
            xAxisType = "datetime"
        >
        </plot-backlog-component>
    </v-container>

    <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
    <!-- TABLE -->
    <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
    <v-container fluid v-if="toggleView == 'list'">
        <v-data-table
            :headers="headers"
            :items="filteredItems"
            :search="search"
            class="elevation-1"
            hide-default-footer
        >
        <template v-slot:items="props" >
            <td class="text-xs-left subheading">
                <v-checkbox
                    v-model="props.item.completed"
                    primary
                    hide-details
                    @change.self="toggleComplete(props.item)"
                ></v-checkbox>
            </td>
            <td class="text-xs-left" >
                <v-avatar :color="avatarColor(props.item)" size="36" v-if="!props.item.completed">
                    <!-- {{avatarURL(props.item.to)}} -->
                    <v-img :src="avatarURL(props.item.to)" alt="props.item.to" v-if="avatarURL(props.item.to) != ''"></v-img>
                    <span class="white--text subtitle-2" v-else>{{ userInitials(props.item.to) }}</span>
                </v-avatar>
                <v-avatar color="gray" size="36" v-else>
                    <span class="teal--text subtitle-2" v-if="props.item.to != ''">{{ userInitials(props.item.to) }}</span>
                </v-avatar>
            </td>
            <td class="text-xs-left subheading" :class="formatText(props.item)" >
                {{ props.item.start }}
            </td>
            <td class="text-xs-left subheading" :class="formatText(props.item)" >
                {{ props.item.end }}
            </td>
            <td class="text-xs-left subheading" :class="formatText(props.item)" >
                {{ props.item.number }}
            </td>
            <td class="text-xs-left subheading" :class="formatText(props.item)" >
                {{ props.item.name }}
            </td>
            <td class="text-xs-left subheading" :class="formatText(props.item)" >
                {{ props.item.description }}
            </td>
            <td class="text-xs-left subheading" :class="formatText(props.item)" >
                {{ props.item.hours }}
            </td>
            <td class="justify-center layout px-0">
            <v-icon color="green lighten-3" class="mr-2" @click="editItem(props.item)" v-if="!props.item.completed">edit</v-icon>
            <v-icon color="green lighten-3" class="mr-2" @click="copyItem(props.item)" v-if="!props.item.completed">filter_none</v-icon>
            <v-icon color="red" @click="deleteItem(props.item)">delete</v-icon>
            </td>
        </template>
        <template v-slot:no-data>
            No data
        </template>
        <template v-slot:no-results>
            <v-alert :value="true" color="error" icon="warning">
            Your search for "{{ search }}" found no results.
            </v-alert>
        </template>
        </v-data-table>
    </v-container>

    <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
    <!-- MODULE -->
    <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
    <v-container fluid v-if="toggleView == 'module'">
        <v-layout row wrap justify-start align-center>
            <v-flex xs12 sm6 md3 v-for="item in filteredItems" :key="item.id">
                <v-card tile hover height="100%" class="ma-2 px-0 py-3">
                    <v-card-title :class="formatText(item)" class="ma-0 pa-0 subtitle-1 text-uppercase">
                       <v-layout row justify-center align-center>
                           <v-flex xs10>{{item.name}}</v-flex>
                       </v-layout>
                    </v-card-title> 
                    <v-card-text>
                        <v-layout row justify-center align-center>
                            <v-flex xs2>
                                <v-avatar :color="avatarColor(item)" size="50" v-if="!item.completed">
                                    <v-img :src="avatarURL(item.to)" alt="item.to" v-if="avatarURL(item.to) != ''"></v-img>
                                    <span class="white--text subtitle-2" v-else>{{ userInitials(item.to) }}</span>
                                </v-avatar>
                                <v-avatar color="gray" size="36" v-else>
                                    <span class="teal--text subtitle-2" v-if="item.to != ''">{{ userInitials(item.to) }}</span>
                                </v-avatar>
                            </v-flex>
                            <v-flex xs10>
                                <v-layout row wrap justify-center align-center >
                                    <v-flex xs2><v-icon color="teal darken-2">insert_drive_file</v-icon></v-flex>
                                    <v-flex xs10 :class="formatText(item)">{{item.description}}</v-flex>
                                    <v-flex xs2><v-icon color="teal darken-2">date_range</v-icon></v-flex>
                                    <v-flex xs5 :class="formatText(item)">{{item.start}}</v-flex>
                                    <v-flex xs5 :class="formatText(item)">{{item.end}}</v-flex>
                                    <v-flex xs2><v-icon color="teal darken-2">schedule</v-icon></v-flex>
                                    <v-flex xs10 :class="formatText(item)">{{item.hours}} Hrs</v-flex>
                                </v-layout>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
   
  </div>
    
</template>

<script>
import PlotBacklogComponent from '@/components/PlotBacklogComponent.vue'
import Backlog from '@/classes/backlog'
import {map, findIndex, orderBy, debounce, isString, filter, forEach, chain, groupBy, value, sortBy, toUpper} from "lodash"
import * as moment from 'moment'
import Swal from 'sweetalert2'
import VerEx from 'verbal-expressions'
import {metrics} from '@/mixins/metricsMixin'
import webpush from 'web-push'
import { prependListener } from 'cluster'

export default {
    middleware : ['loadUsers','loadSchedules'],
    components:{PlotBacklogComponent},
    mixins : [metrics],
    layout:'default',
    data(){
        return{
            toggleView : 'list',
            //viewFormat : 'list',
            //display : 'pending',
            search: '',
            dialog: false,
            headers: [
                {text: 'Status', align: 'left', sortable: true, value: 'status'},
                {text: 'To', align: 'left', sortable: true, value: 'to'},
                {text: 'Start', align: 'left', sortable: true, value: 'start'},
                {text: 'End', align: 'left', sortable: true, value: 'end'},
                {text: 'Number', align: 'left', sortable: true, value: 'number'},
                {text: 'Name', align: 'left', sortable: true, value: 'name'},
                {text: 'Description', align: 'left', sortable: true, value: 'description'},
                {text: 'Hours', align: 'left', sortable: true, value: 'hours'},
                {text: 'Actions', align: 'center',value: 'actions', sortable: false }
            ],
            items : [],
            group : '',
            isCopy : false,
            editedIndex: -1,
            editedItem: {
                completed: '',
                to: '',
                start : '',
                end : '',
                number: '',
                name: '',
                description : '',
                hours : '',
                billable : '',
            },
            defaultItem: {
                completed: false,
                to: '',
                start : '',
                end : '',
                number: '',
                name: '',
                description : '',
                hours : '',
                billable : true,
            },
            modalStart:false,
            modalEnd:false,

            test : {},
            //groupByCurrentWeek : [],
            //groupByProject : []
            // snackbar : false,
            // timeout : 3000,
            // mode : ''
        }//RETURN
    },//DATA
    async asyncData({store}){
        let uid = store.getters.userID
        let userName = store.getters.userName
        let userEmail = store.getters.userEmail
        let photoURL = store.getters.photoURL
        let group = store.getters.group
        //subscriptions = await store.getters['subscriptions/list']
        //let  items = await store.getters['schedules/list']
       
        return {uid,userName,userEmail,photoURL, group}
    },//ASYN
    fetch({ store, params }){
        //return store.dispatch('schedules/get',{group : store.getters.group})
    },
    created(){
       
    },//CREATED
    mounted(){
        this.items = orderBy(this.$store.getters['schedules/list'],['completed','end','name'],['asc'])
    },//MOUNTED
    watch: {
        dialog (val) {
            val || this.close()
        }
    },//WATCH
    computed:{
        userData(){
            return this.$store.getters.list
        },
        formTitle () {
            return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
        },//FORM TITLE
        filteredItems(){
            console.log('STEP 5 : SCHEDULES - filtereditems')
            this.items = orderBy(this.$store.getters['schedules/list'],['completed','end','name'],['asc'])
            console.log(this.items)
            return this.items
        },//FILTERED ITEMS
        itemsByCurrentWeek(){
            let B = new Backlog(this.items)
            return B.GroupPendingByEndDateForCurrentWeek()
        },//ITEMS BY CURRENT WEEK
        itemsByName(){
            //return this.$store.getters['schedules/byName']
            console.log('STEP 6 : SCHEDULES - groupByName')
            let data = this.$store.getters['schedules/list']
            let d1 =  chain(data)
                    .sortBy(['name'])
                    .filter({completed : false})
                    .groupBy('name')
                    .map((data, name) => ({ data, name }))
                    .value()
            return d1
            // let data = this.$store.getters['schedules/list']
            // let B = new Backlog(data)
            // return B.GroupPendingByName()
        },//ITEMS BY NAME
        itemsByUser(){
            let data = this.$store.getters['schedules/list']
             let d1 =  chain(data)
                    .sortBy(['end'])
                    .filter({completed : false})
                    .groupBy('to')
                    .map((data, to) => ({ data, to }))
                    .value()
            return d1

            //let B = new Backlog(data)
            //return B.GroupPendingByUser()
        },//ITEMS BY USER
        timelinePlotData(){
            // let B = new Backlog(this.items)
            // return  [
            //     {name: 'timeline', data: B.PlotTimeline()},
            // ]
            
            //GET, FILTER AND SORT DATA
            let data = chain(this.$store.getters['schedules/list'])
                        .filter({completed : false, billable : true})
                        .sortBy(['end'])
                        .value()
            //FORMAT DATA FOR PLOTTING
            const plotData = data.map(item => {
                                let start = item.start == '' ? new Date().getTime() : new Date(item.start).getTime()
                                let end = new Date(item.end).getTime()
                                return{
                                    x: item.name,
                                    y: [start, end]
                                }
                            })
            //RETURN OBJECT TO PLOT COMPONENT
            return [ {name: 'timeline', data: plotData} ]
        },//TIMELINE PLOT DATA
       

    },//COMPUTED
    methods:{
        synchronizeData(){
            this.$store.dispatch('schedules/get',{group : this.group})
        },
        sortByDate(data){
            return sortBy(data,['end'])
        },
        capitalizeText(text){
            return toUpper(text)
        },
        avatarURL(name){
            let arr = name.split(' ')
            return this.$store.getters.avatarByName(arr[0],arr[1])
            //return obj.photoURL
        },
        avatarColor(item){
            switch (item.to){
                case "Alpesh Chavda": return 'blue darken-4'
                case "Michael Ferraro": return 'red darken-2'
                case "Lisa Haas": return 'orange darken-1'
            }
        },
        toggleComplete(item){
            let index = this.items.indexOf(item)
            Object.assign(this.items[index], item)
            this.$store.dispatch('schedules/update',item)
        },//UPDATE TASK
        formatText(item){
            if(item.completed){
                return "teal--text text--lighten-4 isCompleted"
            }
            else{
                if(moment() > moment(item.end)){
                    return "red--text"
                }
                else{
                    return item.billable ? "blue--text" : "green--text"
                }
            }
        },//FORMAT TEXT
        editItem (item) {
            console.log(item)
            this.editedIndex = this.items.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },
        copyItem (item) {
            console.log(item)
            delete item.id
            this.editedIndex = this.items.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
            this.isCopy = true
        },
        deleteItem (item) {
            const index = this.items.indexOf(item)
            Swal.fire({
                type: 'warning',
                title: 'Are you sure you want to delete this link?',
                text: item.name,
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'Cancel'
            })
            .then((result) => {
                if (result.value) {
                    this.items.splice(index, 1)
                    this.$store.dispatch('schedules/delete',item)
                } 
            })
        },
        close () {
            this.dialog = false
            setTimeout(() => {
            this.editedItem = Object.assign({}, this.defaultItem)
            this.editedIndex = -1
            }, 300)
        },
        copy(){
            let payload = {...this.editedItem, id : Math.random().toString(24)}
            this.items.push(payload)
            this.$store.dispatch('schedules/add',payload)
            this.editedIndex = -1
            this.isCopy = false
            this.close()
            //this.$store.dispatch('notifications/get',payload)
            //type = 'Copy Task'
        },
        save () {
            //let type = ''
            if (this.editedIndex > -1) {
                Object.assign(this.items[this.editedIndex], this.editedItem)
                this.$store.dispatch('schedules/update',this.editedItem)
                this.editedIndex = -1
                //type = 'Updated Task'
            } 
            else {
                let payload = {...this.editedItem,completed : false, id : Math.random().toString(24), group : this.$store.getters.group}
                this.items.push(payload)
                this.$store.dispatch('schedules/add',payload)
                //this.$store.dispatch('notifications/get',payload)
                //type = 'New Task'
            }

            // const vapidKeys = {
            //     publicKey: 'BKnoc5M9L61MAFZCsJj2L4gxFmtvPK8MIL2EI2vnVK1Q-U0v4MuTKX5Y8B8AIZCwOSC31RurSfWXZRtg1mt9fRw',
            //     privateKey: 'rhdP9g22O1byPSWIFJlg9oK7xWBgaSt2x2xHrSX6gbU'
            // }

            // webpush.setVapidDetails(
            //     'mailto:example@yourdomain.org',
            //     vapidKeys.publicKey,
            //     vapidKeys.privateKey
            // )

            // const payload = {
            //     title : 'New Notification',
            //     body : `${type} : ${this.editedItem.description} due on ${this.editedItem.end}`,
            //     icon: '/task.png',
            // }
            // const options ={
            //     TTL: 172800,
            //     headers: {
            //         "Content-Type" : "application/json;charset=UTF-8",
            //         "mode" : "no-cors",
            //         "Access-Control-Allow-Origin" : "*",
            //         "Access-Control-Allow-Credentials" : true
            //     },
            // }

            // console.log('SCHEDULES - SEND NOTIFICATION')
           
            // //if(subscription.uid == this.editedItem.to)
            //     forEach(this.subscriptions, subscription =>{
            //         console.log(JSON.parse(subscription.body))
            //         console.log(payload)
            //         let sub = JSON.parse(subscription.body)
            //         let data = JSON.stringify(payload)
            //         webpush.sendNotification(sub, data, options)
            //     })
          
            this.editedIndex = -1
            this.close()
        },
        // addField(){
        //   this.$store.dispatch('links/addField',{uid : this.uid})
        // }
    },//METHODS

    
}
</script>

<style scoped>
a{
    text-decoration: none
}
.isCompleted{
    text-decoration: line-through;
}
</style>