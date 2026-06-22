/* eslint-disable @typescript-eslint/no-explicit-any */
import { Ingredient } from '@/models/recipeModels'
import axios from 'axios'
import { convertToIngredient, convertToIngredientListAbridged, 
    nutrientCodes, NutrientCodeType 
} from './utils'

// Move to .env file
export const usdaAxios = axios.create({
    baseURL: 'https://api.nal.usda.gov/fdc/v1',
})

const API_KEY = "Jn9lVbi0jXaeYjduFIJdQaTfZTB2d3swONybyS3d"
const sources = ["Foundation", "SR Legacy"]

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
            const ingredientList = convertToIngredientListAbridged(response)
            resolve(ingredientList)   
        })
        .catch(error => {
            console.error('ERROR: listFoodByNameAbridged took', (new Date().getTime() - start))
            console.error(error)
            reject(error)
        }) 
    })
}

// const getNutritionForIngredientList = async (usdaFDCIDS: string[]) => {
//     return await new Promise<IngredientIDsAndNutrients[]>( (resolve, reject) => {
//         const start = new Date().getTime()
//         console.debug("getNutritionForIngredientList INPUT: ", usdaFDCIDS)
//         const requestBody = {
//             api_key: API_KEY,
//             fdcIds: usdaFDCIDS.join(",").trim(),
//             format: "full",
//             nutrients: nutrientCodes.map((nutrient: NutrientCodeType) => nutrient.nutrientNumber).join(",").trim() ,
//         }
//         console.debug("REQUEST BODY: ", requestBody)
        
//         usdaAxios.get('/foods', {
//             params: requestBody
//         })
//         .then(response => {
//             console.debug('SUCCESS: listFoodByNameAbridged took', (new Date().getTime() - start), '')
//             console.debug(response)
//             const ingredientList: IngredientIDsAndNutrients[] = convertToIngredientList(response)
            
//             resolve(ingredientList)   
//         })
//         .catch(error => {
//             console.error('ERROR: listFoodByNameAbridged took', (new Date().getTime() - start))
//             console.error(error)
//             reject(error)
//         }) 
//     })
// }

const getNutritionForIngredient = async (fdcID: number) => {
    return await new Promise<Ingredient>( (resolve, reject) => {
        const start = new Date().getTime()
        console.debug("getNutritionForIngredientList INPUT: ", fdcID)
        const requestBody = {
            api_key: API_KEY,
            fdcIds: fdcID,
            format: "full",
            nutrients: nutrientCodes.map((nutrient: NutrientCodeType) => nutrient.nutrientNumber).join(",").trim() ,
        }
        console.debug("REQUEST BODY: ", requestBody)
        
        usdaAxios.get('/foods', {
            params: requestBody
        })
        .then(response => {
            console.debug('SUCCESS: listFoodByNameAbridged took', (new Date().getTime() - start), '')
            console.debug(response)
            const ingredient: Ingredient = convertToIngredient(response)
            console.log("ingredient: ", ingredient)
            resolve(ingredient)   
        })
        .catch(error => {
            console.error('ERROR: listFoodByNameAbridged took', (new Date().getTime() - start))
            console.error(error)
            reject(error)
        }) 
    })
}
// Helper Functions =================================================================================================



const USDAAPI = {
    listFoodByNameAbridged, getNutritionForIngredient
}

export default USDAAPI