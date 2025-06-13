/* eslint-disable @typescript-eslint/no-explicit-any */
import { NutritionFacts } from '../../models/recipeModels';
import { NutritionDailyValues } from './dailyValues';
import NutritonixAPI from '../../apis/nutrionix/api';
import { useState, useEffect, useCallback } from 'react';


interface NutritionLabelInput {
    ingredientSections: IngredientSection[], 
    totalServings: number, 
    servingSize: number, 
    servingForm: string,
    errors: (value: string[]) => void
}

const NutritionLabel = ({ingredientSections, totalServings, servingSize, servingForm, errors}: NutritionLabelInput) => {

    // const [localIngredientSection, setLocalIngredientSection] = useState<IngredientSection[]>([])
    const [localTotalServings, setLocalTotalServings] = useState<number>(0)
    const [localServingSize, setLocalServingSize] = useState<number>(0)
    const [localServingForm, setLocalServingForm] = useState<string>("")
    const [dailyValues] = useState<NutritionDailyValues>(new NutritionDailyValues())
    const [mainNutritionValues] = useState<string[]>([
        "fat", "saturatedFat", "transFat", "carbohydrate", "fibre", 
        "sugars", "protein", "cholesterol", "sodium"
    ])
    const [topVitamins] = useState<string[]>(["vitamind", "iron", "potassium", "calcium"])
    const [nutritionFacts, setNutritionFacts] = useState<NutritionFacts>(new NutritionFacts())
    const [nutritionFactsPerServing, setNutritionFactsPerServing] = useState<NutritionFacts>(new NutritionFacts())

    // type returnTupleType = [nutritionFacts: NutritionFacts, errors: string[]]

    const calculatePerServing = useCallback((value: number): number => {
        // console.log("CALCULATION: " ,  value * (localServingSize / localTotalServings))
        return value * (localServingSize / localTotalServings)
    }, [localServingSize, localTotalServings])

    const setNutritionFactsLabel = (facts: NutritionFacts) => {
        setNutritionFacts(() => facts );
        // setNutritionFacts((prev) => {
        //     const newValue = prev

        //     newValue.calories = facts.calories
        //     newValue.fat = facts.fat
        //     newValue.saturatedFat = facts.saturatedFat
        //     newValue.transFat = facts.transFat
        //     newValue.carbohydrate = facts.carbohydrate
        //     newValue.fibre = facts.fibre
        //     newValue.sugars = facts.sugars
        //     newValue.protein = facts.protein
        //     newValue.cholesterol = facts.cholesterol
        //     newValue.sodium = facts.sodium
        //     newValue.vitaminD = facts.vitaminD
        //     newValue.iron = facts.iron
        //     newValue.potassium = facts.potassium
        //     newValue.calcium = facts.calcium

        //     return prev
        // })
    }


    const setNutritionPerServing = useCallback((facts: NutritionFacts) => {
        setNutritionFactsPerServing(() => ({
            calories: calculatePerServing(facts.calories),
            fat: calculatePerServing(facts.fat),
            saturatedFat: calculatePerServing(facts.saturatedFat),
            transFat: calculatePerServing(facts.transFat),
            carbohydrate: calculatePerServing(facts.carbohydrate),
            fibre: calculatePerServing(facts.fibre),
            sugars: calculatePerServing(facts.sugars),
            protein: calculatePerServing(facts.protein),
            cholesterol: calculatePerServing(facts.cholesterol),
            sodium: calculatePerServing(facts.sodium),
            vitamind: calculatePerServing(facts.vitamind),
            iron: calculatePerServing(facts.iron),
            potassium: calculatePerServing(facts.potassium),
            calcium: calculatePerServing(facts.calcium),
            getValue: NutritionFacts.prototype.getValue
        }));
    },[calculatePerServing])

    // const updateFactsTable = useCallback((ingredientSections: IngredientSection[]) => {
    //     console.log("updating Table...")

    //     const nF = new NutritionFacts()
    //     nF.calories = 246
    //     nF.fat = 50
    //     nF.saturatedFat = 51
    //     nF.transFat = 52
    //     nF.carbohydrate = 32
    //     nF.fibre = 42
    //     nF.sugars = 63
    //     nF.protein = 84
    //     nF.cholesterol = 99
    //     nF.sodium = 321
    //     nF.vitamind = 22
    //     nF.iron = 23
    //     nF.potassium = 24
    //     nF.calcium = 25

    //     setNutritionFactsLabel(nF)
    //     setNutritionPerServing(nF)

    //     // NutritonixAPI.getNaturalLangNutrition(ingredientSections).then( (responseTuple) => {
    //     //     console.log("RESPONSE TUPLE: ", responseTuple[0])
    //     //     setNutritionFactsLabel(responseTuple[0])
    //     //     setNutritionPerServing(responseTuple[0])
    //     //     errors(responseTuple[1])
    //     // })
    // }, [errors, setNutritionPerServing])

    useEffect(() => {
        console.log("EFFECT INPUTS: ", ingredientSections, servingForm, servingSize, totalServings)
        // setLocalIngredientSection(ingredientSections)
        setLocalTotalServings(totalServings)
        setLocalServingSize(servingSize)
        setLocalServingForm(servingForm)

        // updateFactsTable(ingredientSections)
    }, [ingredientSections, servingForm, servingSize, totalServings])

    const setNameDisplayValue = (value: string) => {
        if (value == 'saturatedFat') {
            return <label className="pl-4 capitalize">saturated fat</label>
        } else if (value == 'transFat') {
            return <label className="pl-4 capitalize">trans fat</label>
        } else if (value == 'fibre' || value =='sugars') {
            return <label className="pl-4 capitalize">{value}</label>
        } else {
            return <label className="font-semibold capitalize">{value}</label>
        }
    }

    const displayVitamins = (nutrient: string, value: number) => {
        if (nutrient=='transFat'  || nutrient=='protein' || nutrient=='cholesterol' || nutrient=='sugars') {
            return ''
        } 
        return dailyValues.calculateDV(nutrient, value) +'%'
    }

    return (
        <div className="border border-black box-border p-1">
           
            {/* Main Container */}
            <div>
                {/* Title */}
                <div className="flex flex-col">
                    <label className="font-bold text-[30px] flex justify-center">Nutrition Facts</label>
                    <div className="bg-black h-[1px]"/>
                    <div className="flex flex-row justify-center">
                        <label className="text-m flex justify-end pr-1">Total Servings: { localTotalServings } /</label>
                        <label className="text-m flex justify-end">Serving size: { localServingSize + " " + localServingForm }</label>
                    </div>
                    <div className="bg-black h-[10px]"/>
                </div>

                {/* Columns */}
                <div className="grid grid-cols-4 divide-x-2 divide-slate-300">
                    {/* =================== Col 1 ======================== */}
                    <div className="col-span-2 px-1">
                        <div className="pt-6">
                            <label className="font-bold text-3xl">Calories</label>
                        </div>

                        <div className="bg-black h-[5px]"/>
                            
                        <div className="divide-y divide-black"> 
                            <div className="h-6"/>
                            <div className="divide-y divide-black">
                                {
                                    mainNutritionValues.map((value, idx) => (
                                        <div key={idx}>
                                            {setNameDisplayValue(value)}
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                        <div className="bg-black h-[10px]"/>

                        <div className="">
                            <div className="divide-y divide-black">
                                {
                                    topVitamins.map((value, idx) => (
                                        <div key={idx}>
                                            <label className="capitalize">
                                                {
                                                    value=='vitamind' ?
                                                    'vitamin d' :
                                                    value
                                                }
                                            </label>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                    </div>

                    {/*  =================== Col 2 ======================== */}
                    <div className="px-1">
                        <div className="font-bold flex flex-col place-items-end"> 
                            <label className="text-lg">Per Serving</label>
                            <label className="text-2xl">{ Math.round(nutritionFactsPerServing.calories) }</label>  
                        </div>

                        <div className="bg-black h-[5px]"/>

                        <div className="divide-y divide-black"> 
                            <div className="h-6">
                                <label className="flex justify-end font-semibold">% DV*</label>
                            </div>

                            <div className="divide-y divide-black"> 
                                {
                                    mainNutritionValues.map((value, idx) => (
                                        <div key={idx}>
                                           <div className="flex flex-row justify-between"> 
                                                <div>
                                                    <label>
                                                        { 
                                                            nutritionFactsPerServing.getValue(value).toFixed(1) + (value == 'cholesterol' || value=='sodium' ? 'mg' : 'g')
                                                        }
                                                    </label>
                                                </div>
                                                <div>
                                                    <label>
                                                        {
                                                            displayVitamins(value, nutritionFactsPerServing.getValue(value))
                                                        }
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                        <div className="bg-black h-[10px]"/>

                        <div className="divide-y divide-black">
                            {
                                topVitamins.map((value, idx) => (
                                    <div key={idx}>
                                        <div className="flex flex-row justify-between"> 
                                            <div> 
                                                <label>
                                                    { 
                                                       nutritionFactsPerServing.getValue(value).toFixed(1) + (value == 'vitamind' ? 'mcg' : 'mg')
                                                    }
                                                </label>
                                            </div>
                                            <div>
                                                <label>{ dailyValues.calculateDV(value, nutritionFactsPerServing.getValue(value)) }%</label>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    {/* =================== Col 3 ======================== */}
                     <div className="px-1">
                        <div className="font-bold flex flex-col place-items-end"> 
                            <label className="text-xl">Total</label>
                            <label className="text-2xl">{ nutritionFacts.calories }</label>
                        </div>

                        <div className="bg-black h-[5px]"/>

                        <div className="divide-y divide-black"> 
                            <div className="h-6">
                                <label className="flex justify-end font-semibold">% DV*</label>
                            </div>  

                            <div className="divide-y divide-black">
                                {
                                    mainNutritionValues.map((value, idx) => (
                                        <div key={idx}>
                                           <div className="flex flex-row justify-between"> 
                                                <div>
                                                    <label>
                                                        { 
                                                            nutritionFacts.getValue(value).toFixed(1) + (value == 'cholesterol' || value=='sodium' ? 'mg' : 'g')
                                                        }
                                                    </label>
                                                </div>
                                                <div>
                                                    <label>
                                                        {
                                                            displayVitamins(value, nutritionFacts.getValue(value))
                                                        }
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                        <div className="bg-black h-[10px]"/>

                        <div className="divide-y divide-black">
                            {
                                topVitamins.map((value, idx) => (
                                    <div key={idx}>
                                        <div className="flex flex-row justify-between"> 
                                            <div> 
                                                <label>
                                                    { 
                                                       nutritionFacts.getValue(value).toFixed(1) + (value == 'vitamind' ? 'mcg' : 'mg')
                                                    }
                                                </label>
                                            </div>
                                            <div>
                                                <label>{ dailyValues.calculateDV(value, nutritionFacts.getValue(value)) }%</label>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                     </div> 
                </div>
                
                <div className="bg-black h-[5px]"/>

                <div className="text-xs flex flex-col"> 
                    <label>* 5% or less is <strong>a little</strong>, 15% or more is <strong>a lot</strong></label>
                </div>

            </div>

        </div>
    )
}


export default NutritionLabel