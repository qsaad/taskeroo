<template>
    <v-layout column>
        <v-container grid-list-md fluid>
            <v-layout row wrap>
                <v-flex xs12>
                    <v-card flat tile class="blue-lighten--4">
                        <v-card-title class="pa-0 ma-0">
                             <v-toolbar dark dense>
                                <v-toolbar-title class="yellow--text">BILLINGS</v-toolbar-title>
                                <v-spacer></v-spacer>
                                    <v-btn-toggle dark v-model="toggleBilling" multiple>
                                        <v-btn flat value="mu">
                                            MU
                                        </v-btn>
                                        <v-btn flat value="amount">
                                            Amount
                                        </v-btn>
                                        <v-btn flat value="invoice">
                                            Invoice
                                        </v-btn>
                                        <v-btn flat value="percent">
                                            %
                                        </v-btn>
                                        <v-btn flat value="profit">
                                            Profit
                                        </v-btn>
                                    </v-btn-toggle>
                                
                                <v-spacer></v-spacer>
                                <v-toolbar-items class="hidden-sm-and-down">
                                    <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
                                </v-toolbar-items>
                            </v-toolbar>
                        </v-card-title>
                      
                        <v-card-text class="green--text text-xs-center pa-0 ma-0">
                             <v-data-table
                                :headers="computedBillingHeaders"
                                :items="billings.items"
                                class="mt-0"
                                hide-actions
                            >
                            <template v-slot:items="props">
                                <td class="text-xs-left subheading green--text" v-show="showField('id')">
                                    <v-btn @click="goto(props.item.number)" color="blue">{{ props.item.number }}</v-btn>
                                </td>
                                <td class="text-xs-left subheading green--text text-no-wrap text-truncate" v-show="showField('id')">
                                    {{ props.item.name }}
                                </td>
                                <td class="text-xs-left subheading green--text" v-show="showField('mu')">
                                    {{ formatNumber(props.item.MU,2) }}
                                </td>
                                <td class="text-xs-left subheading green--text" v-show="showField('mu')">
                                    {{ formatNumber(props.item.MUa,2) }}
                                </td>
                                <td class="text-xs-left subheading green--text" v-show="showField('amount')">
                                    {{ formatAmount(props.item.fee) }}
                                </td>
                                <td class="text-xs-left subheading green--text" v-show="showField('amount')">
                                    {{ formatAmount(props.item.asr) }}
                                </td>
                                <td class="text-xs-left subheading green--text" v-show="showField('amount')">
                                    {{ formatAmount(props.item.labor) }}
                                </td>
                                <td class="text-xs-left subheading green--text" v-show="showField('invoice')">
                                    {{ formatAmount(props.item.invoice) }}
                                </td>
                                <td class="text-xs-left subheading green--text" v-show="showField('invoice')">
                                    {{ formatAmount(props.item.paid) }}
                                </td>
                                <td class="text-xs-left subheading green--text" v-show="showField('invoice')">
                                    {{ formatAmount(props.item.ar) }}
                                </td>
                                <td class="text-xs-left subheading green--text" v-show="showField('percent')">
                                    {{ formatPercent(props.item.percentLabor) }}
                                </td>
                                <td class="text-xs-left subheading green--text" v-show="showField('percent')">
                                    {{ formatPercent(props.item.percentInvoiced) }}
                                </td>
                                <td class="text-xs-left subheading green--text" v-show="showField('percent')">
                                    {{ formatPercent(props.item.percentAR) }}
                                </td>
                                <td class="text-xs-left subheading green--text" v-show="showField('profit')">
                                    {{ formatAmount(props.item.profit) }}
                                </td>
                                <td class="text-xs-left subheading green--text" v-show="showField('profit')">
                                    {{ formatAmount(props.item.wipProfit) }}
                                </td>
                            </template>
                            <template v-slot:footer>
                                <td colSpan = 2 class="text-xs-center subheading yellow--text" v-show="showField('id')">
                                    TOTALS
                                </td>
                                <td class="text-xs-left subheading yellow--text" v-show="showField('mu')">
                                    {{ formatNumber(billings.averageMU,2) }}
                                </td>
                                <td class="text-xs-left subheading yellow--text" v-show="showField('mu')">
                                    {{ formatNumber(billings.averageMUa,2) }}
                                </td>
                                <td class="text-xs-left subheading yellow--text" v-show="showField('amount')">
                                    {{ formatAmount(billings.totalFee) }}
                                </td>
                                <td class="text-xs-left subheading yellow--text" v-show="showField('amount')">
                                    {{ formatAmount(billings.totalASR) }}
                                </td>
                                <td class="text-xs-left subheading yellow--text" v-show="showField('amount')">
                                    {{ formatAmount(billings.totalLabor) }}
                                </td>
                                <td class="text-xs-left subheading yellow--text" v-show="showField('invoice')">
                                    {{ formatAmount(billings.totalInvoice) }}
                                </td>
                                <td class="text-xs-left subheading yellow--text" v-show="showField('invoice')">
                                    {{ formatAmount(billings.totalPaid) }}
                                </td>
                                <td class="text-xs-left subheading yellow--text" v-show="showField('invoice')">
                                    {{ formatAmount(billings.totalASR) }}
                                </td>
                                <td class="text-xs-left subheading yellow--text" v-show="showField('percent')">
                                    {{ formatPercent(billings.averagePercentLabor) }}
                                </td>
                                <td class="text-xs-left subheading yellow--text" v-show="showField('percent')">
                                    {{ formatPercent(billings.averagePercentInvoiced) }}
                                </td>
                                <td class="text-xs-left subheading yellow--text" v-show="showField('percent')">
                                    {{ formatPercent(billings.averagePercentAR) }}
                                </td>
                                <td class="text-xs-left subheading yellow--text" v-show="showField('profit')">
                                    {{ formatAmount(billings.totalProfit) }}
                                </td>
                                <td class="text-xs-left subheading yellow--text" v-show="showField('profit')">
                                   {{ formatAmount(billings.totalWipProfit) }}
                                </td>
                            </template>
                            <template v-slot:no-data>
                                No data
                            </template>
                        </v-data-table>
                        </v-card-text>
                    
                        <v-card-actions>
                           
                        </v-card-actions>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </v-layout>   
</template>

<script>
import Billings from '@/classes/billings'

import {metrics} from '@/mixins/metricsMixin'
import {map, filter, sum, pick, mean, omit, compact} from "lodash"

export default {
    middleware : ['loadBillings'],
    components:{},
    mixins : [metrics],
    layout:'default',
    data(){
        return{
             search : '',
            toggleBilling : ['id','mu','amount'],
            headers: [
                {text: 'NUMBER', align: 'left', sortable: true, value: 'number', category: 'id'},
                {text: 'NAME', align: 'left', sortable: true, value: 'name', category: 'id'},
                {text: 'MU', align: 'left', sortable: true, value: 'mu', category: 'mu'},
                {text: 'MUa', align: 'left', sortable: true, value: 'mua', category: 'mu'},
                {text: 'FEE', align: 'left', sortable: true, value: 'fee', category: 'amount'},
                {text: 'ASR', align: 'left', sortable: true, value: 'asr', category: 'amount'},
                {text: 'LABOR', align: 'left', sortable: true, value: 'labor', category: 'amount'},
                {text: 'INVOICE', align: 'left', sortable: true, value: 'invoice', category: 'invoice'},
                {text: 'PAID', align: 'left', sortable: true, value: 'paid', category: 'invoice'},
                {text: 'AR', align: 'left', sortable: true, value: 'ar', category: 'invoice'},
                {text: 'LABOR', align: 'left', sortable: true, value: 'percentlabor', category: 'percent'},
                {text: 'INVOICED', align: 'left', sortable: true, value: 'percentInvoiced', category: 'percent'},
                {text: 'AR', align: 'left', sortable: true, value: 'percentAR', category: 'percent'},
                {text: 'PROFIT', align: 'left', sortable: true, value: 'profit', category: 'profit'},
                {text: 'WIPPROFIT', align: 'left', sortable: true, value: 'wipProfit', category: 'profit'},

            ],
           
        }//RETURN
    },//DATA
    async asyncData({store}){
         console.log('ASYNCDATA - DASHBOARD')
        return {
            uid : store.getters.userID,
            userName : store.getters.userName,
            userEmail : store.getters.userEmail,
        }
    },//ASYN
    fetch(){

    },
    created(){
        
    },//CREATED
    mounted(){
        
    },//MOUNTED
    watch: {
     
    },//WATCH
    computed:{
        computedBillingHeaders(){
            return compact(map(this.headers, item => {
                if(this.toggleBilling.includes(item.category) || item.category == 'id') {
                    return omit(item, ['category'])
                }
            }))
        },

        billings(){
            let data = this.$store.getters['billings/list']
            let projects = this.$store.getters['projects/list']

            let B = new Billings({data : data, projects : projects})

            let items = this.search == '' ? B.billingSummary() : filter(B.billingSummary(),item => {
                    return item.name.indexOf(this.search) > -1 || item.number.indexOf(this.search) > -1
                })

            //TOTALS FOR FOOTER
            let averageMU = mean(map(items, item => item.MU))
            let averageMUa = mean(map(items, item => item.MUa))
            let totalFee = sum(map(items, item => item.fee))
            let totalASR = sum(map(items, item => item.asr))
            let totalLabor = sum(map(items, item => item.labor))
            let totalInvoice = sum(map(items, item => item.invoice))
            let totalPaid = sum(map(items, item => item.paid))
            let totalAR = sum(map(items, item => item.ar))
            let averagePercentLabor = mean(map(items, item => item.percentLabor))
            let averagePercentInvoiced = mean(map(items, item => item.percentInvoiced))
            let averagePercentAR = mean(map(items, item => item.percentAR))
            let totalProfit = sum(map(items, item => item.profit))
            let totalWipProfit = sum(map(items, item => item.wipProfit))

            return {
                items : items,
                averageMU : averageMU,
                averageMUa : averageMUa,
                totalFee : totalFee,
                totalASR : totalASR,
                totalLabor : totalLabor,
                totalInvoice : totalInvoice,
                totalPaid : totalPaid,
                totalAR : totalAR,
                averagePercentLabor :  averagePercentLabor,
                averagePercentInvoiced : averagePercentInvoiced,
                averagePercentAR : averagePercentAR,
                totalProfit : totalProfit,
                totalWipProfit : totalWipProfit
            }
        
        },//BILLINGS
       
    },//COMPUTED
    methods:{
         goto(number){
            this.$router.push({path: '/projects/' + number}) 
        },
        
        showField(param){
            return this.toggleBilling.includes(param) ? true : false
        }
       
       
    },//METHODS  
}
</script>

<style scoped>

</style>

