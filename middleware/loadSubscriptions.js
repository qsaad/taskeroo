export default({ store, route, redirect }) => {
    console.log('MIDDLEWARE - LOADSUBSCRIPTIONS - ' + route.name)
    if (store.state.subscriptions.list.length === 0) {
      store.dispatch('subscriptions/get',{group : store.getters.group})
    }
  }