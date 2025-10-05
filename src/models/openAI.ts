import { Ingredient, NutritionFacts } from "./recipeModels"

export class nutritionFactsResponse {
    nutritionFacts: NutritionFacts = new NutritionFacts()
    ingredients: Ingredient[] = []
}