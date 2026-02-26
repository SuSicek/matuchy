import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import { createRouter, createWebHistory } from 'vue-router'

// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import App from './App.vue'
import HomeView from './views/HomeView.vue'
import AboutUs from './views/AboutUsVuetify.vue'
import References from './views/ReferencesClean.vue'
import Career from './views/CareerClean.vue'
import ContactUs from './views/ContactUs.vue'
import DivisionView from './views/DivisionView.vue'
// import ProdejnaView from './views/ProdejnaView.vue'
import ProdejnaView from './views/ProdejnaView.vue'
import ReferenceDetail from './views/ReferenceDetail.vue'
import JobDetail from './views/JobDetail.vue'
import StudentOpportunities from './views/StudentOpportunities.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/o-nas', name: 'AboutUs', component: AboutUs },
  { path: '/reference', name: 'References', component: References },
  { path: '/kariera', name: 'Career', component: Career },
  { path: '/kontakt', name: 'ContactUs', component: ContactUs },
  { path: '/divize/:id', name: 'Division', component: DivisionView, props: true },
  { path: '/prodejna', name: 'Prodejna', component: ProdejnaView },
  { path: '/reference/:id', name: 'ReferenceDetail', component: ReferenceDetail, props: true },
  { path: '/kariera/:id', name: 'JobDetail', component: JobDetail, props: true },
  { path: '/studenti', name: 'StudentOpportunities', component: StudentOpportunities },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#031f68',
          secondary: '#047857',
          accent: '#00c6fb',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107'
        }
      }
    }
  }
})

const app = createApp(App)
app.use(router)
app.use(vuetify)
app.mount('#app')