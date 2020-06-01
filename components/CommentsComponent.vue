<template>
    <v-card height="97%" class="my-2">
        <v-card-title class="yellow--text headline px-3 py-0">
            COMMENTS
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
                            <v-text-field label="Comment" v-model="editedItem.comment"></v-text-field>
                            <v-combobox label="By" :items="usersList" v-model="editedItem.by"></v-combobox>
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
                                    {{ formatDate(props.item.date) }}
                                </td>
                                <td class="text-xs-left subheading green--text">
                                    {{ props.item.comment }}
                                </td>
                                <td class="text-xs-left subheading green--text">
                                    {{ userInitials(props.item.by) }}
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
        name: {type:String, default:''},
    },
    data(){
        return{
            search: '',
            dialog: false,
            menu  :false,
            headers: [
                {text: 'DATE', align: 'left', sortable: true, value: 'date'},
                {text: 'COMMENT', align: 'left', sortable: true, value: 'comment'},
                {text: 'BY', align: 'left', sortable: true, value: 'by'},
                {text: 'DISCIPLINE', align: 'left', sortable: true, value: 'discipline'},
                { text: '', align: 'center',value: 'actions', sortable: false }
            ],
            items : [],
            editedIndex: -1,
            editedItem: {
                date: '',
                comment: '',
                by: '',
                discipline : []
            },
            defaultItem: {
                date: '',
                comment: '',
                by: '',
                discipline : []
            },
            
        }//RETURN
    },//DATA
    async asyncData({store}){
       return{
            uid : store.getters.userID,
            userName : store.getters.userName,
            userEmail : store.getters.userEmail,
            items : store.state.comments.list,
        }
    },//ASYN
    async fetch ({ store, params }) {

    },
    created(){
      
    },//CREATED
    mounted(){
        this.items = this.$store.getters['comments/listByNumber'](this.number)
    },//MOUNTED
    watch: {
        dialog (val) {
            val || this.close()
        }
    },//WATCH
    computed:{
        formTitle () {
            return this.editedIndex === -1 ? 'New Comment' : 'Edit Comment'
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
                title: 'Are you sure you want to delete this Comment?',
                text: item.url,
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'Cancel'
            })
            .then((result) => {
                if (result.value) {
                    this.items.splice(index, 1)
                    this.$store.dispatch('comments/delete',item)
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
                this.$store.dispatch('comments/update',this.editedItem)
                this.editedIndex = -1
            } 
            else {
                // this.items.push(this.editedItem)
                // let payload = {...this.editedItem, number : this.number, id : Math.random().toString(24)}
                const payload = Object.assign(this.editedItem, {number : this.number, name : this.name, id : Math.random().toString(24)})
                this.items.push(payload)
                this.$store.dispatch('comments/add',payload)
            }
            this.editedIndex = -1
            this.close()
        }, 
    },//METHODS  
}
</script>

<style scoped>

</style>




