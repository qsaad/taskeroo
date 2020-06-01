export default({ store, route, redirect }) => {
    console.log('MIDDLEWARE - LOADREFENCES - ' + route.name)
    if (store.state.references.list.length === 0) {
      store.dispatch('references/get',{uid : store.getters.userID})
    }
  }