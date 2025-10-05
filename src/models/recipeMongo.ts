class RecipeDTO {
    recipe_id: string = ""
    name: string = ""
    description: string = ""
    serving: ServingDTO = new ServingDTO
    tags: string[] = []
    time_to_plate: number = 0
    images: string = ""
    metadata: Metadata = new Metadata
    created_date: string = ""
    updated_date: string = ""
    ingredient_section: IngredientSectionDTO[] = []
    instruction_section: InstructionSectionDTO[] = []
    nutrition_facts: NutritionFactsDTO = new NutritionFactsDTO
}

class Metadata {
    main_image_alt_text: string = ''
}

class ServingDTO {
    total_servings: number = 0
    serving_size: number = 0
    amount: string = ""
}

class IngredientSectionDTO {
    section_name: string = ""
    ingredients: IngredientDTO[] = []
}

class IngredientDTO {
    name: string = ""
    quantity: number = 0
    measurement: string = ""
    type: number = 0
}

class InstructionSectionDTO {
    section_name: string = ""
    metadata: InstructionImageMetadata = new InstructionImageMetadata
    steps: string[] = []
}

class InstructionImageMetadata {
    alt_text: string = ''
}

class NutritionFactsDTO {
    calories: number = 0
    fat: number = 0
    saturated_fat: number = 0
    trans_fat: number = 0
    carbohydrate: number = 0
    fibre: number = 0
    sugars: number = 0
    protein: number = 0
    cholesterol: number = 0
    sodium: number = 0
    vitamin_d: number = 0
    iron: number = 0
    potassium: number = 0
    calcium: number = 0
}

export { RecipeDTO, ServingDTO, IngredientSectionDTO, IngredientDTO, InstructionSectionDTO, NutritionFactsDTO }