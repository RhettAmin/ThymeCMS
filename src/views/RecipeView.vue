<template>
  <div class="flex flex-col place-items-center w-full">
    <h1 class="text-3xl pb-5 text-center">Update Recipe</h1>

    <form class="divide-y divide-black w-[65%]" @submit.prevent>

      <div class="flex flex-row divide-x divide-black p-2">
        <div class="w-2/4 px-2">
          <div class="flex flex-col pb-3">
            <label class="label font-medium">Name</label>
            <input class="input" type="text" v-model="recipe.name">
          </div>

          <div class="flex flex-row space-x-4">
            <div class="flex flex-col pb-3">
              <label class="label font-medium">Total Servings</label>
              <input class="" type="number" v-model="recipe.serving.totalServings">
            </div>  

            <div class="flex flex-col pb-3">
              <label class="label font-medium">Serving Size</label>
              <div class="flex flex-row space-x-4">
                <input class="w-1/4" type="number" v-model="recipe.serving.servingSize">
                <input class="w-3/4" type="text" v-model="recipe.serving.amount">  
              </div>
            </div>  
          </div>

          <div class="flex flex-col pb-3">
            <label class="label font-medium">Tags</label>
            <input class="input" type="text" @blur="onTagBlurOut" v-model="recipe.tags">
            <p class="extra-info">seperate tags with commas (",")</p>
          </div> 

          <div class="flex flex-row space-x-4">
            <div class="flex flex-col pb-3">
                <label class="label font-medium">Time to Plate (Minutes)</label>
                <input class="input" type="number" v-model="recipe.timeToPlate">
            </div>
            <div class="flex flex-col pb-3">
                <label class="label font-medium">Time to Plate (Display)</label>
                <label>{{ convertMinutesToHourNotation(recipe.timeToPlate) }}</label>
            </div>
            </div>
        </div>
        
        <div class="flex flex-row pl-2">
            <div class="flex flex-col space-y-2">
                <div class="flex flex-col">
                    <label class="label font-medium">Main Image</label>
                    <input class="input" type="file" @change="changeMainImage">
                </div>
                <div id="preview">
                    <img class="pb-3" v-if="recipe.mainImage?.imageFileRef" :src="setImage(recipe.mainImage.imageFileRef)" width="200"/>
                </div>
            </div>
            <div class="flex flex-col space-y-2">
                <div class="flex flex-col">
                    <label class="label font-medium">Hero Image</label>
                    <input class="input" type="file" @change="changeHeroImage">
                </div>
                <div id="preview">
                    <img class="pb-3" v-if="recipe.heroImage?.imageFileRef" :src="setImage(recipe.heroImage.imageFileRef)" width="200"/>
                </div>
            </div>
        </div>
      </div>

      <div class="flex flex-col p-4 space-y-1">
          <label class="font-medium text-lg">Description</label>
          <textarea v-model="recipe.description" rows="4"></textarea>
      </div> 

      <!-- INGREDIENTS START -->
      <div class="p-4">
        <h2 class="pb-3 text-xl">Ingredients</h2>
        
        <div class="flex flex-row space-x-3 px-5 py-2 " v-for="(ingredientSection, idx) in recipe.ingredientSection" :key="idx">
          <div id="SectionContainer" class="border rounded bg-green-100 p-2 w-full">

            <div class="pb-2 relative">
              <label class="pr-2">Section Name</label>
              <input class="text-black my-[-2px]" type="text" v-model="ingredientSection.sectionName">
              <font-awesome-icon v-on:click="removeIngredientSection(idx)" 
                class="bg-red-300 w-5 h-5 rounded-md absolute right-0 cursor-pointer" icon="fa-solid fa-minus" />
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
                <div class="">
                  <label class="">Type</label>
                  <div class="control">
                    <select v-model="ingredient.type">
                      <option value="0">none(ie. cloves, medium)</option>
                      <option value="1">weight(oz, lb)</option>
                      <option value="2">volume(tsp, tbsp, cup)</option>
                    </select>
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

        <div class="my-2 flex justify-center">
          <label class="rounded border p-1 bg-green-400 cursor-pointer" v-on:click="addIngredientSection">Add Ingredient Group</label>
        </div>

      </div>

      <!-- INGREDIENTS END -->

      <!-- INSTRUCTIONS END -->  
      <div class="p-4">
        <div class="flex flex-row gap-3">
          <h2 class="pb-3 text-xl">Instructions</h2>
        </div>

        <div class="flex flex-row space-x-3 px-5 py-2" v-for="(instructionSection, iIdx) in recipe.instructionSection" :key="iIdx">
          <div id="SectionContainer" class="border rounded bg-green-100 p-2 w-full">

            <div class="pb-2 relative"> 
              <label class="pr-2" placeholder="Section Name">Section Name</label>
              <input class="my-[-2px]" type="text" v-model="instructionSection.sectionName"
                 @blur="updateInstructImageRefOnSectionNameChange(iIdx, instructionSection.sectionName )">
              <font-awesome-icon v-on:click="removeInstructionSection(iIdx)" 
                class="bg-red-300 w-5 h-5 rounded-md absolute right-0 cursor-pointer" icon="fa-solid fa-minus" />
            </div>

            <div class="flex flex-col space-y-4">
              <div class="flex flex-row">
                <div class="flex flex-col">
                  <label class="label">Section Image</label>
                  <input class="input" type="file" @change="onInstructionImageChange(iIdx, $event)">
                </div>
                
              </div> 
              <div id="preview">
                <img class="pb-3" v-if="instructionSection.image?.imageFileRef" :src="setImage(instructionSection.image.imageFileRef)" width="200"/>
              </div>
            </div>

            <div id="ingredientsContainer" class="flex flex-col" >
              <div class="space-x-3 py-2">
                <label class="">Section Instructions</label> 
                <label class="rounded border p-1 text-blue bg-green-400 cursor-pointer" v-on:click="addInstruction(instructionSection)">Add Instructions</label>
              </div>
              
            <div class="flex items-center pl-5 py-2" v-for="(step, idx) in instructionSection.steps" :key="idx">
                <h3 class="pr-3">{{ idx+1 }}</h3>
                <textarea class="w-full" v-model="instructionSection.steps[idx]"></textarea>
                <font-awesome-icon v-on:click="removeInstruction(instructionSection, idx)" class="bg-red-300 w-5 h-5 ml-2 rounded-md" icon="fa-solid fa-minus" />
            </div>
          </div>

          </div>
        </div>
          
        <div class="my-2 flex justify-center">
          <label class="rounded border p-1 bg-green-400 cursor-pointer" v-on:click="addInstructionSection">Add Instruction Group</label>
        </div>
      </div>
      <!-- INSTRUCTIONS END -->

      <!-- Nutriftion Facts -->
      <div class="p-4">
        <div class="flex flex-col justify-center px-44">
          <div class="pb-2 flex justify-center">
            <label class="rounded border p-1 bg-blue-400 cursor-pointer" v-on:click="calculateNutritionValues">Calculate Nutrition Values</label>
          </div>
          <div v-if="isThereNutritionErrors" class="flex flex-col space-y-4 pb-2">
            <label class="bg-red-300" v-for="(issue, idx) in nutritionErrors" :key="idx"> {{ issue }}</label>
          </div>
          <NutritionFactsLabel ref="nutriFactLabel"/>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="flex flex-col py-2 px-4">
        <div v-if="isSubmitting"> 
          <ProgressBar ref="progressBar" />
        </div>
        <button @click="submit" class="rounded-lg py-4 px-2 w-full bg-green-800 text-slate-50 mt-5 hover:border-2">Update Recipe</button>
      </div>
    </form>

  </div>
</template>


<script lang="ts">
    import { Recipe, Serving, IngredientSection, Ingredient, InstructionSection, NutritionFacts, MainImageRef, InstructionImageRef } from '@/models/recipeModel';
    import ThymeBackendAPI from '@/api/backend/thymebackend';
    import FirebaseConn from '@/api/firebase/firebaseConnection';
    import NutritionFactsLabel from '@/components/NutritionFactsLabel.vue';
    import ProgressBar from '@/components/ProgressBar.vue';
    import Toaster from "@/components/toast";
    import JSZip from 'jszip';
    import { Md5 } from 'ts-md5';
    import { ref } from 'vue';

    export default {
        components: {
            NutritionFactsLabel, ProgressBar
        },
        data() {
            return {
                id: '',
                posts:null,
                mainImageRef: new MainImageRef,
                heroImageRef: new MainImageRef,
                zip: new JSZip,
                nutriLabel: ref(NutritionFactsLabel),
                progressBar: ref(ProgressBar),
                listOfInstructionImages: [] as InstructionImageRef[],
                isSubmitting: false,
                isThereNutritionErrors: false,
                nutritionErrors: [],
                recipe: {
                    recipeId: '',
                    name: '',
                    description: '',
                    images: '',
                    heroImage: undefined,
                    mainImage: undefined,
                    tags: [] as string[],
                    serving: new Serving,
                    timeToPlate: 0,
                    ingredientSection: [] as IngredientSection[],
                    instructionSection: [] as InstructionSection[],
                    nutritionFacts: new NutritionFacts()
                } as Recipe,
            }
        },

        methods: {

            changeMainImage(event: any) {
                const file = event.target.files[0];
                this.recipe.mainImage!!.imageFileRef = file
                // this.mainImageRef.imageFileRef = file
                // // set Reference img display after file upload
                // this.mainImageRef.imageURLPreview = URL.createObjectURL(file)
            },

            changeHeroImage(event: any) {
                const file = event.target.files[0];
                if (this.recipe.heroImage == undefined) {
                  this.recipe.heroImage = new MainImageRef
                }
                this.recipe.heroImage!!.imageFileRef = file
                // // set Reference img display after file upload
                // this.heroImageRef.imageURLPreview = URL.createObjectURL(file)
                // this.recipe.heroImage = file
            },

            setHeroImage(imgString: File): any {
              if (this.heroImageRef.imageFileRef == null) {
                this.setImage(imgString)
              } else {
                this.setImage(this.heroImageRef.imageFileRef)
              }
            },

            setImage(imgString: File): any {
              return URL.createObjectURL(imgString)
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
                // Create Instruction Section
                let instructionSection = new InstructionSection();
                // Add an imageRef to the list of Image Refs
                let imageRef = new InstructionImageRef
                imageRef.index = this.recipe.instructionSection.length
                // instructionSection.image = imageRef
                // this.listOfInstructionImages.push(imageRef)
                // Add instructionSection to the list
                this.recipe.instructionSection.push(instructionSection)
            },

            updateInstructImageRefOnSectionNameChange(index: number, name: string) {
                this.recipe.instructionSection[index].sectionName = name
            },

            onInstructionImageChange(index: number, file: any) {
                const imageFile = file.target.files[0]; 
                console.log(this.recipe.instructionSection[index])
                if (this.recipe.instructionSection[index].image?.imageFileRef == undefined) {
                  this.recipe.instructionSection[index].image = new InstructionImageRef
                  this.recipe.instructionSection[index].image!!.index = index
                }
                this.recipe.instructionSection[index].image!!.imageFileRef = imageFile
                this.recipe.instructionSection[index].image!!.imageName = imageFile.name
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

            // =============== NutritionLabel ==============
            calculateNutritionValues() {
                (this.$refs['nutriFactLabel'] as typeof NutritionFactsLabel)
                  .updateFactsTable(this.recipe.ingredientSection, this.recipe.serving).then( (responseTuple: any) => {
                    this.recipe.nutritionFacts = responseTuple[0]

                    if (responseTuple[1].length > 0) {
                      this.isThereNutritionErrors = true
                      this.nutritionErrors = responseTuple[1]
                      Toaster.toastError("couldn't find the following foods: " + responseTuple[1])
                    }
                })
            },

            setTable() {
              (this.$refs['nutriFactLabel'] as typeof NutritionFactsLabel).setup(this.recipe.nutritionFacts, this.recipe.serving)
            },

            // ====================  Recipe Upload Calls  =====================================

            async submit() {
                this.renderProgressBar().then( () => {

                  this.updateStep("checking ID")
                  this.updateProgress(30)
                  
                  this.updateStep("Uploading Images")
                  this.updateProgress(0)

                  // Upload Images to Firebase
                  this.uploadImages().then( () => {

                    this.updateStep("Uploading Recipe")
                    this.updateProgress(50)

                    // Post Recipe 
                    ThymeBackendAPI.updateRecipe(this.recipe).then( () => {
                      this.updateStep("Uploading Complete!")
                      this.updateProgress(100)
                     // setTimeout(function() {window.location.reload()}, 2000)
                    })
                  })

                })
                .catch((err) => {
                  Toaster.toastError(err)
                });
            },

            async renderProgressBar() {
                return await new Promise<void>( (resolve) => {
                  this.isSubmitting = true 
                  resolve()
                })
            },

            async checkIfIdExists() {
                return await new Promise<string>( (resolve, reject) => {
                  // Generate hashed ID from Recipe Name
                  let hashedId = Md5.hashStr(this.recipe.name)
                  this.updateProgress(50)

                  ThymeBackendAPI.doesRecipeExist(hashedId).then( () => {
                      this.updateProgress(100)
                      resolve(hashedId)
                  }).catch(() => {
                      reject("Recipe Exists!")
                  })
                })
            },

            convertMinutesToHourNotation(timeInMinutes: number) {
                if (timeInMinutes < 60) {
                    return `00:${timeInMinutes}`
                }
                const hours = Math.floor(timeInMinutes / 60)
                const minutes = timeInMinutes % 60 == 0 ? '00' : timeInMinutes % 60 
                return `${hours}:${minutes}`
            },

            async uploadImages() {
                return await new Promise<void>( (resolve) => {
                  let imageFolder = this.zip.folder(this.recipe.recipeId)

                  // Add Main Image
                  imageFolder?.file("main_"+this.recipe.mainImage!!.imageName, this.recipe.mainImage!!.imageFileRef)

                  // Add Hero Image
                  imageFolder?.file("hero_"+this.recipe.heroImage!!.imageName, this.recipe.heroImage!!.imageFileRef)

                  // Add InstructionImages if they exist
                  this.recipe.instructionSection.forEach( (instructionSection) => {
                      if (instructionSection.image?.imageFileRef != undefined) {
                        imageFolder?.file(instructionSection.image.index + "_" + instructionSection.image.imageName, instructionSection.image.imageFileRef)
                      }
                  })

                  this.listOfInstructionImages.forEach( instructionImage => {
                    if (instructionImage.imageFileRef != null) {
                      imageFolder?.file(instructionImage.index + "_" + instructionImage.imageFileRef.name, instructionImage.imageFileRef)
                    }
                  })
                  console.log(imageFolder)
                  let _this = this
                  this.zip.generateAsync({type:"blob"}).then(function(content) {
                    const location = _this.recipe.name.replace(/ /g, '-') + "_" + _this.recipe.recipeId + ".zip"
                    FirebaseConn.uploadImage(location, content, (_this.$refs['progressBar'] as typeof ProgressBar)).then((imageURL) => {
                        _this.recipe.images = imageURL
                        resolve()
                    })
                  })
                })
            },

            async postRecipe(recipe: Recipe) {
                return await new Promise<void>( (resolve) => {
                  ThymeBackendAPI.postRecipe(recipe)
                  resolve()
                })
            },

            // ================= Progress Bar =====================
            updateStep(value: string) {
              (this.$refs['progressBar'] as typeof ProgressBar).updateStep(value)
            },
            updateProgress(value: number) {
              (this.$refs['progressBar'] as typeof ProgressBar).updateProgress(value)
            }
      
        },

        mounted() {
            this.id = this.$route.query.id?.toString()!!
            ThymeBackendAPI.getRecipe(this.id).then((backendResponse) => {
              FirebaseConn.getImage(backendResponse[0]).then((response) => {
                this.recipe = response
                this.setTable()                  
              })
            })
        }
    }

</script>