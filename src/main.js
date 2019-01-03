import Vue from 'vue'
import HomeView from './views/Home'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)

const el = new Vue({
  el: '#app',

  name: 'LuoguBoard',

  data: () => ({
    isLoaded: document.readyState === 'complete'
  }),

  render: h => h(HomeView)
})

el.isLoaded || window.addEventListener('load', () => {
  el.isLoaded = true
  console.log('Luogu Board loaded')
})
