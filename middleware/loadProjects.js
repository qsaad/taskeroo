export default({ store, route, redirect }) => {
    console.log('MIDDLEWARE - LOADPROJECTS - ' + route.name)
    if (store.state.projects.list.length === 0) {
      store.dispatch('projects/get')
    }
}