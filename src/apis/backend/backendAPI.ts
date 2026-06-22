import axios from 'axios'
import { RecipeModel } from '../../models/recipeModels'
import { IngredientSectionDTO, RecipeBaseDTO, RecipeDTO } from '../../models/recipeDB'
import { convertRecipeDTOToRecipe, convertRecipeToRecipeBaseDTO, convertRecipeToRecipeDTO, convertRecipeToRecipeIngredientDTO, DoesRecipeExistOuput } from './utils'

export const thymeAxios = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
})

const doesRecipeExist = async (recipeName: string) => {

    const hashedName = await getHashedName(recipeName)

    return await new Promise<DoesRecipeExistOuput>( (resolve, reject) => {
        thymeAxios.get('/recipes', {
            params: {
                recipeId: hashedName
            }
        })
        .then(response => {
            if (response.data.status_code == '404') { // Recipe does not exist
                resolve({ exists: false, recipe: null})
            } else if (response.data.status_code == '200') {
                console.log("response: ", response.data)
                resolve({ exists: true, recipe: response.data})
            }    
        })
        .catch(error => {
            console.log(error)
            reject(error)
        }) 
    })
}

const getHashedName = async (recipeName: string) => {
    return await new Promise<string>( (resolve, reject) => {

        thymeAxios.get(`utils/hashedName/`+recipeName)
        .then(async response => {
            console.log("HashedName Response from API: ", response)

            if (response.status == 200) {
                const hashedName: string = response.data
                resolve(hashedName)
            } else {
                reject("Received unexpected response code")
            }
        }).catch((error) => {
            console.error(error)
            reject(error)
        })
    })
}

const getRecipe = async (recipeId: string) => {
    return await new Promise<RecipeModel>( (resolve, reject) => {

        thymeAxios.get(`/recipes/`+recipeId)
        .then(async response => {
            // console.log("Response from API: ", response, response.data)

            if (response.status == 200) {
                const responseObj: RecipeDTO = response.data.data
                const recipe: RecipeModel = await convertRecipeDTOToRecipe(responseObj)
                // console.log("returning recipe: ", recipe)
                resolve(recipe)
            } else if (response.data.status_code == "404") {
                resolve (new RecipeModel())
            } else {
                reject("Received unexpected response code")
            }
        }).catch((error) => {
            console.error(error)
            reject(error)
        })
    })
}

const getRecipes = async () => {
    return await new Promise<RecipeModel[]>( (resolve, reject) => {
        thymeAxios.get('/recipes/', {})
        .then(response => {
            console.log("Response from API: ", response.data)
            const responseObj: RecipeDTO[] = response.data.recipes
            console.log("response: ", responseObj)
            const convertedResponse: RecipeModel[] = []
            responseObj.map((recipe: RecipeDTO) => {
                convertRecipeDTOToRecipe(recipe).then((recipeObj: RecipeModel) => {
                    convertedResponse.push(recipeObj)
                })
            })

            resolve(convertedResponse)
        })
        .catch(error => {
            console.log(error)
            reject()
        }); 
    })
}

const postRecipe = async (recipe: RecipeModel) => {
    return await new Promise<void>( (resolve, reject) => {
        console.log("recipe uploading: ", recipe)

        let postingRecipe: RecipeDTO | undefined = undefined
        convertRecipeToRecipeDTO(recipe).then((response) => {
            postingRecipe = response
            console.log(postingRecipe)
            if (postingRecipe) {
                thymeAxios.post(
                    '/recipes', 
                    postingRecipe
                )
                .then(response => {
                    console.log(response)
                    resolve()
                })
                .catch(error => {
                    // your action on error success
                    console.error(error)
                })
            }
        }).catch((error) => {
            console.log(error)
            reject(error)
        })
    })
}

const updateRecipeBase = async (recipe: RecipeModel) => {
    return await new Promise<void>( (resolve, reject) => {
        console.log("recipe uploading:", recipe)

        const convertedRecipeBase: RecipeBaseDTO = convertRecipeToRecipeBaseDTO(recipe)
        
        try {
            console.log("Sending Recipe: ", convertedRecipeBase)
            if (convertedRecipeBase) {
                thymeAxios.put(
                    '/recipes/base', 
                    convertedRecipeBase
                )
                .then(response => {
                    console.log(response)
                    resolve()
                })
                .catch(error => {
                    // your action on error success
                    console.error(error)
                })
            }
        } catch (err) {
            console.error(err)
            reject(err)
        }
    })
}

const updateRecipeIngredients = async (recipe: RecipeModel) => {
    return await new Promise<void>( (resolve, reject) => {
        console.log("recipe uploading:", recipe)

        const convertedRecipeIngredients: IngredientSectionDTO[] = convertRecipeToRecipeIngredientDTO(recipe)

        const requestBody = {
            "recipe_id": recipe.recipeId,
            "ingredient_sections": convertedRecipeIngredients
        }
        try {
            console.log("Sending IngredientList: ", requestBody)
            if (convertedRecipeIngredients.length > 0) {
                thymeAxios.put(
                    '/recipes/ingredient_sections',
                    requestBody
                )
                .then(response => {
                    console.log(response)
                    resolve()
                })
                .catch(error => {
                    // your action on error success
                    console.error(error)
                })
            }
            else {
                console.error("List to update is empty")
                reject("List to update is empty")
            }
        } catch (err) {
            console.error(err)
            reject(err)
        }
    })
}


const BackendAPI = {
    doesRecipeExist, postRecipe, getRecipe, getRecipes, updateRecipeBase, getHashedName, updateRecipeIngredients
}

export default BackendAPI