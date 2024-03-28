import { Recipe } from '@/models/recipeModel'; 
import snakecaseKeys from 'snakecase-keys'
import camelcaseKeys from 'camelcase-keys'
import Toaster from "@/components/toast";
import axios from 'axios'
 

const thymeAxios = axios.create({
    baseURL: 'http://localhost:9292',
})

async function doesRecipeExist(hashedId: string) {
    return await new Promise<void>( (resolve, reject) => {

        // setup interceptor
        const responseInterceptor = thymeAxios.interceptors.response.use(function (config) {
            config.data = camelcaseKeys(config.data, { deep: true })
            return config
        })

        thymeAxios.get('/recipes', {
            params: {
                recipeId: hashedId
            }
        })
        .then(response => {
            if (response.data.statusCode == '404') {
                Toaster.toastInfo("Recipe doesn't exist. Creating new one...")  
                resolve()
            } else {
                reject()
            }    
        })
        .catch(error => {
            console.log(error)
            reject()
        }); 

        // remove interceptor
        axios.interceptors.response.eject(responseInterceptor)
    })
}

async function postRecipe(recipe: Recipe) {
    return await new Promise<void>( (resolve) => {
        console.log("recipe uploading:")
        console.log(recipe)
        // Setup Interceptor
        const requestInterceptor = thymeAxios.interceptors.request.use(function (config) {
            config.data = JSON.stringify(snakecaseKeys(config.data, { deep: true }))
            return config
        })

        thymeAxios.post(
            '/recipes', 
            recipe
        )
        .then(response => {
            console.log(response)
            Toaster.toastSuccess("Recipe Uploaded!")
            resolve()
        })
        .catch(error => {
            // your action on error success
            Toaster.toastError("Error uploading to backend!!")
            console.error(error)
        })

        // remove interceptor
        axios.interceptors.request.eject(requestInterceptor)
    })
}

const ThymeBackendAPI = {
    doesRecipeExist, postRecipe
}

export default ThymeBackendAPI