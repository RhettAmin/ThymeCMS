// import { Ingredient } from "@/models/recipeModels"


export enum CONVERSTION_TYPES {
    OTHER = "OTHER",
    WEIGHT = "WEIGHT",
    VOLUME = "VOLUME"
}

export const ingredientTypeOptions = [
    { label: "Other (cloves, box, item)", value: CONVERSTION_TYPES.OTHER },
    { label: "weight(oz, lb, grams)", value: CONVERSTION_TYPES.WEIGHT },
    { label: "volume(tsp, tbsp, cup)", value: CONVERSTION_TYPES.VOLUME }
]

export type SectionNameUpdate = {
    name: string
    index: number
}

export function roundNut(value: number): number {
    return Math.round(value)
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