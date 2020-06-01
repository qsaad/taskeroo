import {fireStore, fireAuth} from '~/plugins/firebase.js'
import Swal from 'sweetalert2'
import {map, findIndex, filter} from "lodash"

export const strict = false 

export const state = () => ({
    list : [],
  })
  //STATE
  export const getters = {
    list : state => state.list,
    totalCount : state => (state.list).length,
    listByNumber: (state) => (number) => {
      return state.list.filter((item) => item.number === number)
    }
  }//GETTER

  export const mutations = {
    GET (state, payload) {
      let items = []
      console.log("VUEX - SUBMITTALS GET")
      fireStore.collection('submittals').get()
      .then((querySnapshot) =>{
        querySnapshot.forEach((doc) =>{
            items.push(doc.data()) 
            console.log(doc.id, " => ", doc.data());
        });
        state.list = items
      })
      .catch((error)=> {
        console.log("Error getting documents: ", error);
      })
    },//GET
    ADD (state, payload){
      console.log("VUEX - SUBMITTALS ADD")
      fireStore.collection('submittals').add(payload)
      .then((docRef) => {
          console.log("Document written with ID: ", docRef.id)
          state.list.push(payload)
          Swal.fire({
            type: 'success',
            title: 'SUBMITTAL ADDED SUCCESSFULLY',
            text: 'added to list',
          })
      })
      .catch((error)=> {
          console.error("Error adding document: ", error);
      })
      
    },//ADD

    UPDATE (state, payload) {
      console.log("VUEX - SUBMITTALS UPDATE")
      fireStore.collection('submittals').where("number","==",payload.number).where("id","==",payload.id).get()
      .then(querySnapshot => {
          querySnapshot.forEach( doc => {
            fireStore.collection("submittals").doc(doc.id).update({...payload})
              .then( () => {
                const index = state.list.findIndex(item => item.id == payload.id)
                state.list[index] = {...payload}
                Swal.fire({
                  type: 'success',
                  title: 'SUBMITTAL UPDATED SUCCESSFULLY',
                  text: ' updated in list ',
                })
              })
          })
      })
    },//UPDATE

    
    DELETE (state, payload) {
      console.log("VUEX - SUBMITTALS DELETE")
      fireStore.collection('submittals').where('number','==',payload.number).where('id','==',payload.id).get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete()
          .then( () =>{
            console.log("Document successfully deleted!")
            state.list.splice(state.list.indexOf(payload), 1)
            Swal.fire({
              type: 'success',
              title: 'SUBMITTAL REMOVED SUCCESSFULLY',
              text:  'deleted from list',
            })
          })
          .catch((error)=>{
            console.error("Error removing document: ", error)
          })
          
        })//FOREACH
      })//GET

    },//DELETE

  }//MUTATIONS
  
  export const actions = {
    get : (context, payload) => { context.commit('GET', payload) },
    add : (context, payload) => { context.commit('ADD', payload) },
    update : (context, payload) => { context.commit('UPDATE', payload) },
    delete : (context, payload) => { context.commit('DELETE', payload) },
  }//ACTIONS
  