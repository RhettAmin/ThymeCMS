<script lang="ts">
  import { Recipe } from '@/models/recipeModel'
  import ThymeBackendAPI from '@/api/backend/thymebackend'
  import FirebaseConn from '@/api/firebase/firebaseConnection'

  export default {
    data() {
      return {
        recipes: [] as Recipe[]
      }
    },

    methods: {
      deleteRecipe(id: string) {
        ThymeBackendAPI.deleteRecipe(id).then(() => {
        })
      },

      setImage(imgString: Blob): any{
          return URL.createObjectURL(imgString) 
      }
    },

    mounted() {
      ThymeBackendAPI.getRecipe().then((response) => {
        for (const [index, value] of response.entries()) {
          FirebaseConn.getImage(value).then((imageResponse) => {
            this.recipes.push(imageResponse)
            this.recipes
          }).catch((error) => {

          })
        }
        
      })
      
    }
  }

</script>

<template>
  <!-- Page -->
  <div class="flex flex-col items-center">
    <h1 class="text-2xl font-bold">View Recipes</h1>

    <!-- Recipe Card -->
    <div class="border bg-red-300 w-3/5 my-2 p-4" v-for="(recipe, idx) in recipes" :key="idx">
      <div class="flex flex-row">
        <!-- Image -->
        <div>
          <img class="" v-if="recipe.mainImage" :src=setImage(recipe.mainImage.imageFileRef) width="200" height="200"/>
        </div>

        <!-- Info Body -->
        <div class="w-full px-2">
          <!-- Top Line --> 
          <div class="flex flex-row justify-between">
            <div class="">{{ recipe.name }}</div>
            <div class="items-end">
              <font-awesome-icon @click="deleteRecipe(recipe.recipeId)" class="w-4 h-4" icon="fa-solid fa-trash" /> 
            </div>
          </div>
          <div class="flex justify-center pt-12">
            <RouterLink :to="{ path:'/recipe', query: { id: recipe.recipeId } }" class="route-option border rounded-md bg-green-400 px-4 py-2 ">Edit</RouterLink>
          </div>
        </div>
        
      </div>
    </div>

  </div>
</template>