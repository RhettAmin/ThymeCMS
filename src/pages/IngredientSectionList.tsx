import Button from "@/components/button"
import { IngredientSectionModel, Ingredient, MicronutrientDisplay } from "../models/recipeModels"
import { ingredientTypeOptions } from "./utils"
import USDAAPI from "@/apis/USDA/api"
import { useCallback } from "react"

type displayIngredientSectionType = {
    ingredientSections: IngredientSectionModel[]
    onUpdateRecipe: ((updatedSection: IngredientSectionModel[]) => void)
}

const IngredientSectionList = ({
    ingredientSections, 
    onUpdateRecipe
}: displayIngredientSectionType) => {
  
        const addIngredientSection = () => { 
            onUpdateRecipe([...ingredientSections, new IngredientSectionModel()])
        }

        const removeIngredientSection = (sectionIndex: number) => {
            onUpdateRecipe( ingredientSections.filter((_, i) => i !== sectionIndex))
        }

        const updateSectionName = (newNameValue: string, sectionIndex: number) => {
            onUpdateRecipe(ingredientSections.map((section, index) => {
                if (index === sectionIndex) {
                    return { ...section, sectionName: newNameValue }
                }
                return section
            }))
        }

        const addIngredientToSection = useCallback((sectionIndex: number, ingredient: Ingredient) => {
            onUpdateRecipe(ingredientSections.map((section, index) => 
                index === sectionIndex ? 
                    {
                        ...section,
                        ingredients: [...section.ingredients, ingredient],
                        controls: {
                            ...section.controls,
                            micronutrientDisplay: [
                                ...section.controls.micronutrientDisplay, 
                                { ingredient: ingredient.name, shouldDisplayMicronutrients: false}
                            ]
                        }
                    } :
                    section
            ))
        }, [ingredientSections, onUpdateRecipe])

        const removeIngredientFromSection = (sectionIndex: number, ingredientIndex: number) => {
            onUpdateRecipe(ingredientSections.map((section, index) => 
                index === sectionIndex ? 
                    {
                        ...section,
                        ingredients: section.ingredients.filter((_, i) => i !== ingredientIndex)
                    } :
                    section
            ))
        }

        // Helper function to update ingredient using setValue
        const updateIngredientValue = (
            sectionIndex: number,
            ingredientIndex: number,
            key: string,
            value: string | number
        ) => {
            onUpdateRecipe(ingredientSections.map((section, sIndex) => 
                sIndex === sectionIndex ?
                    {
                        ...section,
                        ingredients: section.ingredients.map((ingredient: Ingredient, iIndex: number) => 
                            iIndex === ingredientIndex ? 
                                { ...ingredient, [key]: value } : 
                                ingredient
                        ),
                        controls: { ...section.controls, micronutrientDisplay: section.controls.micronutrientDisplay.map(
                                (display: MicronutrientDisplay, index: number) => 
                                    index === ingredientIndex && key === 'name' && typeof value === 'string'?
                                        { ...display, ingredient: value } :
                                        display
                            ) }
                    } : 
                    section
            ))
        }

        const updateIngredientNutrientValue = (
            sectionIndex: number,
            ingredientIndex: number,
            nutrientKey: string,
            value: string | number
        ) => {
            onUpdateRecipe(ingredientSections.map((section, sIndex) => 
                sIndex === sectionIndex ?
                    {
                        ...section,
                        ingredients: section.ingredients.map((ingredient: Ingredient, iIndex: number) => 
                            iIndex === ingredientIndex ? 
                                { ...ingredient, nutrients: { ...ingredient, [nutrientKey]: value } } : 
                                ingredient
                        )
                    } : 
                    section
            ))
        }
        
        const updateSearchValue = (sectionIndex: number, newValue: string) => {
            onUpdateRecipe(ingredientSections.map((section, sIndex) => 
                sIndex === sectionIndex ?
                    {
                        ...section,
                        controls: { 
                            ...section.controls,
                            searchValue: newValue
                        }
                    } : 
                    section
            ))
        }

        const searchForIngredient = useCallback((sectionIndex: number) => {
            // Get Section SearchValue
            const searchValue = ingredientSections[sectionIndex].controls.searchValue
            let page = ingredientSections[sectionIndex].controls.page

            // Check if the same search value has been passed along to check the next 5
            if (searchValue == ingredientSections[sectionIndex].controls.lastSearchedValue) {
                onUpdateRecipe(ingredientSections.map((section, sIndex) => 
                    sIndex === sectionIndex ?
                        {
                            ...section,
                            controls: { 
                                ...section.controls,
                                page: page+1
                            }
                        } : 
                        section
                ))
                page++ // increment local page for search call
            } else {
                onUpdateRecipe(ingredientSections.map((section, sIndex) => 
                    sIndex === sectionIndex ?
                        {
                            ...section,
                            controls: { 
                                ...section.controls,
                                page: 1,
                                lastSearchedValue: searchValue
                            }
                        } : 
                        section
                ))
            }

            USDAAPI.listFoodByNameAbridged(searchValue, page)
                .then((response: Ingredient[]) => {
                    onUpdateRecipe(ingredientSections.map((section, sIndex) => 
                        sIndex === sectionIndex ?
                            {
                                ...section,
                                controls: { 
                                    ...section.controls,
                                    page: 1,
                                    ingredients: response
                                }
                            } : 
                            section
                    ))
                })
                .catch((err) => {
                    console.error(err)
                })
        }, [ingredientSections, onUpdateRecipe])

        const clearSectionSearch = useCallback((sectionIndex: number) => {
            const searchValue = ingredientSections[sectionIndex].controls.searchValue
            onUpdateRecipe(ingredientSections.map((section, sIndex) => 
                sIndex === sectionIndex ?
                    {
                        ...section,
                        controls: { 
                            ...section.controls,
                            searchValue: "",
                            ingredients: [],
                            page: 1,
                            lastSearchedValue: searchValue
                        }
                    } : 
                    section
            ))
        }, [ingredientSections, onUpdateRecipe])

        const addSearchResultToSectionIngList = useCallback((sectionIndx:number, ingredient: Ingredient) => {
            addIngredientToSection(sectionIndx, ingredient)
        },[addIngredientToSection])

        const openCloseMicroNutrients = useCallback((SIndex: number, ingredient: Ingredient) => {
            onUpdateRecipe(ingredientSections.map((section, sIndex) => 
                sIndex === SIndex ?
                    {
                        ...section,
                        controls: { 
                            ...section.controls,
                            micronutrientDisplay: section.controls.micronutrientDisplay.map(
                                (display: MicronutrientDisplay) =>
                                    display.ingredient === ingredient.name ?
                                    {
                                        ...display,
                                        shouldDisplayMicronutrients: !display.shouldDisplayMicronutrients
                                    } :
                                    display
                            ) 
                        }
                    } : 
                    section
            ))
        }, [ingredientSections, onUpdateRecipe])

        // Renderable
        return (
            <div className="p-4 h-full">
                <h2 className="pb-3 text-3xl border-b border-gray-400">Ingredients</h2>
                
                <div className="flex flex-col space-y-3 mt-4 overflow-y-auto max-h-200 rounded-md w-full">   
                    {/* Ingredient section Map */}
                    {   
                        ingredientSections.map((section: IngredientSectionModel, SIndex: number) => {
                            return (
                                <div key={ SIndex } className="flex flex-col space-y-4 items-center border border-thymeBackdrop rounded-md bg-thymeCard p-2 w-full">
                                   
                                    <div className="pb-2 relative w-full flex flex-col gap-x-4 space-y-2">
                                        <div className="flex justify-between">
                                            <label>Section Name {SIndex}</label>
                                            <div 
                                                onClick={() => removeIngredientSection(SIndex)}
                                                className="bg-red-300 h-1/2 p-1 rounded-md flex items-center justify-center font-bold cursor-pointer">
                                                <img width={15} height={15} src="minus.png" alt="RemoveSection" />
                                            </div>
                                        </div> 
                                        <input
                                            placeholder="Section Name"
                                            value={section.sectionName}
                                            onChange={(e) => updateSectionName(e.target.value, SIndex)} 
                                            className="bg-white border border-1 rounded-md px-1 py-2 w-full" 
                                        />
                                    </div>

                                    {/* Ingredient Search */}
                                    <div className="w-full flex flex-col space-y-2 border border-slate-300 shadow-md p-2 rounded-lg bg-slate-100">
                                        <div className="flex flex-row space-x-6">
                                            <input 
                                                className="flex-1 bg-white px-2 rounded-lg"
                                                placeholder="Search"
                                                value={
                                                    ingredientSections[SIndex].controls && ingredientSections[SIndex].controls.searchValue ? 
                                                        ingredientSections[SIndex].controls.searchValue : ""
                                                }
                                                onChange={(e) => updateSearchValue(SIndex, e.target.value)}
                                                onKeyUp={ (event: React.KeyboardEvent<HTMLInputElement>) => {
                                                    event.preventDefault()
                                                    if (event.key === 'Enter') {
                                                        searchForIngredient(SIndex)
                                                    }
                                                }}
                                            />
                                            <Button 
                                                message={"Search"} 
                                                onClickFn={() => searchForIngredient(SIndex)} 
                                            />
                                            <Button 
                                                message={"Clear"} 
                                                onClickFn={() => clearSectionSearch(SIndex)} 
                                                shouldErrorRender={true} 
                                            />
                                        </div>

                                        {/* Search Results */}
                                        {
                                            ingredientSections[SIndex] && // Check to see if instance exists first before rendering.
                                            <div className={`border border-slate-200 p-4 rounded-lg 
                                                ${ ingredientSections[SIndex].controls.ingredients.length > 0 ? '' : 'hidden'}`}>
                                                <label className="font-bold">Results - <span className="italic text-sm">Select One</span></label>
                                                <div>
                                                {
                                                        ingredientSections[SIndex].controls.ingredients
                                                            .map((ingredient: Ingredient, index: number) => (
                                                                <div key={index}
                                                                    className={`flex flex-row justify-between p-2 rounded-lg cursor-pointer
                                                                    ${index%2==0 ? 'bg-amber-100 hover:bg-amber-200' : 'bg-emerald-100 hover:bg-emerald-200'}`}
                                                                    onClick={() => addSearchResultToSectionIngList(SIndex, ingredient)}
                                                                >
                                                                    <p>{ ingredient.name }</p>
                                                                    {/* Ingredients */}
                                                                    <div className="flex flex-row space-x-4">
                                                                        <div className="space-x-2">   
                                                                            <label className="font-bold">Calories</label>
                                                                            <label>{ ingredient.calories }</label>
                                                                        </div>
                                                                        <div className="space-x-2">   
                                                                            <label className="font-bold">Protein</label>
                                                                            <label>{ ingredient.protein }</label>
                                                                        </div>
                                                                        <div className="space-x-2">   
                                                                            <label className="font-bold">Carbs</label>
                                                                            <label>{ ingredient.carbohydrate }</label>
                                                                        </div>
                                                                        <div className="space-x-2">   
                                                                            <label className="font-bold">Fat</label>
                                                                            <label>{ ingredient.fat }</label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        }
                                    </div>

                                    {/* Added Ingredients */}
                                    <div className={`w-full ${section.ingredients.length > 0 ? '' : 'hidden'}`}>
                                        <label className="font-bold">Ingredients</label>

                                        <div className="border rounded-lg bg-white px-4 py-4 w-full space-y-4">
                                            {
                                                section.ingredients.map((ingredient: Ingredient, ingIndex:number) => {
                                                    return (
                                                        <div key={ingIndex} className="flex flex-col p-2 border border-gray-400 bg-gray-100 rounded-lg">
                                                            <div className="flex flex-row gap-x-2 justify-evenly py-2 pl-4">
                                                                {/* Main Values */}
                                                                <div className="flex flex-col gap-y-2 min-w-144">
                                                                    <div className="flex flex-col flex-1">
                                                                        <label className="">Name</label>
                                                                        <input
                                                                            placeholder="Potato"
                                                                            type="text"
                                                                            value={ingredient.name}
                                                                            onChange={(e) => updateIngredientValue(SIndex, ingIndex, 'name', e.target.value)}
                                                                            className="border p-1 bg-white rounded-md w-full"
                                                                        />
                                                                    </div>
                                                                    <div className="flex flex-row gap-x-2">
                                                                        <div className="flex flex-col flex-1">
                                                                            <label className="">Quantity</label>
                                                                            <input
                                                                                type="number" step="0.01"
                                                                                placeholder="2"
                                                                                value={ingredient.quantity}
                                                                                onChange={(e) => updateIngredientValue(SIndex, ingIndex, 'quantity', e.target.value)}
                                                                                className="border p-1 bg-white rounded-md w-full"
                                                                            />
                                                                        </div>
                                                                        <div className="flex flex-col flex-1">
                                                                            <label className="">Measurement</label>
                                                                            <input
                                                                                placeholder="medium"
                                                                                value={ingredient.measurement}
                                                                                onChange={(e) => updateIngredientValue(SIndex, ingIndex, 'measurement', e.target.value)}
                                                                                className="border p-1 bg-white rounded-md w-full"
                                                                            />
                                                                        </div>
                                                                        <div className="flex flex-col flex-1">
                                                                            <label className="">Measurement Type</label>
                                                                            <select
                                                                                className="border p-1 bg-white rounded-md w-full"
                                                                                onChange={(e) => updateIngredientValue(SIndex, ingIndex, 'type', e.target.value)}
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
                                                                    </div>
                                                                </div>
                                                                {/* Nutrients */}
                                                                <div className="flex flex-col gap-y-2">
                                                                    <div className="flex flex-row gap-x-4">
                                                                        <div className="w-26">
                                                                            <label className="font-bold">Calories</label>
                                                                            <input
                                                                                placeholder="0"
                                                                                value={ingredient.calories}
                                                                                onChange={(e) => updateIngredientNutrientValue(SIndex, ingIndex, 'calories', e.target.value)}
                                                                                className="p-1 ml-2 border bg-white rounded-md w-full"
                                                                            />
                                                                        </div>
                                                                        <div className="w-16">
                                                                            <label className="font-bold">Protein</label>
                                                                            <input
                                                                                placeholder="0"
                                                                                value={ingredient.protein}
                                                                                onChange={(e) => updateIngredientNutrientValue(SIndex, ingIndex, 'protein', e.target.value)}
                                                                                className="p-1 ml-2 border bg-white rounded-md w-full"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex flex-row gap-x-4">
                                                                        <div className="w-26">
                                                                            <label className="font-bold">Carbohydrates</label>
                                                                            <input
                                                                                placeholder="0"
                                                                                value={ingredient.carbohydrate}
                                                                                onChange={(e) => updateIngredientNutrientValue(SIndex, ingIndex, 'carbohydrate', e.target.value)}
                                                                                className="p-1 ml-2 border bg-white rounded-md w-full"
                                                                            />
                                                                        </div>
                                                                        <div className="w-16">
                                                                            <label className="font-bold">Fat</label>
                                                                            <input
                                                                                placeholder="0"
                                                                                value={ingredient.fat}
                                                                                onChange={(e) => updateIngredientNutrientValue(SIndex, ingIndex, 'fat', e.target.value)}
                                                                                className="p-1 ml-2 border bg-white rounded-md w-full"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Remove button */}
                                                                <div className="flex -mt-2">
                                                                    <span className="bg-red-300 w-5 h-fit p-1 rounded-md cursor-pointer"
                                                                        onClick={() => removeIngredientFromSection(SIndex, ingIndex)}
                                                                    >
                                                                        <img width={15} height={15} src="minus.png" alt="RemoveIngredient" />
                                                                    </span>
                                                                    
                                                                </div>
                                                            </div>

                                                            <div className="py-1 px-2">
                                                                <div className="flex flex-row justify-between py-1 px-3 cursor-pointer bg-orange-200 rounded-lg" 
                                                                    onClick={() => openCloseMicroNutrients(SIndex, ingredient)}>
                                                                    <p className="font-bold">
                                                                            More Nutrients
                                                                    </p>

                                                                    <img width="20px" src="down.png" alt="Logo" />
                                                                </div>
                                                                {   
                                                                    ingredientSections[SIndex].controls.micronutrientDisplay[ingIndex].shouldDisplayMicronutrients &&
                                                                    (
                                                                        <div className="grid grid-cols-10 gap-4">
                                                                            <div className="col-span-2">
                                                                                <label className="font-bold">Saturated Fat</label>
                                                                                <input
                                                                                    placeholder="0"
                                                                                    value={ingredient.saturatedFat}
                                                                                    onChange={(e) => updateIngredientNutrientValue(SIndex, ingIndex, 'saturatedFat', e.target.value)}
                                                                                    className="p-1 ml-2 border bg-white rounded-md w-full"
                                                                                />
                                                                            </div>
                                                                            <div className="col-span-2">
                                                                                <label className="font-bold">Trans Fat</label>
                                                                                <input
                                                                                    placeholder="0"
                                                                                    value={ingredient.transFat}
                                                                                    onChange={(e) => updateIngredientNutrientValue(SIndex, ingIndex, 'transFat', e.target.value)}
                                                                                    className="p-1 ml-2 border bg-white rounded-md w-full"
                                                                                />
                                                                            </div>
                                                                            <div className="col-span-2">
                                                                                <label className="font-bold">Fibre</label>
                                                                                <input
                                                                                    placeholder="0"
                                                                                    value={ingredient.fibre}
                                                                                    onChange={(e) => updateIngredientNutrientValue(SIndex, ingIndex, 'fibre', e.target.value)}
                                                                                    className="p-1 ml-2 border bg-white rounded-md w-full"
                                                                                />
                                                                            </div>
                                                                            <div className="col-span-2">
                                                                                <label className="font-bold">Sugar</label>
                                                                                <input
                                                                                    placeholder="0"
                                                                                    value={ingredient.sugars}
                                                                                    onChange={(e) => updateIngredientNutrientValue(SIndex, ingIndex, 'sugars', e.target.value)}
                                                                                    className="p-1 ml-2 border bg-white rounded-md w-full"
                                                                                />
                                                                            </div>
                                                                            <div className="col-span-2">
                                                                                <label className="font-bold">Cholesterol</label>
                                                                                <input
                                                                                    placeholder="0"
                                                                                    value={ingredient.cholesterol}
                                                                                    onChange={(e) => updateIngredientNutrientValue(SIndex, ingIndex, 'cholesterol', e.target.value)}
                                                                                    className="p-1 ml-2 border bg-white rounded-md w-full"
                                                                                />
                                                                            </div>
                                                                            <div className="col-span-2">
                                                                                <label className="font-bold">Sodium</label>
                                                                                <input
                                                                                    placeholder="0"
                                                                                    value={ingredient.sodium}
                                                                                    onChange={(e) => updateIngredientNutrientValue(SIndex, ingIndex, 'sodium', e.target.value)}
                                                                                    className="p-1 ml-2 border bg-white rounded-md w-full"
                                                                                />
                                                                            </div>
                                                                            <div className="col-span-2">
                                                                                <label className="font-bold">Vitamin D</label>
                                                                                <input
                                                                                    placeholder="0"
                                                                                    value={ingredient.vitaminD}
                                                                                    onChange={(e) => updateIngredientNutrientValue(SIndex, ingIndex, 'vitamind', e.target.value)}
                                                                                    className="p-1 ml-2 border bg-white rounded-md w-full"
                                                                                />
                                                                            </div>
                                                                            <div className="col-span-2">
                                                                                <label className="font-bold">Iron</label>
                                                                                <input
                                                                                    placeholder="0"
                                                                                    value={ingredient.iron}
                                                                                    onChange={(e) => updateIngredientNutrientValue(SIndex, ingIndex, 'iron', e.target.value)}
                                                                                    className="p-1 ml-2 border bg-white rounded-md w-full"
                                                                                />
                                                                            </div>
                                                                            <div className="col-span-2">
                                                                                <label className="font-bold">Potassium</label>
                                                                                <input
                                                                                    placeholder="0"
                                                                                    value={ingredient.potassium}
                                                                                    onChange={(e) => updateIngredientNutrientValue(SIndex, ingIndex, 'potassium', e.target.value)}
                                                                                    className="p-1 ml-2 border bg-white rounded-md w-full"
                                                                                />
                                                                            </div>
                                                                            <div className="col-span-2">
                                                                                <label className="font-bold">Calcium</label>
                                                                                <input
                                                                                    placeholder="0"
                                                                                    value={ingredient.calcium}
                                                                                    onChange={(e) => updateIngredientNutrientValue(SIndex, ingIndex, 'calcium', e.target.value)}
                                                                                    className="p-1 ml-2 border bg-white rounded-md w-full"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>

                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

                <div className="my-2 flex justify-center">
                    <Button 
                        message={"Add Ingredient Section"} 
                        onClickFn={() => addIngredientSection()} 
                    />
                </div>
            </div>
        )
    }
    

    export default IngredientSectionList