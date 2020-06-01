<template>
    <v-container fluid>
        <v-layout row wrap justify-center align-top>
            <v-flex xs12 sm6>
                <v-card tile height=100% class="ma-2">
                    <v-card-title class="headline">
                        PROFILE PHOTO
                    </v-card-title>
                    <v-card-text>
                        <v-layout row justify-center align-center class="pa-0">
                            <v-flex xs6 class="text-center">
                                <v-avatar size="96" color="indigo" v-if="photoURL == null">
                                    <v-icon>person</v-icon>
                                </v-avatar>
                                <v-img 
                                    :src="downloadURL == null ? photoURL : downloadURL" 
                                    max-width="100"
                                    max-height="100"
                                    v-else>
                                </v-img>
                                <input type="file" capture="camera" name="photoUploadBtn" id="photoUploadBtn" class="inputfile" accept="image/*" @change.prevent="uploadPhoto"/>
                                <label for="photoUploadBtn"><v-icon dark left>publish</v-icon>UPLOAD Photo</label>
                                <p v-if="progressValue > 0" class="display-2">{{progressPercentage}}</p>
                            </v-flex>
                            
                        </v-layout>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs12 sm6>
                <v-card tile height=100% class="ma-2">
                    <v-card-title class="headline">
                        PROFILE INFORMATION
                    </v-card-title>
                    <v-card-text>
                        <v-layout row justify-center align-center class="pa-0">
                            <v-flex xs6>
                                <v-text-field
                                    label="First Name"
                                    v-model="fname"
                                    prepend-icon="person"
                                    clearable
                                >
                                </v-text-field>
                                <v-text-field
                                    label="Last Name"
                                    v-model="lname"
                                    prepend-icon="person"
                                    clearable
                                >
                                </v-text-field>
                                <v-btn color="indigo" block @click="update">
                                    UPDATE
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
        
        
    </v-container>
</template>

<script>
import {fireStore, fireAuth, storage} from '~/plugins/firebase.js'
//import firebase from '~/plugins/firebase.js'
import Swal from 'sweetalert2'

export default {
    middleware : [],
    components:{},
    layout:'default',
    props: {
      fname: {type: String, default: ''},
      lname : {type: String, default: ''},
      uid : {type: String, default: ''},
      photoURL : {type: String, default: ''},
    },
    data(){
        return{
          downloadURL : null,
          progressValue : 0
        }//RETURN
    },//DATA
    async asyncData({store}){
        
    },//ASYNC
    fetch({store}){

    },
    created(){
        
    },//CREATED
    mounted(){
        
    },//MOUNTED
    watch: {
     
    },//WATCH
    computed:{
        currentPhotoURL(){
            return this.downloadURL == null ? this.photoURL : this.downloadURL
        },
        progressPercentage(){
            return (this.progressValue).toFixed(0) + '%'
        }
    },//COMPUTED
    methods:{
        update(){
           let user = fireAuth.currentUser;
            user.updateProfile({
                displayName: this.fname + ' ' + this.lname,
                photoURL: this.downloadURL
            })
            .then(() =>{
                Swal.fire({
                    type: 'success',
                    title: 'USER NAME SUCCESSFULLY UPDATED',
                    text: this.fname + ' ' + this.lname,
                })
            }).catch((error) =>{
                Swal.fire({
                    type: 'error',
                    title: 'USER NAME UPDATE FAILED',
                    text: error.message,
                })
                console.log(error.message)
            });
        },//UPDATE DISPLAY NAME
        uploadPhoto(e){
            this.downloadURL = null
            const file = e.target.files[0]
            let metadata = { contentType: 'image/jpeg' }
            let storageRef = storage.ref();
            let uploadTask = storageRef.child(`users/${this.uid}/profile-image`).put(file, metadata);

            uploadTask.on('state_changed', (snapshot) =>{
                let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                this.progressValue = progress
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                    case storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
                }
            }, (error) => {
                console.log(error.message)
            }, () => {
                uploadTask.snapshot.ref.getDownloadURL()
                .then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    this.$store.dispatch('photo_update',{uid:this.uid, photoURL : downloadURL})
                    this.downloadURL = downloadURL
                    this.update()
                    this.progressValue = 0
                });
            });


        },//UPLOAD FILE

    },//METHODS  
}
</script>

<style scoped>
/* LABEL STYLING */
.inputfile {
	width: 0.1px;
	height: 0.1px;
	opacity: 0;
	overflow: hidden;
	position: absolute;
	z-index: -1;
}
.inputfile + label {
    font-size: 0.7em;
    font-weight: 700;
    color: white;
    background-color: rgb(255, 152, 0);
    display: inline-block;
    padding: 5px;
    border: 1px solid rgb(255, 152, 0);
    border-radius: 2px;
}

.inputfile:focus + label,
.inputfile + label:hover {
    background-color: rgb(255, 152, 0,);
}

.inputfile + label {
	cursor: pointer; /* "hand" cursor */
}

.inputfile:focus + label {
	outline: 1px dotted #000;
	outline: -webkit-focus-ring-color auto 5px;
}

</style>


