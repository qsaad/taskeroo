export default({ store, route, redirect }) => {
    console.log('STEP 3 : MIDDLEWARE - LOADSCHEDULES - ' + route.name)
    if (store.state.schedules.list.length === 0) {
      //store.dispatch('schedules/get',{uid : store.getters.userID})
      store.dispatch('schedules/get',{group : store.getters.group})
    }
  }