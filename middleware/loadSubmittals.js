export default({ store, route, redirect }) => {
    console.log('MIDDLEWARE - LOADSUBMITTALS - ' + route.name)
    if (store.state.submittals.list.length === 0) {
      store.dispatch('submittals/get')
    }
}