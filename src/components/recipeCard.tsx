import { Link } from "react-router-dom"

type RecipeCardInput =  {
    recipeName: string
    recipeMainImageLink: string
    tags: string[]
    description: string
    timeToPlate: number
}

const RecipeCard = ({ recipeName, recipeMainImageLink, tags, description, timeToPlate } : RecipeCardInput) => {
    
    const getFontSize = (text: string) => {
        const length = text.length;
        if (length < 15) return 'text-lg'
        if (length < 30) return 'text-base'
        if (length < 50) return 'text-sm pt-1'
        return 'text-base'
    }

    const convertTime = (time: number): string => {
        if (time > 60) {
            return `${time / 60} hours`
        } else if (time === 60) {
            return `${time / 60} hour`
        } else {
            return `${time} minutes`
        }
    }

    return (
        <div className="relative h-full flex flex-col col-span-1 group bg-thymeBorder rounded-lg shadow-md border-2 border-black-200 p-4 flex flex-col">
            <div className="border-2 border-thymeButton h-full bg-thymeCard">
                <div className="border-2 border-thymeButton h-8 -mx-2 -mt-2 px-2 rounded-[0.65vw]">
                    <div className="bg-thymeCard h-7 -mx-2 px-2 rounded-[0.65vw] text-center">
                        <p className={`font-bold justify-center text-center ${ getFontSize(recipeName) }`}>{ recipeName }</p>
                    </div>
                </div>
                {/* Image placeholder */}
                <div className="flex w-full aspect-square items-center justify-center">
                    {
                        recipeMainImageLink ?
                        <img className="w-full h-full object-cover" src={recipeMainImageLink}/> :
                        <p className="w-full h-full bg-red-200 flex items-center justify-center">Image</p>
                    }
                </div>
                <div className="flex flex-col flex-1 pt-2 h-fit space-y-2">
                    <div className=" flex-none border-2 border-thymeButton -mx-2 -mt-2 px-2 rounded-[0.65vw] hover:border-thymeButtonHover">
                        <div className="bg-gradient-to-r from-thymeButton to-thymeButton hover:from-thymeButtonHover hover:to-thymeButton transition-all duration-200 -mx-2 px-2 text-center hover:text-white rounded-md">
                            <Link to={`/addRecipe?recipeName=${recipeName}`}>
                                <p className="font-bold">Edit</p>
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 space-y-2 px-2">
                        <div className="border-b-1 pb-1 border-black">
                            <p>{tags.join(", ")}</p>
                        </div>
                        
                        <div className="flex-1">
                            <p className="rounded-lg">{ description }</p>
                        </div>

                        <div className="absolute right-1 bottom-1 border-2 border-thymeRoot px-2 bg-thymeRoot rounded-lg inset-shadow-[2px_2px_5px_1px_rgba(0,0,0,0.25)]">
                            <div className=" flex flex-row justify-between">
                                <p>{ convertTime(timeToPlate) }</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecipeCard