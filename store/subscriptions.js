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
  }//GETTER

  export const mutations = {
    GET (state, payload) {
      let items = []
      console.log("VUEX - SUBSCRIPTION GET")
      fireStore.collection("subscriptions").where("group","==",payload.group).get()
      .then((querySnapshot) =>{
        querySnapshot.forEach((doc) =>{
            items.push(doc.data()) 
        });
        state.list = items
      })
      .catch((error)=> {
        console.log("Error getting documents: ", error);
      })
    },//GET
    ADD (state, payload){
      console.log("VUEX - SUBSCRIPTION ADD")
      let docExist = false
      fireStore.collection("subscriptions").where("uid","==",payload.uid).where("endpoint","==",payload.endpoint).get()
          .then(querySnapshot => {
            querySnapshot.forEach( doc => {
                if (doc.exists) {
                    docExist = true
                    Swal.fire({
                        type: 'warning',
                        title: doc.data().endpoint + ' already exists',
                        text: 'Try another data device',
                    })
                } 
            })
        if(docExist == false){
          fireStore.collection("subscriptions").add(payload)
          .then((docRef) => {
            console.log("Document written with ID: ", docRef.id)
            state.list.push(payload)
            Swal.fire({
              type: 'success',
              title: 'SUBSCRIPTION ADDED SUCCESSFULLY',
              text: payload.endpoint + ' added to list',
            })
            return docRef.id
          })
          .catch((error)=> {
              console.error("Error adding document: ", error);
          })
        }//IF DOC DOES DOES NOT EXIST
      })
      
    },//ADD

    UPDATE (state, payload) {
      console.log("VUEX - SUBSCRIPTION UPDATE")
      fireStore.collection("subscriptions").where("id","==",payload.id).where("uid","==",payload.uid).get()
      .then(querySnapshot => {
          querySnapshot.forEach( doc => {
            fireStore.collection("subscriptions").doc(doc.id).update({...payload})
              .then( () => {
                const index = state.list.findIndex(item => item.id == payload.id)
                state.list[index] = {...payload}
                Swal.fire({
                  type: 'success',
                  title: 'SUBSCRIPTION UPDATED SUCCESSFULLY',
                  text: payload.endpoint + ' updated in list ',
                })
              })
          })
      })
    },//UPDATE

    
    DELETE (state, payload) {
      console.log("VUEX - SUBSCRIPTION DELETE")
      fireStore.collection("subscriptions").where("uid","==",payload.uid).where("endpoint","==",payload.endpoint).get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete()
          .then( () =>{
            console.log("Subscription successfully deleted!")
            state.list.splice(state.list.indexOf(payload), 1)
            Swal.fire({
              type: 'success',
              title: 'SUBSCRIPTION REMOVED SUCCESSFULLY',
              text: payload.endpoint + ' deleted from list',
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
    //addField : (context, payload) => { context.commit('ADDFIELD', payload) },
  }//ACTIONS
  