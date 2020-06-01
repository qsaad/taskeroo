<template>
<v-img src="/hologram.svg" class="bg">
  <v-layout column wrap align-center justify-center>
    <v-flex class="red--text font-weight-black pa-0 ma-0 underlineclass" :class="computedTitle">
      WORK LOAD MANAGER
    </v-flex>
    <!-- <v-flex class="teal--text subheading">
      <span class="yellow--text title">A</span><span>ccountable</span>
      <span class="yellow--text title">A</span><span>daptable</span>
      <span class="yellow--text title">A</span><span>nalytical</span>
    </v-flex> -->
    <login-component v-if="isLogin"></login-component>
    <register-component v-else></register-component>
    <v-flex class="pa-0 ma-0">
      <v-btn color="warning" @click="isLogin=!isLogin">
        <span v-show="isLogin">Show Register</span>
        <span v-show="!isLogin">Show Login</span>
      </v-btn>
    </v-flex>
  </v-layout>
  </v-img>
</template>


<script>
import LoginComponent from '@/components/LoginComponent'
import RegisterComponent from '@/components/RegisterComponent'
//import webpush from 'web-push'

const check = () => {
  if (!('serviceWorker' in navigator)) {
    throw new Error('No Service Worker support!')
  }
  if (!('PushManager' in window)) {
    throw new Error('No Push API Support!')
  }
}

const registerServiceWorker = async () => {
  const registration = await navigator.serviceWorker.register('/sw.js')
  return registration
}

const main = async () => {
  check();
  let registration = await registerServiceWorker()
}

main()

export default {
    middleware : [],
    components:{LoginComponent,RegisterComponent},
    layout:'landing',
    data(){
        return{
            isLogin : true , 
        }//RETURN
    },//DATA
    async asyncData({store}){
        return{
          
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
      computedTitle(){
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 'display-1'
          case 'sm': return 'display-1'
          case 'md': return 'display-1'
          case 'lg': return 'display-2'
          case 'xl': return 'display-2'
        }//SWITCH
      },//COMPUTED TITLE
    },//COMPUTED
    methods:{
      
     
     
    },//METHODS  
}
</script>

<style scoped>
.underlineclass{
  text-decoration: underline white;
}
.bg {
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

</style>


