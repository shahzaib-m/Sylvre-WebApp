import Vue from 'vue'

import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)
import "./assets/css/bootstrap.min-bootswatchdarkly.css";
import 'bootstrap-vue/dist/bootstrap-vue.css'

import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)

import App from './App.vue'

/* vue-fontawesome */
import { library } from '@fortawesome/fontawesome-svg-core'
import { faChevronLeft, faChevronRight, faBook, faUser, faTrashAlt,
         faSignOutAlt, faSignInAlt, faUserPlus, faCheckCircle, faSave,
         faPlus, faPlay, faBars, faCaretRight, faLightbulb, faEdit } from '@fortawesome/free-solid-svg-icons'
import { faFrownOpen } from '@fortawesome/free-regular-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faChevronLeft, faChevronRight, faBook, faUser, faTrashAlt,
            faSignOutAlt, faSignInAlt, faUserPlus, faCheckCircle, faSave,
            faPlus, faPlay, faBars, faCaretRight, faLightbulb, faEdit);
library.add(faFrownOpen);
library.add(faGithub);

Vue.component('fa-icon', FontAwesomeIcon)
/* --------------- */

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
