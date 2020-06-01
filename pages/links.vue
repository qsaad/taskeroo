<template>
    <div>
    <v-toolbar flat color="orange">
      <v-toolbar-title class="black--text headline font-weight-bold">LINKS</v-toolbar-title>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-text-field v-model="search" append-icon="search" class="black--text" label="Search" single-line hide-details clearable></v-text-field>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark class="mb-2" v-on="on">New Link</v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field v-model="editedItem.url" label="URL"></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="editedItem.name" label="Name"></v-text-field>
                </v-flex>
                <v-flex>
                  <v-radio-group v-model="editedItem.type" :mandatory="false">
                    <v-radio label="Web Link" value="web"></v-radio>
                    <v-radio label="Local Path" value="local"></v-radio>
                  </v-radio-group>
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
      :items="items"
      :search="search"
      class="elevation-1 mt-3"
      hide-actions
    >
      <template v-slot:items="props" >
        <td class="text-xs-left" >
            <v-icon color="green" v-if="props.item.type=='web'" @click="goto(props.item.url)">open_in_new</v-icon>
            <v-icon color="yellow" v-else @click="copyPath(props.item.url)">file_copy</v-icon>
        </td>
        <td class="text-xs-left subheading">
            {{ props.item.name }}
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
import {map, findIndex, orderBy, debounce, isString} from "lodash"
import Swal from 'sweetalert2'
import VerEx from 'verbal-expressions'

export default {
    middleware : ['loadLinks'],
    components:{},
    layout:'default',
    data(){
        return{
            search: '',
            dialog: false,
            headers: [
                {text: 'URL', align: 'left', sortable: true, value: 'url'},
                {text: 'Name', align: 'left', sortable: true, value: 'name'},
                { text: 'Actions', align: 'center',value: 'actions', sortable: false }
            ],
            items : [],
            editedIndex: -1,
            editedItem: {
                url: '',
                name: '',
                type : 'web',
            },
            defaultItem: {
                url: '',
                name: '',
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
            items : store.state.links.list,
        }
    },//ASYN
    fetch(){

    },
    created(){
       
    },//CREATED
    mounted(){
        this.items = orderBy(this.$store.getters['links/links'],['name'],['asc'])
    },//MOUNTED
    watch: {
        dialog (val) {
            val || this.close()
        }
    },//WATCH
    computed:{
        formTitle () {
            return this.editedIndex === -1 ? 'New Link' : 'Edit Link'
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
                title: 'Are you sure you want to delete this link?',
                text: item.url,
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'Cancel'
            })
            .then((result) => {
                if (result.value) {
                    this.items.splice(index, 1)
                    this.$store.dispatch('links/delete',item)
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
                this.$store.dispatch('links/update',this.editedItem)
                this.editedIndex = -1
            } 
            else {
                if(_.findIndex(this.items, ['url', this.editedItem.url]) > -1){
                    Swal.fire({
                        type: 'warning',
                        title: this.editedItem.url + ' already exists on ',
                        text: 'Try another url',
                    })
                }
                else{
                    this.items.push(this.editedItem)
                    let payload = {...this.editedItem, uid : this.uid, id : Math.random().toString(24)}
                    this.$store.dispatch('links/add',payload)
                }
            }
            this.editedIndex = -1
            this.close()
        },
        copyPath(path){
          this.$copyText(path)
          .then((e) =>{
            this.snackbar = true
            console.log(path)
          }, (e) => {
            
            console.log(e)
          })
        },//COPY PATH
        goto(url){
            window.open(url)
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
</style>