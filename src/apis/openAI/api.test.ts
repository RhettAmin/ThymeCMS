// api/recipeApi.test.ts
import { describe, it } from 'vitest'
import OPEN_AI_API from './api'
import { IngredientSectionModel } from '@/models/recipeModels'

const openAiAPI = OPEN_AI_API

describe('callOpenAI', () => {
  it('It calls openAI Successfully', async () => {
    const ingredientTest: IngredientSectionModel[] = [{
      "sectionName": "",
      "ingredients": [
        {
          "name": "Cheese, blue",
          "quantity": 4,
          "measurement": "oz",
          "type": 0,
          "nutrients": {
            "calories": 353,
            "fat": 28.7,
            "saturatedFat": 18.7,
            "transFat": 0,
            "carbohydrate": 2.34,
            "fibre": 0,
            "sugars": 0,
            "protein": 21.4,
            "cholesterol": 75,
            "sodium": 1150,
            "vitamind": 21,
            "iron": 0,
            "potassium": 256,
            "calcium": 528
          }
        }
      ]
    }]
    const recipes = await openAiAPI.getTotalNutritionFacts(ingredientTest)
    console.log("RESPONSE: ", recipes)
  }, 30000)
})