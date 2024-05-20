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
                            <label class="text-2xl">{{ Math.round(nutritionPerServing.calories) }}</label>  
                        </div>

                        <div class="bg-black h-[5px]"/>

                        <div class="divide-y divide-black"> 
                            <div class="h-6">
                                <label class="flex justify-end font-semibold">% DV / VQ *</label>
                            </div>

                            <div v-for="(value, idx) in mainNutritionValues" :key="idx">
                                <div class="grid grid-cols-3 space-between-4"> 
                                    <div class="col-start-1 col-end-2 flex">
                                        <label v-if="value=='Cholesterol' || value=='Sodium'">{{ nutritionPerServing.getValue(value).toFixed(1) }}mg</label>
                                        <label v-else>{{ nutritionPerServing.getValue(value).toFixed(1) }}g</label>
                                    </div>
                                    <div class="col-start-3 flex pl-5">
                                        <label v-if="value=='Trans' || value=='Protein' || value=='Cholesterol' || value=='Sugars'"></label>
                                        <label v-else>{{ dailyValue.calculateDV(value, nutritionPerServing.getValue(value)) }}%</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="bg-black h-[10px]"/>

                        <div class="divide-y divide-black"> 
                            <div v-for="(value, idx) in topVitamins" :key="idx">
                                <div class="grid grid-cols-3 space-between-4"> 
                                    <div class="col-start-1 col-end-2 flex"> 
                                        <label v-if="value=='Vitamin D'">{{ nutritionPerServing.getValue(value).toFixed(1) }}mcg</label>
                                        <label v-else>{{ nutritionPerServing.getValue(value).toFixed(1) }}mg</label>
                                    </div>
                                    <div class="col-start-3 flex pl-5">
                                        <label>{{ dailyValue.calculateDV(value, nutritionPerServing.getValue(value)) }}%</label>
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
    import { Serving, IngredientSection, NutritionFacts } from '@/models/recipeModel';
    import { nutritionDailyValues } from '@/components/nutritionDailyValues';
    import NutritonixAPI from '@/api/nutrionix/nutrionixAPI';

    type returnTupleType = [nutritionFacts: NutritionFacts, errors: string[]]
  
    export default {
        data() {
            return {
                serving: new Serving(),
                nutritionPerServing: new NutritionFacts(),
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
                return value * (this.serving.servingSize / this.serving.totalServings)
            },

            setNutritionPerServing(facts: NutritionFacts) {
                this.nutritionPerServing.calories = this.calculatePerServing(facts.calories)
                this.nutritionPerServing.fat = this.calculatePerServing(facts.fat)
                this.nutritionPerServing.saturatedFat = this.calculatePerServing(facts.saturatedFat)
                this.nutritionPerServing.transFat = this.calculatePerServing(facts.transFat)
                this.nutritionPerServing.carbohydrate = this.calculatePerServing(facts.carbohydrate)
                this.nutritionPerServing.fibre = this.calculatePerServing(facts.fibre)
                this.nutritionPerServing.sugars = this.calculatePerServing(facts.sugars)
                this.nutritionPerServing.protein = this.calculatePerServing(facts.protein)
                this.nutritionPerServing.cholesterol = this.calculatePerServing(facts.cholesterol)
                this.nutritionPerServing.sodium = this.calculatePerServing(facts.sodium)
                this.nutritionPerServing.vitaminD = this.calculatePerServing(facts.vitaminD)
                this.nutritionPerServing.iron = this.calculatePerServing(facts.iron)
                this.nutritionPerServing.potassium = this.calculatePerServing(facts.potassium)
                this.nutritionPerServing.calcium = this.calculatePerServing(facts.calcium)
            },

            async updateFactsTable(ingredientSections: IngredientSection[], serving: Serving) {
                return await new Promise<returnTupleType>( (resolve) => {
                    this.serving = serving
                
                    console.log("updating Table...")
                    NutritonixAPI.getNaturalLangNutrition(ingredientSections).then( (responseTuple) => {
                        this.nutritionFacts = responseTuple[0]
                        this.setNutritionPerServing(this.nutritionFacts)
                        resolve(responseTuple)
                    })
                })
                
                
            }
        },
    };
    
</script>