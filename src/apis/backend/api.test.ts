/* eslint-disable @typescript-eslint/no-explicit-any */
// api/recipeApi.test.ts
import { vi, describe, expect, it, beforeEach } from 'vitest'
import BackendAPI, { thymeAxios }  from './backendAPI'
import type { AxiosResponse } from 'axios'
import { RecipeModel } from '@/models/recipeModels'

const api = BackendAPI

vi.mock('@/api/thymeAxios', () => {
  return {
    thymeAxios: {
      get: vi.fn(), 
    },
  }
})

describe('getRecipe', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('It calls the backend with a valid recipeName and gets a recipe from the DB successfully', async () => {

    const mockResponse =  {
        "message": null,
        "recipe_list": [
            {
                "recipe_id": "testID",
                "name": "Beef Tartare and Pickled Chips",
                "description": "A light and delicious appetizer that will have you going back for more! Hand-cut beef, paired with the tangy crunch of pickled chips. ",
                "tags": [
                    "Appetizer",
                    "Long-prep"
                ],
                "ingredient_section": [
                    {
                        "section_name": "Pickled Chips",
                        "ingredients": [
                            {
                                "name": "potato",
                                "quantity": 4.0,
                                "measurement": "medium",
                                "type": 0
                            },
                            {
                                "name": "garlic cloves",
                                "quantity": 4.0,
                                "measurement": "",
                                "type": 0
                            },
                            {
                                "name": "mustard seeds",
                                "quantity": 13.0,
                                "measurement": "grams",
                                "type": 2
                            },
                            {
                                "name": "peppercorns",
                                "quantity": 6.0,
                                "measurement": "grams",
                                "type": 2
                            },
                            {
                                "name": "dill",
                                "quantity": 10.0,
                                "measurement": "grams",
                                "type": 2
                            },
                            {
                                "name": "vinegar",
                                "quantity": 400.0,
                                "measurement": "ml",
                                "type": 2
                            },
                            {
                                "name": "water",
                                "quantity": 200.0,
                                "measurement": "ml",
                                "type": 2
                            },
                            {
                                "name": "sugar",
                                "quantity": 60.0,
                                "measurement": "grams",
                                "type": 2
                            },
                            {
                                "name": "salt",
                                "quantity": 60.0,
                                "measurement": "grams",
                                "type": 2
                            },
                            {
                                "name": "vegetable oil",
                                "quantity": 400.0,
                                "measurement": "ml",
                                "type": 2
                            }
                        ]
                    },
                    {
                        "section_name": "Beef Tartare",
                        "ingredients": [
                            {
                                "name": "beef tenderloin",
                                "quantity": 450.0,
                                "measurement": "grams",
                                "type": 1
                            },
                            {
                                "name": "shallot",
                                "quantity": 1.0,
                                "measurement": "large",
                                "type": 0
                            },
                            {
                                "name": "capers",
                                "quantity": 35.0,
                                "measurement": "grams",
                                "type": 2
                            },
                            {
                                "name": "egg",
                                "quantity": 1.0,
                                "measurement": "",
                                "type": 0
                            },
                            {
                                "name": "dijon mustard",
                                "quantity": 11.0,
                                "measurement": "grams",
                                "type": 2
                            },
                            {
                                "name": "olive oil",
                                "quantity": 28.0,
                                "measurement": "ml",
                                "type": 2
                            },
                            {
                                "name": "lemon",
                                "quantity": 1.0,
                                "measurement": "large",
                                "type": 0
                            },
                            {
                                "name": "parsley",
                                "quantity": 19.0,
                                "measurement": "grams",
                                "type": 2
                            }
                        ]
                    }
                ],
                "serving": {
                    "total_servings": 8,
                    "serving_size": 1,
                    "form": "portion"
                },
                "time_to_plate": 2880,
                "instruction_section": [
                    {
                        "section_name": "Pickling the Chips",
                        "metadata": {
                            "alt_text": ""
                        },
                        "steps": [
                            "This step should be done at least 2 days before serving to allow the potatoes to pickle, but can be kept for longer",
                            "Wash and scrub the potatoes. You can peel them or leave the skin on",
                            "Cut the potatoes into thin circular slices, then wash them in cold water until the water runs clear. Then place the potatoes in a large jar",
                            "Peel and cut your garlic, trim your dill. Toss into the jar with the potatoes then put the rest of the ingredients into the jar. Store in the fridge",
                            "NOTE: If you want to adjust the amount of liquid for the container you're using, it's a 2 parts vinegar, 1 part water, 0.15 part salt and sugar"
                        ]
                    },
                    {
                        "section_name": "Beef Tartare",
                        "metadata": {
                            "alt_text": ""
                        },
                        "steps": [
                            "Zest your lemon and place it in a bowl. Cut and juice the lemon into the same bowl",
                            "Add finely chopped shallot, parsley, and capers to the bowl followed with egg, mustard, and olive oil",
                            "Dice the steak into small pieces similar to ground beef. You can place the steak in the freezer (in a reusable container) for 10-15 minutes to firm it up to make it easier to cut. Toss the beef into the bowl with the rest of the ingredients",
                            "Mix everything thoroughly and set aside for at least 30 minutes, feel free to stir it now and then "
                        ]
                    },
                    {
                        "section_name": "Frying the Chips",
                        "metadata": {
                            "alt_text": ""
                        },
                        "steps": [
                            "Drain the potatoes from the jar, you can save the liquid to pickle anything else if you'd like. ",
                            "In a pot, add oil then heat oil to 162°C (325°F). If you don't have a thermometer you can dip a wooden chopstick into the oil and if you see bubbles form, it's good to go. Alternatively, you can use a small chip to test the oil",
                            "When the oil is hot enough, fry your chips in batches until they are lightly browned. Remove them and allow them to sit on a tray or bowl lined with paper towel",
                            "Once all the chips have been fried once, raise the heat of the oil to 190°C (375°F) then fry your chips again until they are golden brown. Remove from oil then sprinkle salt on top"
                        ]
                    },
                    {
                        "section_name": "Plate up!",
                        "metadata": {
                            "alt_text": ""
                        },
                        "steps": [
                            "If you want to be fancy place the steak tartare into a plastic wrap-lined ramekin, packing it tightly. Flip it onto a plate, place chips around then top with a sprig of parsley",
                            "Serve and enjoy!"
                        ]
                    }
                ],
                "nutrition_facts": {
                    "calories": 6130.0,
                    "protein": 140.0,
                    "carbohydrate": 238.0,
                    "fat": 515.0,
                    "saturated_fat": 77.0,
                    "trans_fat": 0.0,
                    "fibre": 24.0,
                    "sugars": 74.0,
                    "cholesterol": 569.0,
                    "sodium": 24796.0,
                    "vitamin_d": 1.0,
                    "iron": 29.0,
                    "potassium": 5966.0,
                    "calcium": 408.0
                }
            }
        ],
        "status_code": "200"
    }

    const mockAxiosResponse: AxiosResponse = {
      data: mockResponse,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    }

    vi.spyOn(thymeAxios, 'get').mockResolvedValue(mockAxiosResponse as any)

    await api.getRecipe("Beef Tartare and Pickled Chips").then((responseRecipe: RecipeModel) => {
        expect(responseRecipe).not.toBeUndefined()
        expect(responseRecipe.recipeName).toBe("Beef Tartare and Pickled Chips")
        expect(responseRecipe.tags.length).toBe(2)
        expect(responseRecipe.ingredientSections.length).toBe(2)
        expect(responseRecipe.instructionSections.length).toBe(4)
        expect(responseRecipe.totalServings).toBe(8)
        expect(responseRecipe.servingSize).toBe(1)
        expect(responseRecipe.servingForm).toBe("portion")
        expect(responseRecipe.timeToPlate).toBe(2880)
        expect(responseRecipe.nutritionFacts.calcium).toBe(408.0)
        expect(responseRecipe.nutritionFacts.calories).toBe(6130.0)
        expect(responseRecipe.nutritionFacts.carbohydrate).toBe(238.0)
        expect(responseRecipe.nutritionFacts.cholesterol).toBe(569.0)
        expect(responseRecipe.nutritionFacts.fat).toBe(515.0)
        expect(responseRecipe.nutritionFacts.fibre).toBe(24.0)
        expect(responseRecipe.nutritionFacts.iron).toBe(29.0)
        expect(responseRecipe.nutritionFacts.potassium).toBe(5966.0)
        expect(responseRecipe.nutritionFacts.protein).toBe(140.0)
        expect(responseRecipe.nutritionFacts.saturatedFat).toBe(77.0)
        expect(responseRecipe.nutritionFacts.sodium).toBe(24796.0)
        expect(responseRecipe.nutritionFacts.sugars).toBe(74.0)
        expect(responseRecipe.nutritionFacts.transFat).toBe(0.0)
        expect(responseRecipe.nutritionFacts.vitamind).toBe(1.0)
    })
  }, 30000)

  it('It calls the backend with an invalid recipeName and receives status_code 404', async () => {

    const mockResponse =  {
        "message": null,
        "recipe_list": [],
        "status_code": "404"
    }

    const mockAxiosResponse: AxiosResponse = {
      data: mockResponse ,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    }

    vi.spyOn(thymeAxios, 'get').mockResolvedValue(mockAxiosResponse as any)

    await api.getRecipe("Beef Tartare and Pickled Chips").then((responseRecipe: RecipeModel) => {
        expect(responseRecipe).not.toBeUndefined()
        expect(responseRecipe.recipeName).toBe("")
    })
  }, 30000)

  it('It calls the backend but an unexpect statuscode is received', async () => {

    const mockResponse =  {
        "message": null,
        "recipe_list": [],
        "status_code": "403"
    }

    const mockAxiosResponse: AxiosResponse = {
      data: mockResponse ,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    }

    vi.spyOn(thymeAxios, 'get').mockResolvedValue(mockAxiosResponse as any)

    await api.getRecipe("Beef Tartare and Pickled Chips").catch((error) => {
        expect(error).not.toBeUndefined()
        expect(error).toBe("Received unexpected response code")
    })
  }, 30000)
})

describe('getRecipes', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

  it('It calls the backend and gets a list of recipes from the DB successfully', async () => {

    const mockResponse = {
        "message": null,
        "recipe_list": [
            {
                "recipe_id": "73c5807ec24daca38c4ec2c330ba9ece",
                "name": "Beef Tartare and Pickled Chips",
                "description": "A light and delicious appetizer that will have you going back for more! Hand-cut beef, paired with the tangy crunch of pickled chips. ",
                "created_date": "2025-10-18",
                "updated_date": "2025-10-18",
                "tags": [
                    "Appetizer",
                    "Long-prep"
                ],
                "ingredient_section": [
                    {
                        "section_name": "Pickled Chips",
                        "ingredients": [
                            {
                                "name": "potato",
                                "quantity": 4.0,
                                "measurement": "medium",
                                "type": 0
                            },
                            {
                                "name": "garlic cloves",
                                "quantity": 4.0,
                                "measurement": "",
                                "type": 0
                            },
                            {
                                "name": "mustard seeds",
                                "quantity": 13.0,
                                "measurement": "grams",
                                "type": 2
                            },
                            {
                                "name": "peppercorns",
                                "quantity": 6.0,
                                "measurement": "grams",
                                "type": 2
                            },
                            {
                                "name": "dill",
                                "quantity": 10.0,
                                "measurement": "grams",
                                "type": 2
                            },
                            {
                                "name": "vinegar",
                                "quantity": 400.0,
                                "measurement": "ml",
                                "type": 2
                            },
                            {
                                "name": "water",
                                "quantity": 200.0,
                                "measurement": "ml",
                                "type": 2
                            },
                            {
                                "name": "sugar",
                                "quantity": 60.0,
                                "measurement": "grams",
                                "type": 2
                            },
                            {
                                "name": "salt",
                                "quantity": 60.0,
                                "measurement": "grams",
                                "type": 2
                            },
                            {
                                "name": "vegetable oil",
                                "quantity": 400.0,
                                "measurement": "ml",
                                "type": 2
                            }
                        ]
                    },
                    {
                        "section_name": "Beef Tartare",
                        "ingredients": [
                            {
                                "name": "beef tenderloin",
                                "quantity": 450.0,
                                "measurement": "grams",
                                "type": 1
                            },
                            {
                                "name": "shallot",
                                "quantity": 1.0,
                                "measurement": "large",
                                "type": 0
                            },
                            {
                                "name": "capers",
                                "quantity": 35.0,
                                "measurement": "grams",
                                "type": 2
                            },
                            {
                                "name": "egg",
                                "quantity": 1.0,
                                "measurement": "",
                                "type": 0
                            },
                            {
                                "name": "dijon mustard",
                                "quantity": 11.0,
                                "measurement": "grams",
                                "type": 2
                            },
                            {
                                "name": "olive oil",
                                "quantity": 28.0,
                                "measurement": "ml",
                                "type": 2
                            },
                            {
                                "name": "lemon",
                                "quantity": 1.0,
                                "measurement": "large",
                                "type": 0
                            },
                            {
                                "name": "parsley",
                                "quantity": 19.0,
                                "measurement": "grams",
                                "type": 2
                            }
                        ]
                    }
                ],
                "serving": {
                    "total_servings": 8,
                    "serving_size": 1,
                    "form": "portion"
                },
                "time_to_plate": 2880,
                "instruction_section": [
                    {
                        "section_name": "Pickling the Chips",
                        "metadata": {
                            "alt_text": ""
                        },
                        "steps": [
                            "This step should be done at least 2 days before serving to allow the potatoes to pickle, but can be kept for longer",
                            "Wash and scrub the potatoes. You can peel them or leave the skin on",
                            "Cut the potatoes into thin circular slices, then wash them in cold water until the water runs clear. Then place the potatoes in a large jar",
                            "Peel and cut your garlic, trim your dill. Toss into the jar with the potatoes then put the rest of the ingredients into the jar. Store in the fridge",
                            "NOTE: If you want to adjust the amount of liquid for the container you're using, it's a 2 parts vinegar, 1 part water, 0.15 part salt and sugar"
                        ]
                    },
                    {
                        "section_name": "Beef Tartare",
                        "metadata": {
                            "alt_text": ""
                        },
                        "steps": [
                            "Zest your lemon and place it in a bowl. Cut and juice the lemon into the same bowl",
                            "Add finely chopped shallot, parsley, and capers to the bowl followed with egg, mustard, and olive oil",
                            "Dice the steak into small pieces similar to ground beef. You can place the steak in the freezer (in a reusable container) for 10-15 minutes to firm it up to make it easier to cut. Toss the beef into the bowl with the rest of the ingredients",
                            "Mix everything thoroughly and set aside for at least 30 minutes, feel free to stir it now and then "
                        ]
                    },
                    {
                        "section_name": "Frying the Chips",
                        "metadata": {
                            "alt_text": ""
                        },
                        "steps": [
                            "Drain the potatoes from the jar, you can save the liquid to pickle anything else if you'd like. ",
                            "In a pot, add oil then heat oil to 162°C (325°F). If you don't have a thermometer you can dip a wooden chopstick into the oil and if you see bubbles form, it's good to go. Alternatively, you can use a small chip to test the oil",
                            "When the oil is hot enough, fry your chips in batches until they are lightly browned. Remove them and allow them to sit on a tray or bowl lined with paper towel",
                            "Once all the chips have been fried once, raise the heat of the oil to 190°C (375°F) then fry your chips again until they are golden brown. Remove from oil then sprinkle salt on top"
                        ]
                    },
                    {
                        "section_name": "Plate up!",
                        "metadata": {
                            "alt_text": ""
                        },
                        "steps": [
                            "If you want to be fancy place the steak tartare into a plastic wrap-lined ramekin, packing it tightly. Flip it onto a plate, place chips around then top with a sprig of parsley",
                            "Serve and enjoy!"
                        ]
                    }
                ],
                "nutrition_facts": {
                    "calories": 6130.0,
                    "protein": 140.0,
                    "carbohydrate": 238.0,
                    "fat": 515.0,
                    "saturated_fat": 77.0,
                    "trans_fat": 0.0,
                    "fibre": 24.0,
                    "sugars": 74.0,
                    "cholesterol": 569.0,
                    "sodium": 24796.0,
                    "vitamin_d": 1.0,
                    "iron": 29.0,
                    "potassium": 5966.0,
                    "calcium": 408.0
                }
            },
            {
                "recipe_id": "458fb32003ce2e9e62f748305e7c1cf4",
                "name": "Braised Lentils",
                "description": "A hearty, healthy, and heavy dish ready to warm you up with earthy tones and savoury flavours that will send you spiraling up into flavours you've never experienced this way before. Or it could be just be okay, give it a try and see. ",
                "created_date": "2025-10-05",
                "updated_date": "2025-10-05",
                "tags": [
                    "Vegetarian",
                    "Slow-cook"
                ],
                "ingredient_section": [
                    {
                        "section_name": "",
                        "ingredients": [
                            {
                                "name": "Butter, salted",
                                "quantity": 2.0,
                                "measurement": "tbsp",
                                "type": 2
                            },
                            {
                                "name": "Olive oil",
                                "quantity": 2.0,
                                "measurement": "tbsp",
                                "type": 2
                            },
                            {
                                "name": "Carrot",
                                "quantity": 1.0,
                                "measurement": "medium",
                                "type": 0
                            },
                            {
                                "name": "Onion",
                                "quantity": 1.0,
                                "measurement": "medium",
                                "type": 0
                            },
                            {
                                "name": "Celery",
                                "quantity": 1.0,
                                "measurement": "stalk",
                                "type": 0
                            },
                            {
                                "name": "Garlic",
                                "quantity": 4.0,
                                "measurement": "cloves",
                                "type": 0
                            },
                            {
                                "name": "Bell Pepper",
                                "quantity": 2.0,
                                "measurement": "medium",
                                "type": 0
                            },
                            {
                                "name": "Roma Tomato",
                                "quantity": 2.0,
                                "measurement": "medium",
                                "type": 0
                            },
                            {
                                "name": "Lentils, dry",
                                "quantity": 1.0,
                                "measurement": "cup",
                                "type": 2
                            },
                            {
                                "name": "Mushroom Stock",
                                "quantity": 2.0,
                                "measurement": "cups",
                                "type": 2
                            },
                            {
                                "name": "Brandy (Optional)",
                                "quantity": 0.5,
                                "measurement": "cup",
                                "type": 2
                            },
                            {
                                "name": "White wine  (Optional)",
                                "quantity": 0.5,
                                "measurement": "cup",
                                "type": 2
                            }
                        ]
                    }
                ],
                "serving": {
                    "total_servings": 8,
                    "serving_size": 1,
                    "form": "serving"
                },
                "time_to_plate": 60,
                "instruction_section": [
                    {
                        "section_name": "",
                        "metadata": {
                            "alt_text": ""
                        },
                        "steps": [
                            "Let lentils soak overnight. Before using drain and leave aside for now",
                            "Dice up carrots, onions, celery, bell pepper, tomato, and garlic into small pieces and set aside",
                            "Set a pot on a stove on medium-low, toss in the butter and oil. Cook and stir often until the butter starts to brown",
                            "Brown butter then toss in carrot, onion, bell pepper, and celery and cook until they have softened and lightly browned",
                            "Toss in tomato and garlic. Then salt and pepper to taste. Cook until the tomatoes have broken down a bit",
                            "If you’re using brandy and/or wine, toss it into the mix and let it cook down for a few minutes",
                            "Toss in lentils and stock until it covers the lentils, give it a good mix, before reducing the heat to low, then cover the the mixture with a cartouche or a lid left slightly open",
                            "Cook for around 40 minutes until the lentils have softened but are still holding their shape",
                            "Serve and enjoy!"
                        ]
                    }
                ],
                "nutrition_facts": {
                    "calories": 2322.52,
                    "protein": 56.24,
                    "carbohydrate": 0.0,
                    "fat": 56.44,
                    "saturated_fat": 29.29,
                    "trans_fat": 1.25,
                    "fibre": 11.82,
                    "sugars": 12.48,
                    "cholesterol": 82.76,
                    "sodium": 6733.31,
                    "vitamin_d": 0.0,
                    "iron": 1.92,
                    "potassium": 3527.33,
                    "calcium": 289.97
                }
            }
        ],
        "status_code": "200"
    }

    const mockAxiosResponse: AxiosResponse = {
      data: mockResponse ,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    }

    vi.spyOn(thymeAxios, 'get').mockResolvedValue(mockAxiosResponse as any)
    
    await api.getRecipes().then((recipes: RecipeModel[]) => {
        console.log("RESPONSE: ", recipes)
        expect(recipes.length).toBe(2)
    })
    
  }, 30000)

  it('It calls the backend and gets a list of recipes from the DB successfully', async () => {

    const mockResponse = {
        "message": null,
        "recipe_list": [],
        "status_code": "400"
    }

    const mockAxiosResponse: AxiosResponse = {
      data: mockResponse ,
      status: 400,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    }

    vi.spyOn(thymeAxios, 'get').mockResolvedValue(mockAxiosResponse as any)
    
    await api.getRecipes().catch((error) => {
        console.log("error: ", error)
        expect(error).not.toBeUndefined()
    })
    
  }, 30000)
})