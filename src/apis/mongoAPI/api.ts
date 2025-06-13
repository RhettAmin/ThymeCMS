import { Md5 } from 'ts-md5';
import axios from 'axios'
import { RecipeModel } from '../../models/recipeModels';
import { RecipeDTO } from '../../models/recipeMongo'

const thymeAxios = axios.create({
    baseURL: 'http://localhost:9292',
})

const generateID = (recipeName: string) => {
    return Md5.hashStr(recipeName)
}

const doesRecipeExist = async (id: string) => {
    return await new Promise<boolean | string>( (resolve, reject) => {
        thymeAxios.get('/recipes', {
            params: {
                recipeId: id
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
        }); 
    })
}

const postRecipe = async (recipe: RecipeModel) => {
    return await new Promise<void>( (resolve) => {
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
                    // Toaster.toastSuccess("Recipe Uploaded!")
                    resolve()
                })
                .catch(error => {
                    // your action on error success
                    // Toaster.toastError("Error uploading to backend!!")
                    console.error(error)
                })
            }
        }).catch((error) => {
            console.log(error)
        })
    })
}

const convertRecipeToRecipeDTO = async(recipe: RecipeModel) => {
    return await new Promise<RecipeDTO>((resolve) => {
        const recipeDTO = new RecipeDTO

        recipeDTO.recipe_id = recipe.recipeId
        recipeDTO.name = recipe.name
        recipeDTO.description = recipe.description

        // Metadata
        recipeDTO.metadata.main_image_alt_text = recipe.metadata.mainImageAltText

        // Serving
        recipeDTO.serving.amount = recipe.serving.amount
        recipeDTO.serving.serving_size = recipe.serving.servingSize
        recipeDTO.serving.total_servings = recipe.serving.totalServings

        recipeDTO.tags = recipe.tags
        recipeDTO.time_to_plate = recipe.timeToPlate
        recipeDTO.images = recipe.images
        recipeDTO.created_date = recipe.createdDate
        recipeDTO.updated_date = recipe.updatedDate

        const ing_Sections: IngredientSectionDTO[] = []
        // Ingredient Section
        recipe.ingredientSection.forEach((section) => {
            const i_section = new IngredientSectionDTO
            
            i_section.section_name = section.sectionName

            section.ingredients.forEach((ing) => {
                const ingredient = new IngredientDTO

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
        recipe.instructionSection.forEach((section) => {
            const i_section = new InstructionSectionDTO
            
            i_section.section_name = section.sectionName
            i_section.metadata.alt_text = section.metadata.altText
            
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
        recipeDTO.nutrition_facts.vitamin_d = recipe.nutritionFacts.vitaminD

        resolve(recipeDTO)

    })
}

const convertRecipeDTOToRecipe = async(recipeDTO: RecipeDTO) => {
    return await new Promise<RecipeModel>((resolve) => {
        const recipe = new Recipe

        recipe.recipeId = recipeDTO.recipe_id
        recipe.name = recipeDTO.name
        recipe.description = recipeDTO.description

        // Metadata
        recipe.metadata.mainImageAltText = recipeDTO.metadata.main_image_alt_text

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
        if (recipeDTO.ingredient_section) {
            recipeDTO.ingredient_section.forEach((section) => {
                const iSection = new IngredientSection
                
                iSection.sectionName = section.section_name

                section.ingredients.forEach((ing) => {
                    const ingredient = new Ingredient

                    ingredient.name = ing.name
                    ingredient.measurement = ing.measurement
                    ingredient.quantity = ing.quantity
                    ingredient.type = ing.type

                    iSection.ingredients.push(ingredient)
                })

                ingSections.push(iSection)
            })
            recipe.ingredientSection = ingSections
        }

        const instrSection: InstructionSection[] = []
        // Instruction Section
        if (recipeDTO.instruction_section) {
            recipeDTO.instruction_section.forEach((section) => {
                const iSection = new InstructionSection
                
                iSection.sectionName = section.section_name
                iSection.metadata.altText = section.metadata.alt_text

                const steps: string[] = []
                section.steps.forEach((step) => {
                    steps.push(step)
                })
                iSection.steps = steps
                instrSection.push(iSection)
            })
            recipe.instructionSection = instrSection
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
        recipe.nutritionFacts.vitaminD = recipeDTO.nutrition_facts.vitamin_d

        resolve(recipe)

    })
}


const MongoAPI = {
    generateID, doesRecipeExist, postRecipe
}

export default MongoAPI