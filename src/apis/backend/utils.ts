import { Ingredient, IngredientSectionControls, IngredientSectionModel, InstructionSectionModel, NutritionFacts, RecipeModel } from "@/models/recipeModels"
import { IngredientDTO, IngredientSectionDTO, InstructionSectionDTO, RecipeDTO } from "@/models/recipeMongo"
import { Md5 } from "ts-md5"


export const generateID = (recipeName: string) => {
    return Md5.hashStr(recipeName)
}

export type DoesRecipeExistOuput = {
    exists: boolean,
    recipe: RecipeModel | null
}

export const convertRecipeToRecipeDTO = async(recipe: RecipeModel) => {
    try {
        const recipeDTO = new RecipeDTO()

        recipeDTO.recipe_id = generateID(recipe.recipeName)
        recipeDTO.name = recipe.recipeName
        recipeDTO.description = recipe.description
        recipeDTO.is_active = recipe.isActive

        // Main Images
        recipeDTO.hero_image_link = recipe.heroImageLink
        recipeDTO.main_image_link = recipe.mainImageLink

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
        recipe.ingredientSections.forEach((section: IngredientSectionModel) => {
            const i_section = new IngredientSectionDTO()
            
            i_section.section_name = section.sectionName

            section.ingredients.forEach((ing: Ingredient) => {
                const ingredient = new IngredientDTO()

                ingredient.name = ing.name
                ingredient.fdcid = ing.fdcid
                ingredient.measurement = ing.measurement
                ingredient.quantity = ing.quantity
                ingredient.type = ing.type
                ingredient.nutrients = {
                    ...ingredient.nutrients,
                    saturated_fat: ing.nutrients.saturatedFat,
                    trans_fat: ing.nutrients.transFat,
                    vitamin_d: ing.nutrients.vitamind
                }

                i_section.ingredients.push(ingredient)
            })

            ing_Sections.push(i_section)
        })
        recipeDTO.ingredient_section = ing_Sections

        const instr_section: InstructionSectionDTO[] = []
        
        // Instruction Section
        console.info("Converting Instructions to InstructionDTO")
        recipe.instructionSections.forEach((section) => {
            const i_section = new InstructionSectionDTO()
            
            i_section.section_name = section.sectionName
            i_section.image_link = section.image
            
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

        return await recipeDTO
    } catch (err) {
        console.error(err)
        throw err
    }
}

export const convertRecipeDTOToRecipe = async(recipeDTO: RecipeDTO) => {
    try {
        const recipe = new RecipeModel()

        recipe.recipeName = recipeDTO.name
        recipe.description = recipeDTO.description
        recipe.isActive = recipeDTO.is_active ? recipeDTO.is_active : false

        // Main Images
        recipe.heroImageLink = recipeDTO.hero_image_link 
        recipe.mainImageLink = recipeDTO.main_image_link 

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
            recipeDTO.ingredient_section.forEach((section: IngredientSectionDTO) => {
                const iSection = new IngredientSectionModel()
                const control = new IngredientSectionControls()

                iSection.sectionName = section.section_name

                section.ingredients.forEach((ing: IngredientDTO) => {
                    const ingredient = new Ingredient("", 0, "", 0)
                    
                    ingredient.name = ing.name
                    ingredient.fdcid = ing.fdcid
                    ingredient.measurement = ing.measurement
                    ingredient.quantity = ing.quantity
                    ingredient.type = ing.type
                    if (ing.nutrients) {
                        ingredient.nutrients = {
                            ...ing.nutrients,
                            saturatedFat: ing.nutrients.saturated_fat,
                            transFat: ing.nutrients.trans_fat,
                            vitamind: ing.nutrients.vitamin_d
                        }
                    } else {
                        ingredient.nutrients = new NutritionFacts()
                    }

                    iSection.ingredients.push(ingredient)

                    control.micronutrientDisplay.push({ingredient: ingredient.name, shouldDisplayMicronutrients: false})
                })
                iSection.controls = control
                ingSections.push(iSection)
            })
            recipe.ingredientSections = ingSections
        }

        const instrSection: InstructionSectionModel[] = []
        // Instruction Section
        console.info("Converting InstructionsDTO to Instruction")
        if (recipeDTO.instruction_section) {
            recipeDTO.instruction_section.forEach((section) => {
                const iSection = new InstructionSectionModel()
                
                iSection.sectionName = section.section_name
                iSection.image = section.image_link

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

        return await recipe

    } catch (err) {
        console.error(err)
        throw err
    }
}