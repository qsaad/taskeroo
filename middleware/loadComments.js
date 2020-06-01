export default({ store, route, redirect }) => {
    console.log('MIDDLEWARE - LOADCOMMENTS - ' + route.name)
    if (store.state.comments.list.length === 0) {
      store.dispatch('comments/get')
    }
  }