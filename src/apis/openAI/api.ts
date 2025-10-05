import { nutritionFactsResponse } from "@/models/openAI"
import { IngredientSectionModel } from "@/models/recipeModels"
import OpenAI from "openai"

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // only if calling directly from frontend
})

const getTotalNutritionFacts = async (ingredientList: IngredientSectionModel[]) => {
    return await new Promise<nutritionFactsResponse>( (resolve, reject) => {

        const prompt = `
            IngredientList:
            ${JSON.stringify(ingredientList, null, 2)}

            class Ingredient {
                name: string
                quantity: number
                measurement: string
                type: number
                nutrients = new NutritionFacts()
            }

            class NutritionFacts {
                calories: number
                fat: number
                saturatedFat: number
                transFat: number
                carbohydrate: number
                fibre: number
                sugars: number
                protein: number
                cholesterol: number
                sodium: number
                vitamind: number
                iron: number
                potassium: number
                calcium: number
            }

            I have a list of ingredients that I have given you. 
            Calculate the total amount for each field in the NutritionFacts class from each ingredient in the list. 
            Round each number to 2 decimal points.
            Each ingredient in the list has it's nutrition information listed per 100g. 
            You will need to calculate the actual value by taking the quantity and measurement from the ingredient and deriving the nutrition information for that amount. 
            Provide your response in json format returning the NutritionFacts of the total from all ingredients 
            as well as a list of ingredients but where it's nutrition facts have the correct values based on the quantity and measurement

            If there is any issue return with the error or issue in the quotes:
            {
                "error": "..."
            }

            your response should be structured like this:
            {
                "nutritionFacts: { ... },
                "ingredients": [...]
            }
        `
        console.log("prompt: ", prompt, " list: ", ingredientList)
        client.responses.create({
            model: "gpt-5",
            input: prompt
        })
        .then(response => {
            console.log(response)
            if (JSON.parse(response.output_text)["error"])
                reject(`Error: ${JSON.parse(response.output_text)["error"]}`)

            const responseObj: nutritionFactsResponse = JSON.parse(response.output_text)
            
            resolve(responseObj)
        })
        .catch(error => {
            console.error('API call failed:', error)
            reject(error)
        })
    })
}

const OPEN_AI_API = {
    getTotalNutritionFacts
}

export default OPEN_AI_API
