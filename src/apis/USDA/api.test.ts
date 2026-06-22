/* eslint-disable @typescript-eslint/no-explicit-any */
// api/recipeApi.test.ts

import { vi, describe, expect, it, beforeEach } from 'vitest'
// import type { AxiosResponse } from 'axios'
import USDAAPI, { usdaAxios } from './api'
// import { IngredientIDsAndNutrients } from './utils'
import { Ingredient } from '@/models/recipeModels'

const USDA_API = USDAAPI

vi.mock('@/api/usdaAxios', () => {
  return {
    usdaAxios: {
      get: vi.fn(), 
    },
  }
})

describe('listFoodByNameAbridged', () => {
   beforeEach(() => {
    vi.clearAllMocks()
  })

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

// describe('getNutritionForIngredientList', () => {
//    beforeEach(() => {
//     vi.clearAllMocks()
//   })

//   it('fetches a list of foods with their nutrient values from USDA successfully', async () => {
//     const mockRecipes = [
//       {
//           "fdcId": 168149,
//           "description": "Fish, mackerel, salted",
//           "publicationDate": "4/1/2019",
//           "foodNutrients": [
//               {
//                   "type": "FoodNutrient",
//                   "nutrient": {
//                       "id": 1008,
//                       "number": "208",
//                       "name": "Energy",
//                       "rank": 300,
//                       "unitName": "kcal"
//                   },
//                   "id": 1334253,
//                   "amount": 305.00000000,
//                   "dataPoints": 0
//               },
//               {
//                   "type": "FoodNutrient",
//                   "nutrient": {
//                       "id": 1003,
//                       "number": "203",
//                       "name": "Protein",
//                       "rank": 600,
//                       "unitName": "g"
//                   },
//                   "id": 1334277,
//                   "amount": 18.50000000,
//                   "dataPoints": 0
//               },
//               {
//                   "type": "FoodNutrient",
//                   "nutrient": {
//                       "id": 1004,
//                       "number": "204",
//                       "name": "Total lipid (fat)",
//                       "rank": 800,
//                       "unitName": "g"
//                   },
//                   "id": 1334251,
//                   "amount": 25.10000000,
//                   "dataPoints": 0
//               },
//               {
//                   "type": "FoodNutrient",
//                   "nutrient": {
//                       "id": 1005,
//                       "number": "205",
//                       "name": "Carbohydrate, by difference",
//                       "rank": 1110,
//                       "unitName": "g"
//                   },
//                   "foodNutrientDerivation": {
//                       "id": 68,
//                       "code": "Z",
//                       "description": "Assumed zero (Insignificant amount or not naturally occurring in a food, such as fiber in meat)",
//                       "foodNutrientSource": {
//                           "id": 5,
//                           "code": "7",
//                           "description": "Assumed zero"
//                       }
//                   },
//                   "id": 1334252,
//                   "amount": 0E-8,
//                   "dataPoints": 0
//               },
//               {
//                   "type": "FoodNutrient",
//                   "nutrient": {
//                       "id": 1079,
//                       "number": "291",
//                       "name": "Fiber, total dietary",
//                       "rank": 1200,
//                       "unitName": "g"
//                   },
//                   "id": 1334289,
//                   "amount": 0E-8,
//                   "dataPoints": 0
//               },
//               {
//                   "type": "FoodNutrient",
//                   "nutrient": {
//                       "id": 1087,
//                       "number": "301",
//                       "name": "Calcium, Ca",
//                       "rank": 5300,
//                       "unitName": "mg"
//                   },
//                   "id": 1334259,
//                   "amount": 66.00000000,
//                   "dataPoints": 0
//               },
//               {
//                   "type": "FoodNutrient",
//                   "nutrient": {
//                       "id": 1092,
//                       "number": "306",
//                       "name": "Potassium, K",
//                       "rank": 5700,
//                       "unitName": "mg"
//                   },
//                   "id": 1334260,
//                   "amount": 520.00000000,
//                   "dataPoints": 0
//               },
//               {
//                   "type": "FoodNutrient",
//                   "nutrient": {
//                       "id": 1093,
//                       "number": "307",
//                       "name": "Sodium, Na",
//                       "rank": 5800,
//                       "unitName": "mg"
//                   },
//                   "id": 1334293,
//                   "amount": 4450.00000000,
//                   "dataPoints": 0
//               },
//               {
//                   "type": "FoodNutrient",
//                   "nutrient": {
//                       "id": 1110,
//                       "number": "324",
//                       "name": "Vitamin D (D2 + D3), International Units",
//                       "rank": 8650,
//                       "unitName": "IU"
//                   },
//                   "foodNutrientDerivation": {
//                       "id": 16,
//                       "code": "BFSN",
//                       "description": "Based on another form of the food or similar food; Concentration adjustment; Solids; Retention factors not used",
//                       "foodNutrientSource": {
//                           "id": 2,
//                           "code": "4",
//                           "description": "Calculated or imputed"
//                       }
//                   },
//                   "id": 1334255,
//                   "amount": 1006.00000000,
//                   "dataPoints": 0
//               },
//               {
//                   "type": "FoodNutrient",
//                   "nutrient": {
//                       "id": 1258,
//                       "number": "606",
//                       "name": "Fatty acids, total saturated",
//                       "rank": 9700,
//                       "unitName": "g"
//                   },
//                   "id": 1334279,
//                   "amount": 7.14800000,
//                   "dataPoints": 0
//               },
//               {
//                   "type": "FoodNutrient",
//                   "nutrient": {
//                       "id": 1253,
//                       "number": "601",
//                       "name": "Cholesterol",
//                       "rank": 15700,
//                       "unitName": "mg"
//                   },
//                   "id": 1334278,
//                   "amount": 95.00000000,
//                   "dataPoints": 0
//               }
//           ],
//           "foodPortions": [
//               {
//                   "id": 82563,
//                   "gramWeight": 136.00000000,
//                   "sequenceNumber": 3,
//                   "amount": 1.00000000,
//                   "modifier": "cup, cooked",
//                   "measureUnit": {
//                       "id": 9999,
//                       "name": "undetermined",
//                       "abbreviation": "undetermined"
//                   }
//               },
//               {
//                   "id": 82562,
//                   "gramWeight": 17.00000000,
//                   "sequenceNumber": 2,
//                   "amount": 1.00000000,
//                   "modifier": "cubic inch, boneless",
//                   "measureUnit": {
//                       "id": 9999,
//                       "name": "undetermined",
//                       "abbreviation": "undetermined"
//                   }
//               },
//               {
//                   "id": 82561,
//                   "gramWeight": 80.00000000,
//                   "sequenceNumber": 1,
//                   "amount": 1.00000000,
//                   "modifier": "piece (5-1/2\" x 1-1/2\" x 1/2\")",
//                   "measureUnit": {
//                       "id": 9999,
//                       "name": "undetermined",
//                       "abbreviation": "undetermined"
//                   }
//               }
//           ],
//           "dataType": "SR Legacy",
//           "foodClass": "FinalFood",
//           "foodComponents": [],
//           "foodAttributes": [],
//           "nutrientConversionFactors": [],
//           "inputFoods": [],
//           "ndbNumber": 83110,
//           "isHistoricalReference": true,
//           "foodCategory": {
//               "id": 15,
//               "code": "1500",
//               "description": "Finfish and Shellfish Products"
//           }
//       },
//       {
//           "fdcId": 168557,
//           "description": "Mushrooms, brown, italian, or crimini, exposed to ultraviolet light, raw",
//           "publicationDate": "4/1/2019",
//           "foodNutrients": [
//               {
//                   "type": "FoodNutrient",
//                   "nutrient": {
//                       "id": 1008,
//                       "number": "208",
//                       "name": "Energy",
//                       "rank": 300,
//                       "unitName": "kcal"
//                   },
//                   "foodNutrientDerivation": {
//                       "id": 49,
//                       "code": "NC",
//                       "description": "Calculated",
//                       "foodNutrientSource": {
//                           "id": 2,
//                           "code": "4",
//                           "description": "Calculated or imputed"
//                       }
//                   },
//                   "id": 1369780,
//                   "amount": 22.00000000,
//                   "dataPoints": 0
//               },
//               {
//                   "type": "FoodNutrient",
//                   "nutrient": {
//                       "id": 1003,
//                       "number": "203",
//                       "name": "Protein",
//                       "rank": 600,
//                       "unitName": "g"
//                   },
//                   "foodNutrientDerivation": {
//                       "id": 1,
//                       "code": "A",
//                       "description": "Analytical",
//                       "foodNutrientSource": {
//                           "id": 1,
//                           "code": "1",
//                           "description": "Analytical or derived from analytical"
//                       }
//                   },
//                   "id": 1369738,
//                   "amount": 2.50000000,
//                   "dataPoints": 1
//               },
//               {
//                   "type": "FoodNutrient",
//                   "nutrient": {
//                       "id": 1004,
//                       "number": "204",
//                       "name": "Total lipid (fat)",
//                       "rank": 800,
//                       "unitName": "g"
//                   },
//                   "foodNutrientDerivation": {
//                       "id": 1,
//                       "code": "A",
//                       "description": "Analytical",
//                       "foodNutrientSource": {
//                           "id": 1,
//                           "code": "1",
//                           "description": "Analytical or derived from analytical"
//                       }
//                   },
//                   "id": 1369778,
//                   "amount": 0.10000000,
//                   "dataPoints": 1
//               },
//               {
//                   "type": "FoodNutrient",
//                   "nutrient": {
//                       "id": 1005,
//                       "number": "205",
//                       "name": "Carbohydrate, by difference",
//                       "rank": 1110,
//                       "unitName": "g"
//                   },
//                   "foodNutrientDerivation": {
//                       "id": 49,
//                       "code": "NC",
//                       "description": "Calculated",
//                       "foodNutrientSource": {
//                           "id": 2,
//                           "code": "4",
//                           "description": "Calculated or imputed"
//                       }
//                   },
//                   "id": 1369779,
//                   "amount": 4.30000000,
//                   "dataPoints": 0
//               },
//               {
//                   "type": "FoodNutrient",
//                   "nutrient": {
//                       "id": 1079,
//                       "number": "291",
//                       "name": "Fiber, total dietary",
//                       "rank": 1200,
//                       "unitName": "g"
//                   },
//                   "foodNutrientDerivation": {
//                       "id": 1,
//                       "code": "A",
//                       "description": "Analytical",
//                       "foodNutrientSource": {
//                           "id": 1,
//                           "code": "1",
//                           "description": "Analytical or derived from analytical"
//                       }
//                   },
//                   "id": 1369742,
//                   "amount": 0.60000000,
//                   "dataPoints": 1
//               },
//               {
//                   "type": "FoodNutrient",
//                   "nutrient": {
//                       "id": 1087,
//                       "number": "301",
//                       "name": "Calcium, Ca",
//                       "rank": 5300,
//                       "unitName": "mg"
//                   },
//                   "foodNutrientDerivation": {
//                       "id": 1,
//                       "code": "A",
//                       "description": "Analytical",
//                       "foodNutrientSource": {
//                           "id": 1,
//                           "code": "1",
//                           "description": "Analytical or derived from analytical"
//                       }
//                   },
//                   "id": 1369785,
//                   "amount": 18.00000000,
//                   "dataPoints": 1
//               },
//               {
//                   "type": "FoodNutrient",
//                   "nutrient": {
//                       "id": 1092,
//                       "number": "306",
//                       "name": "Potassium, K",
//                       "rank": 5700,
//                       "unitName": "mg"
//                   },
//                   "foodNutrientDerivation": {
//                       "id": 1,
//                       "code": "A",
//                       "description": "Analytical",
//                       "foodNutrientSource": {
//                           "id": 1,
//                           "code": "1",
//                           "description": "Analytical or derived from analytical"
//                       }
//                   },
//                   "id": 1369786,
//                   "amount": 448.00000000,
//                   "dataPoints": 1
//               },
//               {
//                   "type": "FoodNutrient",
//                   "nutrient": {
//                       "id": 1093,
//                       "number": "307",
//                       "name": "Sodium, Na",
//                       "rank": 5800,
//                       "unitName": "mg"
//                   },
//                   "foodNutrientDerivation": {
//                       "id": 1,
//                       "code": "A",
//                       "description": "Analytical",
//                       "foodNutrientSource": {
//                           "id": 1,
//                           "code": "1",
//                           "description": "Analytical or derived from analytical"
//                       }
//                   },
//                   "id": 1369746,
//                   "amount": 6.00000000,
//                   "dataPoints": 1
//               },
//               {
//                   "type": "FoodNutrient",
//                   "nutrient": {
//                       "id": 1110,
//                       "number": "324",
//                       "name": "Vitamin D (D2 + D3), International Units",
//                       "rank": 8650,
//                       "unitName": "IU"
//                   },
//                   "foodNutrientDerivation": {
//                       "id": 1,
//                       "code": "A",
//                       "description": "Analytical",
//                       "foodNutrientSource": {
//                           "id": 1,
//                           "code": "1",
//                           "description": "Analytical or derived from analytical"
//                       }
//                   },
//                   "id": 1369790,
//                   "amount": 1276.00000000,
//                   "dataPoints": 6,
//                   "max": 2360.00000000,
//                   "min": 744.00000000
//               },
//               {
//                   "type": "FoodNutrient",
//                   "nutrient": {
//                       "id": 1258,
//                       "number": "606",
//                       "name": "Fatty acids, total saturated",
//                       "rank": 9700,
//                       "unitName": "g"
//                   },
//                   "foodNutrientDerivation": {
//                       "id": 10,
//                       "code": "BFFN",
//                       "description": "Based on another form of the food or similar food; Concentration adjustment; Fat; Retention factors not used",
//                       "foodNutrientSource": {
//                           "id": 2,
//                           "code": "4",
//                           "description": "Calculated or imputed"
//                       }
//                   },
//                   "id": 1369769,
//                   "amount": 0.01400000,
//                   "dataPoints": 0
//               },
//               {
//                   "type": "FoodNutrient",
//                   "nutrient": {
//                       "id": 1253,
//                       "number": "601",
//                       "name": "Cholesterol",
//                       "rank": 15700,
//                       "unitName": "mg"
//                   },
//                   "foodNutrientDerivation": {
//                       "id": 68,
//                       "code": "Z",
//                       "description": "Assumed zero (Insignificant amount or not naturally occurring in a food, such as fiber in meat)",
//                       "foodNutrientSource": {
//                           "id": 5,
//                           "code": "7",
//                           "description": "Assumed zero"
//                       }
//                   },
//                   "id": 1369768,
//                   "amount": 0E-8,
//                   "dataPoints": 0
//               }
//           ],
//           "foodPortions": [
//               {
//                   "id": 83305,
//                   "dataPoints": 4,
//                   "gramWeight": 72.00000000,
//                   "sequenceNumber": 2,
//                   "amount": 1.00000000,
//                   "modifier": "cup sliced",
//                   "measureUnit": {
//                       "id": 9999,
//                       "name": "undetermined",
//                       "abbreviation": "undetermined"
//                   }
//               },
//               {
//                   "id": 83306,
//                   "dataPoints": 30,
//                   "gramWeight": 20.00000000,
//                   "sequenceNumber": 3,
//                   "amount": 1.00000000,
//                   "modifier": "piece whole",
//                   "measureUnit": {
//                       "id": 9999,
//                       "name": "undetermined",
//                       "abbreviation": "undetermined"
//                   }
//               },
//               {
//                   "id": 83304,
//                   "dataPoints": 4,
//                   "gramWeight": 87.00000000,
//                   "sequenceNumber": 1,
//                   "amount": 1.00000000,
//                   "modifier": "cup whole",
//                   "measureUnit": {
//                       "id": 9999,
//                       "name": "undetermined",
//                       "abbreviation": "undetermined"
//                   }
//               }
//           ],
//           "dataType": "SR Legacy",
//           "foodClass": "FinalFood",
//           "scientificName": "Agaricus bisporus",
//           "foodComponents": [],
//           "foodAttributes": [
//               {
//                   "id": 3339119,
//                   "value": "http://purl.obolibrary.org/obo/NCBITaxon_5341",
//                   "name": "NCBI Taxon",
//                   "foodAttributeType": {
//                       "id": 999,
//                       "name": "Attribute",
//                       "description": "Generic attributes"
//                   }
//               },
//               {
//                   "id": 3339120,
//                   "value": "http://purl.obolibrary.org/obo/NCBITaxon_4751",
//                   "name": "NCBI Taxon Parent",
//                   "foodAttributeType": {
//                       "id": 999,
//                       "name": "Attribute",
//                       "description": "Generic attributes"
//                   }
//               },
//               {
//                   "id": 3339121,
//                   "value": "Agaricus bisporus",
//                   "name": "Scientific Name",
//                   "foodAttributeType": {
//                       "id": 999,
//                       "name": "Attribute",
//                       "description": "Generic attributes"
//                   }
//               },
//               {
//                   "id": 3339122,
//                   "value": "http://purl.obolibrary.org/obo/FOODON_00004253",
//                   "name": "FoodOn Ontology ID #1 For FDC Item",
//                   "foodAttributeType": {
//                       "id": 999,
//                       "name": "Attribute",
//                       "description": "Generic attributes"
//                   }
//               },
//               {
//                   "id": 3339123,
//                   "value": "brown mushroom (raw)",
//                   "name": "FoodOn Ontology Name #1 For FDC Item",
//                   "foodAttributeType": {
//                       "id": 999,
//                       "name": "Attribute",
//                       "description": "Generic attributes"
//                   }
//               },
//               {
//                   "id": 3339124,
//                   "value": "http://purl.obolibrary.org/obo/FOODON_00002434",
//                   "name": "Ontology ID For Source",
//                   "foodAttributeType": {
//                       "id": 999,
//                       "name": "Attribute",
//                       "description": "Generic attributes"
//                   }
//               },
//               {
//                   "id": 3339125,
//                   "value": "mushroom food product",
//                   "name": "Ontology Name For Source",
//                   "foodAttributeType": {
//                       "id": 999,
//                       "name": "Attribute",
//                       "description": "Generic attributes"
//                   }
//               }
//           ],
//           "nutrientConversionFactors": [
//               {
//                   "id": 12294,
//                   "proteinValue": 2.62000000,
//                   "fatValue": 8.37000000,
//                   "carbohydrateValue": 3.48000000,
//                   "type": ".CalorieConversionFactor",
//                   "name": "Calories From Proximates"
//               },
//               {
//                   "id": 17128,
//                   "value": 6.25000000,
//                   "type": ".ProteinConversionFactor",
//                   "name": "Protein From Nitrogen"
//               }
//           ],
//           "inputFoods": [],
//           "ndbNumber": 11936,
//           "isHistoricalReference": true,
//           "foodCategory": {
//               "id": 11,
//               "code": "1100",
//               "description": "Vegetables and Vegetable Products"
//           }
//       }
//     ]
    
//     const mockAxiosResponse: AxiosResponse = {
//       data: mockRecipes,
//       status: 200,
//       statusText: 'OK',
//       headers: {},
//       config: {} as any,
//     }

//     vi.spyOn(usdaAxios, 'get').mockResolvedValue(mockAxiosResponse as any)

//     const recipes: IngredientIDsAndNutrients[] = await USDA_API.getNutritionForIngredientList(["168149", "168557"])
//     console.log("RECIPES FETCHED: ", recipes)
//     recipes.map((ingredient: IngredientIDsAndNutrients) => {
//       expect(ingredient.fdcId).not.toBeUndefined()
//       expect(ingredient.nutrients).not.toBeUndefined()
//     })
    
//   })
// })

describe('getNutritionForIngredient', () => {
   beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches the nutrition of a food item with their nutrient values from USDA successfully', async () => {
    
    const ingredient: Ingredient = await USDA_API.getNutritionForIngredient(168149)
    console.log("ingredient FETCHED: ", ingredient)
    // recipes.map((ingredient: IngredientIDsAndNutrients) => {
    //   expect(ingredient.fdcId).not.toBeUndefined()
    //   expect(ingredient.nutrients).not.toBeUndefined()
    // })
    
  })
})