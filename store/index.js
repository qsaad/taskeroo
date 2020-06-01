import {fireStore, fireAuth} from '~/plugins/firebase.js'
import Swal from 'sweetalert2'
import { set, find, uniq, map, values, mapValues, orderBy, filter,get} from "lodash"

export const strict = false

export const state = () => ({
  user : {},
  group : '',
  list : [],
  data : []
})//state

export const getters = {
  users : state => state.list,
  userID : state => state.user.uid,
  userEmail : state => state.user.email,
  userName : state => state.user.displayName,
  
  data : state => state.data,
  list : state => state.list,
  count : state => state.list.length,
  user : state => state.user,
  group : state => state.group,
  uid : state => state.user.uid,
  email : state => state.user.email,
  displayName : state => state.user.displayName,
  photoURL : state => state.user.photoURL,

  tasksUser : state => filter(state.list, {'assigned_to': state.userEmail,'completed':false}),

  avatarByUID: (state) => (uid) => {
    return get(find(state.list, {'uid': uid}),'photoURL')
  },
  avatarByName: (state) => (fname, lname) => {
    return get(find(state.list, {'fname': fname,'lname':lname}),'photoURL')
  },

  
  //usersNameList : state =>  values(mapValues(state.list, 'email')),
  //getGroupList : state => uniq(map(state.data,'group')),
  // getUsersByGroup : (state) => (group) => {
  //   return state.list.find(item => item.group === group)
  // },

  isAuthenticated : state => { return state.user != null ? true : false },
}//GETTER

export const mutations = {
  REGISTER (state, payload) {
    fireAuth.createUserWithEmailAndPassword(payload.email,payload.password)
      .then((authData) => {
        //SET DISPLAY NAME
        payload.uid = authData.user.uid
        authData.user.updateProfile({
          displayName: payload.fname + ' ' + payload.lname
        })

        let usersPayload = payload
        delete usersPayload.password

        fireStore.collection("users").add(usersPayload)
          .then((docRef) => {
            console.log("Document written with ID: ", docRef.id)
            state.list.push(payload)
          })
          .catch((error)=> {
              console.error("Error adding document: ", error);
          })
      
        //SEND VERIFICATION EMAIL
        authData.user.sendEmailVerification()
          .then(() =>{
              Swal.fire({
                type: 'success',
                title: 'REGISTRATION SUCCESSFULLY - CHECK VERIFICATION EMAIL',
                text: 'Please try again',
            })
          })
          .catch((error) =>{
              Swal.fire({
                  type: 'error',
                  title: 'REGISTRATION FAILED',
                  text: 'Please try again',
              })
          })
      })
  },
  LOGIN (state, payload) {
    fireAuth.signInWithEmailAndPassword(payload.email, payload.password)
        .then((authData) =>{
            if(authData.user.emailVerified){
              console.log('STEP 1 : GET USER AUTH DATA FROM FIREBASE')
              console.log(authData.user)
                state.user = authData.user
                state.group = 'OEC-S-COL'
                this.$router.replace('/schedules')
            }
            else{
                authData.user.sendEmailVerification()
                Swal.fire({
                    type: 'warning',
                    title: 'VERIFY EMAIL',
                    text: 'Check your email for verification link',
                })
                this.$router.replace('/')
            }
        })
        .catch( (error) => {
            Swal.fire({
                type: 'warning',
                title: 'LOGIN FAILED',
                text: 'login credentials not found',
            })
        })
  },//LOGIN
  SIGNOUT (state, payload) {
    state.user = null
    //state.group = null
    this.$router.replace('/')
  },//SIGNOUT

  GET (state, payload) {
    let items = []
    console.log("STEP 4A : VUEX - USER GET")
    fireStore.collection("users").where("group", "==", payload.group).get()
    .then((querySnapshot) =>{
      querySnapshot.forEach((doc) =>{
          items.push(doc.data()) 
          //console.log(doc.id, " => ", doc.data());
      });
      state.list = items
      console.log(state.list)
    })
    .catch((error)=> {
      console.log("Error getting documents: ", error);
    })
  },//GET

  LOAD_DATA (state,payload) {
    console.log('LOAD DATA')
    fireStore.collection('users').get()
      .then((querySnapshot) => {
        let items = []
        querySnapshot.forEach((doc) => {
          items.push(doc.data())
        })
        state.data = items
        console.log("VUEX - LOAD DATA")
    })
    .catch((error) =>{
        console.log("Error LOAD_DATA: ", error.message);
    });
  },//LOAD DATA

  PHOTO_UPDATE (state, payload) {
    //let items = []
    console.log("VUEX - PHOTO UPDATE")
    fireStore.collection("users").where("uid", "==", payload.uid).get()
    .then((querySnapshot) =>{
      querySnapshot.forEach((doc) =>{
        fireStore.collection("users").doc(doc.id).update({photoURL : payload.photoURL})
        .then( () => {
          set(find(state.list, { uid: payload.uid }), 'photoURL', payload.photoURL)
          let user = fireAuth.currentUser
          if (user) {
            user.updateProfile({
              photoURL: payload.photoURL
            })
          } else {
            console.log('Not Logged in')
          }
  
          // const index = state.list.findIndex(item => item.uid == payload.uid)
          // state.list[index] = {photoURL : payload.photoURL}
          Swal.fire({
            type: 'success',
            title: 'PHOTOURL UPDATED SUCCESSFULLY',
            text: payload.photoURL + ' updated in list',
          })
        })
      });
    })
    .catch((error)=> {
      console.log("Error getting documents: ", error.message);
    })
  },//PHOTO_UPDATE

  
  GROUP (state, payload) {
    let items = []
    console.log("VUEX - USER GROUP")
    fireStore.collection("users").where("id", "==", payload.uid).get()
    .then((querySnapshot) =>{
      querySnapshot.forEach((doc) =>{
          console.log(doc.id, " => ", doc.data().group);
          items.push(doc.data().group) 
          //console.log(doc.id, " => ", doc.data());
      });
      state.group = items[0]
    })
    .catch((error)=> {
      console.log("Error getting documents: ", error);
    })
  },//GET

}//MUTATIONS


export const actions = {
  register : (context, payload) => {context.commit('REGISTER', payload)},
  login : (context, payload) => {context.commit('LOGIN', payload)},
  signout : (context, payload) => {context.commit('SIGNOUT', payload)},
  get : (context, payload) => { context.commit('GET', payload) },
  load_data : (context, payload) => { context.commit('LOAD_DATA', payload) },
  photo_update : (context, payload) => { 
    context.commit('PHOTO_UPDATE', payload) 
    context.commit('GET', payload)
  },
  group : (context, payload) => { context.commit('GROUP', payload) },

  async nuxtServerInit ({ commit, dispatch }, { req }) {
    //console.log(req.session.user)
    //console.log(req)

    console.log('STEP 0 : SERVER INIT')
    await dispatch('load_data')
    //dispatch('group')
  }
}//ACTIONS
