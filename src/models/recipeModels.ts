import { CONVERSTION_TYPES } from "@/utils/utils"

export class RecipeModel {
    recipeId: string = ""
    name: string = ""
    description: string = ""
    heroImageLink: string = ""
    mainImageLink: string = ""
    createdDate: string = ""
    updatedDate: string = ""
    timeToPlate: number = 0
    totalTime: number = 0
    prepTime: number = 0
    cookTime:number = 0
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

    constructor(data?: Partial<RecipeModel>) {
        Object.assign(this, data)
    }
}

export class NotesModel {
    id: number = 0
    content: string = ""
    placement: string = ""
    display_name: string = ""
}

export class Ingredient {
    name: string = ""
    id: number = 0
    fdcId: number = 0
    sortOrder: number = 0
    quantity: number = 0
    measurement: string = ""
    gramWeight: number = 0
    conversionType: CONVERSTION_TYPES = CONVERSTION_TYPES.OTHER
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

    constructor(data?: Partial<RecipeModel>) {
        Object.assign(this, data)
    }
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
    isOpen: boolean = true
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
    isOpen: boolean = true
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




