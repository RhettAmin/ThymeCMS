import { createRouter, createWebHistory } from 'vue-router'
import AddRecipes from '@/views/AddRecipes.vue'
import ViewRecipes from '@/views/ViewRecipes.vue'
import PlaygroundPage from '@/views/PlaygroundPage.vue'
import RecipeView from '@/views/RecipeView.vue'

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
    },
    {
      path: '/playground',
      name: 'playgroundPage',
      component: PlaygroundPage
    },
    {
      path: '/recipe',
      name: 'recipeView',
      component: RecipeView
    }
  ]
})

export default router
