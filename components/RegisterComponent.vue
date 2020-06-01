<template>
    <v-layout column justify-center align-center class="pa-0">
        <v-flex>
            <v-text-field
                label="First Name"
                v-model="fname"
                prepend-icon="person"
                :rules="[rules.required]"
                clearable
                required
            >
            </v-text-field>
            <v-text-field
                label="Last Name"
                v-model="lname"
                prepend-icon="person"
                :rules="[rules.required]"
                clearable
                required
            >
            </v-text-field>
            <v-combobox
                disabled
                label="Department"
                v-model="group"
                :items="groupList"
                prepend-icon="email"
            >
            </v-combobox>
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
                @click.prevent="register"
                :disabled="!validation"
            >
                Submit
            </v-btn>
        </v-flex>
    </v-layout>
</template>

<script>
export default {
    middleware : [],
    components:{},
    layout:'default',
    data(){
        return{
            fname : '',
            lname : '',
            email : '',
            password : '',
            group : 'OEC-S-COL',
            groupList : ['OEC-S-COL', 'OEC-S-CLE','OEC-MEP-COL','OEC-C-COL','OEC-MEP-CLE','OEC-C-CLE'],
            // department : 'Structure',
            // departmentList : ['Structure','Mechanical','Electrical','Plumbing','Civil','Technology','Fire Protection','Architect'],
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
            return (this.fname == '' || this.lname == '' || this.email == '' || this.password.length < 6) ? false : true
        },//VALIDATION
    },//COMPUTED
    methods:{
        register(){
            this.$store.dispatch('register',{
                fname : this.fname,
                lname : this.lname,
                group : this.group, 
                email : this.email,
                uid : '',
                photoURL : '',
                password : this.password
            })
        }
    },//METHODS  
}
</script>

<style scoped>

</style>




