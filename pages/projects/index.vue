<template>
    <div>
    <v-toolbar flat color="orange">
      <v-toolbar-title class="black--text headline font-weight-bold">PROJECTS</v-toolbar-title>
      <v-divider
        class="mx-2"
        inset
        vertical
      ></v-divider>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark class="mb-2" v-on="on">New Project</v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-form v-model="valid">
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field 
                    v-model="editedItem.number" 
                    label="Number"
                    :rules="numberRules"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field 
                    v-model="editedItem.name" 
                    label="Name"
                    :rules="[() => !!editedItem.name || 'This field is required']"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
            <v-btn color="blue darken-1" flat v-if="valid" @click="save">Save</v-btn>
            <v-btn color="blue darken-1" flat v-else  disabled @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="projects"
      :search="search"
      class="elevation-1 mt-3"
      hide-actions
    >
      <template v-slot:items="props" >
        <td class="text-xs-left" >
            <v-icon color="yellow"  @click="copyPath(props.item.url)">file_copy</v-icon>
        </td>
        <td class="text-xs-left subheading yellow--text" >
          <v-btn @click="goto(props.item.number)" color="teal">{{ props.item.number }}</v-btn>
        </td>
        <td class="text-xs-left subheading">{{ props.item.name }}</td>
        <td class="text-xs-left subheading">{{ formatNumber(props.item.multiplier,2) }}</td>
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
import {metrics} from '@/mixins/metricsMixin'
import Swal from 'sweetalert2'
import {map, findIndex, orderBy, debounce, isString} from "lodash"

export default {
    middleware : [],
    components:{},
    mixins : [metrics],
    layout:'default',
    data(){
        return{
            snackbar : false,
            timeout : 3000,
            mode : '',
            search: '',
            dialog: false,
            valid : false,
            headers: [
                {text: 'URL', align: 'left', sortable: false, value: 'url'},
                {text: 'Number', align: 'left', sortable: true, value: 'number'},
                {text: 'Name', align: 'left', sortable: true, value: 'name'},
                {text: 'MU', align: 'left', sortable: true, value: 'mu'},
                {text: 'Actions', align: 'center',value: 'actions', sortable: false }
            ],
            projects : [],
            numberRules: [
              v => !!v || 'Number is required',
              v => /^J\d{8}\.\d{3}$/.test(v) || 'Number must be valid'
            ],
            editedIndex: -1,
            editedItem: {
                number: '',
                name: '',
                client : '',
                MU : '',
                address : '',
                city : '',
                state : '',
                budget : '',
                market : '',
                area : '',
                levels : '',
                start : '',
                complete : '',
                scope : ''
            },
            defaultItem: {
                number: '',
                name: '',
                client : '',
                MU : '',
                address : '',
                city : '',
                state : '',
                budget : '',
                market : '',
                area : '',
                levels : '',
                start : '',
                complete : '',
                scope : ''
            }
        }//RETURN
    },//DATA
    async asyncData({store}){
        return{
            uid : store.getters.userID,
            userName : store.getters.userName,
            userEmail : store.getters.userEmail,
            projects : store.state.projects.list,
        }
    },//ASYN
    fetch(){

    },
    created(){
       
    },//CREATED
    mounted(){
        this.projects = orderBy(this.$store.getters['projects/list'],['number'],['asc'])
    },//MOUNTED
    watch: {
        dialog (val) {
            val || this.close()
        }
    },//WATCH
    computed:{
        formTitle () {
            return this.editedIndex === -1 ? 'New Project' : 'Edit Project'
        },
        
    },//COMPUTED
    methods:{
        editItem (item) {
            this.editedIndex = this.projects.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },
        deleteItem (item) {
            const index = this.projects.indexOf(item)
            Swal.fire({
                type: 'warning',
                title: 'Are you sure you want to delete this Project?',
                text: item.url,
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'Cancel'
            })
            .then((result) => {
                if (result.value) {
                    this.projects.splice(index, 1)
                     this.$store.dispatch('projects/delete',item)
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
                Object.assign(this.projects[this.editedIndex], this.editedItem)
                let payload = {...this.editedItem, uid : this.uid}
                this.$store.dispatch('projects/update',payload)
            } //UPDATE
            else {
              if(_.findIndex(this.projects, ['number', this.editedItem.number]) > -1){
                    Swal.fire({
                        type: 'warning',
                        title: `This project ${this.editedItem.number} already exists`,
                        text: 'Please try again',
                    })
                }//ALREADY EXISTS
                else{
                    this.projects.push(this.editedItem)
                    let payload = {...this.editedItem, number : this.editedItem.number, id : Math.random().toString(24)}
                    this.$store.dispatch('projects/add',payload)
                }//ADD
                
            }//ADD
            this.close()
        },//SAVE
        goto(number){
            this.$router.push({path: '/projects/' + number}) 
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
        
    },//METHODS

    
}
</script>

<style scoped>

</style>