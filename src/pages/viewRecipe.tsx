import BackendAPI from "@/apis/backend/backendAPI"
import { RecipeModel } from "@/models/recipeModels"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import LoadingElement from "@/components/LoadingElement"

const ViewRecipe = () => {
    const [recipe, setRecipe] = useState<RecipeModel>(new RecipeModel())
    const [searchParams] = useSearchParams()
    const recipeName = searchParams.get('recipeName')

    useEffect(() => {
        if (recipeName) {
            BackendAPI.getRecipe(recipeName).then(data => setRecipe(data));
        }
    }, [recipeName])
    
    return (
        <div className="w-full h-full">
            {
                recipe.recipeName == "" ?
                <div className="w-full h-screen">
                    <LoadingElement/> 
                </div> :
                <div  className="w-full h-full">
                    
                    <p> Recipe: {recipe.recipeName }</p>
                </div>
            }
        </div>
    )
} 


export default ViewRecipe