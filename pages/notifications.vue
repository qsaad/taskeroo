<template>
    <div>
        <v-toolbar flat color="orange">
            <v-toolbar-title class="black--text headline font-weight-bold">NOTIFICATIONS</v-toolbar-title>
        </v-toolbar>
        <v-layout row wrap justify-center align-center>
            <v-flex xs12 sm4 md6>
                <v-card tile hover class="ma-2">
                    <v-card-title class="title font-weight-bold blue--text pb-0 mb-0">
                        title
                    </v-card-title>
                    <v-card-text class="body-2 teal--text">
                        <!-- <p v-for="item in items" :key="item.id">
                            {{item.name}}
                        </p> -->
                    </v-card-text>
                    <v-card-actions>
                      
                    </v-card-actions>
                </v-card>
            </v-flex>

           
        </v-layout>

    
    </div>
    
</template>

<script>
export default {
    middleware : ['loadNotifications'],
    components:{},
    layout:'default',
    data(){
        return{
          
        }//RETURN
    },//DATA
    async asyncData({store}){
        let uid = store.getters.userID
        let userName = store.getters.userName
        let userEmail = store.getters.userEmail
        //let  items = await store.getters['notifications/list']
       
        return {uid, userName, userEmail}
    },//ASYNC
    fetch({store}){

    },
    created(){
        
    },//CREATED
    mounted(){
        
    },//MOUNTED
    watch: {
     
    },//WATCH
    computed:{
       
    },//COMPUTED
    methods:{
       

    },//METHODS  
}
</script>

<style scoped>

</style>


