import { useEffect, useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"

const AddRecipe = () => {
    interface Ingredient {
        name: string
        quantity: number
        measurement: string
        type: number
    }

    interface IngredientSection {
        sectionName: string;
        ingredients: Ingredient[]
    }
    
    interface InstructionImageMetadata {
        altText: string
    }
    
    // interface InstructionImageRef {
    //     instructionSection: string
    //     index: number
    // }
    
    interface InstructionSection {
        sectionName: string
        image: string
        metadata: InstructionImageMetadata
        steps: string[]
    }
    
    interface NutritionFacts {
        calories: number
        fat: number
        saturatedFat: number
        transFat: number
        carbohydrate: number
        fibre: number
        sugars: number
        protein: number
        cholesterol: number
        sodium: number
        vitaminD: number
        iron: number
        potassium: number
        calcium: number
    
        // getValue(value: string): number {
        //     switch(value as any) {
        //         case "Calories": {
        //             return this.calories;
        //         }
        //         case "Fat": {
        //             return this.fat;
        //         }
        //         case "Saturated": {
        //             return this.saturatedFat;
        //         }
        //         case "Trans": {
        //             return this.transFat;
        //         }
        //         case "Carbohydrate": {
        //             return this.carbohydrate;
        //         }
        //         case "Fibre": {
        //             return this.fibre;
        //         }
        //         case "Sugars": {
        //             return this.sugars;
        //         }
        //         case "Protein": {
        //             return this.protein;
        //         }
        //         case "Cholesterol": {
        //             return this.cholesterol;
        //         }
        //         case "Sodium": {
        //             return this.sodium;
        //         }
        //         case "Vitamin D": {
        //             return this.vitaminD;
        //         }
        //         case "Iron": {
        //             return this.iron;
        //         }
        //         case "Potassium": {
        //             return this.potassium;
        //         }
        //         case "Calcium": {
        //             return this.calcium;
        //         }
        //     }
        //     return -1
        // }
    }
    
    interface IFormInput {
        recipeName: string
        heroImageLink: string
        mainImageLink: string
        totalServings: number
        servingSize: number
        servingAmount: string
        tags: string[]
        timeToPlate: number
        description: string
        ingredientSection: IngredientSection[]
        instructionSection: InstructionSection[]
        nutritionFacts: NutritionFacts
    }

    const { register, handleSubmit } = useForm<IFormInput>()
    const [ingredientSections, setIngredientSections] = useState<IngredientSection[]>([{
        sectionName: '',
        ingredients: []
    }])
    const [instructionSections, setInstructionSections] = useState<InstructionSection[]>([{
        sectionName: '',
        image: '',
        metadata: {
            altText: ''
        },
        steps: [""]
    }])
    // const [ingredientList, setIngredientList] = useState<Ingredient[]>([])

    const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data)

   
    const DisplayIngredientSection = () => {

        const addSection = () => {
            console.log("HIT")
            setIngredientSections(prev => [...prev, {
                sectionName: '',
                ingredients: []
            }])
        }

        const removeSection = (indexToRemove: number) => {
            setIngredientSections(prevItems => prevItems.filter((_, index) => index !== indexToRemove));
        }

        const addIngredientToSection = (sectionIndex: number) => {
            setIngredientSections(prevSections => {
              const updatedSections = [...prevSections];
              const updatedIngredients = [
                ...updatedSections[sectionIndex].ingredients,
                {
                  name: "",
                  quantity: 0,
                  measurement: "",
                  type: 0,
                },
              ];
          
              updatedSections[sectionIndex] = {
                ...updatedSections[sectionIndex],
                ingredients: updatedIngredients,
              };
          
              return updatedSections;
            });
        };

        const removeIngredientFromSection = (sectionIndex: number, ingredientIndex: number) => {
            setIngredientSections(prevSections => {
              const updatedSections = [...prevSections];
              const updatedIngredients = updatedSections[sectionIndex].ingredients.filter((_, i) => i !== ingredientIndex);
          
              updatedSections[sectionIndex] = {
                ...updatedSections[sectionIndex],
                ingredients: updatedIngredients,
              };
          
              return updatedSections;
            });
        };

        const updateIngredientField = <K extends keyof Ingredient>(
            sectionIndex: number,
            ingredientIndex: number,
            field: K,
            newValue: Ingredient[K]
        ) => {
            setIngredientSections(prevSections => {
              const updatedSections = [...prevSections];
              const updatedIngredients = [...updatedSections[sectionIndex].ingredients];
              
              updatedIngredients[ingredientIndex] = {
                ...updatedIngredients[ingredientIndex],
                [field]: newValue,
              };
          
              updatedSections[sectionIndex] = {
                ...updatedSections[sectionIndex],
                ingredients: updatedIngredients,
              };
          
              return updatedSections;
            });
        }

        return (
            <div className="p-4 h-full overflow-auto">
                <h2 className="pb-3 text-3xl">Ingredients</h2>
                
                <div className="flex flex-col space-y-3 py-4 h-overflow-y-auto border border-thymeProgress rounded-md bg-thymeProgress p-2 w-full">   
                    {/* Ingredient section Map */}
                    {
                        ingredientSections.map((section, iSIndex) => {
                            return (
                                <div key={iSIndex} className="border border-thymeBackdrop rounded-md bg-thymeCard p-2 w-full">
                                    <div className="pb-2 relative w-full flex flex-row gap-x-4 items-center">
                                        <input className="bg-white border border-1 rounded-md px-1 py-2 w-full" placeholder="Section Name"></input>
                                        <div 
                                            onClick={() => removeSection(iSIndex)}
                                            className="bg-red-300 h-1/2 p-1 rounded-md flex items-center justify-center font-bold cursor-pointer">
                                            <img width={10} height={10} src="minus.png" alt="Logo" />
                                        </div>
                                    </div>
                                    {/* Ingredient map */}
                                    <div id="ingredientsContainer" className="flex flex-col space-y-3 w-full " >
                                        {
                                            section.ingredients.map((ingredient, iIndex) => {
                                                return (
                                                    <div key={iIndex} className="flex justify-center w-full overflow-x-auto">
                                                        <div className="bg-thymeProgressBackground rounded-md shadow-lg p-2 w-full flex flex-row space-x-3 ">
                                                            <div className="flex flex-col w-full">
                                                                <label className="">Name</label>
                                                                <input className="bg-white border border-1 rounded-md" type="text"
                                                                    onChange={(e) => updateIngredientField(iSIndex, iIndex, "name", e.target.value)}
                                                                    value={ingredient.name}
                                                                />
                                                            </div>
                                                            <div className="flex flex-col w-full">
                                                                <label className="">Quantity</label>
                                                                <input className="bg-white border border-1 rounded-md" type="number" step=".01" v-model="ingredient.quantity"/>
                                                            </div>
                                                            <div className="flex flex-col w-full">
                                                                <label className="">Measurement</label>
                                                                <input className="bg-white border border-1 rounded-md" type="text" v-model="ingredient.measurement" />
                                                            </div>
                                                            <div className="flex justify-center items-center ">
                                                                <span className="bg-red-300 w-4 h-4 mt-3 p-1 rounded-md cursor-pointer"
                                                                    onClick={() => { removeIngredientFromSection(iSIndex, iIndex)} }
                                                                >
                                                                    <img src="minus.png" alt="Logo" />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                        <div className="flex justify-center">
                                            <label className="rounded border mt-3 p-1 text-blue bg-green-400 cursor-pointer w-1/4 flex justify-center"
                                                onClick={() => addIngredientToSection(iSIndex)}>
                                                Add Ingredient
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

                <div className="my-2 flex justify-center">
                    <label className="rounded border p-1 bg-green-400 cursor-pointer" 
                        onClick={() => addSection()}>
                            Add Ingredient Group
                    </label>
                </div>

            </div>
        )
    }

    /**
     * DisplayInstructionSection
     * @returns Instruction Section Component
     */
    const DisplayInstructionSection = () => {
        const addSection = () => {
            setInstructionSections(prev => [...prev, {
                sectionName: '',
                image: '',
                metadata: {
                    altText: ''
                },
                steps: [""]
            }])
        }

        const removeSection = (indexToRemove: number) => {
            setInstructionSections(prevItems => prevItems.filter((_, index) => index !== indexToRemove));
        }

        const addStepToInstruction = (sectionIndex: number) => {
            setInstructionSections(prevSections => {
                const updatedSections = [...prevSections];
                const section = { ...updatedSections[sectionIndex] };
            
                // Create a new steps array with the added step
                section.steps = [...section.steps, ''];
            
                updatedSections[sectionIndex] = section;
                return updatedSections;
            });
        };

        const removeInstructionFromSection = (sectionIndex: number) => {
            setInstructionSections(prevSections => {
              const updatedSections = [...prevSections].filter((_, i) => i !== sectionIndex);
          
              return updatedSections;
            });
        };

        const updateInstructionField = (
            sectionIndex: number,
            field: keyof InstructionSection,
            newValue: any,
            options?: {
                stepIndex?: number; // Only for updating a specific step
                metadataField?: keyof InstructionImageMetadata; // Only for updating a metadata field
            }
        ) => {
            setInstructionSections(prevSections => {
                const updatedSections = [...prevSections];
                const section = { ...updatedSections[sectionIndex] };
            
                // Handle updating a specific step
                if (field === 'steps' && typeof options?.stepIndex === 'number') {
                  const updatedSteps = [...section.steps];
                  updatedSteps[options.stepIndex] = newValue;
                  section.steps = updatedSteps;                
                } else if (field === 'metadata' && options?.metadataField) { // Handle updating a metadata field
                  section.metadata = {
                    ...section.metadata,
                    [options.metadataField]: newValue
                  };
                } else {
                  (section as any)[field] = newValue; // Handle top-level field update
                }
            
                updatedSections[sectionIndex] = section;
                return updatedSections;
            });
        }

        return (
            <div className="p-4 h-full overflow-auto">
                <h2 className="pb-3 text-3xl">Instructions</h2>
                
                <div className="flex flex-col space-y-3 py-4 h-overflow-y-auto border border-thymeProgress rounded-md bg-thymeProgress p-2 w-full">   
                    {/* Instruction section Map */}
                    {
                        instructionSections.map((section, iSIndex) => {
                            return (
                                <div key={iSIndex} className="border border-thymeBackdrop rounded-md bg-thymeCard p-2 w-full">
                                    <div className="pb-2 relative">
                                        <div>
                                            <label className="pr-2">Section Name</label>
                                            <input className="bg-white border border-1 rounded-md"></input>
                                        </div>
                                        <div className="flex flex-row gap-x-2 mt-4 ">
                                            <div>
                                                <label className="pr-2">Image</label>
                                                <input className="bg-white border border-1 rounded-md"></input>
                                            </div>
                                            <div>
                                                <label className="pr-2">Metadata</label>
                                                <input className="bg-white border border-1 rounded-md"></input>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <p>Steps</p>
                                            <ol className="space-y-2 mt-2">
                                                {
                                                    section.steps.map((step, index) => {
                                                        return (
                                                            <li key={index} className="flex flex-row gap-8 items-center w-full px-4">
                                                                <p>{index + 1}</p>
                                                                <textarea className="border border-1 bg-white rounded-md w-full h-16" value={step} />
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ol>
                                        </div>
                                        <div>
                                            <span
                                                onClick={() => removeSection(iSIndex)}
                                                className="bg-red-300 w-4 h-4 p-1 rounded-md absolute top-0 right-0 text-center justify-center font-bold cursor-pointer">
                                                <img src="minus.png" alt="Logo" />
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-center">
                                        <label className="rounded border mt-3 p-1 text-blue bg-green-400 cursor-pointer w-1/4 flex justify-center"
                                            onClick={() => addStepToInstruction(iSIndex)}>
                                            Add Step
                                        </label>
                                    </div>
                                </div>
                            )
                        })
                    }
                   
                </div>

                <div className="my-2 flex justify-center">
                    <label className="rounded border p-1 bg-green-400 cursor-pointer" 
                        onClick={() => addSection()}>
                            Add Instruction Section
                    </label>
                </div>

            </div>
        )
    }

    return (
        <div className="w-full h-full">
            <h2 className="text-3xl font-semibold w-full text-center mb-4">Add Recipe</h2>
            <div className="flex flex-col divide-y space-y-4">
                {/* Main Content */}
                <form className="flex-1 h-full overflow-y-auto p-4 mb-4">
                    <div 
                        className="flex flex-col" 
                        onSubmit={handleSubmit(onSubmit)}
                    >   
                        {/* Main form fields */}
                        <div className="grid grid-cols-8 gap-2">
                            {/* Name */}
                            <div className="col-span-8 flex flex-row gap-x-4">
                                <label className="w-30">Recipe Name</label>
                                <input
                                    className="border border-1 bg-white px-2 rounded-md w-full"
                                    {...register("recipeName")} 
                                />
                            </div>
                            {/* Main Image Links */}
                            <div className="col-span-8 flex flex-row gap-x-4">
                                <div className="col-span-2 flex flex-row gap-x-2">
                                    <label className="w-27">Hero Link</label>
                                    <input
                                        className="border border-1 bg-white px-2 rounded-md"
                                        {...register("heroImageLink")} 
                                    />
                                </div>
                                <div className="col-span-2 flex flex-row gap-x-4">
                                    <label className="w-18">Main Link</label>
                                    <input
                                        className="border border-1 bg-white px-2 rounded-md"
                                        {...register("mainImageLink")} 
                                    />
                                </div>
                            </div>
                            {/* Servings */}
                            <div className="col-span-8 flex flex-col gap-y-2">
                                <div className="flex flex-row gap-x-4">
                                    <label className="w-25">Total Servings</label>
                                    <input
                                        type="number"
                                        className="border border-1 bg-white px-2 rounded-md"
                                        {...register("totalServings")} 
                                    />
                                </div>
                                <div className="flex flex-row gap-x-13">
                                    <div className="flex flex-row gap-x-4">
                                      <label className="w-25">Serving Size</label>
                                      <input 
                                          type="number"
                                          className="border border-1 bg-white px-2 rounded-md" 
                                          {...register("servingSize")} 
                                      />
                                    </div>
                                    <div className="flex flex-row gap-x-4">
                                      <label>Type</label>
                                      <input 
                                          className="border border-1 bg-white px-2 rounded-md" 
                                          {...register("servingAmount")} 
                                      />
                                    </div>
                                </div>
                            </div>
                            {/* Time and Tags */}
                            <div className="col-span-8 flex flex-row gap-x-13">
                                <div className="flex flex-row">
                                    <label className="w-29">Time to Plate</label>
                                    <input
                                        type="number"
                                        className="border border-1 bg-white px-2 rounded-md"
                                        {...register("timeToPlate")} 
                                    />
                                </div>
                                <div className="flex flex-row">
                                    <label className="w-12">Tags</label>
                                    <input
                                        className="border border-1 bg-white px-2 rounded-md"
                                        {...register("tags")} 
                                    />
                                </div>
                            </div>
                            {/* Description */}
                            <div className="col-span-8 flex flex-row gap-x-4">
                                <label className="w-30">Description</label>
                                <textarea
                                    className="border border-1 bg-white px-2 rounded-md w-full"
                                    {...register("description")} 
                                    rows={4}
                                />
                            </div>
                        </div>
                        

                        {/*  Ingredients */}
                        <div className="flex-auto">
                            <DisplayIngredientSection />
                        </div>

                        {/*  Instruction */}
                        <div className="flex-auto">
                            <DisplayInstructionSection />
                        </div>


                    </div>

                    <div className="flex justify-center mt-4">
                        <button 
                            className="border border-1 py-2 w-3/4 bg-green-500 rounded-lg shadow-lg" 
                        >
                            Submit
                        </button>
                    </div>
                </form>
                
                {/* Sample Display */}
                <div className="px-4 flex-1">
                    Sample Display
                </div>
            </div>
           
        </div>
    )
} 

export default AddRecipe