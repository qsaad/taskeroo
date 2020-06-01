export default({ store, route, redirect }) => {
    console.log('STEP 4 : MIDDLEWARE - LOADUSERS - ' + route.name)
    if (store.state.list.length === 0) {
      store.dispatch('get',{group : store.getters.group})
    }
}