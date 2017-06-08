// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import PlayBoard from './components/PlayBoard.vue'
import Blocks from './components/Blocks.vue'
import FlowBoard from './components/FlowBoard.vue'
import Modal from './components/Modal.vue'

Vue.component('app-play-board', PlayBoard)
Vue.component('app-blocks', Blocks)
Vue.component('app-flow-board', FlowBoard)
Vue.component('app-modal', Modal)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
