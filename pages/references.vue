<template>
    <div>
    <v-toolbar flat color="orange">
      <v-toolbar-title class="black--text headline font-weight-bold">REFERENCES</v-toolbar-title>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark class="mb-2" v-on="on">New Reference</v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field v-model="editedItem.title" label="Title"></v-text-field>
                </v-flex>
                <v-flex xs12>
                    <v-combobox v-model="editedItem.category" :items="categoryItems" label="Category"></v-combobox>
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="editedItem.description" label="Description"></v-text-field>
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
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="filteredItems"
      class="elevation-1 mt-3"
      hide-actions
    >
      <template v-slot:items="props" >
        <td class="text-xs-left yellow--text" >
            {{ props.item.category }}
        </td>
        <td class="text-xs-left">
            <v-layout column wrap justify-start align-start>
                <v-flex class="title blue--text">{{ props.item.title }}</v-flex>
                <v-flex class="subheading">{{ props.item.description }}</v-flex>
            </v-layout>
        </td>
        <td class="justify-center layout px-0">
          <v-icon color="blue" class="mr-2" @click="editItem(props.item)">edit</v-icon>
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
    <v-snackbar v-model="snackbar" :timeout="timeout" :vertical="mode === 'vertical'">
      Path Copied !
      <v-btn dark flat @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
  </div>
    
</template>

<script>
import {map, findIndex, orderBy, includes, toLower, valuesIn, pickBy, identity, debounce, isString} from "lodash"
import Swal from 'sweetalert2'
import VerEx from 'verbal-expressions'

export default {
    middleware : ['loadReferences'],
    components:{},
    layout:'default',
    data(){
        return{
            search: '',
            dialog: false,
            headers: [
                {text: 'Category', align: 'left', sortable: true, value: 'category'},
                {text: 'Title', align: 'left', sortable: true, value: 'title'},
                { text: 'Actions', align: 'center',value: 'actions', sortable: false }
            ],
            items : [],
            categoryItems :['Analysis','Concrete','Steel','Masonry','Wood','Coldform','Wind','Seismic'],
            editedIndex: -1,
            editedItem: {
                title: '',
                description: '',
                category : '',
                
            },
            defaultItem: {
                title: '',
                description: '',
                category : '',
            },
            snackbar : false,
            timeout : 3000,
            mode : ''
        }//RETURN
    },//DATA
    async asyncData({store}){
        return{
            uid : store.getters.userID,
            userName : store.getters.userName,
            userEmail : store.getters.userEmail,
            //items : store.state.references.list,
        }
    },//ASYN
    fetch(){

    },
    created(){
       
    },//CREATED
    mounted(){
        //this.items = orderBy(this.$store.getters['references/references'],['title'],['asc'])
    },//MOUNTED
    watch: {
        dialog (val) {
            val || this.close()
        }
    },//WATCH
    computed:{
        formTitle () {
            return this.editedIndex === -1 ? 'New Reference' : 'Edit Reference'
        },
        filteredItems(){
            this.items =  this.$store.getters['references/references']
            let data  = map(this.items, item =>{
              let title = toLower(item.title)
              let description = toLower(item.description)
              let searchText = toLower(this.search)
              if(title.includes(searchText) || description.includes(searchText)){
                return item
              }
            })
        
            this.items = valuesIn(pickBy(data, identity))
            return this.items
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
                title: 'Are you sure you want to delete this Reference?',
                text: item.title,
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'Cancel'
            })
            .then((result) => {
                if (result.value) {
                    this.items.splice(index, 1)
                    this.$store.dispatch('references/delete',item)
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
                this.$store.dispatch('references/update',this.editedItem)
                this.editedIndex = -1
            } 
            else {
                if(_.findIndex(this.items, ['title', this.editedItem.title]) > -1){
                    Swal.fire({
                        type: 'warning',
                        title: this.editedItem.title + ' already exists on ',
                        text: this.editedItem.description,
                    })
                }
                else{
                    this.items.push(this.editedItem)
                    let payload = {...this.editedItem, uid : this.uid, id : Math.random().toString(24)}
                    this.$store.dispatch('references/add',payload)
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