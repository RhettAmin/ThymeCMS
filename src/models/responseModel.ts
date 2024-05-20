import { RecipeDTO } from '@/models/recipeDTO'; 

class Response {
    message: string = "";
    recipe_list: RecipeDTO[] = [];
    status_code: string = "";
}

export { Response }