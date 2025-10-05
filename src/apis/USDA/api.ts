/* eslint-disable @typescript-eslint/no-explicit-any */
import { Ingredient, NutritionFacts } from '@/models/recipeModels'
import axios from 'axios'

const usdaAxios = axios.create({
    baseURL: 'https://api.nal.usda.gov/fdc/v1',
})

const API_KEY = "Jn9lVbi0jXaeYjduFIJdQaTfZTB2d3swONybyS3d"
const sources = ["Foundation", "SR Legacy"]

type NutrientCodeType = {
    name: string
    id: number
    nutrientNumber: string
    unitName: string
    amount: number
}

const nutrientCodes: NutrientCodeType[] = [
  { name: "calories", id: 1008, nutrientNumber: "208", unitName: "kcal", amount: 0 },
  { name: "fat", id: 1004, nutrientNumber: "204", unitName: "g", amount: 0 },
  { name: "saturatedFat", id: 1258, nutrientNumber: "606", unitName: "g", amount: 0 },
  { name: "transFat", id: 1257, nutrientNumber: "605", unitName: "g", amount: 0 }, 
  { name: "carbohydrate", id: 1005, nutrientNumber: "205", unitName: "g", amount: 0 },
  { name: "fibre", id: 1079, nutrientNumber: "291", unitName: "g", amount: 0 },
  { name: "protein", id: 1003, nutrientNumber: "203", unitName: "g", amount: 0 },
  { name: "cholesterol", id: 1253, nutrientNumber: "601", unitName: "mg", amount: 0 },
  { name: "sodium", id: 1093, nutrientNumber: "307", unitName: "mg", amount: 0 },
  { name: "vitamind", id: 1110, nutrientNumber: "324", unitName: "IU", amount: 0 },
  { name: "potassium", id: 1092, nutrientNumber: "306", unitName: "mg", amount: 0 },
  { name: "calcium", id: 1087, nutrientNumber: "301", unitName: "mg", amount: 0 }
]
// Functions =================================================================

const listFoodByNameAbridged = async (foodname: string, pageNumber: number | null = null) => {
    return await new Promise<Ingredient[]>( (resolve, reject) => {
        const start = new Date().getTime()
        console.debug("listFoodByNameAbridged input: ", foodname, pageNumber)
        const requestBody = {
            api_key: API_KEY,
            query: foodname,
            dataType: sources.toString(),
            pageSize: 5,
            pageNumber: pageNumber ? pageNumber : 0
        }
        console.debug("REQUEST BODY: ", requestBody)
        
        usdaAxios.get('/foods/list', {
            params: requestBody
        })
        .then(response => {
            console.debug('SUCCESS: listFoodByNameAbridged took', (new Date().getTime() - start), '')
            console.debug(response)
            const ingredientList = convertToIngredientList(response)
            resolve(ingredientList)   
        })
        .catch(error => {
            console.error('ERROR: listFoodByNameAbridged took', (new Date().getTime() - start))
            console.error(error)
            reject(error)
        }) 
    })
}

// Helper Functions =================================================================================================

const convertToIngredientList = (responseData: any): Ingredient[] => {
    const newList: Ingredient[] = []

    // Pull out the Data List from the Response
    const data = responseData["data"]

    if (responseData["data"]) {
        data.map((item: any) => {
            const ing: Ingredient = new Ingredient("", 0, "", 0)
            ing.name = item["description"] ? item["description"] : "NULL"
            // Quantity, measurement and Type will have to modified later after adding an ingredient 

            // Nutrients
            // Copy nutrientCodes to new object
            const nutrients = [...nutrientCodes]
            // Get values
            if (item["foodNutrients"]) {
                const nutrientMap: Record<string, any> = {}

                for (const it of item["foodNutrients"]) {
                    if (it.number != null) {
                        nutrientMap[it.number] = it
                    }
                }

                nutrients.forEach((nutrient) => {
                    const match = nutrientMap[nutrient.nutrientNumber]
                    
                    if (match) {
                        nutrient.amount = match.amount ?? nutrient.amount
                    }
                })
            }
            
            //  Set new Ingredients NutritonFacts
            const facts = new NutritionFacts()

            nutrients.forEach(({ name, amount }) => {
                // Only copy if the property exists on the NutritionFacts instance
                if (name in facts) {
                    // `as any` keeps the code short remove it if you add a
                    // mapped-type helper to get full compile-time safety.
                    (facts as any)[name] = amount
                }
            })
            ing.nutrients = facts

            newList.push(ing)
            return newList
        })
    } else {
        console.error("ERROR: There was an issue with the data: ", responseData)
        return []
    }

    console.log("NEWLIST: ", newList)
    return newList
}

const USDAAPI = {
    listFoodByNameAbridged
}

export default USDAAPI