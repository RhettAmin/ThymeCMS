import { Md5 } from 'ts-md5'
import axios from 'axios'
import { Ingredient, IngredientSectionModel, InstructionSectionModel, RecipeModel } from '../../models/recipeModels'
import { RecipeDTO, IngredientSectionDTO, IngredientDTO, InstructionSectionDTO } from '../../models/recipeMongo'

const thymeAxios = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
})

const generateID = (recipeName: string) => {
    return Md5.hashStr(recipeName)
}

const doesRecipeExist = async (recipeName: string) => {
    return await new Promise<boolean | string>( (resolve, reject) => {
        thymeAxios.get('/recipes', {
            params: {
                recipeId: generateID(recipeName)
            }
        })
        .then(response => {
            if (response.data.status_code == '404') { // Recipe does not exist
                resolve(true)
            } else {
                reject(false)
            }    
        })
        .catch(error => {
            console.log(error)
            reject(error)
        }) 
    })
}

const getRecipe = async (recipeId?: string) => {
    return await new Promise<RecipeModel>( (resolve, reject) => {
        thymeAxios.get('/recipes', {
            params: {
                recipeId: recipeId
            }
        })
        .then(response => {
            console.log("Response from API: ", response.data)
            // We're getting a single recipe here, the API call returns it as a list so we grab the first value
            const responseObj: RecipeDTO = response.data.recipe_list[0] 

            convertRecipeDTOToRecipe(responseObj).then((recipeObj) => {
                resolve(recipeObj)
            })
        })
        .catch(error => {
            console.log(error)
            reject()
        }); 
    })
}

const postRecipe = async (recipe: RecipeModel) => {
    return await new Promise<void>( (resolve, reject) => {
        console.log("recipe uploading:")
        console.log(recipe)

        let postingRecipe: RecipeDTO | undefined = undefined
        convertRecipeToRecipeDTO(recipe).then((response) => {
            postingRecipe = response
            console.log(postingRecipe)
            if (postingRecipe) {
                thymeAxios.post(
                    '/recipes', 
                    postingRecipe
                )
                .then(response => {
                    console.log(response)
                    resolve()
                })
                .catch(error => {
                    // your action on error success
                    console.error(error)
                })
            }
        }).catch((error) => {
            console.log(error)
            reject(error)
        })
    })
}

const convertRecipeToRecipeDTO = async(recipe: RecipeModel) => {
    return await new Promise<RecipeDTO>((resolve) => {
        const recipeDTO = new RecipeDTO

        recipeDTO.recipe_id = generateID(recipe.recipeName)
        recipeDTO.name = recipe.recipeName
        recipeDTO.description = recipe.description

        // Serving
        recipeDTO.serving.form = recipe.servingForm
        recipeDTO.serving.serving_size = recipe.servingSize
        recipeDTO.serving.total_servings = recipe.totalServings

        recipeDTO.tags = recipe.tags
        recipeDTO.time_to_plate = recipe.timeToPlate
        recipeDTO.created_date = new Date().toISOString().split('T')[0]
        recipeDTO.updated_date = new Date().toISOString().split('T')[0]

        const ing_Sections: IngredientSectionDTO[] = []
        // Ingredient Section
        recipe.ingredientSections.forEach((section) => {
            const i_section = new IngredientSectionDTO()
            
            i_section.section_name = section.sectionName

            section.ingredients.forEach((ing) => {
                const ingredient = new IngredientDTO()

                ingredient.name = ing.name
                ingredient.measurement = ing.measurement
                ingredient.quantity = ing.quantity
                ingredient.type = ing.type

                i_section.ingredients.push(ingredient)
            })

            ing_Sections.push(i_section)
        })
        recipeDTO.ingredient_section = ing_Sections

        const instr_section: InstructionSectionDTO[] = []
        
        // Instruction Section
        recipe.instructionSections.forEach((section) => {
            const i_section = new InstructionSectionDTO()
            
            i_section.section_name = section.sectionName
            
            const steps: string[] = []
            section.steps.forEach((step) => {
                steps.push(step)
            })
            i_section.steps = steps
            instr_section.push(i_section)
        })
        recipeDTO.instruction_section = instr_section

        // NutritionFacts
        recipeDTO.nutrition_facts.calcium = recipe.nutritionFacts.calcium
        recipeDTO.nutrition_facts.calories = recipe.nutritionFacts.calories
        recipeDTO.nutrition_facts.carbohydrate = recipe.nutritionFacts.carbohydrate
        recipeDTO.nutrition_facts.cholesterol = recipe.nutritionFacts.cholesterol
        recipeDTO.nutrition_facts.fat = recipe.nutritionFacts.fat
        recipeDTO.nutrition_facts.fibre = recipe.nutritionFacts.fibre
        recipeDTO.nutrition_facts.iron = recipe.nutritionFacts.iron
        recipeDTO.nutrition_facts.potassium = recipe.nutritionFacts.potassium
        recipeDTO.nutrition_facts.protein = recipe.nutritionFacts.protein
        recipeDTO.nutrition_facts.saturated_fat = recipe.nutritionFacts.saturatedFat
        recipeDTO.nutrition_facts.sodium = recipe.nutritionFacts.sodium
        recipeDTO.nutrition_facts.sugars = recipe.nutritionFacts.sugars
        recipeDTO.nutrition_facts.trans_fat = recipe.nutritionFacts.transFat
        recipeDTO.nutrition_facts.vitamin_d = recipe.nutritionFacts.vitamind

        resolve(recipeDTO)

    })
}

const convertRecipeDTOToRecipe = async(recipeDTO: RecipeDTO) => {
    return await new Promise<RecipeModel>((resolve) => {
        const recipe = new RecipeModel()

        recipe.recipeName = recipeDTO.name
        recipe.description = recipeDTO.description

        // Serving
        recipe.servingForm = recipeDTO.serving.form
        recipe.servingSize = recipeDTO.serving.serving_size
        recipe.totalServings = recipeDTO.serving.total_servings

        recipe.tags = recipeDTO.tags
        recipe.timeToPlate = recipeDTO.time_to_plate
        recipe.createdDate = recipeDTO.created_date
        recipe.updatedDate = recipeDTO.updated_date

        const ingSections: IngredientSectionModel[] = []
        // Ingredient Section
        if (recipeDTO.ingredient_section) {
            recipeDTO.ingredient_section.forEach((section) => {
                const iSection = new IngredientSectionModel()
                
                iSection.sectionName = section.section_name

                section.ingredients.forEach((ing) => {
                    const ingredient = new Ingredient("", 0, "", 0)

                    ingredient.name = ing.name
                    ingredient.measurement = ing.measurement
                    ingredient.quantity = ing.quantity
                    ingredient.type = ing.type

                    iSection.ingredients.push(ingredient)
                })

                ingSections.push(iSection)
            })
            recipe.ingredientSections = ingSections
        }

        const instrSection: InstructionSectionModel[] = []
        // Instruction Section
        if (recipeDTO.instruction_section) {
            recipeDTO.instruction_section.forEach((section) => {
                const iSection = new InstructionSectionModel()
                
                iSection.sectionName = section.section_name

                const steps: string[] = []
                section.steps.forEach((step) => {
                    steps.push(step)
                })
                iSection.steps = steps
                instrSection.push(iSection)
            })
            recipe.instructionSections = instrSection
        }

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
        recipe.nutritionFacts.vitamind = recipeDTO.nutrition_facts.vitamin_d

        resolve(recipe)

    })
}


const BackendAPI = {
    generateID, doesRecipeExist, postRecipe, getRecipe
}

export default BackendAPI