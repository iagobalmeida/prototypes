import Vue from 'vue'
import App from './App.vue'
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faMagnifyingGlass,
  faHandFist,
  faShield,
  faXmark,
  faCoins,
  faArrowUp
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faMagnifyingGlass)
library.add(faHandFist)
library.add(faShield)
library.add(faXmark)
library.add(faCoins)
library.add(faArrowUp)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.mixin({
  data: () => ({
    get assets() {
      return {
        archer:   require('./assets/unities/archer.png'),
        lancer:   require('./assets/unities/lancer.png'),
        warrior:  require('./assets/unities/warrior.png'),
        thief:    require('./assets/unities/thief.png'),
        mage:     require('./assets/unities/mage.png'),
        enemy:    require('./assets/unities/enemy.png'),
      };
    }
  })
});

Vue.config.productionTip = false;

Vue.use(new VueSocketIO({
    debug: true,
    connection: SocketIO('http://localhost:3000', { origins:'*' }), //options object is Optional
  })
);

new Vue({
  render: h => h(App),
}).$mount('#app')
