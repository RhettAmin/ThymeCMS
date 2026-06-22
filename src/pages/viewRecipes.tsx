import BackendAPI from "@/apis/backend/backendAPI"
import { RecipeModel } from "@/models/recipeModels"
import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"


function useDebounce<T>(value: T, delay: number = 300): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay)
        return () => clearTimeout(timer)
    }, [value, delay])

    return debouncedValue
}

const ViewRecipes = () => {

    // For now capture all recipes
    // Change this to store the recent paginated values
    const [allRecipes, setAllRecipes] = useState<RecipeModel[]>([])
    // const [filteredRecipes, setFilteredRecipes] = useState<RecipeModel[]>([])
    const [query, setQuery] = useState('')
    const debouncedQuery = useDebounce(query, 0)

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

    const filteredRecipes = useMemo(() =>
        allRecipes.filter(r =>
            r.name.toLowerCase().includes(debouncedQuery.toLowerCase())
        ), [allRecipes, debouncedQuery]
    )
        
    return (
        <div className="w-full h-full flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">All Recipes</h2>

            {/* Filter Search */}
            <div className="w-full max-w-6xl">
                <input 
                    type="text"
                    value={query}
                    className="w-full border border-border text-surface-input bg-brand-mid rounded-lg px-4 py-2"
                    placeholder="Search"
                    onChange={e => setQuery(e.target.value)}  
                />


            </div>
            
            {/* Container to store gridview for recipes */}
            {/* TODO: Pagination */}
            <div className="w-full max-w-6xl px-10 flex-1 min-h-0 py-8 scrollbar-thin overflow-y-auto scrollbar-hide">
                <ul className="grid grid-cols-2 gap-8">
                {
                    filteredRecipes.map((recipe: RecipeModel, index: number) =>
                        <li key={index} className="col-span-1 bg-surface-card flex flex-row border border-thymeBorder rounded-md">
                            <img className="w-24 h-24 object-cover rounded-tl-md " src={recipe.mainImageLink}/>
                            <div className="flex flex-col space-x-8 w-full  p-2">
                                <p className="font-bold text-lg text-text-primary">{recipe.name}</p>
                                <p className="text-text-secondary">{recipe.tags.join(", ")}</p>
                                <Link to={`/recipeEditor?recipeId=${recipe.recipeId}`}>
                                    <p className="w-full text-center text-text-on-dark font-semibold bg-brand-mid cursor-pointer 
                                        active:bg-thymeButtonHover border border-thymeBorder rounded-lg">
                                            Edit
                                    </p>
                                </Link>
                            </div>
                        </li>
                    )
                }
                </ul>
            </div>
        </div>
    )
} 

export default ViewRecipes