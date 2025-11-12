export class NutritionDailyValues {
    // Values are represented as mg (milligram)
    fat: number = 75  //grams
    saturatedFat: number = 20 // grams
    transFat: number = -1 // grams
    carbohydrate: number = 275 // grams
    fibre: number = 28 // grams
    sugars: number = 100 // grams
    cholesterol: number = 300 // milligrams
    sodium: number = 2300 // milligrams
    protein: number = -1 // grams
    vitamind: number = 20 // micrograms
    iron: number = 18 // milligrams
    potassium: number = 3400 // milligrams
    calcium: number = 1300 // milligrams
} 

export const calculateDV = (dailyValRatio: number, value: number) => {
    return Math.round((value/dailyValRatio) * 100)
}

export const MainNutritionValues = [
    "fat", 
    "saturatedFat", 
    "transFat", 
    "carbohydrate", 
    "fibre", 
    "sugars", 
    "protein", 
    "cholesterol", 
    "sodium"
]
export const TopVitamins = [
    "vitamind", 
    "iron", 
    "potassium", 
    "calcium"
]