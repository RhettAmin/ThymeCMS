// import { Ingredient } from "@/models/recipeModels"

export const ingredientTypeOptions = [
    { label: "Other (cloves, box, item)", value: 0 },
    { label: "weight(oz, lb, grams)", value: 1 },
    { label: "volume(tsp, tbsp, cup)", value: 2 }
]

export type SectionNameUpdate = {
    name: string
    index: number
}

// export type MicronutrientDisplay = {
//     ingredient: string,
//     shouldDisplayMicronutrients: boolean
// }

// export type IngredientSectionControls = {
//     searchValue: string
//     lastSearchedValue: string
//     ingredients: Ingredient[]
//     micronutrientDisplay: MicronutrientDisplay[]
//     page: number
// }