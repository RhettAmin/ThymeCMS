/* eslint-disable @typescript-eslint/no-explicit-any */
import { RecipeModel, IngredientSectionModel, Ingredient } from "../models/recipeModels"
// import NutritionLabel from "./nutritionLabel/nutritionLabel"
import { Dispatch, SetStateAction, useEffect, useState } from "react"

const AddRecipe = () => {
    const [recipeForUpload, setRecipeForUpload] = useState<RecipeModel>(new RecipeModel())
    // const [nutritionFactErrors, setNutritionFactErrors] = useState<string[]>([])

    function debounce<T extends (...args: any[]) => any>(
        func: T,
        delay: number
    ): (...args: Parameters<T>) => void {
        let timeoutId: number
        return (...args: Parameters<T>) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        }
    }
 
    // Instruction Section Functions ==============================================================================================================

    type displayIngredientSectionType = {
        ingredientSections: IngredientSectionModel[]
        onUpdateRecipe: Dispatch<SetStateAction<RecipeModel>>
    }
    const DisplayIngredientSection = ({ingredientSections, onUpdateRecipe}: displayIngredientSectionType) => {
        
        const [localSectionList, setLocalSectionList] = useState<IngredientSectionModel[]>([])

        useEffect(() => {
            setLocalSectionList(ingredientSections)
        }, [ingredientSections])

        const ingredientTypeOptions = [
            { label: "Other (cloves, box, item)", value: 0 },
            { label: "weight(oz, lb, grams)", value: 1 },
            { label: "volume(tsp, tbsp, cup)", value: 2 }
        ]

        const updateParent = () => {
            const updatedRecipe = {
                ...recipeForUpload,
                ingredientSections: [...localSectionList]
            } as RecipeModel
            onUpdateRecipe(updatedRecipe)
        }

        const addIngredientSection = () => {
            const newSection = new IngredientSectionModel("")
            newSection.ingredients.push(new Ingredient("",0,"",0))
            console.log("newSection: ", newSection)
            setLocalSectionList((prev) => {
                const newList = [...prev, newSection]
                console.log(newList)
                return newList
            })
            debounce(() => {
                updateParent()
            }, 100)
        }

        const removeIngredientSection = (sectionIndex: number) => {
            setLocalSectionList((prev) => {
                const newList = [...prev] // Create a copy
                newList.splice(sectionIndex, 1) // Remove 1 item at sectionIndex
                return newList
            }) 
            debounce(() => {
                updateParent()
            }, 100)
        }

        const updateSectionName = (newNameValue: string, sectionIndex: number) => {
            setLocalSectionList((prev) => {
                const newList = [...prev]
                newList.map((section, index) => {
                    if (index === sectionIndex) {
                        section.sectionName = newNameValue
                    }
                })
                return newList
            })
            debounce(() => {
                updateParent()
            }, 100)
        }

        const addIngredientToSection = (sectionIndex: number) => {
            setLocalSectionList((prev) => {
                const newList = [...prev]
                if (newList[sectionIndex]) {
                    newList[sectionIndex] = {
                        ...newList[sectionIndex],
                        ingredients: [...newList[sectionIndex].ingredients, new Ingredient("", 0, "", 0)]
                    }
                }
                return newList
            })
            debounce(() => {
                updateParent()
            }, 100)
        }

        const removeIngredientFromSection = (sectionIndex: number, ingredientIndex: number) => {

            setLocalSectionList((prev) => {
                const newList = [...prev] 
                if (newList[sectionIndex]) {
                    const newIngredients = [...newList[sectionIndex].ingredients]
                    newIngredients.splice(ingredientIndex, 1)
                    
                    newList[sectionIndex] = {
                        ...newList[sectionIndex],
                        ingredients: newIngredients
                    }
                }
                return newList
            })
            debounce(() => {
                updateParent()
            }, 100)
        }

        // Helper function to update ingredient using setValue
        const updateIngredientValue = (
            sectionIndex: number,
            ingredientIndex: number,
            key: string,
            value: string | number
        ) => {
            setLocalSectionList((prev) => {
                const newList = [...prev]

                if (newList[sectionIndex] && newList[sectionIndex].ingredients[ingredientIndex]) {
                    const newIngredients = [...newList[sectionIndex].ingredients]
                    newIngredients[ingredientIndex] = {
                        ...newIngredients[ingredientIndex],
                        [key]: value
                    }
                    
                    newList[sectionIndex] = {
                        ...newList[sectionIndex],
                        ingredients: newIngredients
                    }
                }
                return newList
            })
            debounce(() => {
                updateParent()
            }, 100)
        }
        

        return (
            <div className="p-4 h-full overflow-auto">
                <h2 className="pb-3 text-3xl">Ingredients</h2>
                
                <div className="flex flex-col space-y-3 py-4 h-overflow-y-auto border border-thymeProgress rounded-md bg-thymeProgress p-2 w-full">   
                    {/* Ingredient section Map */}
                    {   
                        localSectionList.map((section: IngredientSectionModel, SIndex: number) => {
                            return (
                                <div key={ SIndex } className="flex flex-col space-y-4 items-center border border-thymeBackdrop rounded-md bg-thymeCard p-2 w-full">
                                   
                                    <div className="pb-2 relative w-full flex flex-row gap-x-4 items-center">
                                        <input
                                            placeholder="Section Name"
                                            value={section.sectionName}
                                            onChange={(e) => updateSectionName(e.target.value, SIndex)} 
                                            // onBlur={() => updateSectionName(SIndex)}
                                            className="bg-white border border-1 rounded-md px-1 py-2 w-full" 
                                        />
                                        <div 
                                            onClick={() => removeIngredientSection(SIndex)}
                                            className="bg-red-300 h-1/2 p-1 rounded-md flex items-center justify-center font-bold cursor-pointer">
                                            <img width={10} height={10} src="minus.png" alt="Logo" />
                                        </div>
                                    </div>
                                    <div>
                                        {
                                            section.ingredients.map((ingredient: Ingredient, ingIndex:number) => {
                                                return (
                                                    <div key={ingIndex}>
                                                        <div className="flex flex-row gap-x-4 justify-center w-full overflow-x-auto">
                                                            <div className="flex flex-col w-full">
                                                                <label className="">Name</label>
                                                                <input
                                                                    placeholder="Name"
                                                                    type="text"
                                                                    value={ingredient.name}
                                                                    onChange={(e) => updateIngredientValue(SIndex, ingIndex, 'name',e.target.value)}
                                                                    className="border p-1 bg-white rounded-md"
                                                                />
                                                            </div>
                                                            <div className="flex flex-col w-full">
                                                                <label className="">Quantity</label>
                                                                <input
                                                                    type="number" step="0.01"
                                                                    placeholder="Quantity"
                                                                    className="border p-1 bg-white rounded-md"
                                                                />
                                                            </div>
                                                            <div className="flex flex-col w-full">
                                                                <label className="">Measurement</label>
                                                                <input
                                                                    placeholder="Measurement"
                                                                    className="border p-1 bg-white rounded-md"
                                                                />
                                                            </div>
                                                            <div className="flex flex-col w-full">
                                                                <label className="">Measurement Type</label>
                                                                <select
                                                                    className="border p-1 bg-white rounded-md"
                                                                >
                                                                    {
                                                                        ingredientTypeOptions.map(option => (
                                                                            <option key={option.value} value={option.value}>
                                                                                {option.label}
                                                                            </option>
                                                                        ))
                                                                    }
                                                                </select>
                                                            </div>
                                                            <div className="flex">
                                                                <span className="bg-red-300 w-4 h-4 mt-8 p-1 rounded-md cursor-pointer"
                                                                    onClick={() => removeIngredientFromSection(SIndex, ingIndex)}
                                                                >
                                                                    <img src="minus.png" alt="Logo" />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    <button
                                        type="button"
                                        className="bg-green-200 px-2 py-1 rounded w-1/4"
                                        onClick={() => addIngredientToSection(SIndex)}
                                    >
                                        Add Ingredient
                                    </button>
                                </div>
                            )
                        })
                    }
                </div>

                <div className="my-2 flex justify-center">
                    <label className="rounded border px-24 py-1 bg-thymeButton cursor-pointer" 
                        onClick={ () => addIngredientSection() }
                    >
                        Add Ingredient Section
                    </label>
                </div>

                <div>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        type="button"
                        // onClick={() => {
                        //     const allSections = getValues("ingredientSection")
                        //     onSendToChild(allSections) // send current state to parent (and then child)
                        // }}
                        >
                        Process Ingredients
                    </button>
                </div>

            </div>
        )
    }
    

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateRecipe = (key: string, value: any) => {
        setRecipeForUpload(prev => ({
            ...prev,
            [key]: value
        }))
    }

    return (
        <div className="w-full h-full">
            <h2 className="text-3xl font-semibold w-full text-center mb-4">Add Recipe</h2>
            <div className="flex flex-col divide-y space-y-4">
                {/* Main Content */}
                <form className="flex-1 h-full overflow-y-auto p-4 mb-4" onSubmit={(e) => e.preventDefault()}>  {/* onSubmit={handleSubmit(onSubmit)}> */}
                    <div 
                        className="flex flex-col" 
                        // onSubmit={handleSubmit(onSubmit)}
                    >   
                        {/* Main form fields */}
                        <div className="grid grid-cols-8 gap-4">
                            {/* Name */}
                            <div className="col-span-8 flex flex-col gap-x-4">
                                <label className="">Recipe Name</label>
                                <input
                                    className="border border-1 bg-white px-2 rounded-md w-full"
                                    // {...register("recipeName")} 
                                    type="text"
                                    value={recipeForUpload.recipeName}
                                    onChange={(e) => { updateRecipe("recipeName", e.target.value)}}
                                />
                            </div>
                            {/* Main Image Links */}
                            <div className="col-span-8 flex flex-row w-full gap-x-4">
                                <div className="col-span-2 flex flex-col w-full gap-x-2">
                                    <label className="">Hero Link</label>
                                    <input
                                        className="border border-1 bg-white px-2 rounded-md"
                                        type="text"
                                        value={recipeForUpload.heroImageLink}
                                        onChange={(e) => {updateRecipe("heroImageLink", e.target.value)}}
                                        // {...register("heroImageLink")} 
                                    />
                                </div>
                                <div className="col-span-2 flex flex-col w-full gap-x-3">
                                    <label className="">Main Link</label>
                                    <input
                                        className="border border-1 bg-white px-2 rounded-md"
                                        // {...register("mainImageLink")} 
                                        type="text"
                                        value={recipeForUpload.mainImageLink}
                                        onChange={(e) => {updateRecipe("mainImageLink", e.target.value)}}
                                    />
                                </div>
                            </div>
                            {/* Servings */}
                            <div className="col-span-8 flex flex-col gap-y-4">
                                <div className="flex flex-col gap-x-4">
                                    <label className="">Total Servings</label>
                                    <input
                                        type="number"
                                        className="border border-1 bg-white px-2 rounded-md"
                                        // {...register("totalServings")} 
                                        value={recipeForUpload.totalServings}
                                        onChange={(e) => {updateRecipe("totalServings", e.target.value)}}
                                    />
                                </div>
                                <div className="flex flex-row w-full gap-x-4">
                                    <div className="flex flex-col w-full gap-x-4">
                                      <label className="">Serving Size</label>
                                      <input 
                                            type="number"
                                            className="border border-1 bg-white px-2 rounded-md" 
                                            //   {...register("servingSize")} 
                                            value={recipeForUpload.servingSize}
                                            onChange={(e) => {updateRecipe("servingSize", e.target.value)}}
                                      />
                                    </div>
                                    <div className="flex flex-col w-full gap-x-4">
                                      <label>Form</label>
                                      <input 
                                            className="border border-1 bg-white px-2 rounded-md" 
                                        //   {...register("servingForm")} 
                                            type="text"
                                            value={recipeForUpload.servingForm}
                                            onChange={(e) => {updateRecipe("servingForm", e.target.value)}}
                                      />
                                    </div>
                                </div>
                            </div>
                            {/* Time and Tags */}
                            <div className="col-span-8 flex flex-col gap-y-4">
                                <div className="flex flex-col">
                                    <label className="">Time to Plate (minutes)</label>
                                    <input
                                        type="number"
                                        className="border border-1 bg-white px-2 rounded-md"
                                        // {...register("timeToPlate")}
                                        value={recipeForUpload.timeToPlate}
                                        onChange={(e) => {updateRecipe("timeToPlate", e.target.value)}}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="">Tags</label>
                                    <input
                                        className="border border-1 bg-white px-2 rounded-md"
                                        // {...register("tags")} 
                                        type="text"
                                        value={recipeForUpload.tags}
                                        onChange={(e) => {updateRecipe("tags", e.target.value)}}
                                    />
                                </div>
                            </div>
                            {/* Description */}
                            <div className="col-span-8 flex flex-col gap-x-4">
                                <label className="">Description</label>
                                <textarea
                                    className="border border-1 bg-white px-2 rounded-md w-full"
                                    // {...register("description")} 
                                    rows={4}
                                    value={recipeForUpload.description}
                                    onChange={(e) => {updateRecipe("description", e.target.value)}}
                                />
                            </div>
                        </div>
                        

                        {/*  Ingredients */}
                        <div className="flex-auto">
                            <DisplayIngredientSection 
                                ingredientSections={ recipeForUpload.ingredientSections }
                                onUpdateRecipe={setRecipeForUpload}
                            />
                            {/* <DisplayIngredientSection
                                control={control}
                                register={register}
                                getValues={getValues}
                                ingredientSections={ingredientSections}
                                addIngredientSection={addIngredientSection}
                                removeIngredientSection={removeIngredientSection}
                                onSendToChild={handleSendToChild}
                            /> */}
                        </div>

                        {/*  Instruction */}
                        <div className="flex-auto">
                            {/* <DisplayInstructionSection /> */}
                        </div>

                        {/* { nutritionLabel } */}
                        <div className="p-4">
                            <div className="flex flex-col justify-center px-44">
                            {/* <div className="pb-2 flex justify-center">
                                <label className="rounded border p-1 bg-blue-400 cursor-pointer" onClick={calculateNutritionValues}>Calculate Nutrition Values</label>
                            </div> */}
                            {/* <div>
                                {
                                    nutritionFactErrors.length > 0 &&
                                    nutritionFactErrors.map((value, idx) => (
                                        <label className="bg-red-300" key={idx}>{ value }</label>
                                    ))
                                }   
                            </div> */}
                            {/* <div v-if="isThereNutritionErrors" className="flex flex-col space-y-4 pb-2">
                                <label className="bg-red-300" v-for="(issue, idx) in nutritionErrors" :key="idx"> {{ issue }}</label>
                            </div> */}
                                {/* <NutritionLabel ingredientSections={ingredientList} totalServings={totalServings} servingSize={servingSize} servingForm={servingForm} errors={setNutritionFactErrors}/> */}
                            </div>
                        </div>
                       

                    </div>

                    <div className="flex justify-center mt-4">
                        {/* <input className="border border-1 px-8 py-2 rounded-lg shadow-lg bg-thymeButton" type="submit" /> */}
                        <button 
                            className="border border-1 px-8 py-2 rounded-lg shadow-lg bg-thymeButton" 
                            // onClick={() => sendRecipeToUpload() }
                        >
                            Submit
                        </button>
                    </div>
                </form>
                
                {/* Sample Display */}
                <div className="px-4 flex-1">
                    Sample Display
                </div>
            </div>
           
        </div>
    )
} 

export default AddRecipe