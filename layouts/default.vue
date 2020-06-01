<template>
  <v-app dark>
    <v-navigation-drawer :mini-variant.sync="miniVariant" :clipped="clipped" v-model="drawer" fixed app >
      <v-list rounded>
        <v-list-tile router :to="item.to" :key="i" v-for="(item, i) in items"  exact>
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed app :clipped-left="clipped">
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
      </v-btn>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat :to="item.to" :key="i" v-for="(item,i) in items">
            {{ item.title }}
        </v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-btn icon @click="goto()">
          <v-icon color="blue">notifications</v-icon>
      </v-btn>
      <!-- <v-avatar color="red" size=32>
          {{ userInitials }}
      </v-avatar> -->
      <v-avatar  size=32>
          <v-img :src="avatarURL"></v-img>
      </v-avatar>
      <v-btn icon @click="signout">
          <v-icon>exit_to_app</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-content>
    
    <v-footer :fixed="fixed" app>
      <v-layout row justify-center align-center>
        <v-flex>
          <span>&copy; {{ new Date().getFullYear() }}</span>
        </v-flex>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
import {fireStore, fireAuth} from '~/plugins/firebase.js'

  export default {
    middleware : ['auth'],
    components:{},
    data () {
      return {
        clipped: true,
        drawer: true,
        fixed: false,
        items: [
          //{ icon: 'apps', title: 'Dashboard', to: '/dashboard' },
          { icon: 'alarm', title: 'Schedule', to: '/schedules' },
          { icon: 'timeline', title: 'Backlog', to: '/backlog' },
          //{ icon: 'list', title: 'Tasks', to: '/tasks' },
          //{ icon: 'list', title: 'Projects', to: '/projects' },
          //{ icon: 'links', title: 'Links', to: '/links' },
          //{ icon: 'bookmark', title: 'References', to: '/references' },
          //{ icon: 'alarm', title: 'Accounts', to: '/accounts' },
          { icon: 'settings', title: 'Settings', to: '/settings' },
        ],
        miniVariant: false,
        // right: true,
        // rightDrawer: false,
        title: 'Work Load Manager'
      }//RETURN
    },//DATA
    async asyncData({store}){
      return{
        uid : store.getters.uid,
        name : store.getters.displayName
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
      avatarURL(){
        let user = fireAuth.currentUser
          if (user) {
            return user.photoURL
          } 
          else {
            return null
          }
        //return this.$store.getters.photoURL
      },
      userInitials(){
        if(this.$store.state.user != null){
          let nameStr = this.$store.getters.displayName
          let nameArr = nameStr.split(" ")
          let fname = nameArr[0]
          let lname = nameArr[1]
          return fname.substring(0, 1) + lname.substring(0, 1)
        }
        else{
          return 'XX'
        }
      }
    },//COMPUTED
    methods:{
      signout(){
        this.$store.dispatch('signout')
      },//SIGNOUT
      goto(){
          this.$router.replace('/notifications')
      }
    }//METHODS
  }//EXPORT
</script>
