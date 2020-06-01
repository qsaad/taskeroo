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
    GET(state, payload) {
        // console.log("VUEX - NOTIFICATION GET")
        // fireStore.collection("notifications").where("group", "==", payload.group)
        //   .onSnapshot(snapshot =>{
        //     let items = [];
        //     snapshot.docChanges().forEach(change => {    
        //         if(change.type == 'added'){
        //           fireStore.collection("notifications").add(payload)
        //           .then((docRef) => {
        //             console.log("Document written with ID: ", docRef.id)
        //             state.list.push(payload)
        //             Swal.fire({
        //               type: 'success',
        //               title: 'NOTIFICATION ADDED SUCCESSFULLY',
        //               text: payload.name + ' added to list',
        //             })
        //           })
        //           .catch((error)=> {
        //               console.error("Error adding document: ", error);
        //           })

        //             //items.push(change.doc.data())
        //         }  
        //         if(change.type == 'removed'){
        //             change.doc.id.delete()
        //         }       
                        
        //     })
        //     state.list = items
        // })
    },//GET
  }//MUTATIONS
  
  export const actions = {
    get : (context, payload) => { context.commit('GET', payload) },
   
  }//ACTIONS
  