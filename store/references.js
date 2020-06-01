import {fireStore, fireAuth} from '~/plugins/firebase.js'
import Swal from 'sweetalert2'
import {map, findIndex, filter} from "lodash"

export const strict = false 

export const state = () => ({
    list : [],
  })
  //STATE
  export const getters = {
    references : state => state.list,
    totalCount : state => (state.list).length,
  }//GETTER

  export const mutations = {
    GET (state, payload) {
      let items = []
      console.log("VUEX - REFERENCE GET")
      fireStore.collection("references").where("uid", "==", payload.uid).get()
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
    ADD (state, payload){
      console.log("VUEX - REFERENCE ADD")
      let docExist = false
      fireStore.collection("references").where("uid","==",payload.uid).where("id","==",payload.id).get()
          .then(querySnapshot => {
            querySnapshot.forEach( doc => {
                if (doc.exists) {
                    docExist = true
                    Swal.fire({
                        type: 'warning',
                        title: doc.data().title + ' already exists on ',
                        text: doc.data().description,
                    })
                } 
            })
        if(docExist == false){
          fireStore.collection("references").add(payload)
          .then((docRef) => {
            console.log("Document written with ID: ", docRef.id)
            state.list.push(payload)
            Swal.fire({
              type: 'success',
              title: 'REFERENCE ADDED SUCCESSFULLY',
              text: payload.title + ' added to list',
            })
          })
          .catch((error)=> {
              console.error("Error adding document: ", error);
          })
        }//IF DOC DOES DOES NOT EXIST
      })
      
    },//ADD

    UPDATE (state, payload) {
      console.log("VUEX - REFERENCE UPDATE")
      fireStore.collection("references").where("uid","==",payload.uid).where("id","==",payload.id).get()
      .then(querySnapshot => {
          querySnapshot.forEach( doc => {
            fireStore.collection("references").doc(doc.id).update({...payload})
              .then( () => {
                const index = state.list.findIndex(item => item.id == payload.id)
                state.list[index] = {...payload}
                Swal.fire({
                  type: 'success',
                  title: 'REFERENCE UPDATED SUCCESSFULLY',
                  text: payload.title + ' updated in list ',
                })
              })
          })
      })
    },//UPDATE
    DELETE (state, payload) {
      console.log("VUEX - REFERENCE DELETE")
      fireStore.collection("references").where('uid','==',payload.uid).where("id","==",payload.id).get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete()
          .then( () =>{
            console.log("Document successfully deleted!")
            state.list.splice(state.list.indexOf(payload), 1)
            Swal.fire({
              type: 'success',
              title: 'REFERENCE REMOVED SUCCESSFULLY',
              text: payload.title + ' deleted from list',
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
    add : (context, payload) => { context.commit('ADD', payload) },
    update : (context, payload) => { context.commit('UPDATE', payload) },
    delete : (context, payload) => { context.commit('DELETE', payload) },
  }//ACTIONS
  