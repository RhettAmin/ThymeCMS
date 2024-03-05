<template>
  <div class="main flex flex-col place-items-center">
    <h1 class=" text-3xl pb-10 text-center">Add Recipe to Book</h1>

    <form class="" @submit.prevent>

      <div class="flex flex-row space-x-8">
        <div>
          <div class="flex flex-col space-x-3 pb-3">
            <label class="label">Name</label>
            <input class="input" type="text" v-model="recipe.name">
          </div>

          <div class="flex flex-col space-x-3 pb-3">
            <label class="label">Servings</label>
            <input class="" type="number" v-model="recipe.servings">
          </div>  

          <div class="flex flex-col space-x-2">
            <label class="label">Tags</label>
            <input class="input" type="text" @blur="onTagBlurOut">
            <p class="extra-info">seperate tags with commas (",")</p>
          </div> 
        </div>
        
        <div>
          <div class="flex flex-row">
            <div class="flex flex-col">
              <label class="label">Main Image</label>
              <input class="input" type="file" @change="onFileChange">
            </div> 
            <div id="preview">
              <img class="pb-3" v-if="mainImageUrl" :src="mainImageUrl" width="200"/>
            </div>
          </div>
        </div>
      </div>

      <div class="">
          <label class="">Description</label>
          <div class="control">
            <textarea v-model="recipe.description" rows="4"></textarea>
          </div>
      </div> 

      <!-- INGREDIENTS START -->
      <div class="py-3">
        <h2 class="pb-3 text-xl">Ingredients</h2>
        
        <div class="flex flex-row space-x-3 px-5 py-2 " v-for="(ingredientSection, idx) in recipe.ingredientSection" :key="idx">
          <div id="SectionContainer" class="border rounded bg-green-100 p-2 w-full">

            <div class="pb-2 relative">
              <label class="pr-2">Section Name</label>
              <input class="text-black my-[-2px]" type="text" v-model="ingredientSection.sectionName" placeholder="Section Name">
              <font-awesome-icon v-on:click="removeIngredientSection(idx)" class="bg-red-300 w-5 h-5 rounded-md absolute right-0 cursor-pointer" icon="fa-solid fa-minus" />
            </div>

            <div id="ingredientsContainer" class="flex flex-col" >
              <div class="space-x-3 py-2">
                <label class="">Section Ingredients</label> 
              </div>
              
              <div class="flex flex-row space-x-3 pl-5 justify-center" v-for="(ingredient, iIdx) in ingredientSection.ingredients" :key="iIdx">
                <div class="">
                  <label class="">Name</label>
                  <div class="control">
                    <input class="text-black" type="text" v-model="ingredient.name">
                  </div>
                </div>
                <div class="">
                  <label class="">Quantity</label>
                  <div class="control">
                    <input class="text-black" type="number" step=".01" v-model="ingredient.quantity">
                  </div>
                </div>
                <div class="">
                  <label class="">Measurement</label>
                  <div class="control">
                    <input class="text-black" type="text" v-model="ingredient.measurement" >
                  </div>
                </div>
                <font-awesome-icon v-on:click="removeIngredient(ingredientSection, iIdx)" class="bg-red-300 w-5 h-5 mt-6 rounded-md cursor-pointer" icon="fa-solid fa-minus" />
              </div>

              <div class="flex justify-center">
                <label class="rounded border mt-3 p-1 text-blue bg-green-400 cursor-pointer w-1/4 flex justify-center" v-on:click="addIngredient(ingredientSection)">Add Ingredient</label>
              </div>
            </div>
          </div>
        </div>

        <div class="pl-5 my-2 flex justify-center">
          <label class="rounded border p-1 bg-green-400 cursor-pointer" v-on:click="addIngredientSection">Add Ingredient Group</label>
        </div>

      </div>
      
      <div class="divide-y"></div>

      <!-- INGREDIENTS END -->

      <!-- INSTRUCTIONS END -->  
      <div class="py-3">
        <div class="flex flex-row gap-3">
          <h2 class="pb-3 text-xl">Instructions</h2>
        </div>

        <div class="flex flex-row space-x-3 px-5 py-2" v-for="(instructionSection, iIdx) in recipe.instructionSection" :key="iIdx">
          <div id="SectionContainer" class="border rounded bg-green-100 p-2 w-full">

            <div class="pb-2 relative">
              <label class="pr-2">Section Name</label>
              <input class="text-black my-[-2px]" type="text" v-model="instructionSection.sectionName">
              <font-awesome-icon v-on:click="removeInstructionSection(iIdx)" class="bg-red-300 w-5 h-5 rounded-md absolute right-0 cursor-pointer" icon="fa-solid fa-minus" />
            </div>

            <div id="ingredientsContainer" class="flex flex-col" >
              <div class="space-x-3 py-2">
                <label class="">Section Instructions</label> 
                <label class="rounded border p-1 text-blue bg-green-400 cursor-pointer" v-on:click="addInstruction(instructionSection)">Add Instructions</label>
              </div>
              
            <div class="flex items-center pl-5 py-2" v-for="(step, idx) in instructionSection.steps" :key="idx">
                <h3 class="pr-3">{{ idx+1 }}</h3>
                <textarea v-model="instructionSection.steps[idx]"></textarea>
                <font-awesome-icon v-on:click="removeInstruction(instructionSection, idx)" class="bg-red-300 w-5 h-5 ml-2 rounded-md" icon="fa-solid fa-minus" />
            </div>
          </div>

          </div>
        </div>
          
        <div class="pl-5 my-2 flex justify-center">
          <label class="rounded border p-1 bg-green-400 cursor-pointer" v-on:click="addInstructionSection">Add Instruction Group</label>
        </div>
      </div>
      <!-- INSTRUCTIONS END -->

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

      <div class="flex justify-center">
        <button @click="submit" class="rounded-lg p-2 bg-green-800 text-slate-50 mt-5 hover:border-2">Submit</button>
      </div>
    </form>

  </div>
</template>

<script lang="ts">
  
  import { Recipe, IngredientSection, Ingredient, InstructionSection } from './recipeModel';
  import { uploadBytes , ref, type StorageReference } from 'firebase/storage'
  import { thymeStorage } from '../config/firebase'
  
  import axios from 'axios';

  export default {
   data() {
      return {
        posts:null,
        mainImageUrl: '',
        mainImageFileRef: null,
        firebaseStorageRef: null as unknown as StorageReference,
        recipe: {
          name: '',
          description: '',
          tags: [] as string[],
          servings: 1,
          image: '',
          ingredientSection: [ 
            {
              sectionName: '',
              ingredients: [
                {
                  name: '',
                  quantity: 0,
                  measurement: ''
                }
              ]
            }
          ] as IngredientSection[],
          instructionSection: [
            {
              sectionName: '',
              steps: []
            }
          ] as InstructionSection[],
          nutritionFacts: {
            calories: 0,
            protein: 0,
            carbs: 0,
            fats: 0,
          }
        } 
      }
    },

    methods: {
      // === Main Image ===
      onFileChange(event: any) {
        const file = event.target.files[0]; 
        this.mainImageFileRef = file;
        // Set Reference for Firebase upload        
        this.firebaseStorageRef = ref(thymeStorage, file.name)
        // set Reference img display after file upload
        this.mainImageUrl = URL.createObjectURL(file)
      },

      // === Tags ===
      onTagBlurOut(e: any) {
        let value = e.target.value
        this.recipe.tags = value.substring(0, value.length).split(", ");
      },

      // === Ingredients === 
      addIngredientSection() {
        let ingredientSection = new IngredientSection();
        this.recipe.ingredientSection.push(ingredientSection)
      },
      addIngredient(ingredientSection: IngredientSection) {
        let ingredient = new Ingredient();
        ingredientSection.ingredients.push(ingredient)
      },
      removeIngredientSection(index: number) {
        this.recipe.ingredientSection.splice(index, 1);
      },
      removeIngredient(ingredientSection: IngredientSection, index: number) {
        ingredientSection.ingredients.splice(index, 1);
      },

      // === Instructions ===
      addInstructionSection() {
        let instructionSection = new InstructionSection();
        instructionSection.steps = []
        this.recipe.instructionSection.push(instructionSection)
      },
      addInstruction(instructionSection: InstructionSection) {
        instructionSection.steps.push("")
      },
      removeInstructionSection(index: number) {
        this.recipe.instructionSection.splice(index, 1);
      },
      removeInstruction(instructionSection: InstructionSection, index: number) {
        instructionSection.steps.splice(index, 1);
      },

      uploadPicture() {
        const data = this.mainImageFileRef
        if (data) {
          uploadBytes(this.firebaseStorageRef, data).then((snapshot) => {
            console.log('uploaded Image file!')
            this.recipe.image = snapshot.ref.toString()
          })
        }
      },

      submit() {
        // Upload Image to Firebase and grab the storage string to put into DB
        console.log(this.recipe);
        this.uploadPicture()
        this.postRecipe(this.recipe);
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
  input, select, textarea {
    color: var(--text-black-soft);
    padding: 0px 5px;
    border-radius: 5px;
  }

  textarea {
    width: 100%;
  }

  .extra-info {
    color: var(--text-black-soft);
  }


</style>
