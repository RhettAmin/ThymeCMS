import { Ingredient, IngredientSectionModel } from "@/models/recipeModels"
import OpenAI from "openai"

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // only if calling directly from frontend
})

const getTotalNutritionFacts = async (ingredientList: IngredientSectionModel[]) => {
    return await new Promise<Ingredient[]>( (resolve, reject) => {
        const timeStart = new Date().getTime()
        const prompt = `
            System: Return ONLY JSON. No prose. 
            User: 
            Given ingredients with amount_g and nutrients_per_100g, scale each ingredient. 
            Round to 2 decimals. 
            Respond: 
            [{"name":"...","quantity":"...", "measurement":"...","type":"...","nutrients":{"calories":0,"fat":0,"saturatedFat":0,"transFat":0,"carbohydrate":0,"fibre":0,"sugars":0,"protein":0,"cholesterol":0,"sodium":0,"vitamind":0,"iron":0,"potassium":0,"calcium":0}}]
            ingredients=
            ${JSON.stringify(ingredientList, null, 2)}
        `
        console.log("prompt: ", prompt, " list: ", ingredientList)
        client.responses.create({
            model: "gpt-5",
            input: prompt
        })
        .then(response => {
            console.log("Response received in: ", ((new Date().getTime() - timeStart)/1000), JSON.parse(response.output_text))

            const responseObj: Ingredient[] = JSON.parse(response.output_text)
            
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
