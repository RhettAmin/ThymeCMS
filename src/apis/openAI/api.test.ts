// api/recipeApi.test.ts
import { describe, it } from 'vitest'
import OPEN_AI_API from './api'

const openAiAPI = OPEN_AI_API

describe('callOpenAI', () => {
  it('It calls openAI Successfully', async () => {
   
    const recipes = await openAiAPI.getTotalNutritionFacts()
    console.log("RESPONSE: ", recipes)
  }, 30000)
})