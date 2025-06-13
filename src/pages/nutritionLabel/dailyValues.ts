export class NutritionDailyValues {
    // Values are represented as mg (milligram)
    fat: number = 75;  //grams
    satFat: number = 20; // grams
    transFat: number = -1; // grams
    carbohydrate: number = 275; // grams
    fibre: number = 28; // grams
    sugars: number = 100; // grams
    cholesterol: number = 300; // milligrams
    sodium: number = 2300; // milligrams
    protein: number = -1; // grams
    vitamind: number = 20; // micrograms
    iron: number = 18; // milligrams
    potassium: number = 3400; // milligrams
    calcium: number = 1300; // milligrams

    calculateDV(nutrient: string, value: number): number {
        let convertingValue:number = 1
        switch(nutrient) {
            case "fat": {
                convertingValue = this.fat;
                break;
            }
            case "saturated": {
                convertingValue = this.satFat;
                break;
            }
            case "trans": {
                convertingValue = this.transFat;
                break;
            }
            case "carbohydrate": {
                convertingValue = this.carbohydrate;
                break;
            }
            case "fibre": {
                convertingValue = this.fibre;
                break;
            }
            case "sugars": {
                convertingValue = this.sugars;
                break;
            }
            case "protein": {
                convertingValue = this.protein;
                break;
            }
            case "cholesterol": {
                convertingValue = this.cholesterol;
                break;
            }
            case "sodium": {
                convertingValue = this.sodium;
                break;
            }
            case "vitamind": {
                convertingValue = this.vitamind;
                break;
            }
            case "iron": {
                convertingValue = this.iron;
                break;
            }
            case "potassium": {
                convertingValue = this.potassium;
                break;
            }
            case "calcium": {
                convertingValue = this.calcium;
                break;
            }
        }
        return Math.round((value/convertingValue) * 100);
    }

} 
