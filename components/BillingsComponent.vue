<template>
    <v-card height="97%" class="my-2">
        <v-card-title class="yellow--text headline px-3 py-0">
            BILLINGS
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
            <v-btn color="primary" dark icon v-on="on">
                <v-icon>add</v-icon>
            </v-btn>
            </template>
            <v-card>
                <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12>
                                <v-menu
                                    v-model="menu"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    lazy
                                    transition="scale-transition"
                                    offset-y
                                    full-width
                                    min-width="290px"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                            v-model="editedItem.date"
                                            label="Date"
                                            prepend-icon="event"
                                            readonly
                                            v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker v-model="editedItem.date" @input="menu = false" color="green lighten-1"></v-date-picker>
                                </v-menu>
                                <v-combobox label="Type" :items="billingsTypeList" v-model="editedItem.type"></v-combobox>
                                <v-text-field label="Reference" v-model.number="editedItem.ref"></v-text-field>
                                <v-text-field label="Amount" v-model.number="editedItem.amount"></v-text-field>
                                <!-- <pre>
                                    {{ computedBillingsStatusList(editedItem.type) }}
                                </pre> -->
                                <v-combobox label="Status" :items="computedBillingsStatusList(editedItem.type)" v-model="editedItem.status" v-if="editedItem.type != 'Fee' || editedItem.type != 'Labor'"></v-combobox>
                                <v-layout row wrap>
                                    <v-checkbox v-model="editedItem.discipline" label="M" value="M"></v-checkbox>
                                    <v-checkbox v-model="editedItem.discipline" label="E" value="E"></v-checkbox>
                                    <v-checkbox v-model="editedItem.discipline" label="P" value="P"></v-checkbox>
                                    <v-checkbox v-model="editedItem.discipline" label="S" value="S"></v-checkbox>
                                    <v-checkbox v-model="editedItem.discipline" label="FP" value="FP"></v-checkbox>
                                    <v-checkbox v-model="editedItem.discipline" label="C" value="C"></v-checkbox>
                                    <v-checkbox v-model="editedItem.discipline" label="A" value="A"></v-checkbox>
                                </v-layout>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
                    <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>        
        </v-card-title>
        <v-card-text>
            <v-layout row wrap>
                <v-flex xs2>
                    Fee : <span class="text-xs-left subheading green--text"> {{  formatAmount(computedBillings.totalFee) }} </span>
                </v-flex>
                <v-flex xs2>
                    ASR : <span class="text-xs-left subheading green--text"> {{  formatAmount(computedBillings.totalASR) }} </span>
                </v-flex>
                <v-flex xs2>
                    Labor : <span class="text-xs-left subheading green--text"> {{  formatAmount(computedBillings.totalLabor) }} </span>
                </v-flex>
                <v-flex xs2>
                    Invoice : <span class="text-xs-left subheading green--text"> {{  formatAmount(computedBillings.totalInvoice) }} </span>
                </v-flex>
                 <v-flex xs2>
                    AR : <span class="text-xs-left subheading green--text"> {{  formatAmount(computedBillings.totalAR) }} </span>
                </v-flex>
                <v-flex xs2>
                    MU : <span class="text-xs-left subheading green--text"> {{  formatNumber(computedBillings.MU,2) }} </span>
                </v-flex>

            </v-layout>
        </v-card-text>
        <v-card-text class="teal--text title pt-0">

            <v-layout row wrap>
                <v-flex xs12 v-show="!showChart">
                    <v-data-table
                        :headers="headers"
                        :items="items"
                        class="mt-0"
                        hide-actions
                    >
                        <template v-slot:items="props">
                                <td class="text-xs-left subheading green--text">
                                    {{ formatDate(props.item.date) }}
                                </td>
                                <td class="text-xs-left subheading green--text">
                                    {{ formatAmount(props.item.amount) }}
                                </td>
                                <td class="text-xs-left subheading green--text">
                                    {{ props.item.type }}
                                </td>
                                <td class="text-xs-left subheading green--text">
                                    {{ props.item.ref }}
                                </td>
                                <td class="text-xs-left subheading green--text">
                                    {{ props.item.status }}
                                </td>
                                <td class="text-xs-left subheading green--text">
                                    {{ joinDisciplines(props.item.discipline) }}
                                </td>
                                <td class="justify-center layout px-0">
                                    <v-btn icon class="px-0 mx-0">
                                        <v-icon color="blue" class="mr-2" @click="editItem(props.item)">edit</v-icon>
                                    </v-btn>
                                    <v-btn icon class="px-0 mx-0">
                                        <v-icon color="red" @click="deleteItem(props.item)">delete</v-icon>
                                    </v-btn>
                                </td>
                        </template>
                        <template v-slot:no-data>
                            No data
                        </template>
                    </v-data-table>
                </v-flex>
                <v-flex xs12 v-show="showChart">
                    <!-- <chart-billings
                        
                        :fee = "computedBillings.totalFee"
                        :asr = "computedBillings.totalASR"
                        :labor = "computedBillings.totalLabor"
                        :invoice = "computedBillings.totalInvoice"
                        :ar = "computedBillings.totalAR"
                        
                    ></chart-billings> -->
                    <plot-fee-labor-by-number
                        :fee = "feePlotData"
                        :labor = "laborPlotData"
                    >

                    </plot-fee-labor-by-number>
                </v-flex>
            </v-layout>
        </v-card-text>
        <v-card-actions>
            <v-layout row wrap justify-center align-center>
                  <v-btn @click="showChart = !showChart" color="orange">Chart </v-btn>           
            </v-layout>
        </v-card-actions>
    </v-card>

    
</template>

<script>
import Swal from 'sweetalert2'
import {map, findIndex, filter, forEach,toLower,toUpper} from "lodash"
import {metrics} from '@/mixins/metricsMixin'
import ChartBillings from '@/components/ChartBillings.vue'
import PlotFeeLaborByNumber from '@/components/PlotFeeLaborByNumber.vue'

import Billings from '@/classes/billings'
import * as Moment from 'moment'
import { extendMoment } from 'moment-range'

const moment = extendMoment(Moment)

export default {
    middleware : [],
    components:{ChartBillings, PlotFeeLaborByNumber},
    mixins : [metrics],
    props : {
        number: {type:[Number,String], default:''},
        name: {type:String, default:''},
        multiplier: {type:[Number], default: 3.0},
    },
    data(){
        return{
            search: '',
            dialog: false,
            menu : false,
            showChart : false,
            laborPlotData : [],
            feePlotData : [],
            headers: [
                {text: 'DATE', align: 'left', sortable: true, value: 'date'},
                {text: 'AMOUNT', align: 'left', sortable: true, value: 'amount'},
                {text: 'TYPE', align: 'left', sortable: true, value: 'type'},
                {text: 'REF', align: 'left', sortable: true, value: 'ref'},
                {text: 'STATUS', align: 'left', sortable: true, value: 'status'},
                {text: 'DISCIPLINE', align: 'left', sortable: true, value: 'discipline'},
                {text: '', align: 'center',value: 'actions', sortable: false }

            ],
            items : [],
            editedIndex: -1,
            editedItem: {
                date: '',
                amount: '',
                type : '',
                ref : '',
                status : '',
                discipline : ['S'],
                number : '',
                id : ''
            },
            defaultItem: {
                date: '',
                amount: '',
                type : '',
                ref : '',
                status : '',
                discipline : ['S'],
                number : '',
                id : ''
            },
            
        }//RETURN
    },//DATA
    async asyncData({store}){
       return{
            uid : store.getters.userID,
            userName : store.getters.userName,
            userEmail : store.getters.userEmail,
            //items : store.state.billings.list,
        }
    },//ASYN
    async fetch ({ store, params }) {

    },
    created(){
      
    },//CREATED
    mounted(){
        this.items = this.$store.getters['billings/listByNumber'](this.number)

    },//MOUNTED
    watch: {
        dialog (val) {
            val || this.close()
        }
    },//WATCH
    computed:{
        formTitle () {
            return this.editedIndex === -1 ? 'New Billing' : 'Edit Billing'
        },
        computedBillings(){
            let data = this.$store.getters['billings/list']
            let projects = this.$store.getters['projects/list']

            let B = new Billings({data : data, projects : projects})

            this.laborPlotData = B.plotLaborByNumber(this.number)
            this.feePlotData = B.plotFeeByNumber(this.number)

            //console.log(B.plotLaborByNumber(this.number))
            //console.log(B.projects)
            let fromDate = B.projectStartDateByNumber(this.number)
            let toDate = B.projectEndDateByNumber(this.number)
            
            console.log(B.plotMUbyNumber(this.number))

            // const start = moment('2011-04-15', 'YYYY-MM-DD');
            // const end   = moment('2011-11-27', 'YYYY-MM-DD');
            // const range =moment.range(fromDate, toDate)

            // const duration = Array.from(range.by('month'));
           
            // let fee = 5000

            // let plotArr = duration.map(m => {
            //     return {
            //         x : m.format('YYYY-MM-DD'),
            //         y : 5000/duration.length
            //     }
            // })

            // console.log(plotArr)

            // map(duration, item => {
            //     console.log(item.moment())
            // })

            // for (let month of range.by('month')) {
            //     console.log(month.format('YYYY-MM-DD'))
            // }

            //console.log(range)
            
            if(this.items.length > 0 ){
                return {
                    totalFee : B.totalFee(),
                    totalASR : B.totalASR(),
                    totalExpense : B.totalExpense(),
                    totalLabor : B.totalLabor(),
                    totalInvoice : B.totalInvoice(),
                    totalAR : B.totalAR(),
                    MU : B.MU(this.multiplier)
                }
            }
            else{
                return {
                totalFee : 0,
                totalASR : 0,
                totalExpense : 0,
                totalLabor : 0,
                MU : this.multiplier
                }
            }
        
        },//COMPUTEDBILLING
       
    },//COMPUTED
    methods:{
         computedBillingsStatusList(type){
            switch(true){
                case (type == 'Fee') : 
                    return []
                case (type == 'Labor') : 
                    return []
                case (type == 'Expense') : 
                    return this.billingsExpenseStatusList
                case (type == 'ASR') : 
                    return this.billingsASRStatusList
                case (type == 'Invoice') : 
                    return this.billingsInvoiceStatusList
            }
        },
        editItem (item) {
            this.editedIndex = this.items.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },
        deleteItem (item) {
            const index = this.items.indexOf(item)
            Swal.fire({
                type: 'warning',
                title: 'Are you sure you want to delete this Billing?',
                text: item.url,
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'Cancel'
            })
            .then((result) => {
                if (result.value) {
                    this.items.splice(index, 1)
                    this.$store.dispatch('billings/delete',item)
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
        save () {
            if (this.editedIndex > -1) {
                Object.assign(this.items[this.editedIndex], this.editedItem)
                this.$store.dispatch('billings/update',this.editedItem)
                this.editedIndex = -1
            } 
            else {
                const payload = Object.assign(this.editedItem, {number : this.number, name: this.name, id : Math.random().toString(24)})
                this.items.push(payload)
                this.$store.dispatch('billings/add',payload)
            }
            this.editedIndex = -1
            this.close()
        }, 
    },//METHODS  
}
</script>

<style scoped>

</style>




