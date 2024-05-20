class RecipeDTO {
    recipe_id: string = "";
    name: string = "";
    description: string = "";
    serving: ServingDTO = new ServingDTO;
    tags: string[] = [];
    time_to_plate: number = 0;
    images: string = "";
    created_date: string = "";
    updated_date: string = "";
    ingredient_section: IngredientSectionDTO[] = [];
    instruction_section: InstructionSectionDTO[] = [];
    nutrition_facts: NutritionFactsDTO = new NutritionFactsDTO;
}

class ServingDTO {
    total_servings: number = 0;
    serving_size: number = 0;
    amount: string = "";
}

class IngredientSectionDTO {
    section_name: string = "";
    ingredients: IngredientDTO[] = [];
}

class IngredientDTO {
    name: string = "";
    quantity: number = 0;
    measurement: string = "";
}

class InstructionSectionDTO {
    section_name: string = "";
    steps: string[] = [];
}

class NutritionFactsDTO {
    calories: number = 0;
    fat: number = 0;
    saturated_fat: number = 0;
    trans_fat: number = 0;
    carbohydrate: number = 0;
    fibre: number = 0;
    sugars: number = 0;
    protein: number = 0;
    cholesterol: number = 0;
    sodium: number = 0;
    vitamin_d: number = 0;
    iron: number = 0;
    potassium: number = 0;
    calcium: number = 0;

    getValue(value: string): number {
        switch(value as any) {
            case "Calories": {
                return this.calories;
            }
            case "Fat": {
                return this.fat;
            }
            case "Saturated": {
                return this.saturated_fat;
            }
            case "Trans": {
                return this.trans_fat;
            }
            case "Carbohydrate": {
                return this.carbohydrate;
            }
            case "Fibre": {
                return this.fibre;
            }
            case "Sugars": {
                return this.sugars;
            }
            case "Protein": {
                return this.protein;
            }
            case "Cholesterol": {
                return this.cholesterol;
            }
            case "Sodium": {
                return this.sodium;
            }
            case "Vitamin D": {
                return this.vitamin_d;
            }
            case "Iron": {
                return this.iron;
            }
            case "Potassium": {
                return this.potassium;
            }
            case "Calcium": {
                return this.calcium;
            }
        }
        return -1
    }
}

export { RecipeDTO, ServingDTO, IngredientSectionDTO, IngredientDTO, InstructionSectionDTO, NutritionFactsDTO }