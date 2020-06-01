<template>
    <v-card height="97%" class="mr-1 my-2">
        <v-card-title class="yellow--text headline px-3 py-0">
            TEAM
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
                            <v-combobox label="Name" :items="usersList" v-model="editedItem.name"></v-combobox>
                            <v-combobox label="Role" :items="roleList" v-model="editedItem.role"></v-combobox>
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
        <v-card-text class="teal--text title pt-0">
            <v-layout row wrap>
                <v-flex xs12>
                    <v-data-table
                        :headers="headers"
                        :items="items"
                        class="mt-0"
                        hide-actions
                    >
                        <template v-slot:items="props">
                                <td class="text-xs-left subheading green--text">
                                    {{ props.item.name }}
                                </td>
                                <td class="text-xs-left subheading green--text">
                                    {{ props.item.role }}
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
            </v-layout>
        </v-card-text>
        <v-card-actions>
            <v-layout row wrap justify-between>
                             
            </v-layout>
        </v-card-actions>
    </v-card>

    
</template>

<script>
import Swal from 'sweetalert2'
import {map, findIndex, filter, forEach,toLower,toUpper} from "lodash"
import {metrics} from '@/mixins/metricsMixin'

export default {
    middleware : [],
    components:{},
    mixins : [metrics],
    props : {
        number: {type:[Number,String], default:''},
    },
    data(){
        return{
            search: '',
            dialog: false,
            headers: [
                {text: 'NAME', align: 'left', sortable: true, value: 'name'},
                {text: 'ROLE', align: 'left', sortable: true, value: 'role'},
                {text: '', align: 'center', sortable: false,value: 'actions'}
            ],
            items : [],
            editedIndex: -1,
            editedItem: {
                name: '',
                role: '',
                discipline : ''
            },
            defaultItem: {
                name: '',
                role: '',
                discipline : ''
            },
        }//RETURN
    },//DATA
    async asyncData({store, params}){
        return{
            uid : store.getters.userID,
            userName : store.getters.userName,
            userEmail : store.getters.userEmail,
        }
    },//ASYN
    async fetch ({ store, params }) {

    },
    created(){
      
    },//CREATED
    mounted(){
        this.items = this.$store.getters['teams/listByNumber'](this.number)
    },//MOUNTED
    watch: {
        dialog (val) {
            val || this.close()
        }
    },//WATCH
    computed:{
        formTitle () {
            return this.editedIndex === -1 ? 'New Member' : 'Edit Member'
        },
      
    },//COMPUTED
    methods:{
        editItem (item) {
            this.editedIndex = this.items.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },
        deleteItem (item) {
            const index = this.items.indexOf(item)
            Swal.fire({
                type: 'warning',
                title: 'Are you sure you want to delete this Member?',
                text: item.url,
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'Cancel'
            })
            .then((result) => {
                if (result.value) {
                    this.items.splice(index, 1)
                    this.$store.dispatch('teams/delete',item)
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
                console.log(this.editedItem.id)
                this.$store.dispatch('teams/update',this.editedItem)
                this.editedIndex = -1
            } 
            else {
                if(_.findIndex(this.items, ['name', this.editedItem.name]) > -1){
                    Swal.fire({
                        type: 'warning',
                        title: this.editedItem.name + ' already exists on ',
                        text: 'Please try again',
                    })
                }
                else{
                    //this.items.push(this.editedItem)
                    //let payload = {...this.editedItem, number : this.number, id : Math.random().toString(24)}
                    const payload = Object.assign(this.editedItem, {number : this.number, id : Math.random().toString(24)})
                    this.items.push(payload)
                    this.$store.dispatch('teams/add',payload)
                }
            }
            this.editedIndex = -1
            this.close()
        }, 
    },//METHODS  
}
</script>

<style scoped>

</style>




