import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

if (!firebase.apps.length) {
    const config = {
        apiKey: "AIzaSyDicxNPvtObVzHXk8pf5qEOSQxsXuPCdRA",
        authDomain: "taskeroo.firebaseapp.com",
        databaseURL: "https://taskeroo.firebaseio.com",
        projectId: "taskeroo",
        storageBucket: "taskeroo.appspot.com",
        messagingSenderId: "795310401738",
        appId: "1:795310401738:web:483a0a45fb78b2f4"
    }
    //firebase.initializeApp(config)

    !firebase.apps.length ? firebase.initializeApp(config) : ''

    firebase.firestore().enablePersistence({synchronizeTabs:true})
        .then(() => {
            console.log("Woohoo! Multi-Tab Persistence!")
        })
        .catch(function(err) {
            if (err.code == 'failed-precondition') {
                // Multiple tabs open, persistence can only be enabled
                // in one tab at a a time.
                // ...
            } 
            else if (err.code == 'unimplemented') {
                // The current browser does not support all of the
                // features required to enable persistence
                // ...
            }
    });
}


export const fireAuth = firebase.auth()
export const fireStore = firebase.firestore()
export const storage = firebase.storage()
export default firebase