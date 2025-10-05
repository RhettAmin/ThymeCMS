// api/recipeApi.test.ts
import { describe, it } from 'vitest'
import USDAAPI from './api'

const USDA_API = USDAAPI

describe('listFoodByNameAbridged', () => {
  it('fetches foods from USDA successfully', async () => {
    // const mockRecipes = [{ id: '1', name: 'Pizza' }]
    
    // global.fetch = vi.fn(() =>
    //   Promise.resolve({
    //     json: () => Promise.resolve(mockRecipes),
    //   })
    // ) as any

    const recipes = await USDA_API.listFoodByNameAbridged("Cheese", 1)
    console.log("RECIPES FETCHED: ", recipes)
    // expect(recipes).toEqual(mockRecipes)
    // expect(fetch).toHaveBeenCalledWith('/api/recipes')
  })
})