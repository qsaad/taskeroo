<template>
    <v-layout column justify-center align-center class="pa-0">
        <v-flex>
            <v-text-field
                label="email"
                v-model="email"
                prepend-icon="email"
                :rules="[rules.required, rules.email]"
                clearable
                required
            >
            </v-text-field>
            <v-text-field
                label="password" 
                type="password"
                v-model="password" 
                :rules="[rules.required, rules.counter]"
                counter
                prepend-icon="vpn_key"
                clearable 
                required
            >
            </v-text-field>
            <v-btn 
                block color="blue" 
                @click.prevent="login"
                :disabled="!validation"
            >
                Login
            </v-btn>
        </v-flex>
    </v-layout>
</template>

<script>
export default {
    middleware : ['loadTasks'],
    components:{},
    layout:'default',
    data(){
        return{
            // email : 'alpeshk_98@yahoo.com',
            // password : 'alp123',
        //    email : '',
        //    password : '',
           email : 'achavda@osborn-eng.com',
           password : 'osborn786',
            rules: {
                required: value => !!value || 'Required.',
                counter: value => value.length > 6 || 'Min 6 characters',
                email: value => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return pattern.test(value) || 'Invalid e-mail.'
                }//EMAIL RULE
            },//RULES
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
       validation(){
            return (this.email == '' || this.password.length < 6) ? false : true
        },//VALIDATION
    },//COMPUTED
    methods:{
        login(){
            this.$store.dispatch('login',{email : this.email, password : this.password})
        }
    },//METHODS  
}
</script>

<style scoped>

</style>




