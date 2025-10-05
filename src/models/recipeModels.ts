export class Ingredient {
    name: string = ""
    quantity: number = 0
    measurement: string = ""
    type: number = 0
    nutrients = new NutritionFacts()

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
        this.sectionName = sectionName || ""
        this.ingredients = ingredients || []
    }
}

export class InstructionImageMetadata {
    altText: string = ""
}

export class InstructionSectionModel {
    sectionName: string = ""
    image: string = ""
    steps: string[] = []
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
    createdDate: string = ""
    updatedDate: string = ""
    ingredientSections: IngredientSectionModel[] = []
    instructionSections: InstructionSectionModel[] = []
    nutritionFacts: NutritionFacts = new NutritionFacts()
}

