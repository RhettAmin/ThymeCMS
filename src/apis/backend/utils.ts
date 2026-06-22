import { Ingredient, IngredientSectionControls, IngredientSectionModel, 
    InstructionSectionModel, InstructionSteps, RecipeModel
} from "@/models/recipeModels"
import { IngredientDTO, IngredientSectionDTO, InstructionSectionDTO, RecipeBaseDTO, RecipeDTO, Steps } from "@/models/recipeDB"
import { v5 as uuidv5 } from 'uuid'


export const generateID = (recipeName: string) => {
    const THYME_NAMESPACE = "1f0bdcf7-7bb0-5307-b10e-1dce378d1473";
    return uuidv5(recipeName, THYME_NAMESPACE)
}

export type DoesRecipeExistOuput = {
    exists: boolean,
    recipe: RecipeModel | null
}

export const convertRecipeToRecipeDTO = async(recipe: RecipeModel) => {
    try {
        const recipeDTO = new RecipeDTO()

        recipeDTO.recipe_id = generateID(recipe.name)
        recipeDTO.name = recipe.name
        recipeDTO.description = recipe.description

        // Main Images
        recipeDTO.hero_image_link = recipe.heroImageLink
        recipeDTO.main_image_link = recipe.mainImageLink

        // Serving
        recipeDTO.serving_form = recipe.servingForm
        recipeDTO.serving_size = recipe.servingSize
        recipeDTO.total_servings = recipe.totalServings

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
                ingredient.measurement = ing.measurement
                ingredient.quantity = ing.quantity
                ingredient.conversion_type = ing.conversionType
                ingredient.gram_weight = ing.gramWeight
                ingredient.calories = ing.calories
                ingredient.fat = ing.fat
                ingredient.saturated_fat = ing.saturatedFat
                ingredient.trans_fat = ing.transFat
                ingredient.carbohydrate = ing.carbohydrate
                ingredient.fibre = ing.fibre
                ingredient.sugars = ing.sugars
                ingredient.protein = ing.protein
                ingredient.cholesterol = ing.cholesterol
                ingredient.sodium = ing.sodium
                ingredient.vitamin_d = ing.vitaminD
                ingredient.iron = ing.iron
                ingredient.potassium = ing.potassium
                ingredient.calcium = ing.calcium

                i_section.ingredients.push(ingredient)
            })

            ing_Sections.push(i_section)
        })
        recipeDTO.ingredient_sections = ing_Sections

        const instr_section: InstructionSectionDTO[] = []
        
        // Instruction Section
        console.info("Converting Instructions to InstructionDTO")
        recipe.instructionSections.forEach((section: InstructionSectionModel) => {
            const i_section = new InstructionSectionDTO()
            
            i_section.section_name = section.sectionName
            i_section.image_link = section.imageLink
            
            const steps: Steps[] = []
            section.steps.forEach((instructionStep: InstructionSteps) => {
                const step: Steps = {
                    step_id: instructionStep.stepId,
                    step_text: instructionStep.stepText,
                    section_id: instructionStep.sectionId,
                    sort_order: instructionStep.sortOrder
                }
                steps.push(step)
            })
            i_section.steps = steps
            instr_section.push(i_section)
        })
        recipeDTO.instruction_sections = instr_section

        // NutritionFacts
        recipeDTO.calcium = recipe.calcium
        recipeDTO.calories = recipe.calories
        recipeDTO.carbohydrate = recipe.carbohydrate
        recipeDTO.cholesterol = recipe.cholesterol
        recipeDTO.fat = recipe.fat
        recipeDTO.fibre = recipe.fibre
        recipeDTO.iron = recipe.iron
        recipeDTO.potassium = recipe.potassium
        recipeDTO.protein = recipe.protein
        recipeDTO.saturated_fat = recipe.saturatedFat
        recipeDTO.sodium = recipe.sodium
        recipeDTO.sugars = recipe.sugars
        recipeDTO.trans_fat = recipe.transFat
        recipeDTO.vitamin_d = recipe.vitaminD

        return await recipeDTO
    } catch (err) {
        console.error(err)
        throw err
    }
}

export const convertRecipeDTOToRecipe = async(recipeDTO: RecipeDTO) => {
    try {
        const recipe = new RecipeModel()
        recipe.recipeId = recipeDTO.recipe_id
        recipe.name = recipeDTO.name
        recipe.description = recipeDTO.description
        // recipe.isActive = recipeDTO.is_active ? recipeDTO.is_active : false

        // Main Images
        recipe.heroImageLink = recipeDTO.hero_image_link 
        recipe.mainImageLink = recipeDTO.main_image_link 

        // Serving
        recipe.servingForm = recipeDTO.serving_form
        recipe.servingSize = recipeDTO.serving_size
        recipe.totalServings = recipeDTO.total_servings

        recipe.tags = recipeDTO.tags
        recipe.timeToPlate = recipeDTO.time_to_plate
        recipe.createdDate = recipeDTO.created_date
        recipe.updatedDate = recipeDTO.updated_date

        const ingSections: IngredientSectionModel[] = []
        // Ingredient Section
        console.log("recipeDTO: ", recipeDTO)
        if (recipeDTO.ingredient_sections) {
            recipeDTO.ingredient_sections.forEach((section: IngredientSectionDTO) => {

                const iSection = new IngredientSectionModel()
                const control = new IngredientSectionControls()

                iSection.sectionId = section.section_id
                iSection.sortOrder = section.sort_order
                iSection.sectionName = section.section_name

                section.ingredients.forEach((ing: IngredientDTO) => {
                    console.log("Conversion Received: ", ing.conversion_type)
                    const ingredient: Ingredient = {
                        name: ing.name,
                        id: ing.id,
                        fdcId: ing.fdc_id,
                        sortOrder: ing.sort_order,
                        quantity: ing.quantity,
                        measurement: ing.measurement,
                        gramWeight: ing.gram_weight,
                        conversionType: ing.conversion_type,
                        calories: ing.calories,
                        fat: ing.fat,
                        saturatedFat: ing.saturated_fat,
                        transFat: ing.trans_fat,
                        carbohydrate: ing.carbohydrate,
                        fibre: ing.fibre,
                        sugars: ing.sugars,
                        protein: ing.protein,
                        cholesterol: ing.cholesterol,
                        sodium: ing.sodium,
                        vitaminD: ing.vitamin_d,
                        iron: ing.iron,
                        potassium: ing.potassium,
                        calcium: ing.calcium,
                    }
                    iSection.ingredients.push(ingredient)

                    control.micronutrientDisplay.push({
                        ingredient: ingredient.name, 
                        shouldDisplayMicronutrients: false
                    })
                })
                iSection.controls = control
                ingSections.push(iSection)
            })
            recipe.ingredientSections = ingSections
        }

        const instrSection: InstructionSectionModel[] = []
        // Instruction Section
        console.info("Converting InstructionsDTO to Instruction")
        if (recipeDTO.instruction_sections) {
            recipeDTO.instruction_sections.forEach((section: InstructionSectionDTO) => {
                const iSection = new InstructionSectionModel()
                
                iSection.sectionId = section.section_id
                iSection.sortOrder = section.sort_order
                iSection.sectionName = section.section_name
                iSection.imageLink = section.image_link
                iSection.altText = section.alt_text
                
                const steps: InstructionSteps[] = []
                section.steps.forEach((stepDTO: Steps) => {
                    const step: InstructionSteps = {
                        stepId: stepDTO.step_id,
                        stepText: stepDTO.step_text,
                        sectionId: stepDTO.section_id,
                        sortOrder: stepDTO.sort_order
                    } 
                    steps.push(step)
                })
                iSection.steps = steps
                instrSection.push(iSection)
            })
            recipe.instructionSections = instrSection
        }

        // NutritionFacts
        recipe.calcium = recipeDTO.calcium
        recipe.calories = recipeDTO.calories
        recipe.carbohydrate = recipeDTO.carbohydrate
        recipe.cholesterol = recipeDTO.cholesterol
        recipe.fat = recipeDTO.fat
        recipe.fibre = recipeDTO.fibre
        recipe.iron = recipeDTO.iron
        recipe.potassium = recipeDTO.potassium
        recipe.protein = recipeDTO.protein
        recipe.saturatedFat = recipeDTO.saturated_fat
        recipe.sodium = recipeDTO.sodium
        recipe.sugars = recipeDTO.sugars
        recipe.transFat = recipeDTO.trans_fat
        recipe.vitaminD = recipeDTO.vitamin_d

        return await recipe

    } catch (err) {
        console.error(err)
        throw err
    }
}

export function convertRecipeToRecipeBaseDTO(recipe: RecipeModel): RecipeBaseDTO {
    
    const recipeDTO = new RecipeBaseDTO()

    recipeDTO.recipe_id = generateID(recipe.name)
    recipeDTO.name = recipe.name
    recipeDTO.description = recipe.description

    // Main Images
    recipeDTO.hero_image_link = recipe.heroImageLink
    recipeDTO.main_image_link = recipe.mainImageLink

    // Serving
    recipeDTO.serving_form = recipe.servingForm
    recipeDTO.serving_size = recipe.servingSize
    recipeDTO.total_servings = recipe.totalServings

    recipeDTO.time_to_plate = recipe.timeToPlate
    recipeDTO.created_date = new Date().toISOString().split('T')[0]
    recipeDTO.updated_date = new Date().toISOString().split('T')[0]

    // NutritionFacts
    recipeDTO.calcium = recipe.calcium
    recipeDTO.calories = recipe.calories
    recipeDTO.carbohydrate = recipe.carbohydrate
    recipeDTO.cholesterol = recipe.cholesterol
    recipeDTO.fat = recipe.fat
    recipeDTO.fibre = recipe.fibre
    recipeDTO.iron = recipe.iron
    recipeDTO.potassium = recipe.potassium
    recipeDTO.protein = recipe.protein
    recipeDTO.saturated_fat = recipe.saturatedFat
    recipeDTO.sodium = recipe.sodium
    recipeDTO.sugars = recipe.sugars
    recipeDTO.trans_fat = recipe.transFat
    recipeDTO.vitamin_d = recipe.vitaminD

     return recipeDTO
}

export function convertRecipeToRecipeIngredientDTO(recipe: RecipeModel): IngredientSectionDTO[] {
    
    const ingSections:IngredientSectionDTO[] = []

    const recipeSections = recipe.ingredientSections
    recipeSections.forEach((section:IngredientSectionModel) => {
        const sectionDTO: IngredientSectionDTO = new IngredientSectionDTO()
        sectionDTO.section_name = section.sectionName
        sectionDTO.section_id = section.sectionId
        sectionDTO.sort_order = section.sortOrder

        section.ingredients.forEach((ing: Ingredient) => {
            const ingredient: IngredientDTO = new IngredientDTO()
            ingredient.name = ing.name ? ing.name : ""
            ingredient.id = ing.id ? ing.id : 0
            ingredient.fdc_id = ing.fdcId ? ing.fdcId : 0
            ingredient.sort_order = ing.sortOrder
            ingredient.quantity = ing.quantity
            ingredient.measurement = ing.measurement
            ingredient.conversion_type = ing.conversionType ? ing.conversionType : "OTHER"
            ingredient.calories = ing.calories
            ingredient.fat = ing.fat
            ingredient.saturated_fat = ing.saturatedFat
            ingredient.trans_fat = ing.transFat
            ingredient.carbohydrate = ing.carbohydrate
            ingredient.fibre = ing.fibre
            ingredient.sugars = ing.sugars
            ingredient.protein = ing.protein
            ingredient.cholesterol = ing.cholesterol
            ingredient.sodium = ing.sodium
            ingredient.vitamin_d = ing.vitaminD
            ingredient.iron = ing.iron
            ingredient.potassium = ing.potassium 
            ingredient.calcium = ing.calcium

            sectionDTO.ingredients.push(ingredient)
        })
        ingSections.push(sectionDTO)
    })

    console.log("converted Recipe Ingredients: ", ingSections)
    return ingSections
}