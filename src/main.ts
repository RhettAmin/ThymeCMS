import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from "@fortawesome/free-solid-svg-icons"
library.add(fas)

// Toast
// import Toast, { PluginOptions } from "vue-toastification";
// import "vue-toastification/dist/index.css";

const app = createApp(App).component('font-awesome-icon', FontAwesomeIcon)

app.use(router)
//app.use(Toast, options)

app.mount('#app')
