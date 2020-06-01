<template>
    <v-container>
        <v-toolbar color="orange" class='black--text headline font-weight-bold mb-2'>
            <v-btn icon color="black" to="/projects"><v-icon>navigate_before</v-icon></v-btn> <v-spacer></v-spacer>{{ number}} - {{ name }} 
        </v-toolbar>
        <v-layout row wrap>
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++ -->
<!-- INFORMATION -->
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++ -->
            <v-flex xs12>
                <v-card height="97%" class="my-2">
                    <v-card-title class="yellow--text headline px-3 py-0">
                        INFORMATION
                        <v-spacer></v-spacer>
                        <v-dialog v-model="dialog" max-width="500px">
                            <template v-slot:activator="{ on }">
                                <v-btn color="primary" dark icon v-on="on">
                                    <v-icon >edit</v-icon>
                                </v-btn>
                            </template>
                            <v-card>
                                <v-card-title>
                                    <span class="headline">Edit Information</span>
                                </v-card-title>
                                <v-card-text>
                                    <v-form v-model="valid">
                                    <v-container grid-list-md>
                                        <v-layout wrap>
                                            <v-flex xs12>
                                                <v-text-field label="Client" v-model="editedItem.client"></v-text-field>
                                                <v-text-field label="Multiplier" v-model.number="editedItem.multiplier"></v-text-field>
                                                <v-text-field label="Address" v-model="editedItem.address"></v-text-field>
                                                <v-text-field label="City" v-model="editedItem.city"></v-text-field>
                                                <v-combobox label="State" :items="stateList" v-model="editedItem.state"></v-combobox>
                                                <v-text-field label="Budget" prefix="$" v-model.number="editedItem.budget"></v-text-field>
                                                <v-combobox label="Market" :items="marketList" v-model="editedItem.market"></v-combobox>
                                                <v-text-field label="Area" suffix="SF" v-model.number="editedItem.area"></v-text-field>
                                                <v-text-field label="Levels" v-model.number="editedItem.levels"></v-text-field>
                                                <v-text-field label="URL" v-model.number="editedItem.url"></v-text-field>
                                                <v-menu
                                                    v-model="menuStart"
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
                                                            v-model="editedItem.start"
                                                            label="Start"
                                                            prepend-icon="event"
                                                            readonly
                                                            v-on="on"
                                                        ></v-text-field>
                                                    </template>
                                                    <v-date-picker v-model="editedItem.start" @input="menuStart = false" color="green lighten-1"></v-date-picker>
                                                </v-menu>
                                                <v-menu
                                                    v-model="menuComplete"
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
                                                            v-model="editedItem.complete"
                                                            label="Complete"
                                                            prepend-icon="event"
                                                            readonly
                                                            v-on="on"
                                                        ></v-text-field>
                                                    </template>
                                                    <v-date-picker v-model="editedItem.complete" @input="menuComplete = false" color="green lighten-1"></v-date-picker>
                                                </v-menu>
                                                <v-textarea label="Scope" v-model="editedItem.scope" box auto-grow></v-textarea>
                                            </v-flex>
                                        </v-layout>
                                    </v-container>
                                    </v-form>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
                                    <v-btn color="blue darken-1" flat @click="update">Update</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>     
                        
                    </v-card-title>
                    <v-card-text class="teal--text title pt-0">
                        <v-layout row wrap>
                            <v-flex xs12 md4 class="mb-2">
                                <v-layout column align-start>
                                    <v-flex xs12 class="caption">Client</v-flex>
                                    <v-flex xs12 class="title green--text">{{ editedItem.client }}</v-flex>
                                </v-layout>
                            </v-flex>
                            <v-flex xs12 md4 class="mb-2">
                                <v-layout column align-start>
                                    <v-flex xs12 class="caption">Multiplier</v-flex>
                                    <v-flex xs12 class="title green--text">{{ editedItem.multiplier }}</v-flex>
                                </v-layout>
                            </v-flex>
                            <v-flex xs12 md4 class="mb-2">
                                <v-layout column align-start>
                                    <v-flex xs12 class="caption">Market</v-flex>
                                    <v-flex xs12 class="title green--text">{{ editedItem.market }}</v-flex>
                                </v-layout>
                            </v-flex>

                            <v-flex xs12 md4 class="mb-2">
                                <v-layout column align-start>
                                    <v-flex xs12 class="caption">Address</v-flex>
                                    <v-flex xs12 class="title green--text">{{ editedItem.address }}</v-flex>
                                </v-layout>
                            </v-flex>
                             <v-flex xs12 md4 class="mb-2">
                                <v-layout column align-start>
                                    <v-flex xs12 class="caption">City</v-flex>
                                    <v-flex xs12 class="title green--text">{{ editedItem.city }}</v-flex>
                                </v-layout>
                            </v-flex>
                             <v-flex xs12 md4 class="mb-2">
                                <v-layout column align-start>
                                    <v-flex xs12 class="caption">State</v-flex>
                                    <v-flex xs12 class="title green--text">{{ editedItem.state }}</v-flex>
                                </v-layout>
                            </v-flex>

                            <v-flex xs12 md4 class="mb-2">
                                <v-layout column align-start>
                                    <v-flex xs12 class="caption">Budget</v-flex>
                                    <v-flex xs12 class="title green--text">{{ formatAmount(editedItem.budget) }}</v-flex>
                                </v-layout>
                            </v-flex>
                            <v-flex xs12 md4 class="mb-2">
                                <v-layout column align-start>
                                    <v-flex xs12 class="caption">Area</v-flex>
                                    <v-flex xs12 class="title green--text">{{ editedItem.area }}</v-flex>
                                </v-layout>
                            </v-flex>
                            <v-flex xs12 md4 class="mb-2">
                                <v-layout column align-start>
                                    <v-flex xs12 class="caption">Levels</v-flex>
                                    <v-flex xs12 class="title green--text">{{ editedItem.levels }}</v-flex>
                                </v-layout>
                            </v-flex>

                            <v-flex xs12 md4 class="mb-2">
                                <v-layout column align-start>
                                    <v-flex xs12 class="caption">Start</v-flex>
                                    <v-flex xs12 class="title green--text">{{ editedItem.start }}</v-flex>
                                </v-layout>
                            </v-flex>
                            <v-flex xs12 md4 class="mb-2">
                                <v-layout column align-start>
                                    <v-flex xs12 class="caption">Complete</v-flex>
                                    <v-flex xs12 class="title green--text">{{ editedItem.complete }}</v-flex>
                                </v-layout>
                            </v-flex>
                            <v-flex xs12 md4 class="mb-2">
                               
                            </v-flex>


                            <v-flex xs12 md12>
                                <v-layout column align-start>
                                    <v-flex xs12 class="caption">Scope</v-flex>
                                    <v-flex xs12 class="title green--text">{{ editedItem.scope }}</v-flex>
                                </v-layout>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                   
                </v-card>
            </v-flex>
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++ -->
<!-- TEAMS -->
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++ -->
            <v-flex xs12 md6>
                <teams-component
                    :number = "number"
                ></teams-component>
            </v-flex>
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++ -->
<!-- MILESTONES -->
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++ -->
           <v-flex xs12 md6>
                <milestones-component
                    :number = "number"
                    :name = "name"
                ></milestones-component>
            </v-flex>
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++ -->
<!-- BILLINGS -->
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++ -->
            <v-flex xs12>
                <billings-component
                    :number = "number"
                    :name = "name"
                    :multiplier = "editedItem.multiplier"
                ></billings-component>
            </v-flex>
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++ -->
<!-- SUBMITTALS -->
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++ -->
            <v-flex xs12>
                <submittals-component
                    :number = "number"
                    :name = "name"
                ></submittals-component>
            </v-flex>
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++ -->
<!-- RFIS -->
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++ -->
            <v-flex xs12>
                <rfis-component
                    :number = "number"
                    :name = "name"
                ></rfis-component>
            </v-flex>
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++ -->
<!-- COMMENTS -->
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++ -->
            <v-flex xs12>
                <comments-component
                    :number = "number"
                    :name = "name"
                ></comments-component>
            </v-flex>

        </v-layout>
    </v-container>
</template>

<script>
import {map, findIndex, orderBy, debounce, isString} from "lodash"
import Swal from 'sweetalert2'
// import DialogComponent from '@/components/DialogComponent.vue'
// import MetricsComponent from '@/components/MetricsComponent.vue'

import BillingsComponent from '@/components/BillingsComponent.vue'
import MilestonesComponent from '@/components/MilestonesComponent.vue'
import CommentsComponent from '@/components/CommentsComponent.vue'
import SubmittalsComponent from '@/components/SubmittalsComponent.vue'
import RfisComponent from '@/components/RfisComponent.vue'
import TeamsComponent from '@/components/TeamsComponent.vue'

import {metrics} from '@/mixins/metricsMixin'

export default {
    middleware : [],
    components:{
        //DialogComponent, MetricsComponent, 
        BillingsComponent, MilestonesComponent, CommentsComponent, SubmittalsComponent, RfisComponent, TeamsComponent
    },
    mixins : [metrics],
    layout:'default',
    data(){
        return{
            valid : false,
            dialog: false,
            menuStart : false,
            menuComplete : false,
            project : {},
            name : '',
            number : '',
            editedItem: {
                client: '',
                multiplier : '',
                address: '',
                city: '',
                state: '',
                budget : '',
                market : '',
                area : '',
                levels : '',
                state : '',
                complete : '',
                scope : '',
                url : ''
            },
            defaultItem: {
                client: '',
                multiplier : '',
                address: '',
                city: '',
                state: '',
                budget : '',
                market : '',
                area : '',
                levels : '',
                state : '',
                complete : '',
                scope : '',
                url : ''
            },
           
        }//RETURN
    },//DATA
    async asyncData({params,store}){
        return{
            params : params,
            uid : store.getters.userID,
            userName : store.getters.userName,
            userEmail : store.getters.userEmail,
            number : params.number
            //item : store.dispatch('projects/pick',{uid: store.getters.userID, number : params.number})
        }
    },//ASYN
    fetch(){

    },
    created(){
       
    },//CREATED
    mounted(){
        let data  = this.$store.getters['projects/projectByNumber'](this.params.number)
        this.name = data[0].name
        this.editedItem = data[0]

    },//MOUNTED
    watch: {
        dialog (val) {
            val || this.close()
        }
    },//WATCH
    computed:{
        // items(){
        //     let data = this.$store.getters['projects/projectByNumber'](this.params.number)
        //     return data[0]
        // },
    },//COMPUTED
    methods:{
        editItem(){
            this.editedItem = Object.assign({}, this.items)
            this.dialog = true
        },
        close() {
            this.dialog = false
            // setTimeout(() => {
            //     this.editedItem = Object.assign({}, this.defaultItem)
            // }, 300)
        },
        update() {
            this.$store.dispatch('projects/update',this.editedItem)
            this.close()
        }, 
    },//METHODS

    
}
</script>

<style scoped>

</style>