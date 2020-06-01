export default({ store, route, redirect }) => {
    console.log('MIDDLEWARE - LOADBILLINGS - ' + route.name)
    if (store.state.billings.list.length === 0) {
      store.dispatch('billings/get')
    }
  }