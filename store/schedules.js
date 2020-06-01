import {fireStore, fireAuth} from '~/plugins/firebase.js'
import Swal from 'sweetalert2'
import {map, findIndex, filter,groupBy} from "lodash"

export const strict = false 

export const state = () => ({
    list : [],
  })
  //STATE
  export const getters = {
    list : state => state.list,
    totalCount : state => (state.list).length,
    byName : state => groupBy(state.list,['name']),
    // completed : state => {state.list.filter(item => item.completed)},
    // pending : state => {state.list.filter(item => !item.completed)},
    // sortedSchedule : (state,getters) => orderBy(state.list,['end','name'],['desc','desc']),
    // getByUser : (state) => (email) => {
    //   return state.list.find(item => item.email === email)
    // },

  }//GETTER

  export const mutations = {
    GET (state, payload) {
      let items = []
      console.log("VUEX - SCHEDULE GET")
      console.log(payload.group)
      fireStore.collection("schedules").where("group", "==", payload.group).get()
      .then((querySnapshot) =>{
        querySnapshot.forEach((doc) =>{
            items.push(doc.data()) 
        });
        state.list = items
      })
      .catch((error)=> {
        console.log("Error getting documents: ", error);
      })

      //------------------------------------------

        // console.log("VUEX - SCHEDULE GET")
        // fireStore.collection("schedules").where("group", "==", payload.group)
        //   .onSnapshot(snapshot =>{
        //     let items = [];
        //     snapshot.docChanges().forEach(change => {          
        //       items.push(change.doc.data());          
        //     })
        //     state.list = items
        // })

        //--------------------------------------------

        // console.log("VUEX - SCHEDULE GET")
        // fireStore.collection("schedules").where("group", "==", payload.group).orderBy("end").orderBy("name")
        //   .onSnapshot(snapshot =>{
        //     let items = [];
        //     snapshot.forEach(doc => {          
        //       items.push(doc.data());          
        //     })
        //     state.list = items
        // })

        
    },//GET
    ADD (state, payload){
      console.log("VUEX - SCHEDULE ADD")
      let docExist = false
      //fireStore.collection("schedules").where("uid","==",payload.uid).where("id","==",payload.id).get()
      fireStore.collection("schedules").where("group","==",payload.group).where("id","==",payload.id).get()
          .then(querySnapshot => {
            querySnapshot.forEach( doc => {
                if (doc.exists) {
                    docExist = true
                    Swal.fire({
                        type: 'warning',
                        title: doc.data().name + ' already exists on ',
                        text: 'Try another data',
                    })
                } 
            })
        if(docExist == false){
          fireStore.collection("schedules").add(payload)
          .then((docRef) => {
            console.log("Document written with ID: ", docRef.id)
            state.list.push(payload)
            Swal.fire({
              type: 'success',
              title: 'SCHEDULE ADDED SUCCESSFULLY',
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
      console.log("VUEX - SCHEDULE UPDATE")
      fireStore.collection("schedules").where("group","==",payload.group).where("id","==",payload.id).get()
      .then(querySnapshot => {
          querySnapshot.forEach( doc => {
            fireStore.collection("schedules").doc(doc.id).update({...payload})
              .then( () => {
                const index = state.list.findIndex(item => item.id == payload.id)
                state.list[index] = {...payload}
                Swal.fire({
                  type: 'success',
                  title: 'SCHEDULE UPDATED SUCCESSFULLY',
                  text: payload.name + ' updated in list ',
                })
              })
          })
      })
    },//UPDATE

    
    DELETE (state, payload) {
      console.log("VUEX - SCHEDULE DELETE")
      //fireStore.collection("schedules").where('uid','==',payload.uid).where("id","==",payload.id).get()
      fireStore.collection("schedules").where('group','==',payload.group).where("id","==",payload.id).get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete()
          .then( () =>{
            console.log("Document successfully deleted!")
            state.list.splice(state.list.indexOf(payload), 1)
            Swal.fire({
              type: 'success',
              title: 'SCHEDULE REMOVED SUCCESSFULLY',
              text: payload.name + ' deleted from list',
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
    add : (context, payload) => { 
      context.commit('ADD', payload)
      context.commit('GET', payload) 
    },
    update : (context, payload) => { 
      context.commit('UPDATE', payload) 
      context.commit('GET', payload)
    },
    delete : (context, payload) => { 
      context.commit('DELETE', payload)
      context.commit('GET', payload) 
    },
    //addField : (context, payload) => { context.commit('ADDFIELD', payload) },
  }//ACTIONS
  