import {fireStore, fireAuth} from '~/plugins/firebase.js'
import Swal from 'sweetalert2'
import {map, findIndex, filter} from "lodash"

export const strict = false 

export const state = () => ({
    list : [],
  })
  //STATE
  export const getters = {
    tasks : state => state.list,
    totalCount : state => (state.list).length,
    remainingCount : state => filter(state.list,{'completed' : false}).length,
    completedCount : state => filter(state.list,{'completed' : true}).length,
    allTasks : state => state.list,
    remainingTasks : state => filter(state.list,{'completed' : false}),
    completedTasks : state => filter(state.list,{'completed' : true}),
    priorityTasks : state => filter(state.list,{'priority' : true}),
  }//GETTER

  export const mutations = {
    GET (state, payload) {
      let items = []
      console.log("VUEX - TASK GET")
      fireStore.collection("tasks").where("uid", "==", payload.uid).get()
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
      console.log("VUEX - TASK ADD")
      fireStore.collection("tasks").add(payload)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id)
        state.list.push(payload)
      })
      .catch((error)=> {
          console.error("Error adding document: ", error);
      })
      
    },//ADD

    UPDATE (state, payload) {
      fireStore.collection("tasks").where("id","==",payload.id).get()
      .then(querySnapshot => {
          querySnapshot.forEach( doc => {
            fireStore.collection("tasks").doc(doc.id).update({
                  title : payload.title,
                  completed : payload.completed,
                  priority : payload.priority,
              })
              .then( () => {
                  const index = state.list.findIndex(item => item.id == payload.id)
                  state.list[index].title = payload.title
                  state.list[index].completed = payload.completed
                  state.list[index].priority = payload.priority
              })
          })
      })
    },//UPDATE

    
    DELETE (state, payload) {
      console.log("VUEX - TASK DELETE")
      fireStore.collection("tasks").where('id','==',payload.id).get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete()
          .then( () =>{
            console.log("Document successfully deleted!")
            state.list.splice(state.list.indexOf(payload), 1)
            Swal.fire({
              type: 'success',
              title: 'TASK REMOVED SUCCESSFULLY',
              text: payload.title + ' deleted from list',
            })
          })
          .catch((error)=>{
            console.error("Error removing document: ", error)
          })
          
        })//FOREACH
      })//GET

      // taskRef.delete()
      //   .then(function() {
      //     console.log("Document successfully deleted!")
      //     Swal.fire({
      //       type: 'success',
      //       title: 'TASK REMOVED SUCCESSFULLY',
      //       text: payload.title + ' deleted from list',
      //   })
      //     state.list.splice(state.list.indexOf(payload), 1)
      //   }).catch(function(error) {
      //     console.error("Error removing document: ", error)
      //   })
    }//DELETE
  
  }//MUTATIONS
  
  export const actions = {
    get : (context, payload) => { context.commit('GET', payload) },
    add : (context, payload) => { context.commit('ADD', payload) },
    update : (context, payload) => { context.commit('UPDATE', payload) },
    delete : (context, payload) => { context.commit('DELETE', payload) },
  }//ACTIONS
  