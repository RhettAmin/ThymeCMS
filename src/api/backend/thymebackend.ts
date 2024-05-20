import { RecipeDTO } from '@/models/recipeDTO'; 
import { Recipe, IngredientSection, Ingredient, InstructionSection } from '@/models/recipeModel'; 
import { Response } from '@/models/responseModel'
import snakecaseKeys from 'snakecase-keys'
import camelcaseKeys from 'camelcase-keys'
import Toaster from "@/components/toast";
import axios from 'axios'
 

const thymeAxios = axios.create({
    baseURL: 'http://localhost:9292',
})

async function doesRecipeExist(hashedId: string) {
    return await new Promise<void>( (resolve, reject) => {
        thymeAxios.get('/recipes', {
            params: {
                recipeId: hashedId
            }
        })
        .then(response => {
            const responseobj = response
            if (responseobj.data.status_code == '404') {
                Toaster.toastInfo("Recipe doesn't exist. Creating new one...")  
                resolve()
            } else {
                reject()
            }    
        })
        .catch(error => {
            console.log(error)
            reject()
        }); 
    })
}

async function getRecipe(recipeId: string) {
    return await new Promise<Recipe>( (resolve, reject) => {
        thymeAxios.get('/recipes', {
            params: {
                recipeId: recipeId
            }
        })
        .then(response => {
            const responseObj: Response = response.data
            //console.log(responseObj)

            let recipe = new Recipe
            convertRecipeDTOToRecipe(responseObj.recipe_list[0]).then((recipeObj) => {
                recipe = recipeObj
                resolve(recipe)
            })
        })
        .catch(error => {
            console.log(error)
            reject()
        }); 
    })
}



async function postRecipe(recipe: Recipe) {
    return await new Promise<void>( (resolve) => {
        console.log("recipe uploading:")
        console.log(recipe)
        // Setup Interceptor
        const requestInterceptor = thymeAxios.interceptors.request.use(function (config) {
            config.data = JSON.stringify(snakecaseKeys(config.data, { deep: true }))
            return config
        })

        thymeAxios.post(
            '/recipes', 
            recipe
        )
        .then(response => {
            console.log(response)
            Toaster.toastSuccess("Recipe Uploaded!")
            resolve()
        })
        .catch(error => {
            // your action on error success
            Toaster.toastError("Error uploading to backend!!")
            console.error(error)
        })

        // remove interceptor
        axios.interceptors.request.eject(requestInterceptor)
    })
}

async function convertRecipeDTOToRecipe(recipeDTO: RecipeDTO) {
    return await new Promise<Recipe>((resolve) => {
        const recipe = new Recipe

        recipe.recipeId = recipeDTO.recipe_id
        recipe.name = recipeDTO.name
        recipe.description = recipeDTO.description
        // Serving
        recipe.serving.amount = recipeDTO.serving.amount
        recipe.serving.servingSize = recipeDTO.serving.serving_size
        recipe.serving.totalServings = recipeDTO.serving.total_servings

        recipe.tags = recipeDTO.tags
        recipe.timeToPlate = recipeDTO.time_to_plate
        recipe.images = recipeDTO.images
        recipe.createdDate = recipeDTO.created_date
        recipe.updatedDate = recipeDTO.updated_date

        const ingSections: IngredientSection[] = []
        // Ingredient Section
        recipeDTO.ingredient_section.forEach((section) => {
            const iSection = new IngredientSection
            
            iSection.sectionName = section.section_name

            section.ingredients.forEach((ing) => {
                const ingredient = new Ingredient

                ingredient.name = ing.name
                ingredient.measurement = ing.measurement
                ingredient.quantity = ing.quantity

                iSection.ingredients.push(ingredient)
            })

            ingSections.push(iSection)
        })
        recipe.ingredientSection = ingSections

        const instrSection: InstructionSection[] = []
        
        // Instruction Section
        recipeDTO.instruction_section.forEach((section) => {
            const iSection = new InstructionSection
            
            iSection.sectionName = section.section_name
            const steps: string[] = []
            section.steps.forEach((step) => {
                steps.push(step)
            })

            instrSection.push(iSection)
        })
        recipe.instructionSection = instrSection

        // NutritionFacts
        recipe.nutritionFacts.calcium = recipeDTO.nutrition_facts.calcium
        recipe.nutritionFacts.calories = recipeDTO.nutrition_facts.calories
        recipe.nutritionFacts.carbohydrate = recipeDTO.nutrition_facts.carbohydrate
        recipe.nutritionFacts.cholesterol = recipeDTO.nutrition_facts.cholesterol
        recipe.nutritionFacts.fat = recipeDTO.nutrition_facts.fat
        recipe.nutritionFacts.fibre = recipeDTO.nutrition_facts.fibre
        recipe.nutritionFacts.iron = recipeDTO.nutrition_facts.iron
        recipe.nutritionFacts.potassium = recipeDTO.nutrition_facts.potassium
        recipe.nutritionFacts.protein = recipeDTO.nutrition_facts.protein
        recipe.nutritionFacts.saturatedFat = recipeDTO.nutrition_facts.saturated_fat
        recipe.nutritionFacts.sodium = recipeDTO.nutrition_facts.sodium
        recipe.nutritionFacts.sugars = recipeDTO.nutrition_facts.sugars
        recipe.nutritionFacts.transFat = recipeDTO.nutrition_facts.trans_fat
        recipe.nutritionFacts.vitaminD = recipeDTO.nutrition_facts.vitamin_d

        resolve(recipe)

    })
}

const ThymeBackendAPI = {
    doesRecipeExist, postRecipe, getRecipe
}

export default ThymeBackendAPI