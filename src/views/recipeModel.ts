class Recipe {
    id: string = "";
    name: string = "";
    description: string = "";
    servings: Number = 0;
    tags: string[] = [];
    image: string = "";
    ingredientSection: IngredientSection[] = [];
    instructionSection: InstructionSection[] = [];
    nutritionFacts: NutritionFacts = new NutritionFacts;
}

class IngredientSection {
    sectionName: string = "";
    ingredients: Ingredient[] = [];
}

class Ingredient {
    name: string = "";
    quantity: number = 0;
    measurement: string = "";
}

class InstructionSection {
    sectionName: string = "";
    steps: string[] = [];
}

class NutritionFacts {
    calories: Number = 0;
    protein: Number = 0;
    carbs: Number = 0;
    fats: Number = 0;
}

export { Recipe, IngredientSection, Ingredient, InstructionSection, NutritionFacts }