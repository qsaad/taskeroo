export default({ store, route, redirect }) => {
    console.log('MIDDLEWARE - LOADDATA - ' + route.name)
    if (store.state.tasks.list.length === 0) {
      store.dispatch('tasks/get',{uid : store.getters.userID})
    }
  }