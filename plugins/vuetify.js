import Vue from 'vue'
import Vuetify, {
  VApp, // required
  VNavigationDrawer,
  VFooter,
  VToolbar
} from 'vuetify/lib'
import { Ripple } from 'vuetify/lib/directives'

Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VToolbar
  },
  directives: {
    Ripple
  }
})

Vue.directive ('item-focus',{
  bind : (el, binding, vnode) =>{
      console.log('DIRECTIVE - ITEM FOCUS')
      console.log(binding.value)
      if (binding.value) {
          el.focus()
      }
      else{
        return
      }
  }
})
