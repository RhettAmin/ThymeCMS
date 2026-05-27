import BackendAPI from "@/apis/backend/backendAPI"
import { RecipeModel } from "@/models/recipeModels"
import { useEffect, useState } from "react"
import RecipeCard from "../components/recipeCard"


const ViewRecipes = () => {

    // For now capture all recipes
    // Change this to store the recent paginated values
    const [allRecipes, setAllRecipes] = useState<RecipeModel[]>([])

    const loadRecipes = async () => {
        await BackendAPI.getRecipes().then((recipes: RecipeModel[]) => {
            setAllRecipes(recipes)
        }).catch((error) => {
            console.log("error: ", error)
        })
    }

    // Add function to call backend API to get all recipes on start
    useEffect(() => {
        loadRecipes()
    }, [])
    
    return (
        <div className="w-full h-full flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">All Recipes</h2>
            
            {/* Container to store gridview for recipes */}
            {/* TODO: Pagination */}
            <div className="w-[60%]">
                <ul className="grid grid-cols-3 gap-x-12 gap-y-12">
                { 
                    allRecipes.map((recipe: RecipeModel, index: number) => 
                        <li key={index} className="col-span-1">
                            <RecipeCard 
                                recipeId={recipe.recipeId}
                                recipeName={recipe.name} 
                                recipeMainImageLink={recipe.mainImageLink}
                                tags={recipe.tags} 
                                description={recipe.description} 
                                timeToPlate={recipe.timeToPlate}  
                            />
                        </li>
                    )
                }
                </ul>
            </div>
        </div>
    )
} 

export default ViewRecipes