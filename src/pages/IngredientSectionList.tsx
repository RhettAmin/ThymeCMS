import { Button } from "@/components/button"
import { IngredientSectionModel, Ingredient, MicronutrientDisplay } from "../models/recipeModels"
import { CONVERSTION_TYPES, ingredientTypeOptions, roundNut } from "../utils/utils"
import { convertForDisplay } from "@/utils/unitConversion"
import USDAAPI from "@/apis/USDA/api"
import { useCallback, useState } from "react"
import { resolveGrams, scaleNutrientsByGrams } from "@/utils/nutrientScaling"


type displayIngredientSectionType = {
    ingredientSections: IngredientSectionModel[]
    onUpdateRecipe: ((updatedSection: IngredientSectionModel[]) => void)
    updateDB: (() => void)
}

const PRIMARY_NUTRIENT_FIELDS: { key: keyof Ingredient; label: string }[] = [
    { key: 'calories',      label: 'Calories' },
    { key: 'fat',           label: 'Fat' },
    { key: 'carbohydrate',  label: 'Carbohydrate' },
    { key: 'protein',       label: 'Protein' },
]

const NUTRIENT_FIELDS: { key: keyof Ingredient; label: string }[] = [
    { key: 'saturatedFat', label: 'Saturated Fat' },
    { key: 'transFat',     label: 'Trans Fat' },
    { key: 'fibre',        label: 'Fibre' },
    { key: 'sugars',       label: 'Sugar' },
    { key: 'cholesterol',  label: 'Cholesterol' },
    { key: 'sodium',       label: 'Sodium' },
    { key: 'vitaminD',     label: 'Vitamin D' },
    { key: 'iron',         label: 'Iron' },
    { key: 'potassium',    label: 'Potassium' },
    { key: 'calcium',      label: 'Calcium' },
]



export function getDisplayQuantity(
  ing: Ingredient,
  system: "metric" | "imperial"
) {
  return convertForDisplay(ing.quantity, ing.measurement, ing.conversionType, system)
}

const IngredientSectionList = ({
    ingredientSections, 
    onUpdateRecipe,
    updateDB
}: displayIngredientSectionType) => {

        const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric")
  
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
            console.log(`Added ${ingredient.name} to section ${sectionIndex}`)
            console.log(`new Section`, ingredientSections)
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
            console.log("Value changed to: ", key, value)
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
            value: number
        ) => {
            // console.log("updating: ", sectionIndex, ingredientIndex, nutrientKey, value)
            onUpdateRecipe(ingredientSections.map((section, sIndex) => 
                sIndex === sectionIndex ?
                    {
                        ...section,
                        ingredients: section.ingredients.map((ingredient: Ingredient, iIndex: number) => 
                            iIndex === ingredientIndex ? 
                                { ...ingredient, [nutrientKey]: value } : 
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

        // API Calls ========================================================================================
        const searchForIngredient = useCallback((sectionIndex: number) => {
            const section = ingredientSections[sectionIndex]
            const { searchValue, lastSearchedValue, page } = section.controls

            const isSameSearch = searchValue === lastSearchedValue
            const nextPage = isSameSearch ? page + 1 : 1
            console.debug("Search INPUT: ", searchValue, isSameSearch, nextPage, page)

            USDAAPI.listFoodByNameAbridged(searchValue, page)
                .then((response: Ingredient[]) => {
                    onUpdateRecipe(ingredientSections.map((section, sIndex) => 
                        sIndex === sectionIndex ?
                            {
                                ...section,
                                controls: { 
                                    ...section.controls,
                                    page: nextPage,
                                    lastSearchedValue: searchValue,
                                    ingredients: response,
                                }
                            } : 
                            section
                    ))
                })
                .catch((err) => {
                    console.error(err)
                })
        }, [ingredientSections, onUpdateRecipe]) 

        //  Display functions =============================================================================================
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

        const openCloseSection = (SIndex: number) => {
            onUpdateRecipe(ingredientSections.map((section, sIndex) => 
                sIndex === SIndex ?
                    {
                        ...section,
                        controls: { 
                            ...section.controls,
                            isOpen: !section.controls.isOpen
                        }
                    } : 
                    section
            ))
        }

        

        // Renderable
        return (
            <div className="flex flex-col space-y-4">
                {/* <h2 className="pb-3 text-3xl border-b border-gray-400">Ingredients</h2> */}
                <div className="flex justify-start space-x-6">
                    <Button 
                        message={"Add Ingredient Section"} 
                        onClickFn={() => addIngredientSection()} 
                    />
                    {/* Update Ingredient Section */}
                    <button className="bg-status-draft hover:bg-status-draft-hover cursor-pointer px-2 py-2 rounded-lg"
                        onClick={() => updateDB()}
                    >
                        Update Sections
                    </button>
                </div>
                
                <div className="flex flex-col space-y-4">   
                    {/* Ingredient section Map */}
                    {   
                        ingredientSections.map((section: IngredientSectionModel, SIndex: number) => {
                            return (
                                <div key={ SIndex } className="flex flex-col items-center rounded-md bg-surface-card w-full">
                                   
                                    {/* Section Name and Controls */}
                                    <div className="p-2 relative w-full flex flex-row justify-between gap-x-4 bg-brand-soft border border-brand rounded-t-md cursor-pointer">
                                        <div className="flex flex-row h-full pb-1">
                                            <label className="text-xl text-text-secondary">Section :</label>
                                            <input
                                                placeholder="Section Name"
                                                value={section.sectionName}
                                                onChange={(e) => updateSectionName(e.target.value, SIndex)}
                                                className="outline-none px-1 font-semibold text-xl text-text-secondary focus:bg-surface-input hover:bg-surface-input"
                                            />
                                        </div>
                                        {/* hidden click box */} 
                                        <div
                                            onClick={() => openCloseSection(SIndex)}
                                            className="flex-1 bg-brand-soft hover:bg-brand-mid p-2 rounded-md flex items-center justify-center font-bold cursor-pointer">
                                        </div>
                                        <div
                                            onClick={() => removeIngredientSection(SIndex)}
                                            className="bg-status-error-light p-2 border border-text-secondary rounded-md flex items-center justify-center font-bold cursor-pointer">
                                            <img width={15} height={15} src="minus.png" alt="RemoveSection" />
                                        </div>
                                    </div>

                                    {/* Main Content */}
                                    <div className={`h-full w-full flex flex-col border-l border-r border-b border-brand p-2 rounded-b-md transition-transform
                                        ${ section.controls.isOpen ? '': 'hidden'}
                                    `}>
                                        
                                        {/* Ingredient Search */}
                                        <div className="flex flex-col my-4 mx-4 border border-border shadow-md p-2 rounded-lg bg-surface-card">
                                            <div className="flex flex-row space-x-6">
                                                <div className="flex-1 flex relative">
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
                                                    <button className="absolute right-1 top-1/4 text-text-on-dark hover:text-text-muted cursor-pointer transition-colors duration-200"
                                                        onClick={() => clearSectionSearch(SIndex)}
                                                    >
                                                        <img width={20} height={20} src="clear.png" alt="Clear Search field" />
                                                    </button>
                                                </div>
                                                <Button
                                                    message={"Search"}
                                                    onClickFn={() => searchForIngredient(SIndex)}
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
                                                                        ${index%2==0 ? 'bg-table-row-even hover:bg-brand-soft' : 'bg-table-row-odd hover:bg-brand-soft'}`}
                                                                        onClick={() => addSearchResultToSectionIngList(SIndex, ingredient)}
                                                                    >
                                                                        <p>{ ingredient.name }</p>
                                                                        {/* Ingredients */}
                                                                        <div className="flex flex-row space-x-4">
                                                                            {
                                                                                PRIMARY_NUTRIENT_FIELDS.map(({ key, label }) => (
                                                                                    <div className="space-x-2" key={key}>
                                                                                        <label className="font-bold">{label}</label>
                                                                                        <label>{ roundNut(ingredient[key] as number) }</label>
                                                                                    </div>
                                                                                ))
                                                                            }
                                                                        </div>
                                                                    </div>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            }
                                        </div>

                                        {/* Added Ingredients */}
                                        <div className={` ${section.ingredients.length > 0 ? '' : 'hidden'}`}>
                                            <label className="font-bold text-xl">Ingredients</label>
                                            <div className="px-4 py-4 mt-2 border-t-1 border-border space-y-4 h-[40rem] overflow-y-scroll">
                                                {
                                                    section.ingredients.map((ingredient: Ingredient, ingIndex:number) => {
                                                        return (
                                                            <div key={ingIndex} className="flex flex-col border border-border bg-brand-softest rounded-lg space-y-4">
                                                                <div className="flex flex-col">
                                                                    {/* Main Values */}
                                                                    <div className="flex flex-col space-y-2">
                                                                        {/* Header */}
                                                                        <div className="flex flex-row justify-between px-2 py-1 items-center rounded-t-lg bg-status-archived border-b border-border">
                                                                            <input
                                                                                placeholder="Name"
                                                                                type="text"
                                                                                value={ingredient.name}
                                                                                onChange={(e) => updateIngredientValue(SIndex, ingIndex, 'name', e.target.value)}
                                                                                className="text-white font-semibold text-xl outline-none pl-1 text-text-secondary focus:bg-surface-input hover:bg-surface-input"
                                                                            />
                                                                            {/* Remove button */}
                                                                            <div className="flex">
                                                                                <span className="bg-status-error-light w-6 h-6 p-1 rounded-md cursor-pointer"
                                                                                    onClick={() => removeIngredientFromSection(SIndex, ingIndex)}
                                                                                >
                                                                                    <img width={15} height={15} src="minus.png" alt="RemoveIngredient" />
                                                                                </span>
                                                
                                                                            </div>
                                                                        </div>

                                                                        <div className="flex flex-row divide-x-2 divide-solid divide-border px-4">
                                                                            <div className="flex-1 flex flex-row space-x-2">
                                                                                <div className="flex flex-row">
                                                                                    <input
                                                                                        type="number" step="0.01"
                                                                                        placeholder="2"
                                                                                        value={ingredient.quantity}
                                                                                        onChange={(e) => updateIngredientValue(SIndex, ingIndex, 'quantity', e.target.value)}
                                                                                        className="w-14 font-semibold outline-none pl-1 text-text-secondary focus:bg-surface-input hover:bg-surface-input"
                                                                                    />
                                                                                </div>
                                                                                {/* Measurement */}
                                                                                <div className="flex flex-row">
                                                                                    <input
                                                                                        placeholder="medium"
                                                                                        value={ingredient.measurement}
                                                                                        onChange={(e) => updateIngredientValue(SIndex, ingIndex, 'measurement', e.target.value)}
                                                                                        className="font-semibold outline-none w-30 pl-1 text-text-secondary focus:bg-surface-input hover:bg-surface-input"
                                                                                    />
                                                                                </div>
                                                                                {/* Type */}
                                                                                <div className="flex flex-row space-x-2">
                                                                                    <select
                                                                                        className="font-semibold outline-none pl-1 text-text-secondary focus:bg-surface-input"
                                                                                        value={ingredient.conversionType}
                                                                                        onChange={(e) => updateIngredientValue(SIndex, ingIndex, 'conversionType', e.target.value)}
                                                                                    >
                                                                                        {
                                                                                            ingredientTypeOptions.map(option => {
                                                                                            console.log("ingredient.conversionType: ", ingredient.conversionType)
                                                                                               return (
                                                                                                <option key={option.value} value={option.value}>
                                                                                                    {option.label}
                                                                                                </option>
                                                                                            )})
                                                                                        }
                                                                                    </select>
                                                                                </div>
                                                                                {/* Gram Weight */}
                                                                                <div className={`w-15 flex flex-row ${ingredient.conversionType == CONVERSTION_TYPES.OTHER ? '' : 'hidden'}`}>
                                                                                    <input
                                                                                        placeholder="medium"
                                                                                        value={ingredient.gramWeight}
                                                                                        onChange={(e) => updateIngredientValue(SIndex, ingIndex, 'gramWeight', e.target.value)}
                                                                                        className="font-semibold w-full outline-none pl-1 text-text-secondary focus:bg-surface-input hover:bg-surface-input"
                                                                                    />
                                                                                </div>
                                                                            </div>

                                                                            {/* Nutrients */}
                                                                            <div className="flex flex-row space-x-2 mx-2">
                                                                                {
                                                                                    PRIMARY_NUTRIENT_FIELDS.map(({ key, label }) => {
                                                                                        const display = getDisplayQuantity(ingredient, "imperial")
                                                                                        const resolvedGrams = resolveGrams(
                                                                                                        ingredient.quantity, 
                                                                                                        ingredient.measurement, 
                                                                                                        ingredient.conversionType, 
                                                                                                        { gramWeightOverride: ingredient.conversionType == CONVERSTION_TYPES.OTHER ? ingredient.gramWeight : undefined }
                                                                                                    )!.grams
                                                                                        const scaledValue = scaleNutrientsByGrams(
                                                                                            {
                                                                                                calories: ingredient.calories,
                                                                                                fat: ingredient.fat,
                                                                                                saturatedFat: ingredient.saturatedFat,
                                                                                                transFat: ingredient.transFat,
                                                                                                carbohydrate: ingredient.carbohydrate,
                                                                                                fibre: ingredient.fibre,
                                                                                                sugars: ingredient.sugars,
                                                                                                protein: ingredient.protein,
                                                                                                cholesterol: ingredient.cholesterol,
                                                                                                sodium: ingredient.sodium,
                                                                                                vitaminD: ingredient.vitaminD,
                                                                                                iron: ingredient.iron,
                                                                                                potassium: ingredient.potassium,
                                                                                                calcium: ingredient.calcium
                                                                                            }, 
                                                                                            resolvedGrams
                                                                                        )
                                                                                        console.log("display values: ", display, resolvedGrams, scaledValue )
                                                                                        return (
                                                                                                <div className="space-x-2" key={ key }>
                                                                                                    <label className="font-bold">{ label }</label>
                                                                                                    <input type="number" value={ scaledValue[key] } 
                                                                                                        className="w-16 font-semibold outline-none pl-1 text-text-secondary focus:bg-surface-input hover:bg-surface-input"
                                                                                                        onChange={(e) => updateIngredientNutrientValue(SIndex, ingIndex, key, Number(e.target.value))} 
                                                                                                    />
                                                                                                </div>
                                                                                            )
                                                                                        }
                                                                                    )
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    
                                                                </div>
                                                                {/* More Nutrients */}
                                                                <div className="">
                                                                    <div className="flex flex-row justify-between py-1 px-3 cursor-pointer bg-brand-soft rounded-t-lg"
                                                                        onClick={() => openCloseMicroNutrients(SIndex, ingredient)}>
                                                                        <p className="font-bold">
                                                                                More Nutrients
                                                                        </p>
                                                                        {
                                                                            ingredientSections[SIndex].controls.micronutrientDisplay[ingIndex].shouldDisplayMicronutrients ?
                                                                            <img width={10} height={8} src="up.png" alt="closeSection" /> :
                                                                            <img width={15} height={15} src="down.png" alt="openSection" />
                                                                        }
                                                                    </div>
                                                                    <div className="">
                                                                        {
                                                                            ingredientSections[SIndex].controls.micronutrientDisplay[ingIndex].shouldDisplayMicronutrients &&
                                                                            <div className="px-4 py-2 border-r border-l border-b border-border rounded-b-lg grid grid-cols-10">
                                                                                {
                                                                                    NUTRIENT_FIELDS.map(({ key, label }) => (
                                                                                        <div key={key} className="col-span-2 flex flex-row items-center space-x-2">
                                                                                            <label className="flex-1 font-bold">{label}</label>
                                                                                            <label className="w-15 font-bold">{ ingredient[key] }</label>
                                                                                        </div>
                                                                                    ))
                                                                                }
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
    

    export default IngredientSectionList