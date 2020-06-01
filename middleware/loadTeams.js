export default({ store, route, redirect }) => {
    console.log('MIDDLEWARE - LOADTEAMS - ' + route.name)
    if (store.state.teams.list.length === 0) {
      store.dispatch('teams/get',{number : route.params.number})
    }
}