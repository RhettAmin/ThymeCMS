import { IngredientSectionModel, Ingredient } from "../models/recipeModels"
import { useCallback, useEffect } from "react"
import USDAAPI from "@/apis/USDA/api"
import { IngredientSectionControls, ingredientTypeOptions, MicronutrientDisplay } from "./utils"

type displayIngredientSectionType = {
    ingredientSections: IngredientSectionModel[]
    ingredientSectionControlsList: IngredientSectionControls[],
    onUpdateRecipe: ((updatedSection: IngredientSectionModel[]) => void)
    onSetIngredientSectionControlsList: ((ingredientSectionControlsList: IngredientSectionControls[]) => void)
}

const IngredientSectionList = ({
    ingredientSections, ingredientSectionControlsList, 
    onUpdateRecipe, onSetIngredientSectionControlsList
}: displayIngredientSectionType) => {
  
        useEffect(() => {
            // set auxiliary arrays to be the same size as ingredientSections when it updates.
            if (ingredientSections.length > ingredientSectionControlsList.length) {
                onSetIngredientSectionControlsList([
                    ...ingredientSectionControlsList, 
                    {searchValue: "", lastSearchedValue:"", ingredients:[], micronutrientDisplay: [], page: 1}
                ])
            }
        }, [ingredientSections, ingredientSectionControlsList, onSetIngredientSectionControlsList])

        const addIngredientSection = () => { 
            onUpdateRecipe([...ingredientSections, new IngredientSectionModel()])
            onSetIngredientSectionControlsList([
                ...ingredientSectionControlsList, 
                { searchValue: "", lastSearchedValue:"", ingredients:[], micronutrientDisplay: [], page: 1}
            ])
        }

        const removeIngredientSection = (sectionIndex: number) => {
            onUpdateRecipe( ingredientSections.filter((_, i) => i !== sectionIndex))
            onSetIngredientSectionControlsList(ingredientSectionControlsList.filter((_, i) => i !== sectionIndex))
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
                        ingredients: [...section.ingredients, ingredient]
                    } :
                    section
            ))
            onSetIngredientSectionControlsList(ingredientSectionControlsList.map(
                (control: IngredientSectionControls, index: number) => 
                    index === sectionIndex ? 
                    {
                        ...control,
                        micronutrientDisplay: [
                            ...control.micronutrientDisplay, 
                            { ingredient: ingredient.name, shouldDisplayMicronutrients: false}
                        ]
                    } : 
                    control
            ))
        }, [ingredientSectionControlsList, ingredientSections, onSetIngredientSectionControlsList, onUpdateRecipe])

        const removeIngredientFromSection = (sectionIndex: number, ingredientIndex: number) => {
            onUpdateRecipe(ingredientSections.map((section, index) => 
                index === sectionIndex ? 
                    {
                        ...section,
                        ingredients: section.ingredients.filter((_, i) => i !== ingredientIndex)
                    } :
                    section
            ))
            onSetIngredientSectionControlsList(ingredientSectionControlsList.map(
                (control: IngredientSectionControls, index: number) => 
                    index === sectionIndex ? 
                    {
                        ...control,
                        micronutrientDisplay: control.micronutrientDisplay.filter((_, i) => i !== ingredientIndex)
                    } : 
                    control
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
                        )
                    } : 
                    section
            ))
            if (key === 'name' && typeof value === 'string') {
                onSetIngredientSectionControlsList(ingredientSectionControlsList.map(
                    (section: IngredientSectionControls, index: number) => 
                        index === sectionIndex ?
                            { ...section, micronutrientDisplay: section.micronutrientDisplay.map(
                                (ingredientObj: MicronutrientDisplay, index: number) => 
                                    index === ingredientIndex ?
                                        { ...ingredientObj, ingredient: value } :
                                        ingredientObj
                            ) } :
                            section
                ))
            }
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
                                { ...ingredient, nutrients: { ...ingredient.nutrients, [nutrientKey]: value } } : 
                                ingredient
                        )
                    } : 
                    section
            ))
        }
        
        const updateSearchValue = (sectionIndex: number, newValue: string) => {
            onSetIngredientSectionControlsList(ingredientSectionControlsList.map(
                (section: IngredientSectionControls, index: number) => 
                    index === sectionIndex ?
                        { ...section, searchValue: newValue } :
                        section
            ))
        }

        const searchForIngredient = useCallback((sectionIndex: number) => {
            // Get Section SearchValue
            const searchValue = ingredientSectionControlsList[sectionIndex].searchValue
            let page = ingredientSectionControlsList[sectionIndex].page

            // Check if the same search value has been passed along to check the next 5
            if (searchValue == ingredientSectionControlsList[sectionIndex].lastSearchedValue) {
                onSetIngredientSectionControlsList(ingredientSectionControlsList.map(
                    (section: IngredientSectionControls, index: number) => 
                        index === sectionIndex ?
                            { ...section, page: page+1 } :
                            section
                ))
                page++ // increment local page for search call
            } else {
                onSetIngredientSectionControlsList(ingredientSectionControlsList.map(
                    (section: IngredientSectionControls, index: number) => 
                        index === sectionIndex ?
                            { ...section, page: 1, lastSearchedValue: searchValue } :
                            section
                ))
            }

            USDAAPI.listFoodByNameAbridged(searchValue, page)
                .then((response: Ingredient[]) => {
                    onSetIngredientSectionControlsList(ingredientSectionControlsList.map(
                        (section: IngredientSectionControls, index: number) => 
                            index === sectionIndex ?
                                { ...section, page: 1, ingredients: response } :
                                section
                    ))
                })
                .catch((err) => {
                    console.error(err)
                })
        }, [ingredientSectionControlsList, onSetIngredientSectionControlsList])

        const clearSectionSearch = useCallback((sectionIndex: number) => {
            const searchValue = ingredientSectionControlsList[sectionIndex].searchValue
            onSetIngredientSectionControlsList(ingredientSectionControlsList.map(
                (section: IngredientSectionControls, index: number) => 
                    index === sectionIndex ?
                        { ...section, searchValue: "", ingredients: [], page: 1, lastSearchedValue: searchValue } :
                        section
            ))
        }, [ingredientSectionControlsList, onSetIngredientSectionControlsList])

        const addSearchResultToSectionIngList = useCallback((sectionIndx:number, ingredient: Ingredient) => {
            addIngredientToSection(sectionIndx, ingredient)
        },[addIngredientToSection])

        const openCloseMicroNutrients = useCallback((SIndex: number, ingredient: Ingredient) => {
            console.log("HIT: ", SIndex, ingredient, ingredientSectionControlsList)
            console.log("VALUE CHANGE TO: ", ingredientSectionControlsList.map(
                (section: IngredientSectionControls, index: number) => 
                    index === SIndex ?
                        { 
                            ...section, 
                            micronutrientDisplay: section.micronutrientDisplay.map(
                                (display: MicronutrientDisplay) =>
                                    display.ingredient === ingredient.name ?
                                    {
                                        ...display,
                                        shouldDisplayMicronutrients: !display.shouldDisplayMicronutrients
                                    } :
                                    display
                            ) 
                        } :
                        section
            ))
            onSetIngredientSectionControlsList(ingredientSectionControlsList.map(
                (section: IngredientSectionControls, index: number) => 
                    index === SIndex ?
                        { 
                            ...section, 
                            micronutrientDisplay: section.micronutrientDisplay.map(
                                (display: MicronutrientDisplay) =>
                                    display.ingredient === ingredient.name ?
                                    {
                                        ...display,
                                        shouldDisplayMicronutrients: !display.shouldDisplayMicronutrients
                                    } :
                                    display
                            ) 
                        } :
                        section
            ))
        }, [ingredientSectionControlsList, onSetIngredientSectionControlsList])

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
                                                <img width={15} height={15} src="minus.png" alt="Logo" />
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
                                                    ingredientSectionControlsList[SIndex] && ingredientSectionControlsList[SIndex].searchValue ? 
                                                        ingredientSectionControlsList[SIndex].searchValue : ""
                                                }
                                                onChange={(e) => updateSearchValue(SIndex, e.target.value)}
                                            />
                                            <button
                                                className="w-[80px] bg-thymeButton p-2 rounded-lg"
                                                onClick={() => searchForIngredient(SIndex)}
                                            >
                                                Search
                                            </button>
                                            <button
                                                className="w-[80px] bg-thymeNegative p-2 rounded-lg"
                                                onClick={() => clearSectionSearch(SIndex)}
                                            >
                                                Clear
                                            </button>
                                        </div>

                                        {/* Search Results */}
                                        {
                                            ingredientSectionControlsList[SIndex] && // Check to see if instance exists first before rendering.
                                            <div className={`border border-slate-200 p-4 rounded-lg 
                                                ${ ingredientSectionControlsList[SIndex].ingredients.length > 0 ? '' : 'hidden'}`}>
                                                <label className="font-bold">Results - <span className="italic text-sm">Select One</span></label>
                                                <div>
                                                {
                                                        ingredientSectionControlsList[SIndex].ingredients
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
                                                                            <label>{ ingredient.nutrients.calories }</label>
                                                                        </div>
                                                                        <div className="space-x-2">   
                                                                            <label className="font-bold">Protein</label>
                                                                            <label>{ ingredient.nutrients.protein }</label>
                                                                        </div>
                                                                        <div className="space-x-2">   
                                                                            <label className="font-bold">Carbs</label>
                                                                            <label>{ ingredient.nutrients.carbohydrate }</label>
                                                                        </div>
                                                                        <div className="space-x-2">   
                                                                            <label className="font-bold">Fat</label>
                                                                            <label>{ ingredient.nutrients.fat }</label>
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

                                        <div className="border rounded-lg bg-white px-2 py-2 w-full space-y-2">
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
                                                                                value={ingredient.nutrients.calories}
                                                                                onChange={(e) => updateIngredientNutrientValue(SIndex, ingIndex, 'calories', e.target.value)}
                                                                                className="p-1 ml-2 border bg-white rounded-md w-full"
                                                                            />
                                                                        </div>
                                                                        <div className="w-16">
                                                                            <label className="font-bold">Protein</label>
                                                                            <input
                                                                                placeholder="0"
                                                                                value={ingredient.nutrients.protein}
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
                                                                                value={ingredient.nutrients.carbohydrate}
                                                                                onChange={(e) => updateIngredientNutrientValue(SIndex, ingIndex, 'carbohydrate', e.target.value)}
                                                                                className="p-1 ml-2 border bg-white rounded-md w-full"
                                                                            />
                                                                        </div>
                                                                        <div className="w-16">
                                                                            <label className="font-bold">Fat</label>
                                                                            <input
                                                                                placeholder="0"
                                                                                value={ingredient.nutrients.fat}
                                                                                onChange={(e) => updateIngredientNutrientValue(SIndex, ingIndex, 'fat', e.target.value)}
                                                                                className="p-1 ml-2 border bg-white rounded-md w-full"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex pr-2">
                                                                    <span className="bg-red-300 h-fit p-1 rounded-md cursor-pointer"
                                                                        onClick={() => removeIngredientFromSection(SIndex, ingIndex)}
                                                                    >
                                                                        <img width="10px" src="minus.png" alt="Logo" />
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
                                                                    ingredientSectionControlsList[SIndex].micronutrientDisplay[ingIndex].shouldDisplayMicronutrients &&
                                                                    (
                                                                        <div className="grid grid-cols-10 gap-4">
                                                                            <div className="col-span-2">
                                                                                <label className="font-bold">Saturated Fat</label>
                                                                                <input
                                                                                    placeholder="0"
                                                                                    value={ingredient.nutrients.saturatedFat}
                                                                                    onChange={(e) => updateIngredientNutrientValue(SIndex, ingIndex, 'saturatedFat', e.target.value)}
                                                                                    className="p-1 ml-2 border bg-white rounded-md w-full"
                                                                                />
                                                                            </div>
                                                                            <div className="col-span-2">
                                                                                <label className="font-bold">Trans Fat</label>
                                                                                <input
                                                                                    placeholder="0"
                                                                                    value={ingredient.nutrients.transFat}
                                                                                    onChange={(e) => updateIngredientNutrientValue(SIndex, ingIndex, 'transFat', e.target.value)}
                                                                                    className="p-1 ml-2 border bg-white rounded-md w-full"
                                                                                />
                                                                            </div>
                                                                            <div className="col-span-2">
                                                                                <label className="font-bold">Fibre</label>
                                                                                <input
                                                                                    placeholder="0"
                                                                                    value={ingredient.nutrients.fibre}
                                                                                    onChange={(e) => updateIngredientNutrientValue(SIndex, ingIndex, 'fibre', e.target.value)}
                                                                                    className="p-1 ml-2 border bg-white rounded-md w-full"
                                                                                />
                                                                            </div>
                                                                            <div className="col-span-2">
                                                                                <label className="font-bold">Sugar</label>
                                                                                <input
                                                                                    placeholder="0"
                                                                                    value={ingredient.nutrients.sugars}
                                                                                    onChange={(e) => updateIngredientNutrientValue(SIndex, ingIndex, 'sugars', e.target.value)}
                                                                                    className="p-1 ml-2 border bg-white rounded-md w-full"
                                                                                />
                                                                            </div>
                                                                            <div className="col-span-2">
                                                                                <label className="font-bold">Cholesterol</label>
                                                                                <input
                                                                                    placeholder="0"
                                                                                    value={ingredient.nutrients.cholesterol}
                                                                                    onChange={(e) => updateIngredientNutrientValue(SIndex, ingIndex, 'cholesterol', e.target.value)}
                                                                                    className="p-1 ml-2 border bg-white rounded-md w-full"
                                                                                />
                                                                            </div>
                                                                            <div className="col-span-2">
                                                                                <label className="font-bold">Sodium</label>
                                                                                <input
                                                                                    placeholder="0"
                                                                                    value={ingredient.nutrients.sodium}
                                                                                    onChange={(e) => updateIngredientNutrientValue(SIndex, ingIndex, 'sodium', e.target.value)}
                                                                                    className="p-1 ml-2 border bg-white rounded-md w-full"
                                                                                />
                                                                            </div>
                                                                            <div className="col-span-2">
                                                                                <label className="font-bold">Vitamin D</label>
                                                                                <input
                                                                                    placeholder="0"
                                                                                    value={ingredient.nutrients.vitamind}
                                                                                    onChange={(e) => updateIngredientNutrientValue(SIndex, ingIndex, 'vitamind', e.target.value)}
                                                                                    className="p-1 ml-2 border bg-white rounded-md w-full"
                                                                                />
                                                                            </div>
                                                                            <div className="col-span-2">
                                                                                <label className="font-bold">Iron</label>
                                                                                <input
                                                                                    placeholder="0"
                                                                                    value={ingredient.nutrients.iron}
                                                                                    onChange={(e) => updateIngredientNutrientValue(SIndex, ingIndex, 'iron', e.target.value)}
                                                                                    className="p-1 ml-2 border bg-white rounded-md w-full"
                                                                                />
                                                                            </div>
                                                                            <div className="col-span-2">
                                                                                <label className="font-bold">Potassium</label>
                                                                                <input
                                                                                    placeholder="0"
                                                                                    value={ingredient.nutrients.potassium}
                                                                                    onChange={(e) => updateIngredientNutrientValue(SIndex, ingIndex, 'potassium', e.target.value)}
                                                                                    className="p-1 ml-2 border bg-white rounded-md w-full"
                                                                                />
                                                                            </div>
                                                                            <div className="col-span-2">
                                                                                <label className="font-bold">Calcium</label>
                                                                                <input
                                                                                    placeholder="0"
                                                                                    value={ingredient.nutrients.calcium}
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
                    <label className="rounded border px-24 py-1 bg-thymeButton cursor-pointer" 
                        onClick={ () => addIngredientSection() }
                    >
                        Add Ingredient Section
                    </label>
                </div>
            </div>
        )
    }
    

    export default IngredientSectionList