import { RecipeModel, IngredientSectionModel, 
    InstructionSectionModel, NutritionFacts, Ingredient } from "../models/recipeModels"
import InstructionSectionList from "./InstructionSectionList"
import NutritionLabel from "../components/nutritionLabel/nutritionLabel"
import IngredientSectionList from "./IngredientSectionList"
import OPEN_AI_API from "@/apis/openAI/api"
import BackendAPI from "@/apis/backend/backendAPI"
import { useEffect, useState, useMemo } from "react"
import toast, { Toast, Toaster } from "react-hot-toast"
import { useSearchParams } from "react-router-dom"
import { DoesRecipeExistOuput } from "@/apis/backend/utils"
import { Button } from "@/components/button"
import { NutrientProfile, scaleIngredientNutrients, sumNutrientProfiles, perServing } from "@/utils/nutrientScaling"

enum DISPLAY_STATE_TYPE  {
    NEW, EDIT
}

enum EDIT_VIEW_TYPE  {
    MAIN, ING, INS
}

const RecipeEditor = () => {
    
    // NewOrEdit Mode // Display switch
    const [displayMode, setDisplayMode] = useState<DISPLAY_STATE_TYPE>(DISPLAY_STATE_TYPE.NEW)
    const [editView, setEditView] = useState<EDIT_VIEW_TYPE>(EDIT_VIEW_TYPE.MAIN)

    // Main Recipe
    const [mainRecipe, setMainRecipe] = useState<RecipeModel>(new RecipeModel())
    const allIngredients = mainRecipe.ingredientSections.flatMap((s) => s.ingredients)

    // Input for individual recipes
    const [searchParams] = useSearchParams()
    const inboundRecipeId = searchParams.get('recipeId')

    // Calculate Loading bar
    const [displayNFLoading, setDisplayNFLoading] = useState<boolean>(false)
    const [displayNFError, setDisplayNFError] = useState<string>("")

    const nutrition = useMemo(
        () => getRecipeNutritionTotals(allIngredients, mainRecipe.totalServings),
        [allIngredients, getRecipeNutritionTotals, mainRecipe.totalServings]
    )

    console.log("Nutrition: ", nutrition)

    useEffect(() => {
        const loadRecipe = async () => {
            if (inboundRecipeId) {
                console.debug("loading recipe...", inboundRecipeId)
                // loadRecipe(inboundRecipeId)
                const recipe = await BackendAPI.getRecipe(inboundRecipeId)
                if (recipe)
                    console.log("recipe: ", recipe)
                    setDisplayMode(DISPLAY_STATE_TYPE.EDIT)
                    setMainRecipe(recipe)
            } 
        }
        loadRecipe()
    }, [inboundRecipeId])

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

    const updateIngredientSections = () => {
        console.debug("updateIngredientSections INPUT: ", mainRecipe )

        BackendAPI.updateRecipeIngredients(mainRecipe)
            .then(() => {
                console.log("Recipe Ingredient List updated!")
            })
            .catch((err) => {
                console.error(err)
            })
    }

    // Nutrition Values ==================================================================
    
    function scaleOneIngredient(ing: Ingredient) {
      const per100g: NutrientProfile = {
        calories: ing.calories,
        fat: ing.fat,
        saturatedFat: ing.saturatedFat,
        transFat: ing.transFat,
        carbohydrate: ing.carbohydrate,
        fibre: ing.fibre,
        sugars: ing.sugars,
        protein: ing.protein,
        cholesterol: ing.cholesterol,
        sodium: ing.sodium,
        vitaminD: ing.vitaminD,
        iron: ing.iron,
        potassium: ing.potassium,
        calcium: ing.calcium,
      };
     
      return scaleIngredientNutrients(
        per100g,
        ing.quantity,
        ing.measurement,
        ing.conversionType,
        { gramWeightOverride: ing.gramWeight ?? undefined }
      );
      // Returns null if grams couldn't be resolved (OTHER type, no gram_weight set)
    }
    
    function getRecipeNutritionTotals(
      allIngredients: Ingredient[],
      servings: number
    ) {
      const results = allIngredients
        .map((ing) => ({ ing, result: scaleOneIngredient(ing) }));
     
      const resolved = results.filter((r) => r.result !== null);
      const unresolved = results.filter((r) => r.result === null).map((r) => r.ing.name);
     
      const total = sumNutrientProfiles(resolved.map((r) => r.result!.nutrients));
      const perServingValues = servings > 0 ? perServing(total, servings) : total;
      const hasApproximations = resolved.some((r) => r.result!.isApproximate);
     
      return {
        total,
        perServing: perServingValues,
        hasApproximations,   // some ingredient used an assumed density (VOLUME, no override)
        unresolvedIngredients: unresolved, // OTHER type, no gram_weight set — excluded from totals
      };
    }

    // Template ==========================================================================
    const mainInfoDisplay = () => {
        return (
            <div className="flex flex-col gap-4 w-full h-full items-center">
                <div className="flex flex-row gap-x-12 w-full h-full">
                    {/* Image links and Preview */}
                    <div className="w-[40%] h-fit flex flex-col space-y-2">
                        <div className={`bg-orange-300  ${ mainRecipe.heroImageLink ? 'w-full h-[400px]' : 'w-full h-[400px]' }`}>
                            <img className="w-full h-full object-cover" src={mainRecipe.heroImageLink}/>
                        </div>
                            {/* Main Image Links */}
                        <div className="col-span-2 flex flex-col w-full gap-y-2">
                            <label className="font-bold text-text-primary">Hero Image Link</label>
                            <input
                                className="border-b-1 outline-none px-2 w-full text-text-secondary bg-surface-input"
                                type="text"
                                value={mainRecipe.heroImageLink}
                                onChange={(e) => {updateRecipe("heroImageLink", e.target.value)}}
                            />
                        </div>
                        <div className="col-span-2 flex flex-col w-full gap-y-2">
                            <label className="font-bold text-text-primary">Main Image Link</label>
                            <input
                                className="border-b-1 outline-none px-2 w-full text-text-secondary bg-surface-input"
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
                    {/* Base Info */}
                    <div className="w-[60%] h-full flex flex-col gap-y-2">
                        {/* Name */}
                        <div className="col-span-8 flex flex-col gap-y-2">
                            <label className="font-bold">Recipe Name</label>
                            <input
                                className="border-b-1 outline-none px-2 w-full text-text-secondary bg-surface-input"
                                type="text"
                                value={mainRecipe.name}
                                onChange={(e) => { updateRecipe("recipeName", e.target.value)}}
                            />
                        </div>
                        {/* Description */}
                        <div className="flex flex-col space-y-2">
                            <label className="font-bold">Description</label>
                            <textarea
                                className="border-b-1 outline-none px-2 w-full text-text-secondary bg-surface-input"
                                rows={8}
                                value={mainRecipe.description}
                                onChange={(e) => {updateRecipe("description", e.target.value)}}
                            />
                        </div>
                        {/* Tags */}
                        <div className="flex flex-col space-y-2">
                            <label className="font-bold">Tags</label>
                            <input
                                className="border border-1 w-96 bg-white px-2 rounded-md"
                                type="text"
                                value={mainRecipe.tags.join(",")}
                                onChange={(e) => {updateRecipe("tags", e.target.value)}}
                            />
                        </div>
                        {/* Times */}
                        <div className="w-full col-span-8 flex flex-col space-y-2 mt-2">
                            <p className="text-xl font-bold border-b-1 pb-2">Time</p>
                            <div className="w-full flex flex-row gap-x-4 pl-4">
                                <div className="flex flex-col w-full">
                                    <label className="font-bold">Time Total</label>
                                    <input
                                        type="number"
                                        className="border border-1 bg-white px-2 rounded-md w-full"
                                        value={mainRecipe.totalTime}
                                        onChange={(e) => {updateRecipe("timeToPlate", e.target.value)}}
                                    />
                                </div>
                                <div className="flex flex-col w-full">
                                    <label className="font-bold">Prep Time</label>
                                    <input
                                        type="number"
                                        className="border border-1 bg-white px-2 rounded-md w-full"
                                        value={mainRecipe.prepTime}
                                        onChange={(e) => {updateRecipe("timeToPlate", e.target.value)}}
                                    />
                                </div>
                                <div className="flex flex-col w-full">
                                    <label className="font-bold">Cook Time</label>
                                    <input
                                        type="number"
                                        className="border border-1 bg-white px-2 rounded-md w-full"
                                        value={mainRecipe.cookTime}
                                        onChange={(e) => {updateRecipe("timeToPlate", e.target.value)}}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Servings */}
                        <div className="col-span-8 flex flex-col gap-y-4">
                            <p className="text-xl font-bold border-b-1 pb-2">Servings</p>
                            <div className="w-full flex flex-row gap-x-4 pl-4">
                                <div className="flex flex-col gap-x-4">
                                    <label className="font-bold">Total Servings</label>
                                    <input
                                        type="number"
                                        className="border border-1 bg-white px-2 rounded-md w-full"
                                        value={mainRecipe.totalServings}
                                        onChange={(e) => {updateRecipe("totalServings", e.target.value)}}
                                    />
                                </div>
    
                                <div className="flex flex-col gap-x-4">
                                <label className="font-bold">Serving Size</label>
                                <input
                                        type="number"
                                        className="border border-1 bg-white px-2 rounded-md w-full"
                                        value={mainRecipe.servingSize}
                                        onChange={(e) => {updateRecipe("servingSize", e.target.value)}}
                                />
                                </div>
                                <div className="flex flex-col gap-x-4">
                                <label className="font-bold">Form</label>
                                <input
                                        className="border border-1 bg-white px-2 rounded-md w-full"
                                        type="text"
                                        value={mainRecipe.servingForm}
                                        onChange={(e) => {updateRecipe("servingForm", e.target.value)}}
                                />
                                </div>
                            </div>
                        </div>
    
                    </div>
    
                </div>
                <div className="flex justify-center w-full border-t border-border pt-4">
                    <Button
                        message={ displayMode == DISPLAY_STATE_TYPE.EDIT ? "Update Base Recipe" : "Add Recipe" }
                        onClickFn={ () => updateBaseRecipe() }
                    />
                </div>
            </div>
        )
    }

    const ingredientDisplay = () => {
        return (
            <div className="flex flex-col space-y-4 py-2 w-full h-full border-b border-border overflow-y-scroll">
                <div className="w-full">
                    <IngredientSectionList
                        ingredientSections={ mainRecipe.ingredientSections }
                        onUpdateRecipe={(newList: IngredientSectionModel[]) => {
                            setMainRecipe((prev) => {
                                return { ...prev, ingredientSections: newList }
                            })
                            updateInstructionSectionsFromIngredients(newList)
                        }}
                        updateDB={() => updateIngredientSections()}
                    />
                </div>
                <div className="flex flex-col w-full justify-center space-y-4 items-center">
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
        )
    }

    const instructionDisplay = () => {
        return (
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
                    }}
                />
            </div>
        )
    }

    const displaySwitcher = () => {
        switch(editView) {
            case EDIT_VIEW_TYPE.MAIN:
                return mainInfoDisplay()
            case EDIT_VIEW_TYPE.ING:
                return ingredientDisplay()
            case EDIT_VIEW_TYPE.INS:
                return instructionDisplay()
        }
    }

    return (
        <div className="w-full h-full overflow-hidden flex flex-row">
            <Toaster/>
            {/* Title */}
            {/* <h2 className="text-3xl font-semibold w-full text-text-primary text-center py-4 shrink-0">Add Recipe</h2> */}

            {/* Controls */}
            <div className="w-[15%] h-full border-r-2 border-gray-300 bg-nav-hover z-2 px-4">
                <div className="text-center text-xl mt-10 text-white">Controls</div>

                <div className="h-full flex flex-col space-y-6 place-items-evenly mt-12">
                    <div className="w-full flex items-center text-bold bg-brand-mid rounded-lg px-4 py-2 text-white cursor-pointer"
                        onClick={() => setEditView(EDIT_VIEW_TYPE.MAIN)}
                    > 
                        Main Info 
                    </div>
                    <div className="w-full flex items-center text-bold bg-brand-mid rounded-lg px-4 py-2 text-white cursor-pointer"
                        onClick={() => setEditView(EDIT_VIEW_TYPE.ING)}
                    > 
                        Ingredients 
                    </div>
                    <div className="w-full flex items-center text-bold bg-brand-mid rounded-lg px-4 py-2 text-white cursor-pointer"
                        onClick={() => setEditView(EDIT_VIEW_TYPE.INS)}
                    > 
                        Instructions 
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-[85%] h-full overflow-y-auto flex shadow-lg z-10 p-4">
                <div className="flex flex-col space-y-6 w-full">
                    { displaySwitcher() }
                </div>
                {
                    displayMode == DISPLAY_STATE_TYPE.NEW &&
                    <div className="flex justify-center mt-4">
                        <Button
                            message={"Submit"}
                            onClickFn={ () => uploadRecipe() }
                        />
                    </div>
                }
            </div>
                
        </div>
    )
} 

export default RecipeEditor