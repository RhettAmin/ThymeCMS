/* eslint-disable @typescript-eslint/no-explicit-any */
import { Ingredient, NutritionFacts } from "@/models/recipeModels"

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
    const data = responseData["data"]

    if (data) {
        data.map((item: any) => {
            console.log("ID: ", item["fdcId"] )
            const ing: Ingredient = new Ingredient("", 0, "", 0)
            ing.name = item["description"] ? item["description"] : "NULL"
            ing.fdcid = item["fdcId"] ? item["fdcId"] : ""

            // Nutrients
            // Copy nutrientCodes to new object
            const nutrients: NutrientCodeType[] = [...nutrientCodes]
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

export const convertToIngredientList = (responseData: any): IngredientIDsAndNutrients[] => {
    const newList: IngredientIDsAndNutrients[] = []

    // Pull out the Data List from the Response
    // console.log("responseData: ", responseData)
    if (responseData["data"]) {
        // console.log("data: ", responseData["data"])
        responseData["data"].map((item: any) => {
            const nutrientFacts: NutritionFacts = new NutritionFacts()
            
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
            // console.debug("pushing value: ", item.fdcId, nutrientFacts)
            newList.push({ fdcId: item.fdcId, nutrients: nutrientFacts }) 
        })
        console.debug("NEWLIST: ", newList)
        return newList
    } else {
        console.error("ERROR: There was an issue with the data: ", responseData)
        return []
    }
}