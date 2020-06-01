<template>
    <v-container fluid grid-list-md class="pa-0">
        <v-layout row wrap justify-center align-center>
            <v-flex xs12 sm10 md8>
                <v-text-field
                    v-model="newTask"
                    @keyup.enter="addItem"
                    placeholder="what needs to be done ?"
                    single-line
                    outline
                    full-width
                >
                </v-text-field>

                <v-data-table hide-headers hide-actions :items="items">
                    <template v-slot:items="props">
                        <td class="title">
                            <!-- DATA IN TABLE -->
                            <div v-show="!props.item.isEdit">
                                <v-layout row wrap justify-center align-center>
                                    <v-flex class="text-xs-left" xs1>
                                        <v-checkbox
                                            v-model="props.item.completed"
                                            primary
                                            hide-details
                                            @change.self="update(props.item)"
                                        ></v-checkbox>
                                    </v-flex>
                                    <v-flex 
                                        @dblclick="beginEdit(props.item)" 
                                        class="text-xs-left pl-2" 
                                        :class="completedText(props.item.completed)" 
                                        xs10
                                        v-touch="{
                                            left: () => beginEdit(props.item),
                                            right: () => deleteItem(props.item),
                                        }"
                                    >
                                        {{ props.item.title }}
                                    </v-flex>
                                    <v-flex xs1>
                                        <v-btn 
                                            @click="deleteItem(props.item)" 
                                            class="text-xs-center" 
                                            v-show="!props.item.isEdit"
                                            color="error" fab small dark
                                        >
                                            <v-icon >delete</v-icon>
                                        </v-btn>
                                        
                                    </v-flex>
                                </v-layout>
                            </div>
                            <!-- EDITING INLINE -->
                            <div>
                                <v-layout row wrap justify-center align-center>
                                    <v-flex xs11 :class="EditText(props.item.isEdit)">
                                        <input type="text" 
                                            v-model="props.item.date"
                                            v-show="props.item.isEdit"
                                            @blur="saveEdit(props.item)"
                                            @keyup.enter="saveEdit(props.item)"
                                            @keyup.esc="cancelEdit(props.item)"
                                        >
                                        <input type="text" 
                                            v-model="props.item.title"
                                            v-show="props.item.isEdit"
                                            @blur="saveEdit(props.item)"
                                            @keyup.enter="saveEdit(props.item)"
                                            @keyup.esc="cancelEdit(props.item)"
                                        >
                                    </v-flex>
                                    <v-flex xs1>
                                        <v-btn  
                                            @click="cancelEdit(props.item)" 
                                            class="text-xs-center" 
                                            v-show="props.item.isEdit"
                                            color="info" fab small dark
                                        >
                                            <v-icon>clear</v-icon>
                                        </v-btn>
                                    </v-flex>
                                </v-layout>
                            </div>
                        </td>
                    </template>
                </v-data-table>
            </v-flex>
        </v-layout>
    </v-container>  
</template>

<script>
import {map, findIndex, orderBy, debounce, isString} from "lodash"
import { DateTime } from "luxon"

export default {
    middleware : ['loadTasks'],
    components:{},
    layout:'default',
    data(){
        return{
            newTask : '',
            completedclass : ['completedclass','teal--text'],

            search: '',
            dialog: false,
            rowsPerPageItems: [5, 10, 15],
            pagination: {
                rowsPerPage: 10
            },
            isEditBtn : false,
            isDeleteBtn : false
        }//RETURN
    },//DATA
    async asyncData({store}){
        return{
            userID : store.getters.userID,
            userName : store.getters.userName,
            userEmail : store.getters.userEmail,
            tasks : store.state.tasks.list,
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
    //    remainingTasks(){
    //        return map(this.tasks,{completed : false})
    //    },
    //    remainingCount(){
    //        return this.$store.getters['tasks/remainingCount']
    //    },
    //    totalCount(){
    //        return this.$store.getters['tasks/totalCount']
    //    },
       items(){
           return orderBy(this.$store.getters['tasks/tasks'],['completed','priority','title'],['asc','asc','asc'])
       }//ITEMS
    },//COMPUTED
    methods:{
        update(item){
            this.$store.dispatch('tasks/update',item)
        },//UPDATE TASK
        beginEdit(item){
            this.beforeEditTitle = item.title
            item.isEdit = true
            //this.$store.dispatch('tasks/update',item)
        },//EDIT ITEM
        saveEdit(item){
            this.$store.dispatch('tasks/update',item)
            item.isEdit = false
        },//DONE EDITE
        cancelEdit(item){
            item.title = this.beforeEditTitle
            item.isEdit = false
        },//CANCEL EDIT
        deleteItem(item){
            this.$store.dispatch('tasks/delete',item)
        },//DELETE TASK
        generateID(){
            return Math.random().toString(16)
        },
        addItem(){
            let value = this.newTask && this.newTask.trim()
            // let arrText = value.split('@')
            // let titleText = arrText[0]
            if (!value) {
                return
            }
            let task = {
                id : this.generateID(),
                title: value,
                completed: false,
                isEdit : false,
                priority : false,
                uid : this.userID
            }
            
            this.$store.dispatch('tasks/add',task)
            this.newTask = ''
        },//ADD TASK
        completedText(value){
                if(value){
                    return "teal--text text--lighten-4 isCompleted"
                }
        },//COMPLETED TEXT
        EditText(value){
                if(value){
                    return "blue--text text--lighten-2"
                }
        },//COMPLETED TEXT
       
    },//METHODS 
    
}
</script>

<style scoped>
.isCompleted{
    text-decoration: line-through;
}
</style>


