<template>
    <div>
        <v-toolbar flat color="orange">
            <v-toolbar-title class="black--text headline font-weight-bold">SETTINGS</v-toolbar-title>
        </v-toolbar>
        <v-layout row wrap justify-center align-center fluid>
           

            <!-- <v-flex xs12 sm4 md6 >
                <v-card tile hover class="ma-2" height="100%">
                    <v-card-title class="title font-weight-bold blue--text pb-0 mb-0">
                        NOTIFICATION
                    </v-card-title>
                    <v-card-text class="body-2 yellow--text"  v-if="!isSubscribed">
                      To recieved automatic notification on schedule updates please subscribe by clicking button below
                    </v-card-text>
                     <v-card-text class="body-2 yellow--text" v-else>
                      You are currently subscribed to recieved automatic notification. To unsubscribed click buttom below
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" @click="subscribe()" v-if="!isSubscribed">Subscribe</v-btn>
                       <v-btn color="warning" @click="unsubscribe()" v-else>Unsubscribe</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex> -->
            <v-flex xs12 sm4 md6 >
                <profile-update-component
                    :fname = "getFname()"
                    :lname = "getLname()"
                    :uid = "uid"
                    :photoURL ="currentAvatar"
                >
                </profile-update-component>
                <!-- <v-card tile hover class="ma-2" height="100%">
                    <v-card-title class="title font-weight-bold blue--text pb-0 mb-0">
                        NOTIFICATION
                    </v-card-title>
                    <v-card-text class="body-2 yellow--text"  v-if="!isSubscribed">
                      To recieved automatic notification on schedule updates please subscribe by clicking button below
                    </v-card-text>
                     <v-card-text class="body-2 yellow--text" v-else>
                      You are currently subscribed to recieved automatic notification. To unsubscribed click buttom below
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" @click="subscribe()" v-if="!isSubscribed">Subscribe</v-btn>
                       <v-btn color="warning" @click="unsubscribe()" v-else>Unsubscribe</v-btn>
                    </v-card-actions>
                </v-card> -->
            </v-flex>

            <v-flex xs12 sm4 md6 >
            </v-flex>


           
        </v-layout>

    
    </div>
    
</template>

<script>
import ProfileUpdateComponent from '@/components/ProfileUpdateComponent.vue'
import {fireStore, fireAuth, storage} from '~/plugins/firebase.js'

export default {
    middleware : ['loadSettings'],
    components:{
        ProfileUpdateComponent
    },
    layout:'default',
    data(){
        return{
           isSubscribed : false,
        }//RETURN
    },//DATA
    async asyncData({store}){
        return{
            uid : store.getters.userID,
            userName : store.getters.userName,
            userEmail : store.getters.userEmail,
            photoURL : store.getters.photoURL,
            group : store.getters.group,
            //items : store.getters['schedules/list'],
        }
    },//ASYNC
    fetch(){

    },
    created(){
        
    },//CREATED
    mounted(){
        //this.checkSubscription()
    },//MOUNTED
    watch: {
     
    },//WATCH
    computed:{
       currentAvatar(){
           let user = fireAuth.currentUser
            if (user) {
                return user.photoURL
            } 
            else {
                return null
            }
            //return this.$store.getters.photoURL
       }
    },//COMPUTED
    methods:{
        getFname(){
            let str = this.userName
            let arr = str.split(" ");
            return arr[0]
        },
        getLname(){
            let str = this.userName
            let arr = str.split(" ");
            return arr[1]
        },
       
        // async checkSubscription(){
        //     const registration = await navigator.serviceWorker.ready
        //     const subscription = await registration.pushManager.getSubscription()
            
        //     console.log(`SETTING - checkSubscription : Registration`)
        //     console.log(registration)
        //     console.log(`SETTING - checkSubscription : Subscription`)
        //     console.log(subscription)

        //     if (subscription) {
        //         this.isSubscribed = true
        //     }
        //     else {
        //         this.isSubscribed = false
        //     }
        // },//CHECK SUBSCRIPTION
        // urlBase64ToUint8Array(base64String) {
        //     let padding = '='.repeat((4 - base64String.length % 4) % 4);
        //     let base64 = (base64String + padding)
        //         .replace(/\-/g, '+')
        //         .replace(/_/g, '/');

        //     let rawData = window.atob(base64);
        //     let outputArray = new Uint8Array(rawData.length);

        //     for (let i = 0; i < rawData.length; ++i) {
        //         outputArray[i] = rawData.charCodeAt(i);
        //     }
        //     return outputArray;
        // },
        // async subscribe(){
        //     const APP_SERVER_KEY = this.urlBase64ToUint8Array('BKnoc5M9L61MAFZCsJj2L4gxFmtvPK8MIL2EI2vnVK1Q-U0v4MuTKX5Y8B8AIZCwOSC31RurSfWXZRtg1mt9fRw')
        //     let permission = await Notification.requestPermission()
        //     let registration = await navigator.serviceWorker.ready
        //     let subscription = await registration.pushManager.subscribe({
        //                                 userVisibleOnly : true,
        //                                 applicationServerKey : APP_SERVER_KEY
        //                             })
        //     console.log(`SETTING - subscribe : Permission`)
        //     console.log(permission)
        //     console.log(`SETTING - subscribe : Resgistration`)
        //     console.log(registration)
        //     console.log(`SETTING - subscribe : Subscription`)
        //     console.log(subscription)

        //     let payload = {
        //           id : Math.random().toString(24),
        //           uid : this.uid,
        //           group : this.$store.getters.group,
        //           endpoint : subscription.endpoint,
        //           method : 'POST',
        //           headers : {
        //               'Content-Type' : 'application/json'
        //             },
        //           body : JSON.stringify(subscription)
        //     }
        //     let docRef = await this.$store.dispatch('subscriptions/add',payload)

        //     console.log(`SETTING - unsubscribe : STORE ADD`)
        //     console.log(docRef)

        //     this.isSubscribed = true
            
        // },//SUBSCRIBE
    //   async unsubscribe(){
    //     const registration = await navigator.serviceWorker.ready
    //     const subscription = await registration.pushManager.getSubscription()

    //     console.log(`SETTING - unsubscribe : Resgistration`)
    //     console.log(registration)
    //     console.log(`SETTING - unsubscribe : Subscription`)
    //     console.log(subscription)
    //     console.log(subscription.endpoint)

    //     if(subscription) {
    //         await subscription.unsubscribe()
    //     }

    //     let payload = {
    //         uid : this.uid,
    //         endpoint : subscription.endpoint
    //     }

    //     await this.$store.dispatch('subscriptions/delete',payload)

    //     console.log(`SETTING - unsubscribe : STORE DELETE`)
        
    //     this.isSubscribed = false
    //   },//UNSUBSCRIBE

    },//METHODS  
}
</script>

<style scoped>

</style>


