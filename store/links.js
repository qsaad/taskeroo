import {fireStore, fireAuth} from '~/plugins/firebase.js'
import Swal from 'sweetalert2'
import {map, findIndex, filter} from "lodash"

export const strict = false 

export const state = () => ({
    list : [],
  })
  //STATE
  export const getters = {
    links : state => state.list,
    totalCount : state => (state.list).length,
  }//GETTER

  export const mutations = {
    GET (state, payload) {
      let items = []
      console.log("VUEX - LINK GET")
      fireStore.collection("links").where("uid", "==", payload.uid).get()
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
      console.log("VUEX - LINK ADD")
      let docExist = false
      fireStore.collection("links").where("uid","==",payload.uid).where("id","==",payload.id).get()
          .then(querySnapshot => {
            querySnapshot.forEach( doc => {
                if (doc.exists) {
                    docExist = true
                    Swal.fire({
                        type: 'warning',
                        title: doc.data().url + ' already exists on ',
                        text: 'Try another url',
                    })
                } 
            })
        if(docExist == false){
          fireStore.collection("links").add(payload)
          .then((docRef) => {
            console.log("Document written with ID: ", docRef.id)
            state.list.push(payload)
            Swal.fire({
              type: 'success',
              title: 'LINK ADDED SUCCESSFULLY',
              text: payload.name + ' added to list',
            })
          })
          .catch((error)=> {
              console.error("Error adding document: ", error);
          })
        }//IF DOC DOES DOES NOT EXIST
      })
      
    },//ADD

    UPDATE (state, payload) {
      console.log("VUEX - LINK UPDATE")
      fireStore.collection("links").where("uid","==",payload.uid).where("id","==",payload.id).get()
      .then(querySnapshot => {
          querySnapshot.forEach( doc => {
            fireStore.collection("links").doc(doc.id).update({...payload})
              .then( () => {
                const index = state.list.findIndex(item => item.id == payload.id)
                state.list[index] = {...payload}
                Swal.fire({
                  type: 'success',
                  title: 'LINK UPDATED SUCCESSFULLY',
                  text: payload.name + ' updated in list ' + payload.url,
                })
              })
          })
      })
    },//UPDATE

    
    DELETE (state, payload) {
      console.log("VUEX - LINK DELETE")
      fireStore.collection("links").where('uid','==',payload.uid).where("id","==",payload.id).get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete()
          .then( () =>{
            console.log("Document successfully deleted!")
            state.list.splice(state.list.indexOf(payload), 1)
            Swal.fire({
              type: 'success',
              title: 'LINK REMOVED SUCCESSFULLY',
              text: payload.url + ' deleted from list',
            })
          })
          .catch((error)=>{
            console.error("Error removing document: ", error)
          })
          
        })//FOREACH
      })//GET

    },//DELETE

    // ADDFIELD (state, payload) {
    //   console.log("VUEX - LINK UPDATE")
    //   let i = 0
    //   fireStore.collection("links").where("uid","==",payload.uid).get()
    //   .then(querySnapshot => {
    //       querySnapshot.forEach( doc => {
    //         let data = Object.assign(doc.data(), {id : Math.random().toString(16)})
    //         i = i + 1
    //         console.log('Updated : ' + i)
    //         fireStore.collection("links").doc(doc.id).update({...data})
    //           .then( () => {
               
    //           })
    //       })
    //   })
    // },//ADD FIELD

    
  
  }//MUTATIONS
  
  export const actions = {
    get : (context, payload) => { context.commit('GET', payload) },
    add : (context, payload) => { context.commit('ADD', payload) },
    update : (context, payload) => { context.commit('UPDATE', payload) },
    delete : (context, payload) => { context.commit('DELETE', payload) },
    //addField : (context, payload) => { context.commit('ADDFIELD', payload) },
  }//ACTIONS
  