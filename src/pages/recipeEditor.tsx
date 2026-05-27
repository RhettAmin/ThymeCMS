import { RecipeModel, IngredientSectionModel, 
    InstructionSectionModel, NutritionFacts, Ingredient } from "../models/recipeModels"
import InstructionSectionList from "./InstructionSectionList"
import NutritionLabel from "../components/nutritionLabel/nutritionLabel"
import IngredientSectionList from "./IngredientSectionList"
import OPEN_AI_API from "@/apis/openAI/api"
import BackendAPI from "@/apis/backend/backendAPI"
import { useCallback, useEffect, useState } from "react"
import toast, { Toast, Toaster } from "react-hot-toast"
import { useSearchParams } from "react-router-dom"
import { DoesRecipeExistOuput } from "@/apis/backend/utils"
import Button from "@/components/button"

const enum DisplayStateType  {
    NEW, EDIT
}

const RecipeEditor = () => {
    
    const createBlankRecipe = useCallback(() => {
        const recipe = new RecipeModel()
        recipe.ingredientSections = [new IngredientSectionModel()]
        recipe.instructionSections = [new InstructionSectionModel()]
        return recipe
    }, [])

    const loadRecipe = useCallback((recipeId: string) => {
        BackendAPI.getRecipe(recipeId)
            .then(data => {
                setDisplayMode(DisplayStateType.EDIT)
                setMainRecipe(data)
            })
    }, [])


    // DisplayStateType - Display switch
    const [displayMode, setDisplayMode] = useState<DisplayStateType>(DisplayStateType.NEW)

    // Main Recipe
    const [mainRecipe, setMainRecipe] = useState<RecipeModel>(createBlankRecipe())

    // Input for individual recipes
    const [searchParams] = useSearchParams()
    const inboundRecipeId = searchParams.get('recipeId')

    // Calculate Loading bar
    const [displayNFLoading, setDisplayNFLoading] = useState<boolean>(false)
    const [displayNFError, setDisplayNFError] = useState<string>("")

    
    useEffect(() => {
        if (inboundRecipeId) {
            console.debug("loading recipe...", inboundRecipeId)
            loadRecipe(inboundRecipeId)
        } else {
            console.debug("new recipe...")
            setMainRecipe(createBlankRecipe())
        }
    }, [createBlankRecipe, inboundRecipeId, loadRecipe])

    // Logger for recipe updates
    // useEffect(() => {
    //     console.log("MAIN RECIPE: ", mainRecipe)
    // }, [mainRecipe])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateRecipe = (key: string, value: any) => {
        setMainRecipe(prev => ({
            ...prev,
            [key]: key === "tags" ? value.split(",").trim() : value
        }))
    }

    const updateInstructionSectionsFromIngredients = (ingredientSections: IngredientSectionModel[]) => {
        if (ingredientSections.length > mainRecipe.instructionSections.length) {
            setMainRecipe((prev) => ({
                ...prev,
                instructionSections: ingredientSections.map((ingredientSection, index) => ({
                    // Use existing item if it exists   ||  Create a new one
                    ...(prev.instructionSections[index] || new InstructionSectionModel() ),
                    sectionName: ingredientSection.sectionName
                }))
            }))
        }
    }

    const updateIngredientSectionsFromInstructions = (instructionSections: InstructionSectionModel[]) => {
        if (instructionSections.length > mainRecipe.ingredientSections.length) {
            setMainRecipe((prev) => ({
                ...prev,
                ingredientSections: instructionSections.map((instructionSection, index) => ({
                    // Use existing item if it exists   ||  Create a new one
                    ...(prev.ingredientSections[index] || new IngredientSectionModel() ),
                    sectionName: instructionSection.sectionName
                }))
            }))
        }
    }

    const getTotalNutritionFactsFromRecipe = (): NutritionFacts => {
        const facts: NutritionFacts = {
            calories: mainRecipe.calories,
            fat: mainRecipe.fat,
            saturatedFat: mainRecipe.saturatedFat,
            transFat: mainRecipe.transFat,
            carbohydrate: mainRecipe.carbohydrate,
            fibre: mainRecipe.fibre,
            sugars: mainRecipe.sugars,
            protein: mainRecipe.protein,
            cholesterol: mainRecipe.cholesterol,
            sodium: mainRecipe.sodium,
            vitamind: mainRecipe.vitaminD,
            iron: mainRecipe.iron,
            potassium: mainRecipe.potassium,
            calcium: mainRecipe.calcium
        }
        return facts
    }

    const roundVals = (num: number) => Math.round(num * 100) / 100
    const calculateNutritionInformation = () => {
        setDisplayNFLoading(true)
        setDisplayNFError("")
        OPEN_AI_API.getTotalNutritionFacts(mainRecipe.ingredientSections)
        .then((response: Ingredient[]) => {
            setDisplayNFLoading(false)

            const totalNutrition: NutritionFacts = response.reduce((acc, ingredient: Ingredient) => ({
                calories: roundVals(acc.calories + ingredient.calories),
                fat: roundVals(acc.fat + ingredient.fat),
                saturatedFat: roundVals(acc.saturatedFat + ingredient.saturatedFat),
                transFat: roundVals(acc.transFat + ingredient.transFat),
                carbohydrate: roundVals(acc.carbohydrate + ingredient.carbohydrate),
                fibre: roundVals(acc.fibre + ingredient.fibre),
                sugars: roundVals(acc.sugars + ingredient.sugars),
                protein: roundVals(acc.protein + ingredient.protein),
                cholesterol: roundVals(acc.cholesterol + ingredient.cholesterol),
                sodium: roundVals(acc.sodium + ingredient.sodium),
                vitamind: roundVals(acc.vitamind + ingredient.vitaminD),
                iron: roundVals(acc.iron + ingredient.iron),
                potassium: roundVals(acc.potassium + ingredient.potassium),
                calcium: roundVals(acc.calcium + ingredient.calcium)
            }), {
                calories: mainRecipe.calories,
                fat: mainRecipe.fat,
                saturatedFat: mainRecipe.saturatedFat,
                transFat: mainRecipe.transFat,
                carbohydrate: mainRecipe.carbohydrate,
                fibre: mainRecipe.fibre,
                sugars: mainRecipe.sugars,
                protein: mainRecipe.protein,
                cholesterol: mainRecipe.cholesterol,
                sodium: mainRecipe.sodium,
                vitamind: mainRecipe.vitaminD,
                iron: mainRecipe.iron,
                potassium: mainRecipe.potassium,
                calcium: mainRecipe.calcium
            })

            setMainRecipe({
                ...mainRecipe,
                ...totalNutrition,
                ingredientSections: mainRecipe.ingredientSections.map(section => ({
                    ...section,
                    ingredients: section.ingredients.map(ingredient => {
                        // Find the matching ingredient from response by name 
                        const updatedIngredient = response?.find(
                            respIng => respIng.name === ingredient.name
                        )
                        
                        return updatedIngredient 
                            ? { ...ingredient, ...updatedIngredient }
                            : ingredient
                        })
                }))
            })
        })
        .catch((error: string) => {
            console.error(error)
            setDisplayNFLoading(false)
            setDisplayNFError(error)
        })
    }

    const uploadRecipe = () => {  
        console.log("Final Recipe: \r\n", mainRecipe)
        BackendAPI.doesRecipeExist(mainRecipe.name)
            .then((output: DoesRecipeExistOuput) => {
                if (output.exists) {    // Recipe exists - update
                    BackendAPI.updateRecipeBase(mainRecipe)
                        .then(() => {
                            console.debug("Recipe Base updated successfully!")
                            toast.success("Recipe Base updated successfully!")
                        })
                        .catch((error: Partial<Pick<Toast, "className" | "id" | "icon" | "duration" | "ariaProps" | "style" | "position" | "iconTheme" | "toasterId" | "removeDelay">> | undefined) => {
                            console.error("Something went wrong updating: ", error)
                            toast.error("Something went wrong updating: ", error)
                        })
                } else { // No Recipe - Create
                    BackendAPI.postRecipe(mainRecipe)
                        .then(() => { 
                            console.debug("Recipe updated successfully!")
                            toast.success("Recipe created successfully!")
                        })
                        .catch((error) => {
                            console.error("Something went wrong updating: ", error)
                            toast.error("Something went wrong creating: ", error)
                        })
                }
            }).catch((error) => {
                console.error(error)
            })
    }

    const updateBaseRecipe = () => {
        BackendAPI.updateRecipeBase(mainRecipe)
            .then(() => {
                console.debug("Recipe updated successfully!")
                toast.success("Recipe updated successfully!")
            })
            .catch((error) => {
                console.error("Something went wrong updating: ", error)
                toast.error("Something went wrong updating: ", error)
            })
    }

    return (
        <div className="w-full h-full">
            <Toaster/>
            <h2 className="text-3xl font-semibold w-full text-center mb-4">Add Recipe</h2>
            <div className="flex flex-col w-full">
                {/* Main Content */}
                <div className="flex-1 h-full flex flex-col items-center overflow-y-auto p-4"> 
                    <div className="flex flex-col space-y-6 w-[80%]">   
                        {/* Main form fields */}
                        <div className="flex flex-col gap-4 w-full">
                            <div className="flex flex-row gap-x-12 w-full">
                                
                                {/* Base Info */}
                                <div className="w-[50%] flex flex-col gap-y-2">
                                    {/* Name */}
                                    <div className="col-span-8 flex flex-col gap-y-2">
                                        <label className="font-bold">Recipe Name</label>
                                        <input
                                            className="border border-1 bg-white px-2 rounded-md w-full"
                                            type="text"
                                            value={mainRecipe.name}
                                            onChange={(e) => { updateRecipe("recipeName", e.target.value)}}
                                        />
                                    </div>
                                    {/* Description */}
                                    <div className="">
                                        <label className="font-bold">Description</label>
                                        <textarea
                                            className="border border-1 bg-white px-2 rounded-md h-full w-full"
                                            rows={4}
                                            value={mainRecipe.description}
                                            onChange={(e) => {updateRecipe("description", e.target.value)}}
                                        />
                                    </div>

                                    {/* Time and Tags */}
                                    <div className="col-span-8 flex flex-row gap-x-4 mt-4">
                                        <div className="flex flex-col">
                                            <label className="font-bold">Time to Plate (minutes)</label>
                                            <input
                                                type="number"
                                                className="border border-1 bg-white px-2 rounded-md"
                                                value={mainRecipe.timeToPlate}
                                                onChange={(e) => {updateRecipe("timeToPlate", e.target.value)}}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="font-bold">Tags</label>
                                            <input
                                                className="border border-1 w-96 bg-white px-2 rounded-md"
                                                type="text"
                                                value={mainRecipe.tags.join(",")}
                                                onChange={(e) => {updateRecipe("tags", e.target.value)}}
                                            />
                                        </div>
                                    </div>

                                    {/* Servings */}
                                    <div className="col-span-8 flex flex-col gap-y-4">
                                        <p className="text-xl font-bold">Servings</p>
                                        <div className="flex flex-row gap-x-4">
                                            <div className="flex flex-col gap-x-4">
                                                <label className="font-bold">Total Servings</label>
                                                <input
                                                    type="number"
                                                    className="border border-1 bg-white px-2 rounded-md"
                                                    value={mainRecipe.totalServings}
                                                    onChange={(e) => {updateRecipe("totalServings", e.target.value)}}
                                                />
                                            </div>
                                            
                                            <div className="flex flex-col gap-x-4">
                                            <label className="font-bold">Serving Size</label>
                                            <input 
                                                    type="number"
                                                    className="border border-1 bg-white px-2 rounded-md" 
                                                    value={mainRecipe.servingSize}
                                                    onChange={(e) => {updateRecipe("servingSize", e.target.value)}}
                                            />
                                            </div>
                                            <div className="flex flex-col gap-x-4">
                                            <label className="font-bold">Form</label>
                                            <input 
                                                    className="border border-1 bg-white px-2 rounded-md"
                                                    type="text"
                                                    value={mainRecipe.servingForm}
                                                    onChange={(e) => {updateRecipe("servingForm", e.target.value)}}
                                            />
                                            </div>
                                        </div>
                                    </div>
                                        
                                </div>

                                {/* Image links and Preview */}
                                <div className="w-[50%] flex flex-col space-y-2">

                                    <div className={`bg-orange-300  ${ mainRecipe.heroImageLink ? 'w-full h-[400px]' : 'w-full h-[400px]' }`}>
                                        <img className="w-full h-full object-cover" src={mainRecipe.heroImageLink}/>
                                    </div>

                                     {/* Main Image Links */}
                                    <div className="col-span-2 flex flex-col w-full gap-y-2">
                                        <label className="font-bold">Hero Image Link</label>
                                        <input
                                            className="border border-1 bg-white px-2 rounded-md"
                                            type="text"
                                            value={mainRecipe.heroImageLink}
                                            onChange={(e) => {updateRecipe("heroImageLink", e.target.value)}}
                                        />
                                    </div>
                                    <div className="col-span-2 flex flex-col w-full gap-y-2">
                                        <label className="font-bold">Main Image Link</label>
                                        <input
                                            className="border border-1 bg-white px-2 rounded-md"
                                            type="text"
                                            value={mainRecipe.mainImageLink}
                                            onChange={(e) => {updateRecipe("mainImageLink", e.target.value)}}
                                        />
                                    </div>


                                    {/* Is Active */}
                                    {/* <div className="flex space-x-2">
                                        <label className="font-bold">is Active</label>
                                        <input
                                            type="checkbox"
                                            // checked={mainRecipe.isActive}
                                            // onChange={() => { updateRecipe("isActive", !mainRecipe.isActive) }}
                                        />
                                    </div> */}
                                </div>
                            </div>

                            {
                                displayMode == DisplayStateType.EDIT &&
                                <div className="flex justify-center w-full">
                                    <Button
                                        width="[40%]"
                                        message={"Update Base Recipe"} 
                                        onClickFn={ () => updateBaseRecipe() } 
                                    />
                                </div>
                            }
                        </div>

                        {/*  Ingredients */}
                        <div className="flex flex-row justify-evenly w-full border-b border-t gap-x-4 py-6 border-black">
                            <div className="w-full flex-1">
                                <IngredientSectionList
                                    ingredientSections={ mainRecipe.ingredientSections }
                                    onUpdateRecipe={(newList: IngredientSectionModel[]) => {
                                        setMainRecipe((prev) => {
                                            return { ...prev, ingredientSections: newList }
                                        })
                                        updateInstructionSectionsFromIngredients(newList)
                                    }}
                                />
                            </div>
                            <div className="flex flex-col justify-center space-y-4 items-center">
                                <NutritionLabel
                                    nutritionFacts={getTotalNutritionFactsFromRecipe()}
                                    totalServings={mainRecipe.totalServings}
                                    servingSize={mainRecipe.servingSize}
                                    servingForm={mainRecipe.servingForm}
                                />
                                <Button 
                                    message={"Calculate Nutrients"} 
                                    onClickFn={ () => calculateNutritionInformation() } 
                                />
                                {
                                    displayNFLoading &&
                                    (
                                        <div className="text-lg font-medium text-gray-800">
                                            Loading
                                            <span className="inline-flex ml-1">
                                                <span className="animate-pulse">.</span>
                                                <span className="animate-pulse [animation-delay:200ms]">.</span>
                                                <span className="animate-pulse [animation-delay:400ms]">.</span>
                                            </span>
                                        </div>
                                    )
                                }
                                {
                                    displayNFError &&
                                    (
                                        <div className="max-w-96">
                                            <p className="text-red-600">{displayNFError}</p>
                                        </div>
                                    )
                                }
                            </div>

                        </div>
                        
                        {/*  Instruction */}
                        <div className="flex-auto">
                            <InstructionSectionList 
                                instructionSections={mainRecipe.instructionSections}
                                ingredientSections={mainRecipe.ingredientSections} 
                                onUpdateRecipe={(newList: InstructionSectionModel[]) => {
                                    setMainRecipe((prev) => {
                                        const newModel: RecipeModel = { ...prev }
                                        newModel.instructionSections = newList
                                        return newModel
                                    })
                                    updateIngredientSectionsFromInstructions(newList)
                                } }                                
                            />
                        </div>
                    </div>

                    {
                        displayMode == DisplayStateType.NEW &&
                        <div className="flex justify-center mt-4">
                            <Button 
                                message={"Submit"} 
                                onClickFn={ () => uploadRecipe() } 
                            />
                        </div>
                    }
                </div>
                
            </div>
           
        </div>
    )
} 

export default RecipeEditor