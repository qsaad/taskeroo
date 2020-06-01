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
    projectByNumber: (state) => (number) => {
      return state.list.filter(item => item.number === number)
    }
  }//GETTER

  export const mutations = {
    GET (state, payload) {
      let items = []
      console.log("VUEX - PROJECT GET")
      fireStore.collection("projects").get()
      .then((querySnapshot) =>{
        querySnapshot.forEach((doc) =>{
            items.push(doc.data()) 
            //console.log(doc.id, " => ", doc.data());
        });
        state.list = items
      })
      .catch((error)=> {
        console.log("Error getting documents: ", error);
      })
    },//GET
    PICK (state, payload) {
      let items = []
      console.log("VUEX - PROJECT PICK")
      fireStore.collection("projects").where("number", "==", payload.number).get()
      .then((querySnapshot) =>{
        querySnapshot.forEach((doc) =>{
            items.push(doc.data()) 
            console.log(doc.id, " => ", doc.data());
            //return doc.data()
        });

        //return items
      })
      .catch((error)=> {
        console.log("Error getting documents: ", error);
      })
      return items
    },//PICK
    ADD (state, payload){
      console.log("VUEX - PROJECT ADD")
      fireStore.collection("projects").add(payload)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id)
        state.list.push(payload)
      })
      .catch((error)=> {
          console.error("Error adding document: ", error);
      })
      
    },//ADD

    UPDATE (state, payload) {
      console.log("VUEX - PROJECT UPDATE")
      fireStore.collection("projects").where("number","==",payload.number).get()
      .then(querySnapshot => {
          querySnapshot.forEach( doc => {
            fireStore.collection("projects").doc(doc.id).update({...payload})
              .then( () => {
                const index = state.list.findIndex(item => item.number == payload.number)
                state.list[index] = {...payload}
                Swal.fire({
                  type: 'success',
                  title: 'PROJECT UPDATED SUCCESSFULLY',
                  text: payload.name + ' updated in list',
                })
              })
          })
      })
    },//UPDATE

    
    DELETE (state, payload) {
      console.log("VUEX - PROJECT DELETE")
      fireStore.collection("projects").where("number","==",payload.number).get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete()
          .then( () =>{
            console.log("Document successfully deleted!")
            state.list.splice(state.list.indexOf(payload), 1)
            Swal.fire({
              type: 'success',
              title: 'PROJECT REMOVED SUCCESSFULLY',
              text: payload.name + ' deleted from list',
            })
          })
          .catch((error)=>{
            console.error("Error removing document: ", error)
          })
          
        })//FOREACH
      })//GET

    }//DELETE
  
  }//MUTATIONS
  
  export const actions = {
    get : (context, payload) => { context.commit('GET', payload) },
    pick : (context, payload) => { context.commit('PICK', payload) },
    add : (context, payload) => { context.commit('ADD', payload) },
    update : (context, payload) => { context.commit('UPDATE', payload) },
    delete : (context, payload) => { context.commit('DELETE', payload) },
  }//ACTIONS
  