import { createRouter, createWebHistory } from 'vue-router'
import AddRecipes from '../views/AddRecipes.vue'
import ViewRecipes from '../views/ViewRecipes.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'addRecipes',
      component: AddRecipes
    },
    {
      path: '/view',
      name: 'viewRecipes',
      component: ViewRecipes
    }
  ]
})

export default router
