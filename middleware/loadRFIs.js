export default({ store, route, redirect }) => {
    console.log('MIDDLEWARE - LOADRFIS - ' + route.name)
    if (store.state.rfis.list.length === 0) {
      store.dispatch('rfis/get')
    }
}