// api/recipeApi.test.ts
import { describe, it } from 'vitest'
import BackendAPI from './api'

const api = BackendAPI

describe('getRecipe', () => {
  it('It calls the backend and gets a recipe from the DB successfully', async () => {
    
    const recipes = await api.getRecipe("7e581c8941180dd9705e926e85ad6f19")
    console.log("RESPONSE: ", recipes)
  }, 30000)
})