import './assets/main.css'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import Toast, { POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const pinia = createPinia()

const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(VueQueryPlugin)
app.use(Toast, { position: POSITION.BOTTOM_RIGHT, transition: 'Vue-Toastification__fade' })

app.mount('#app')
