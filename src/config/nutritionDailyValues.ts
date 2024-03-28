export class nutritionDailyValues {
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
    vitaminD: number = 20; // micrograms
    iron: number = 18; // milligrams
    potassium: number = 3400; // milligrams
    calcium: number = 1300; // milligrams


    calculateDV(nutrient: string, value: number): number {
        let convertingValue:number = 1
        switch(nutrient as any) {
            case "Fat": {
                convertingValue = this.fat;
                break;
            }
            case "Saturated": {
                convertingValue = this.satFat;
                break;
            }
            case "Trans": {
                convertingValue = this.transFat;
                break;
            }
            case "Carbohydrate": {
                convertingValue = this.carbohydrate;
                break;
            }
            case "Fibre": {
                convertingValue = this.fibre;
                break;
            }
            case "Sugars": {
                convertingValue = this.sugars;
                break;
            }
            case "Protein": {
                convertingValue = this.protein;
                break;
            }
            case "Cholesterol": {
                convertingValue = this.cholesterol;
                break;
            }
            case "Sodium": {
                convertingValue = this.sodium;
                break;
            }
            case "Vitamin D": {
                convertingValue = this.vitaminD;
                break;
            }
            case "Iron": {
                convertingValue = this.iron;
                break;
            }
            case "Potassium": {
                convertingValue = this.potassium;
                break;
            }
            case "Calcium": {
                convertingValue = this.calcium;
                break;
            }
        }
        return Math.round((value/convertingValue) * 100);
    }

} 
