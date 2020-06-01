export default({ store, route, redirect }) => {
  console.log('MIDDLEWARE - LOADLINKS - ' + route.name)
  if (store.state.links.list.length === 0) {
    store.dispatch('links/get',{uid : store.getters.userID})
  }
}