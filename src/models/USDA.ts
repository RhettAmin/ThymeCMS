export class FoodNutrientModel {
    number: string = ""
    name: string = ""
    amount: number = 0
    unitName: string = ""
    derivationCode: string = ""
    derivationDescription: string = ""

    constructor(data: Partial<FoodNutrientModel> = {}) {
        Object.assign(this, data)
    }
}

export class FoodModel {
    fdcId: number = 0
    description: string = ""
    dataType: string = ""
    publicationDate: string = ""
    ndbNumber: string = ""
    foodNutrients: FoodNutrientModel[] = []

    constructor(data: Partial<FoodModel> = {}) {
        Object.assign(this, data)
    }
}