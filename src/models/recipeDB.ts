export class RecipeDTO {
    recipe_id: string = ""
    name: string = ""
    description: string = ""
    hero_image_link: string = ""
    main_image_link: string = ""
    created_date: string = ""
    updated_date: string = ""
    time_to_plate: number = 0
    total_servings: number = 0
    serving_size: number = 0
    serving_form: string = ""
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
    tags: string[] = []
    notes: NotesDTO[] = []
    ingredient_sections: IngredientSectionDTO[] = []
    instruction_sections: InstructionSectionDTO[] = []
}

export class RecipeBaseDTO {
    recipe_id: string = ""
    name: string = ""
    description: string = ""
    hero_image_link: string = ""
    main_image_link: string = ""
    created_date: string = ""
    updated_date: string = ""
    time_to_plate: number = 0
    total_servings: number = 0
    serving_size: number = 0
    serving_form: string = ""
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

export class ServingDTO {
    total_servings: number = 0
    serving_size: number = 0
    form: string = ""
}

export class NotesDTO {
    id: number = 0
    content: string = ""
    placement: string = ""
    display_name: string = ""
}

export class IngredientSectionDTO {
    section_id: number = 0
    sort_order: number = 0
    section_name: string = ""
    ingredients: IngredientDTO[] = []
}

export class IngredientDTO {
    name: string = ""
    ingredient_id: number = 0
    sort_order: number = 0
    quantity: number = 0
    measurement: string = ""
    type: number = 0
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

export class InstructionSectionDTO {
    section_id: number = 0
    sort_order: number = 0
    section_name: string = ""
    image_link: string = ""
    alt_text: string = ""
    steps: Steps[] = []
}

export class Steps {
    step_id: number = 0
    step_text: string = ""
    section_id: number = 0
    sort_order: number = 0
}

export class NutritionFactsDTO {
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
