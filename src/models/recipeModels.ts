
export class RecipeModel {
    recipeId: string = ""
    name: string = ""
    description: string = ""
    heroImageLink: string = ""
    mainImageLink: string = ""
    createdDate: string = ""
    updatedDate: string = ""
    timeToPlate: number = 0
    totalServings: number = 0
    servingSize: number = 0
    servingForm: string = ""
    calories: number = 0
    fat: number = 0
    saturatedFat: number = 0
    transFat: number = 0
    carbohydrate: number = 0
    fibre: number = 0
    sugars: number = 0
    protein: number = 0
    cholesterol: number = 0
    sodium: number = 0
    vitaminD: number = 0
    iron: number = 0
    potassium: number = 0
    calcium: number = 0
    tags: string[] = []
    notes: NotesModel[] = []
    ingredientSections: IngredientSectionModel[] = []
    instructionSections: InstructionSectionModel[] = []
}

export class NotesModel {
    id: number = 0
    content: string = ""
    placement: string = ""
    display_name: string = ""
}

export class Ingredient {
    name: string = ""
    ingredientId: number = 0
    sortOrder: number = 0
    quantity: number = 0
    measurement: string = ""
    type: number = 0
    calories: number = 0
    fat: number = 0
    saturatedFat: number = 0
    transFat: number = 0
    carbohydrate: number = 0
    fibre: number = 0
    sugars: number = 0
    protein: number = 0
    cholesterol: number = 0
    sodium: number = 0
    vitaminD: number = 0
    iron: number = 0
    potassium: number = 0
    calcium: number = 0
}

export class MicronutrientDisplay {
    ingredient: string = ""
    shouldDisplayMicronutrients: boolean = false
}

export class IngredientSectionControls {
    searchValue: string = ""
    lastSearchedValue: string = ""
    ingredients: Ingredient[] = []
    micronutrientDisplay: MicronutrientDisplay[] = []
    page: number = 1
}

export class IngredientSectionModel {
    sectionId: number = 0
    sortOrder: number = 0
    sectionName: string = ""
    ingredients: Ingredient[] = []
    controls: IngredientSectionControls = new IngredientSectionControls()
}

export class InstructionImageMetadata {
    altText: string = ""
}

export class InstructionSectionModel {
    sectionId: number = 0
    sortOrder: number = 0
    sectionName: string = ""
    imageLink: string = ""
    altText: string = ""
    steps: InstructionSteps[] = []
}

export class InstructionSteps {
    stepId: number = 0
    stepText: string = ""
    sectionId: number = 0
    sortOrder: number = 0
}

export class NutritionFacts {
    calories: number = 0
    fat: number = 0
    saturatedFat: number = 0
    transFat: number = 0
    carbohydrate: number = 0
    fibre: number = 0
    sugars: number = 0
    protein: number = 0
    cholesterol: number = 0
    sodium: number = 0
    vitamind: number = 0
    iron: number = 0
    potassium: number = 0
    calcium: number = 0
}




