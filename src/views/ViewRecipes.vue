<script setup lang="ts">
</script>

<template>
  <div class="main flex flex-col place-items-center px-5">
    <h1 class="text-xl pb-5">View all Recipes</h1>
    <table class="table-auto">
      <thead>
        <tr class="bg-green-800">
          <th class="border-2 px-4 py-2">Id</th>
          <th class="border-2 px-4 py-2">Name</th>
          <th class="border-2 px-4 py-2">Description</th>
          <th class="border-2 px-4 py-2">Servings</th>
          <th class="border-2 px-4 py-2">Tags</th>
          <th class="border-2 px-4 py-2">Image</th>
          <th class="border-2 px-4 py-2">Ingredients</th>
          <th class="border-2 px-4 py-2">Instructions</th>
          <th class="border-2 px-4 py-2">Nutrition Facts</th>
          <th class="border-2 px-4 py-2">Delete</th>
        </tr>
      </thead>
      <tbody>
        <tr class="" v-for="(recipe, idx) in recipes" :key="idx">
          <td class="border-2 px-4 py-2">{{ recipe.id }}</td>
          <td class="border-2 px-4 py-2">{{ recipe.name }}</td>
          <td class="border-2 px-4 py-2">{{ recipe.description }}</td>
          <td class="border-2 px-4 py-2">{{ recipe.servings }}</td>
          <td class="border-2 px-4 py-2">{{ recipe.tags.toString() }}</td>
          <td class="border-2 px-4 py-2">{{ recipe.image }}</td>
          <td class="border-2 px-4 py-2">
            <div>
              <div class="" v-for="(ingredientSection, iidx) in recipe.ingredientSection" :key="iidx">
                <label value="{{ ingredientSection.sectionName }}"></label>
                <div class="flex flex-row" v-for="(ingredient, idx) in ingredientSection.ingredients" :key="idx">
                  <label>
                     {{ ingredient.name }} {{ ingredient.quantity }} {{ ingredient.measurement }} 
                  </label>
                </div>
              </div>
            </div>
          </td>
          <td class="border-2 px-4 py-2">
            <div>
              <div class="list-decimal" v-for="(instructionSection, idx) in recipe.instructionSection" :key="idx">
                <label value="{{ instructionSection.sectionName }}"></label>
                <ol>
                  <li class="flex flex-row" v-for="(step, idx) in instructionSection.steps" :key="idx"> {{ step }}</li>
                </ol>
              </div>
            </div>
          </td>
          <td class="border-2 px-4 py-2">
            <div>
              <p>Calories: {{ recipe.nutritionFacts.calories }}</p>
              <p>Protein: {{ recipe.nutritionFacts.protein }}</p>
              <p>Carbs: {{ recipe.nutritionFacts.carbs }}</p>
              <p>Fat: {{ recipe.nutritionFacts.fats }}</p>
            </div>
          </td>
          <td class="border-2 text-center justify-center">
            <font-awesome-icon @click="deleteRecipe(recipe.id)" class="bg-blue-300 w-5 h-5 p-2 rounded-md" icon="fa-solid fa-trash" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script lang="ts">
  import axios from 'axios';
  import {Recipe} from './recipeModel';

  export default {
    data() {
      return {
        recipes: [] as Recipe[]
      }
    },

    methods: {
      deleteRecipe(idx: string) {
        axios.delete('http://localhost:8080/api/recipes', {
          params: {
            id: idx
          }
        })
        .then(response => {
          console.log(response);
        })
        .finally(() => 
          this.getRecipes()
        )
      },

      getRecipes() {
        axios.get('http://localhost:8080/api/recipes', {
          params: {
            id: '',
            name:''
          }
        })
        .then(response => {
          this.recipes = response.data;
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });  
      }
    },

    mounted() {
      this.getRecipes()
    }
  }

</script>