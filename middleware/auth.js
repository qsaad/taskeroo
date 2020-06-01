export default({ store, route, redirect }) => {
    console.log('STEP 2 : MIDDLEWARE - AUTH')
    //if(!store.getters.isAuthenticated && route.name !== 'login'){
    if(!store.getters.isAuthenticated){
      console.log('Invalid User ')
      redirect('/')
    }
    else{
      console.log('USER NAME ' + store.getters.displayName)
      console.log('USER EMAIL ' + store.getters.email)
      console.log('USER UID ' + store.getters.uid)
      console.log('USER PhotoURL ' + store.getters.photoURL)
    }
  }