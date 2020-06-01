export default({ store, route, redirect }) => {
    console.log('MIDDLEWARE - LOADMILESTONES - ' + route.name)
    if (store.state.milestones.list.length === 0) {
      store.dispatch('milestones/get')
    }
}