<template>
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
                        <v-flex xs12 v-for="(item,i) in items" :key="i">
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
</template>

<script>
import {map, findIndex, filter, forEach,toLower} from "lodash"

export default {
    middleware : [],
    components:{},
    props : {
        items: {type:Array,default:''},
        editedIndex: {type:Number, default:-1},
        category: {type:String, default:''},
        number: {type:[Number,String], default:''},
    },
    data(){
        return{
            dialog : false,
        }//RETURN
    },//DATA
    async asyncData({store}){
        
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
        formTitle () {
            let title =  this.editedIndex === -1 ? 'New ' : 'Edit '
            return title + this.category
        },
        users(){
            return map(this.$store.getters['users'], item =>{
                return item.fname + ' ' + item.lname
            })
        }
    },//COMPUTED
    methods:{
        close () {
            this.dialog = false
            setTimeout(() => {
                this.items = {}
                //this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            }, 300)
        },
        
        save () {
            if (this.editedIndex > -1) {
                console.log('EDIT this data - ' + this.category)
                console.log(this.items)
                // Object.assign(this.projects[this.editedIndex], this.editedItem)
                let payload = {...this.items, number : this.number}
                let path = this.category + '/update'
                // this.$store.dispatch('projects/update',payload)
            }//EDIT ITEM
            else {
                let payload = {}
                forEach(this.items, item =>{
                    payload[toLower(item.name)] = item.value
                })
                payload['number'] = this.number
                let path = this.category + '/add'
                this.$store.dispatch(path,payload)
            }//ADD ITEM
            this.close()
        },
    },//METHODS  
}
</script>

<style scoped>

</style>




