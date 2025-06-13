/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import { IngredientSectionModel, NutritionFacts } from '../../models/recipeModels';

type returnTupleType = [nutritionFacts: NutritionFacts, errors: string[]]

const nutriConfig = {
    appId: "a22c6aaa",
    appKey: "89c4912e72c17fc88d1566b08f7eeebb",
    baseUrl: "https://trackapi.nutritionix.com",
    naturalLangEndpoint: "/v2/natural/nutrients"
}

const getNaturalLangNutrition = async(ingredientSections: IngredientSectionModel[]) => {
    return await new Promise<returnTupleType>( (resolve) => {
        let queryString = ""
        let ingredientSize = 0
        const missingIngredients: string[] = []

        console.log("API INPUT: ", ingredientSections)
        ingredientSections.forEach(section => {
            section.ingredients.forEach(ingredient => {
                if (ingredient.name != '') {
                    queryString += ingredient.quantity + " " + ingredient.measurement + " " + ingredient.name + " "
                    ingredientSize++
                }
            })
        })
        
        console.log("query: ", queryString)
        console.log(queryString != "")
        if ( queryString != "") {
            axios.post(
                nutriConfig.baseUrl+nutriConfig.naturalLangEndpoint,
                {
                    "query": queryString
                }, 

                {
                    params: {
                        'x-app-id': nutriConfig.appId,
                        'x-app-key': nutriConfig.appKey
                    }
                }
            )       
            .then(response => {
                const nutritionFacts = new NutritionFacts()

                console.log("RESPONSE: ", response)

                const foods = response.data.foods
                // find all the values that we're missing if any
                // First check if the size of the foods gotten from the API is the same length as what we inputted
                if (foods.length != ingredientSize) {
                    ingredientSections.forEach(section => {
                        section.ingredients.forEach(ingredient => {
                            const checkFoodExistence = foods.some( (food: { food_name: string; }) => 
                                food.food_name.localeCompare(ingredient.name, 'en', {sensitivity: 'base'}) == 0 )
                            if (checkFoodExistence == false) {
                                missingIngredients.push(ingredient.name)
                            }
                        })
                    })
                }

                foods.forEach((food: any) => {
                    nutritionFacts.calories += Math.round(food.nf_calories);
                    nutritionFacts.fat += Math.round(food.nf_total_fat);
                    nutritionFacts.saturatedFat += Math.round(food.nf_saturated_fat);
                    nutritionFacts.carbohydrate += Math.round(food.nf_total_carbohydrate);
                    nutritionFacts.fibre += Math.round(food.nf_dietary_fiber);
                    nutritionFacts.sugars += Math.round(food.nf_sugars);
                    nutritionFacts.protein += Math.round(food.nf_protein);
                    nutritionFacts.cholesterol += Math.round(food.nf_cholesterol);
                    nutritionFacts.sodium += Math.round(food.nf_sodium);

                    // Vitamin D (324)
                    nutritionFacts.vitamind += Math.round(findOrZero(food.full_nutrients.find((item: any) => item.attr_id == 324)) * 0.025)
                    // Iron (303)
                    nutritionFacts.iron += Math.round(findOrZero(food.full_nutrients.find((item: any) => item.attr_id == 303)));
                    // Potassium (306)
                    nutritionFacts.potassium += Math.round(findOrZero(food.full_nutrients.find((item: any) => item.attr_id == 306)));
                    // Calcium (301)
                    nutritionFacts.calcium += Math.round(findOrZero(food.full_nutrients.find((item: any) => item.attr_id == 301)));
                })

                const returnTuple: returnTupleType = [nutritionFacts, missingIngredients]
                resolve(returnTuple)
            })
            .catch(err => {
                console.error(err);
            })

        }
    })
    
}

function findOrZero(item: any): number {
    if (item == null || undefined) {
        return 0
    } else {
        return item.value
    }
}

const NutritonixAPI = {
    getNaturalLangNutrition
}

export default NutritonixAPI