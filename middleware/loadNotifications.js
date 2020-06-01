export default({ store, route, redirect }) => {
    console.log('MIDDLEWARE - LOADNOTIFICATIONS - ' + route.name)
    if (store.state.notifications.list.length === 0) {
      //store.dispatch('schedules/get',{uid : store.getters.userID})
      store.dispatch('notifications/get',{group : store.getters.group})
    }
  }