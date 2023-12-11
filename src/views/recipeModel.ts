class Recipe {
    id?: String;
    name: String;
    description: String;
    servings: Number;
    tags: String[];
    image: String;
    ingredients: Ingredient[];
    instructions: Instruction[];
    nutritionFacts: NutritionFacts;

    constructor() {
        this.id = "";
        this.name = "";
        this.description = "";
        this.servings = 0;
        this.tags = [];
        this.image = "";
        this.ingredients = [];
        this.instructions = [];
        this.nutritionFacts = new NutritionFacts;
    }
}
class Ingredient {
    name: String = "";
    quantity: number = 0;
    measurement: String = "";
}

class Instruction {
    step: String = "";
}

class NutritionFacts {
    calories: Number = 0;
    protein: Number = 0;
    carbs: Number = 0;
    fats: Number = 0;

    constructor() {
        this.calories = 0;
        this.protein = 0;
        this.carbs = 0;
        this.fats = 0;
    }
}

export { Recipe, Ingredient, Instruction, NutritionFacts }