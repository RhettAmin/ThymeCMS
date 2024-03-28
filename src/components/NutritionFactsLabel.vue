<template>
    <div class="">
        <!-- Container Box -->
        <div class="border border-black box-border grid grid-cols-1 p-1">

            <div class="">
                <!-- Title -->
                <div class="">
                    <div class="flex flex-col">
                        <label class="font-bold text-[30px] flex justify-center">Nutrition Facts</label>
                        <div class="bg-black h-[1px]"/>
                        <label class="text-m flex justify-end">Serving size {{ serving.servingSize + " " + serving.amount }}</label>
                        
                    </div>
                </div>
                <div class="bg-black h-[10px]"/>
                <!--  Calories and Fats -->

                <div class="grid grid-cols-4 divide-x-2 divide-slate-300">
                    <!--=================== Col 1 ========================-->
                    <div class="col-span-2 px-1">
                        <div class="pt-6">
                            <label class="font-bold text-3xl">Calories</label>
                        </div>

                        <div class="bg-black h-[5px]"/>

                        <div class="divide-y divide-black"> 
                            <div class="h-6">

                            </div>

                            <template v-for="(value, idx) in mainNutritionValues" :key="idx">
                                <div>
                                    <label class="pl-4" 
                                        v-if="value=='Saturated' || value=='Trans'||
                                        value=='Fibre' || value=='Sugars'"> {{ value }} </label>
                                    <label class="font-semibold" v-else>{{ value }}</label>
                                </div>
                            </template>
                        </div>

                        <div class="bg-black h-[10px]"/>

                        <div class="divide-y divide-black">
                            <template v-for="(value, idx) in topVitamins" :key="idx">
                                <div>
                                    <label class="">{{ value }}</label>
                                </div>
                            </template>
                        </div>

                    </div>

                    <!--=================== Col 2 ========================-->
                    <div class="px-1">
                        <div class="font-bold flex flex-col place-items-end"> 
                            <label class="text-lg">Per Serving</label>
                            <label class="text-2xl">{{ calculatePerServing(nutritionFacts.calories) }}</label>  
                        </div>

                        <div class="bg-black h-[5px]"/>

                        <div class="divide-y divide-black"> 
                            <div class="h-6">
                                <label class="flex justify-end font-semibold">% DV / VQ *</label>
                            </div>

                            <div v-for="(value, idx) in mainNutritionValues" :key="idx">
                                <div class="grid grid-cols-3 space-between-4"> 
                                    <div class="col-start-1 col-end-2 flex">
                                        <label v-if="value=='Cholesterol' || value=='Sodium'">{{ calculatePerServing(nutritionFacts.getValue(value)) }}mg</label>
                                        <label v-else>{{ calculatePerServing(nutritionFacts.getValue(value)) }}g</label>
                                    </div>
                                    <div class="col-start-3 flex pl-5">
                                        <label v-if="value=='Trans' || value=='Protein' || value=='Cholesterol' || value=='Sugars'"></label>
                                        <label v-else>{{ dailyValue.calculateDV(value, calculatePerServing(nutritionFacts.getValue(value))) }}%</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="bg-black h-[10px]"/>

                        <div class="divide-y divide-black"> 
                            <div v-for="(value, idx) in topVitamins" :key="idx">
                                <div class="grid grid-cols-3 space-between-4"> 
                                    <div class="col-start-1 col-end-2 flex"> 
                                        <label v-if="value=='Vitamin D'">{{ calculatePerServing(nutritionFacts.getValue(value)) }}mcg</label>
                                        <label v-else>{{ calculatePerServing(nutritionFacts.getValue(value)) }}mg</label>
                                    </div>
                                    <div class="col-start-3 flex pl-5">
                                        <label>{{ dailyValue.calculateDV(value, calculatePerServing(nutritionFacts.getValue(value))) }}%</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!--=================== Col 3 ========================-->
                    <div class="px-1">
                        <div class="font-bold flex flex-col place-items-end"> 
                            <label class="text-xl">Total</label>
                            <label class="text-2xl">{{ nutritionFacts.calories }}</label>
                        </div>

                        <div class="bg-black h-[5px]"/>

                        <div class="divide-y divide-black"> 
                            <div class="h-6">
                                <label class="flex justify-end font-semibold">% DV / VQ *</label>
                            </div>

                            <div v-for="(value, idx) in mainNutritionValues" :key="idx">
                                <div class="grid grid-cols-3 space-between-4"> 
                                    <div class="col-start-1 col-end-2 flex">
                                        <label v-if="value=='Cholesterol' || value=='Sodium'">{{ nutritionFacts.getValue(value) }}mg</label>
                                        <label v-else>{{ nutritionFacts.getValue(value) }}g</label>
                                    </div>
                                    <div class="col-start-3 flex pl-5">
                                        <label v-if="value=='Trans' || value=='Protein' || value=='Cholesterol' || value=='Sugars'"></label>
                                        <label v-else>{{ dailyValue.calculateDV(value, nutritionFacts.getValue(value)) }}%</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="bg-black h-[10px]"/>

                        <div class="divide-y divide-black"> 
                            <div v-for="(value, idx) in topVitamins" :key="idx">
                                <div class="grid grid-cols-3 space-between-4"> 
                                    <div class="col-start-1 col-end-2 flex"> 
                                        <label v-if="value=='Vitamin D'">{{ nutritionFacts.getValue(value) }}mcg</label>
                                        <label v-else>{{ nutritionFacts.getValue(value) }}mg</label>
                                    </div>
                                    <div class="col-start-3 flex pl-5">
                                        <label>{{ dailyValue.calculateDV(value, nutritionFacts.getValue(value)) }}%</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div class="bg-black h-[5px]"/>

            <div class="text-xs flex flex-col"> 
                <label>* 5% or less is <strong>a little</strong>, 15% or more is <strong>a lot</strong></label>
            </div>

        </div>


    </div>
</template>

<script lang="ts">
    import { Serving, NutritionFacts } from '@/models/recipeModel';
    import { nutritionDailyValues } from '@/config/nutritionDailyValues';
    import { nutriConfig } from '@/config/nutritionixConfig';
    import axios from 'axios';
  
    export default {
        data() {
            return {
                serving: new Serving(),
                nutritionFacts: new NutritionFacts(),
                dailyValue: new nutritionDailyValues,
                mainNutritionValues: [
                    "Fat", "Saturated", "Trans", "Carbohydrate", "Fibre", 
                    "Sugars", "Protein", "Cholesterol", "Sodium"
                ],
                topVitamins: ["Vitamin D", "Iron", "Potassium", "Calcium"]
            }
        },
        
        methods: {
            calculatePerServing(value: number): number {
                return Math.round(value * (this.serving.servingSize / this.serving.totalServings))
            },

            callNutritionixAPI(searchString: string) {
                axios.post(
                    nutriConfig.baseUrl+nutriConfig.naturalLangEndpoint,
                    {
                        "query": searchString
                    }, 

                    {
                    params: {
                        'x-app-id': nutriConfig.appId,
                        'x-app-key': nutriConfig.appKey
                    }
                    })
                    .then(response => {
                    console.log(response.data.foods)

                    // Map to Nutrition Facts
                    response.data.foods.forEach((food:any) => {
                        this.nutritionFacts.calories += Math.round(food.nf_calories);
                        this.nutritionFacts.fat += Math.round(food.nf_total_fat);
                        this.nutritionFacts.saturatedFat += Math.round(food.nf_saturated_fat);
                        this.nutritionFacts.carbohydrate += Math.round(food.nf_total_carbohydrate);
                        this.nutritionFacts.fibre += Math.round(food.nf_dietary_fiber);
                        this.nutritionFacts.sugars += Math.round(food.nf_sugars);
                        this.nutritionFacts.protein += Math.round(food.nf_protein);
                        this.nutritionFacts.cholesterol += Math.round(food.nf_cholesterol);
                        this.nutritionFacts.sodium += Math.round(food.nf_sodium);

                        // Vitamin D (324)
                        this.nutritionFacts.vitaminD += Math.round(this.findOrZero(food.full_nutrients.find((item: any) => item.attr_id == 324)) * 0.025)
                        // Iron (303)
                        this.nutritionFacts.iron += Math.round(this.findOrZero(food.full_nutrients.find((item: any) => item.attr_id == 303)));
                        // Potassium (306)
                        this.nutritionFacts.potassium += Math.round(this.findOrZero(food.full_nutrients.find((item: any) => item.attr_id == 306)));
                        // Calcium (301)
                        this.nutritionFacts.calcium += Math.round(this.findOrZero(food.full_nutrients.find((item: any) => item.attr_id == 301)));
                    });

                    })
                    .catch(err => {
                        console.error(err);
                    }
                );
            },

            findOrZero(item: any): number {
                if (item == null || undefined) {
                    return 0
                } else {
                    return item.value
                }
            },

            updateFactsTable: function(searchString: string, serving: Serving): NutritionFacts {
                this.serving = serving
                this.nutritionFacts = new NutritionFacts
                console.log("updating Table...")
                this.callNutritionixAPI(searchString);
                return this.nutritionFacts
            }
        },
    };
    
</script>
