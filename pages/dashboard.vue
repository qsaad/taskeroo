<template>
    <v-layout column>
       <v-container grid-list-md fluid>
           <v-layout row wrap>
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
<!-- MILESTONES -->
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
                 <v-flex xs12 sm6 md4>
                    <v-card flat tile>
                        <v-card-title :class="cardTitleClass" class="pa-0 ma-0">
                            <v-toolbar dark dense>
                                <v-toolbar-title :class="cardTitleClass" class="yellow--text">MILESTONES</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-toolbar-items class="hidden-sm-and-down">
                                    <v-avatar size="36" color="blue white--text subheading">{{milestonesPendingCount}}</v-avatar>
                                </v-toolbar-items>
                            </v-toolbar>
                        </v-card-title>
                        <v-card-text :class="cardTextClass" class="green--text text-xs-center pa-0 ma-0">
                            <v-list two-line>
                                <template v-for="(item, index) in milestones">
                                    <v-list-tile :key="item.id" avatar ripple @click="goto(item.number)">
                                        <v-list-tile-content>
                                            <v-list-tile-title class="green--text">{{ item.name }}</v-list-tile-title>
                                            <v-list-tile-sub-title class="text--primary">{{ item.issue }}</v-list-tile-sub-title>
                                        </v-list-tile-content>
                                        <v-list-tile-action>
                                            <v-list-tile-action-text class="yellow--text">{{ formatDate(item.date) }}</v-list-tile-action-text>
                                        </v-list-tile-action>
                                    </v-list-tile>
                                    <v-divider v-if="index + 1 < milestones.length" :key="index"></v-divider>
                                </template>
                            </v-list>
                        </v-card-text>
                        <v-card-actions>
                            <!-- <v-layout row wrap justify-center align-center>
                                <v-btn flat block dark class="teal--text" @click="milestoneType = 'pending'">
                                    <v-badge left color="purple">
                                        <template v-slot:badge>
                                            <span>{{ milestonesPendingCount }}</span>
                                        </template>
                                        <span>Pending</span>
                                    </v-badge>
                                </v-btn>
                                <v-btn flat block dark class="teal--text" @click="milestoneType = 'overdue'">
                                    <v-badge left color="red">
                                        <template v-slot:badge>
                                            <span>{{ milestonesOverdueCount }}</span>
                                        </template>
                                        <span>Overdue</span>
                                    </v-badge>
                                </v-btn>
                            </v-layout> -->
                        </v-card-actions>
                    </v-card>
                </v-flex>
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
<!-- SUBMITTALS -->
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
                 <v-flex xs12 sm6 md4>
                    <v-card flat tile>
                        <v-card-title :class="cardTitleClass" class="pa-0 ma-0">
                            <v-toolbar dark dense>
                                <v-toolbar-title :class="cardTitleClass" class="yellow--text">SUBMITTALS</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-toolbar-items class="hidden-sm-and-down">
                                    <v-avatar size="36" color="blue white--text subheading">{{submittalsPendingCount}}</v-avatar>
                                </v-toolbar-items>
                            </v-toolbar>
                        </v-card-title>
                        <v-card-text :class="cardTextClass" class="green--text text-xs-center pa-0 ma-0">
                            <v-list two-line>
                                <template v-for="(item, index) in submittals">
                                    <v-list-tile :key="item.id" avatar ripple @click="goto(item.number)">
                                        <v-list-tile-avatar color="teal">
                                            {{ userInitials(item.by) }}
                                        </v-list-tile-avatar>
                                        <v-list-tile-content>
                                            <v-list-tile-title class="green--text">{{ item.name }}</v-list-tile-title>
                                            <v-list-tile-sub-title class="text--primary">{{ item.title }}</v-list-tile-sub-title>
                                        </v-list-tile-content>
                                        <v-list-tile-action>
                                            <v-list-tile-action-text class="yellow--text">{{ formatDate(item.due) }}</v-list-tile-action-text>
                                        </v-list-tile-action>
                                    </v-list-tile>
                                    <v-divider v-if="index + 1 < submittals.length" :key="index"></v-divider>
                                </template>
                            </v-list>
                        </v-card-text>
                        <v-card-actions>
                            <!-- <v-layout row wrap justify-center align-center>
                                <v-btn flat block dark class="teal--text" @click="submittalType = 'pending'">
                                    <v-badge left color="purple">
                                        <template v-slot:badge>
                                            <span>{{ submittalsPendingCount }}</span>
                                        </template>
                                        <span>Pending</span>
                                    </v-badge>
                                </v-btn>
                                <v-btn flat block dark class="teal--text" @click="submittalType = 'overdue'">
                                    <v-badge left color="red">
                                        <template v-slot:badge>
                                            <span>{{ submittalsOverdueCount }}</span>
                                        </template>
                                        <span>Overdue</span>
                                    </v-badge>
                                </v-btn>
                            </v-layout> -->
                        </v-card-actions>
                    </v-card>
                </v-flex>
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
<!-- RFIS -->
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
                 <v-flex xs12 sm6 md4>
                    <v-card flat tile>
                        <v-card-title :class="cardTitleClass" class="pa-0 ma-0">
                            <v-toolbar dark dense>
                                <v-toolbar-title :class="cardTitleClass" class="yellow--text">RFIS</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-toolbar-items class="hidden-sm-and-down">
                                    <v-avatar size="36" color="blue white--text subheading">{{rfisPendingCount}}</v-avatar>
                                </v-toolbar-items>
                            </v-toolbar>
                        </v-card-title>
                        <v-card-text :class="cardTextClass" class="green--text text-xs-center pa-0 ma-0">
                            <v-list two-line>
                                <template v-for="(item, index) in rfis">
                                    <v-list-tile :key="item.id" avatar ripple @click="goto(item.number)">
                                        <v-list-tile-avatar color="teal">
                                            {{ userInitials(item.by) }}
                                        </v-list-tile-avatar>
                                        <v-list-tile-content>
                                            <v-list-tile-title class="green--text">{{ item.name }}</v-list-tile-title>
                                            <v-list-tile-sub-title class="text--primary">{{ item.title }}</v-list-tile-sub-title>
                                        </v-list-tile-content>
                                        <v-list-tile-action>
                                            <v-list-tile-action-text class="yellow--text headline"># {{ item.rfiNumber }}</v-list-tile-action-text>
                                        </v-list-tile-action>
                                    </v-list-tile>
                                    <v-divider v-if="index + 1 < rfis.length" :key="index"></v-divider>
                                </template>
                            </v-list>
                        </v-card-text>
                        <v-card-actions>
                            <!-- <v-layout>
                                <v-flex>
                                    <v-btn flat class="warning" @click="rfiType = 'pending'">Pending</v-btn>
                                </v-flex>
                            </v-layout> -->
                        </v-card-actions>
                    </v-card>
                </v-flex>

<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
<!-- BILLINGS -->
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
                 <v-flex xs12 sm6 md4>
                    <v-card flat tile class="blue-lighten--4">
                        <v-card-title :class="cardTitleClass" class="pa-0 ma-0">
                            <v-toolbar dark dense>
                                <v-toolbar-title :class="cardTitleClass" class="yellow--text">LABOR</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <!-- <v-toolbar-items class="hidden-sm-and-down">
                                    <v-avatar size="36" color="blue white--text subheading">{{submittalsPendingCount}}</v-avatar>
                                </v-toolbar-items> -->
                            </v-toolbar>
                        </v-card-title>
                       
                        <v-card-text :class="cardTextClass" class="green--text text-xs-center pa-0 ma-0">
                             <v-list two-line>
                                <template v-for="(item, index) in billings">
                                    <v-list-tile :key="item.id" avatar ripple @click="goto(item.number)">
                                        <v-list-tile-avatar color="teal">
                                            {{ formatPercent(item.percentLabor) }}
                                        </v-list-tile-avatar>
                                        <v-list-tile-content>
                                            <v-list-tile-title class="green--text">{{ item.name }}</v-list-tile-title>
                                            <v-list-tile-sub-title class="text--primary">{{ formatAmount(item.fee) }}</v-list-tile-sub-title>
                                        </v-list-tile-content>
                                        <v-list-tile-action>
                                            <v-list-tile-action-text class="yellow--text">{{ formatAmount(item.pendingLabor) }}</v-list-tile-action-text>
                                        </v-list-tile-action>
                                    </v-list-tile>
                                    <v-divider v-if="index + 1 < billings.length" :key="index"></v-divider>
                                </template>
                            </v-list>

                            
                           
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
import Milestones from '@/classes/milestones'
import Submittals from '@/classes/submittals'
import RFIS from '@/classes/rfis'
import Billings from '@/classes/billings'

import {metrics} from '@/mixins/metricsMixin'
import {map, filter, sum, pick, mean, omit, compact} from "lodash"

export default {
    middleware : [
        'loadUsers','loadData','loadProjects','loadLinks','loadReferences','loadTeams',
        'loadBillings','loadMilestones','loadSubmittals', 'loadComments','loadRFIs'
    ],
    components:{},
    mixins : [metrics],
    layout:'default',
    data(){
        return{
            discipline : 'S',
            milestoneType : 'pending',
            milestonesPendingCount : 0,
            milestonesOverdueCount : 0,
            submittalType : 'pending',
            submittalsPendingCount : 0,
            submittalsOverdueCount : 0,
            rfiType : 'pending',
            rfisPendingCount : 0,
            search : '',
            toggleBilling : ['id'],
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
    async fetch({ store, params }){
        
    },
    created(){
        
    },//CREATED
    mounted(){
        
    },//MOUNTED
    watch: {
     
    },//WATCH
    computed:{
        cardTitleClass(){
            switch (this.$vuetify.breakpoint.name) {
                case 'xl': return 'display-2'
                case 'lg': return 'display-1'
                case 'md': return 'display-1'
                case 'sm': return 'headline'
                case 'xs': return 'title'
            }//SWITCH
        },//COMPUTED TITLE
        cardTextClass(){
            switch (this.$vuetify.breakpoint.name) {
                case 'xs': return 'body-2'
                case 'sm': return 'body-2'
                case 'md': return 'body-2'
                case 'lg': return 'body-2'
                case 'xl': return 'body-2'
            }//SWITCH
        },//COMPUTED TITLE

       
        users(){
            return this.$store.getters['users']
        },

        milestones(){
            let data = this.$store.getters['milestones/list']
            let M = new Milestones(data)

            this.milestonesPendingCount = M.pendingByDisciplineCount(this.discipline)
            this.milestonesOverdueCount = M.overdueByDisciplineCount(this.discipline)

            switch (this.milestoneType) {
                case 'overdue': 
                    return M.overdueByDiscipline(this.discipline, ['number',  'name', 'date', 'issue','id'])
                    break
                case 'pending': 
                    return M.pendingByDiscipline(this.discipline, ['number', 'name',  'date', 'issue','id'])
                    break
                case 'dueIn10Ddays': 
                    return M.dueIn10DaysByDiscipline(this.discipline, ['number', 'name',  'date', 'issue','id'])
                    break
            }//SWITCH

        },//MILESTONES

        submittals(){
            let data = this.$store.getters['submittals/list']
            let S = new Submittals(data)

            // return {
            //     //OVERDUE
            //     working1 : S.overdue(['number', 'due', 'title','discipline']),
            //     test1 : S.overdueByDiscipline('S', ['number', 'due', 'title']),
            //     working3 : S.overdueByNumber('J20190446.000', ['number', 'due', 'title']),
            //     working4 : S.overdueByUser(this.userName, ['number', 'due', 'title']),
            //     //PENDING
            //     working5 : S.pending( ['number', 'due', 'title','discipline']),
            //     test : S.pendingByDiscipline('S', ['number', 'due', 'title']),
            //     working7 : S.pendingByNumber('J20190446.000',['number', 'due', 'title']),
            //     working8 : S.pendingByUser(this.userName, ['number', 'due', 'title']),
            //     //DUE
            //     working9 : S.dueIn10Days(['number', 'due', 'title']),
            //     working10 : S.dueIn10DaysByDiscipline('E', ['number', 'due', 'title']),
            //     //COUNT - TOTAL
            //     working11 : S.totalByNumber('J20190446.000'),
            //     working12 : S.totalByNumberPerDiscipline('J20190446.000', 'E'),
            //     working13 : S.totalByUser(this.userName),
            //      //COUNT - OVERDUE
            //     working14 : S.overdueByNumberCount('J20190867.000'),
            //     working15 : S.overdueByUserCount(this.userName),
            // }//RETURN

            this.submittalsPendingCount = S.pendingByDisciplineCount(this.discipline)
            this.submittalsOverdueCount = S.overdueByDisciplineCount(this.discipline)

            switch (this.submittalType) {
                case 'overdue': 
                    return S.overdueByDiscipline(this.discipline, ['number', 'name', 'due', 'title','by', 'id'])
                    break
                case 'pending': 
                    return S.pendingByDiscipline(this.discipline, ['number', 'name', 'due', 'title','by', 'id'])
                    break
                case 'dueIn10Ddays': 
                    return S.dueIn10DaysByDiscipline(this.discipline, ['number', 'name', 'due', 'title','by', 'id'])
                    break
            }//SWITCH

        },//SUBMITTALS

        rfis(){
            //return this.$store.getters['rfis/list']

            let data = this.$store.getters['rfis/list']
            let R = new RFIS(data)

            this.rfisPendingCount = R.pendingByDisciplineCount(this.discipline)

            switch (this.rfiType) {
                case 'pending': 
                    return R.pendingByDiscipline(this.discipline, ['number', 'name', 'rfiNumber','title','by', 'id'])
                    break
               
            }//SWITCH

        },//RFIs
        
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

            return B.billingSummary()

        },//BILLINGS
        
        
        comments(){
            return this.$store.getters['comments/list']

        },//COMMENTS
       
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


