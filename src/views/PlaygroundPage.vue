<template>
    <div class="flex flex-col items-center justify-center overflow-auto">
        <div class="flex pb-10">
            <h1>Playground Page</h1>
        </div>

        <div class="flex-1 flex-row text-center" v-if="recipe.recipeId">
            <label class="text-xl text-bold pb-15">Recipe View </label>
            <div class="pt-5">
                <label>{{ recipe.name }}</label>
            </div>
            <div class="flex flex-col pt-5">
                <div>Main Image</div>
                <img class="pb-3" v-if="recipe.mainImage" :src=setImage(recipe.mainImage) width="200" height="200"/>
            </div>
            <div class="pt-5" v-if="recipe.instructionSection">
                <label>Instruction Sections</label>
                <div v-for="(instruction, iIdx) in recipe.instructionSection" :key="iIdx">
                    <div class="flex flex-col pt-5">
                        <label>InstrctionSection Name</label>
                        <label>{{ instruction.sectionName }}</label>
                    </div>
                    <div class="flex flex-col pt-5">
                        <label>Image</label>
                        <img class="pb-3" v-if="instruction.image" :src=setImage(instruction.image) width="200" height="200"/>
                    </div>
                </div>
                
            </div>
            
        </div>     
        
    </div>
    
</template>

<script lang="ts">

    import { Recipe, Serving, IngredientSection, InstructionSection, NutritionFacts } from '@/models/recipeModel';
    import ThymeBackendAPI from '@/api/backend/thymebackend';
    import FirebaseConn from '@/api/firebase/firebaseConnection';
    
    export default {
        data() {
            return {
                recipe: {
                    recipeId: '',
                    name: '',
                    description: '',
                    serving: new Serving,
                    tags: [] as string[],
                    timeToPlate: 0,
                    mainImage: undefined,
                    images: '',
                    createdDate: '',
                    updatedDate: '',
                    ingredientSection: [] as IngredientSection[],
                    instructionSection: [],
                    nutritionFacts: new NutritionFacts,
                } as Recipe,
            }
        },

        created() {
            this.$nextTick(function () {
                this.getRecipe()
            })
        },

        updated() {
        },

        methods: {
            getRecipe() {
                const recipeIDTest = "2a7cff4b33c8a7de9d166434256c6061"
                ThymeBackendAPI.getRecipe(recipeIDTest).then( (recipe) => {
                    this.recipe = recipe
                    this.getImages()
                })
            },

            getImages() {
                FirebaseConn.getImage(this.recipe).then((updatedRecipe) => {
                    this.recipe = updatedRecipe
                })
            },

            setImage(imgString: Blob): any{
                return URL.createObjectURL(imgString) 
            }
        },

        
    }
        

</script>