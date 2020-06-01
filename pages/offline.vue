<template>
  <v-layout column wrap align-center justify-center>
    <v-flex class="red--text font-weight-black pa-0 ma-0 underlineclass" :class="computedTitle">
      WORK LOAD MANAGER
    </v-flex>
    <v-flex>
      <v-btn color="primary" >
        Home
      </v-btn>
    </v-flex>
  </v-layout>
</template>


<script>


export default {
    middleware : [],
    components:{},
    layout:'landing',
    data(){
        return{
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

</style>


