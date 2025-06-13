export class Ingredient {
    name: string = ""
    quantity: number = 0
    measurement: string = ""
    type: number = 0

    constructor(name: string, quantity: number, measurement: string, type: number) {
        this.name = name
        this.quantity = quantity
        this.measurement = measurement
        this.type = type
    }
}

export class IngredientSectionModel {
    sectionName: string = ""
    ingredients: Ingredient[] = []

    constructor(sectionName?: string, ingredients?: Ingredient[]) {
        this.sectionName = sectionName || ''
        this.ingredients = ingredients || []
    }
}

export interface InstructionImageMetadata {
    altText: string
}

// interface InstructionImageRef {
//     instructionSection: string
//     index: number
// }

export interface InstructionSection {
    sectionName: string
    image: string
    metadata: InstructionImageMetadata
    steps: { text: string }[]
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

export class RecipeModel {
    recipeName: string = ""
    heroImageLink: string = ""
    mainImageLink: string = ""
    totalServings: number = 0
    servingSize: number = 0
    servingForm: string = ""
    tags: string[] = []
    timeToPlate: number = 0
    description: string = ""
    ingredientSections: IngredientSectionModel[] = []
    instructionSections: InstructionSection[] = []
    nutritionFacts: NutritionFacts = new NutritionFacts()
}

