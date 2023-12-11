<template>
  <div class="main">
    <h1 class="text-xl">Add Recipe to Book</h1>

    <form class="" @submit.prevent>
      <div class="flex flex-row space-x-3">
        <div class="">
          <label class="label">Name</label>
          <div class="control">
            <input class="input" type="text" v-model="recipe.name">
          </div>
        </div> 

        <div class="">
          <label class="label">Servings</label>
          <div class="">
            <input class="" type="number" v-model="recipe.servings">
          </div>
        </div>  

        <div class="">
          <label class="label">Tags</label>
          <div class="control">
            <input class="input" type="text" v-model="recipe_tags">
          </div>
          <p class="help">seperate tags with commas (",")</p>
        </div> 
      </div>

      

      <div class="">
          <label class="">Description</label>
          <div class="control">
            <textarea class="w-[36.5%]" v-model="recipe.description"></textarea>
          </div>
      </div> 

      <div class="py-3">
        
        <div class="flex flex-row gap-3">
          <h2 class="pb-3 text-lg">Ingredients</h2>
          <font-awesome-icon v-on:click="addIngredientItem" class="bg-blue-300 w-5 h-5 mt-1 rounded-md" icon="fa-solid fa-plus" />
        </div>
        <div class="flex flex-row space-x-3 pl-5 py-2" v-for="(ingredient, idx) in recipe.ingredients" :key="idx">
          <div class="">
            <label class=" ">name</label>
            <div class="control">
              <input class="text-black" type="text" v-model="ingredient.name">
            </div>
          </div>
          <div class="">
            <label class=" ">quantity</label>
            <div class="control">
              <input class="text-black" type="number" v-model="ingredient.quantity">
            </div>
          </div>
          <div class="">
            <label class="">measurement</label>
            <div class="control">
              <input class="text-black" type="text" v-model="ingredient.measurement" >
            </div>
          </div>
          <font-awesome-icon v-on:click="removeIngredientItem(idx)" class="bg-blue-300 w-5 h-5 mt-6 rounded-md" icon="fa-solid fa-minus" />
        </div>
      </div>

      <div class="py-3">
        <div class="flex flex-row gap-3">
          <h2 class="pb-3 text-lg">Instructions</h2>
          <font-awesome-icon v-on:click="addInstructionItem" class="bg-blue-300 w-5 h-5 mt-1 rounded-md" icon="fa-solid fa-plus" />
        </div>
        <ol v-for="(instruction, idx) in recipe.instructions" :key="idx">
          <li class="flex items-center pl-5 py-2">
            <textarea class="w-[78%] text-black" v-model="instruction.step"></textarea>
            <font-awesome-icon v-on:click="removeInstructionItem(idx)" class="bg-blue-300 w-5 h-5 ml-2 rounded-md" icon="fa-solid fa-minus" />
          </li>
        </ol>
      </div>

      <div class="py-3">
        <h2 class="pb-3">Nutrition Facts</h2>
        <div class="flex flex-row flex-wrap space-x-3 pl-4">

          <div class="">
            <label class="">Calories</label>
            <div class="control">
              <input class="input" type="number" v-model="recipe.nutritionFacts.calories">
            </div>
          </div>

          <div class="">
            <label class="">Protein</label>
            <div class="control">
              <input class="input" type="number" v-model="recipe.nutritionFacts.protein">
            </div>
          </div>

          <div class="">
            <label class="">Carbs</label>
            <div class="control">
              <input class="input" type="number" v-model="recipe.nutritionFacts.carbs">
            </div>
          </div>

          <div class="">
            <label class="">Fat</label>
            <div class="control">
              <input class="input" type="number" v-model="recipe.nutritionFacts.fats">
            </div>
          </div>
        </div>
      </div>

      <button @click="submit" class="rounded-lg p-2 bg-green-800 text-slate-50 mt-5 hover:border-2">Submit</button>
    </form>

  </div>
</template>

<script lang="ts">
  import axios from 'axios';
  import { Recipe, Ingredient, Instruction, NutritionFacts } from './recipeModel';

  export default {
   data() {
      return {
        posts:null,
        recipe_tags: 'test, tags, cheese',
        recipe: {
          name: 'Turkey Sandwich',
          description: 'Fat juicy sandwich',
          tags: [] as string[],
          image: '',
          ingredients: [ 
            {
              name: "tomato",
              quantity: 2,
              measurement: "grams"
            },
            {
              name: "potato",
              quantity: 5,
              measurement: "grams"
            }
          ] as Ingredient[],
          servings: 1,
          instructions: [
            {
              step:"cook tomato in vinegar"
            },
            {
              step: "baste with mustard"
            },
            {
              step: "throw in garbage"
            }
          ] as Instruction[],
          nutritionFacts: {
            calories: 300,
            protein: 25,
            carbs: 254,
            fats: 5,
          }
        } 
      }
    },
    methods: {
      addIngredientItem() {
        let ingredient = new Ingredient();
        this.recipe.ingredients.push(ingredient)
      },
      removeIngredientItem(index: number) {
        this.recipe.ingredients.splice(index, 1);
      },

      addInstructionItem() {
        let instruction = new Instruction();
        this.recipe.instructions.push(instruction)
      },
      removeInstructionItem(index: number) {
        this.recipe.instructions.splice(index, 1);
      },

      submit() {
        let recipeClass = new Recipe
        recipeClass.id = undefined
        recipeClass.name = this.recipe.name
        recipeClass.description = this.recipe.description
        recipeClass.servings = this.recipe.servings
        recipeClass.tags = this.recipe_tags.split(",")
        recipeClass.ingredients = this.recipe.ingredients
        recipeClass.instructions = this.recipe.instructions
        recipeClass.nutritionFacts = this.recipe.nutritionFacts

        this.postRecipe(recipeClass);
      },
      
      async postRecipe(recipe: Recipe) {
        axios.post(
          'http://localhost:8080/api/recipes', recipe,
          {
            headers: {
              'Content-Type': 'application/json',
            }
        })
        .then(response => console.log(response))
        .catch(function (error) {
          // your action on error success
            console.log(error);
        });
      }
    }
  }

</script>


<style scoped>
  input, select, textarea{
    color: var(--vt-c-black-soft);
  }
</style>
