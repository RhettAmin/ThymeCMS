import { calculateDV, MainNutritionValues, NutritionDailyValues, TopVitamins } from './utils'
import { NutritionFacts } from '../../models/recipeModels'
import { useState, useEffect, useCallback } from 'react'

interface NutritionLabelInput {
    nutritionFacts: NutritionFacts
    totalServings: number, 
    servingSize: number, 
    servingForm: string
}

const NutritionLabel = ({nutritionFacts, totalServings, servingSize, servingForm}: NutritionLabelInput) => {

    const [dailyValues] = useState<NutritionDailyValues>(new NutritionDailyValues())
    const [nutritionFactsPerServing, setNutritionFactsPerServing] = useState<NutritionFacts>(new NutritionFacts())

    const calculatePerServing = useCallback((value: number): number => {
        return value * (servingSize / totalServings)
    }, [servingSize, totalServings])

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
        }))
    }, [calculatePerServing])

    useEffect(() => {
        // console.log("FACTS INPUT: ", nutritionFacts)
        if (totalServings > 0 && servingSize > 0) {
            setNutritionPerServing(nutritionFacts)
        } else {
            setNutritionFactsPerServing(new NutritionFacts())
        }
    }, [totalServings, nutritionFacts, setNutritionPerServing, servingSize])
    
    const setNameDisplayValue = (value: string) => {
        if (value == 'saturatedFat' || value == 'transFat' || value == 'fibre' || value =='sugars') {
            return <label className="pl-4 capitalize">{value}</label>
        }
        return <label className="font-semibold capitalize">{value}</label>
    }

    const displayVitamins = (nutrient: string, value: number) => {
        if (nutrient=='transFat'  || nutrient=='protein' || nutrient=='cholesterol' || nutrient=='sugars') {
            return ''
        } 
        return calculateDV(dailyValues[nutrient as keyof NutritionDailyValues], value) +'%'
    }

    const getFontSize = (text: string) => {
        const length = text.length
        if (length >= 6) return 'text-xs'
        return 'text-base'
    }

    return (
        <div className="bg-white border border-black box-border p-2">
           
            {/* Main Container */}
            <div>
                {/* Title */}
                <div className="flex flex-col">
                    <label className="font-bold text-[30px] flex justify-center">Nutrition Facts</label>
                    <div className="bg-black h-[1px]"/>
                    <div className="flex flex-row justify-center">
                        <label className="text-m flex justify-end pr-1">Total Servings: { totalServings } /</label>
                        <label className="text-m flex justify-end">Serving size: { servingSize + " " + servingForm }</label>
                    </div>
                    <div className="bg-black h-[10px]"/>
                </div>

                {/* Columns */}
                <div className="grid grid-cols-7 divide-x-2 divide-slate-300">
                    {/* =================== Col 1 ======================== */}
                    <div className="col-span-3 px-1">
                        <div className="pt-6">
                            <label className="font-bold text-3xl">Calories</label>
                        </div>

                        <div className="bg-black h-[5px]"/>
                            
                        <div className="divide-y divide-black"> 
                            <div className="h-6"/>
                            <div className="divide-y divide-black">
                                {
                                    MainNutritionValues.map((value, idx) => (
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
                                    TopVitamins.map((value, idx) => (
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
                    <div className="col-span-2 px-1">
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
                                    MainNutritionValues.map((value, idx) => (
                                        <div key={idx}>
                                           <div className="flex flex-row justify-between"> 
                                                <div>
                                                    <label className={`${getFontSize((nutritionFactsPerServing[value as keyof NutritionFacts]).toFixed(1))}`}>
                                                        { 
                                                            (nutritionFactsPerServing[value as keyof NutritionFacts]).toFixed(1) + 
                                                                (value == 'cholesterol' || value=='sodium' ? 'mg' : 'g')
                                                        }
                                                    </label>
                                                </div>
                                                <div>
                                                    <label className={`${getFontSize((nutritionFactsPerServing[value as keyof NutritionFacts]).toFixed(1))}`}>
                                                        {
                                                            displayVitamins(value, (nutritionFactsPerServing[value as keyof NutritionFacts]))
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
                                TopVitamins.map((value, idx) => (
                                    <div key={idx}>
                                        <div className="flex flex-row justify-between"> 
                                            <div> 
                                                <label>
                                                    { 
                                                       (nutritionFactsPerServing[value as keyof NutritionFacts]).toFixed(1) + 
                                                       (value == 'vitamind' ? 'mcg' : 'mg')
                                                    }
                                                </label>
                                            </div>
                                            <div>
                                                <label>{ 
                                                    calculateDV(dailyValues[value as keyof NutritionDailyValues], 
                                                        (nutritionFactsPerServing[value as keyof NutritionFacts])) 
                                                        }%
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    {/* =================== Col 3 ======================== */}
                     <div className="col-span-2 px-1">
                        <div className="font-bold flex flex-col place-items-end"> 
                            <label className="text-xl">Total</label>
                            <label className="text-2xl">{ Math.round(nutritionFacts.calories) }</label>
                        </div>

                        <div className="bg-black h-[5px]"/>

                        <div className="divide-y divide-black"> 
                            <div className="h-6">
                                <label className="flex justify-end font-semibold">% DV*</label>
                            </div>  

                            <div className="divide-y divide-black">
                                {
                                    MainNutritionValues.map((value, idx) => (
                                        <div key={idx}>
                                           <div className="flex flex-row justify-between"> 
                                                <div>
                                                    <label className={`${getFontSize((nutritionFactsPerServing[value as keyof NutritionFacts]).toFixed(1))}`}>
                                                        { 
                                                            (nutritionFacts[value as keyof NutritionFacts]).toFixed(1) + 
                                                            (value == 'cholesterol' || value=='sodium' ? 'mg' : 'g')
                                                        }
                                                    </label>
                                                </div>
                                                <div>
                                                    <label className={`${getFontSize((nutritionFactsPerServing[value as keyof NutritionFacts]).toFixed(1))}`}>
                                                        {
                                                            displayVitamins(value, (nutritionFacts[value as keyof NutritionFacts]))
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
                                TopVitamins.map((value, idx) => (
                                    <div key={idx}>
                                        <div className="flex flex-row justify-between"> 
                                            <div> 
                                                <label>
                                                    { 
                                                       (nutritionFactsPerServing[value as keyof NutritionFacts]).toFixed(1) + 
                                                       (value == 'vitamind' ? 'mcg' : 'mg')
                                                    }
                                                </label>
                                            </div>
                                            <div>
                                                <label>{ 
                                                    calculateDV(dailyValues[value as keyof NutritionDailyValues], 
                                                    nutritionFactsPerServing[value as keyof NutritionFacts]) 
                                                    }%
                                                </label>
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