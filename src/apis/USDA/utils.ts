/* eslint-disable @typescript-eslint/no-explicit-any */
import { Ingredient, NutritionFacts } from "@/models/recipeModels"
import { FoodModel } from "@/models/USDA"

export type NutrientCodeType = {
    name: string
    id: number
    nutrientNumber: string
    unitName: string
    amount: number
}

export type IngredientIDsAndNutrients = {
    fdcId: string, 
    nutrients: NutritionFacts
}

export const nutrientCodes: NutrientCodeType[] = [
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

export const convertToIngredientListAbridged = (responseData: any): Ingredient[] => {
    const newList: Ingredient[] = []

    // Pull out the Data List from the Response
    const data:FoodModel[] = responseData["data"]
    
    if (data) {
        data.map((item: any) => {
            const ing: Ingredient = new Ingredient()
            ing.name = item["description"] ? item["description"] : "NULL"
            ing.fdcId = item["fdcId"] ? item["fdcId"] : ""

            // Nutrients
            // Copy nutrientCodes to new object
            const nutrients: NutrientCodeType[] = [...nutrientCodes]

            const extractedNutrients = item["foodNutrients"]
            // Extract values to list
            if (extractedNutrients) {
                const nutrientMap: Record<string, any> = {}

                for (const it of extractedNutrients) {
                    if (it.number != null) {
                        nutrientMap[it.number] = it
                    }
                }

                nutrients.forEach((nutrient) => {
                    const match = nutrientMap[nutrient.nutrientNumber]
                    if (match) {
                        (ing as any)[nutrient.name] = match.amount
                        ing.measurement = match.unitName
                    }
                })
            }
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

export const convertToIngredient = (responseData: any): Ingredient => {
    const newIng: Ingredient = new Ingredient()

    // Pull out the Data List from the Response
    console.log("responseData: ", responseData)
    const data = responseData["data"]
    console.log("data: ", responseData["data"])
    
    if (data) {
        
        data.map((item: any) => {
            const nutrientFacts: NutritionFacts = new NutritionFacts()
            console.log("item: ", item)
            // Get values
            if (item["foodNutrients"]) {
                for (const it of item["foodNutrients"]) {
                    if (it.nutrient && it.nutrient.name) {

                        const number: string = it.nutrient.number
                        const converter = nutrientCodes.find((nc: NutrientCodeType) => nc.nutrientNumber === number)

                        if (converter) {
                            nutrientFacts[converter.name as keyof NutritionFacts] = it.amount
                        }
                    }
                }
            }
            console.debug("pushing value: ", item.fdcId, nutrientFacts)
            // newList.push({ fdcId: item.fdcId, nutrients: nutrientFacts }) 
        })
        console.debug("NEWLIST: ", newIng)
        
    } else {
        console.error("ERROR: There was an issue with the data: ", responseData)
        // return newIng
    }
    return newIng
}