<template>
    <v-card height="97%" class="ml-2 my-2">
        <v-card-title class="yellow--text headline px-3 py-0">
            {{computedTitle}}
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
                        <v-flex xs12 v-for="(item,i) in editedItems" :key="i">
                            <v-text-field v-if="item.type == 'string'" :label="item.name" v-model="item.value"></v-text-field>
                            <v-text-field v-if="item.type == 'number'" :label="item.name" v-model.number="item.value"></v-text-field>
                            <p v-if="item.type == 'date'">{{ item.name }}</p>
                            <v-date-picker v-if="item.type == 'date'" v-model="item.value" color="green lighten-1" header-color="primary"></v-date-picker>
                            <v-combobox v-if="item.type == 'list'" :label="item.name" :items="item.list" v-model="item.value"></v-combobox>
                            <v-combobox v-if="item.type == 'user'" :label="item.name" :items="users" v-model="item.value"></v-combobox>
                            <v-textarea v-if="item.type == 'paragraph'" :label="item.name" v-model="item.value" box auto-grow></v-textarea>
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
                        :headers="computedHeaders"
                        :items="items"
                        class="mt-0"
                        hide-actions
                    >
                        <template v-slot:items="props">
                                <td class="text-xs-left subheading green--text" v-for="(metric,j) in computedMetrics" :key="j">
                                    {{ props.item[metric] }}
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

export default {
    middleware : [],
    components:{},
    props : {
        title: {type:String, default:''},
        editedItems: {type:Array,default:''},
        category: {type:String, default:''},
        number: {type:[Number,String], default:''},
    },
    data(){
        return{
            dialog : false,
            editedIndex : -1,
            items :[]
        }//RETURN
    },//DATA
    async asyncData({store}){
        
    },//ASYN
    async fetch ({ store, params }) {
        // let payload = {metric : 'milestones', number: this.number}
        // await store.dispatch('metrics/get',payload)

    },
    created(){
        console.log('METRIC CREATED : ' + this.title)
        let payload = {metric : this.title, number: this.number}
        this.$store.dispatch('metrics/get',payload)

        this.items = this.$store.getters['metrics/list']
        console.log('METRIC CREATED items : ' + this.$store.getters['metrics/list'])
    },//CREATED
    mounted(){
        
    },//MOUNTED
    watch: {
     
    },//WATCH
    computed:{
        computedTitle(){
            return toUpper(this.title)
        },
        computedHeaders(){
            let headers = []
            forEach(this.editedItems, item => {
                headers.push({
                    text : toUpper(item.name),
                    align : 'left',
                    sortable : true,
                    value : item.name
                })
            })
            
            headers.push({text: '', align: 'left', sortable: false, value: 'actions'})

            return headers
        },
        computedMetrics(){
            return map(this.editedItems,item => item.name)
        },
        formTitle () {
            let title =  this.editedIndex === -1 ? 'New ' : 'Edit '
            return title + this.category
        },
        users(){
            return map(this.$store.getters['users'], item =>{
                return item.fname + ' ' + item.lname
            })
        },
        computedItems(){
            return this.$store.getters['metrics/listByNumber'](this.number)
        }
    },//COMPUTED
    methods:{
        editItem (item) {
            //let data = this.$store.getters['metrics/list']
            //this.editedIndex = data.indexOf(item)
            this.editedIndex = 1
            // this.editedItems = Object.assign({}, item)
            // delete item['number']
            // delete item['id']

            // for (let k of Object.keys(this.editedItems)) {
            //     console.log(`Hey ${ this.editedItems[k] }!`);
            // }
            // forEach(item , data =>{
            //     console.log(data.key)
            //     //this.editedItems[data.key] = data.value
            // })

            //console.log(this.editedItems)
            this.dialog = true
        },
        deleteItem (item) {
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.value) {
                    item['metric'] = this.title
                    item['number'] = this.number
                    this.$store.dispatch('metrics/delete',item)
                    Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                    )
                }
            })
            
        },
        close () {
            this.dialog = false
            setTimeout(() => {
                this.items = {}
                //this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            }, 300)
        },
        uuidv4() {
            return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
                (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
            )
        },
        save () {
            if (this.editedIndex > -1) {
                // let payload = {}
                // forEach(this.editedItems, item =>{
                //     payload[toLower(item.name)] = item.value
                // })
                // payload['number'] = this.number
                // payload['metric'] = this.title
               
                //this.$store.dispatch('metrics/update',payload)
            }//EDIT ITEM
            else {
                let payload = {}
                forEach(this.editedItems, item =>{
                    payload[toLower(item.name)] = item.value
                })
                payload['number'] = this.number
                payload['metric'] = this.title
                payload['id'] = this.uuidv4()
                this.$store.dispatch('metrics/add',payload)
            }//ADD ITEM
            this.close()
        },
    },//METHODS  
}
</script>

<style scoped>

</style>




