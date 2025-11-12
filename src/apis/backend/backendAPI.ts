import axios from 'axios'
import { RecipeModel } from '../../models/recipeModels'
import { RecipeDTO } from '../../models/recipeMongo'
import { convertRecipeDTOToRecipe, convertRecipeToRecipeDTO, DoesRecipeExistOuput, generateID } from './utils'

export const thymeAxios = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
})

const doesRecipeExist = async (recipeName: string) => {
    return await new Promise<DoesRecipeExistOuput>( (resolve, reject) => {
        thymeAxios.get('/recipes', {
            params: {
                recipeId: generateID(recipeName)
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

const getRecipe = async (recipeName: string) => {
    return await new Promise<RecipeModel>( (resolve, reject) => {

        const id = generateID(recipeName)
        console.log("Generated id: ", id)
        thymeAxios.get('/recipes', {
            params: {
                recipeId: id
            }
        })
        .then(async response => {
            console.log("Response from API: ", response, response.data)
            // We're getting a single recipe here. 
            // The API call returns it as a list so we grab the first value
            if (response.data.status_code == "200") {
                const responseObj: RecipeDTO = response.data.recipe_list[0] 

                const recipe: RecipeModel = await convertRecipeDTOToRecipe(responseObj)
                console.log("returning recipe: ", recipe)
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
        thymeAxios.get('/recipes', {})
        .then(response => {
            console.log("Response from API: ", response.data)
            const responseObj: RecipeDTO[] = response.data.recipe_list 
            
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

const updateRecipe = async (recipe: RecipeModel) => {
    return await new Promise<void>( (resolve, reject) => {
        console.log("recipe uploading:", recipe)

        let postingRecipe: RecipeDTO | undefined = undefined
        convertRecipeToRecipeDTO(recipe).then((response) => {
            postingRecipe = response
            console.log("Sending Recipe: ", postingRecipe)
            if (postingRecipe) {
                thymeAxios.patch(
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




const BackendAPI = {
    doesRecipeExist, postRecipe, getRecipe, getRecipes, updateRecipe
}

export default BackendAPI