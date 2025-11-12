import Button from "@/components/button"
import { IngredientSectionModel, InstructionSectionModel } from "../models/recipeModels"


type displayIngredientSectionType = {
    instructionSections: InstructionSectionModel[]
    ingredientSections: IngredientSectionModel[]
    onUpdateRecipe: ((updatedSection: InstructionSectionModel[]) => void)
}

const InstructionSectionList = ({instructionSections, ingredientSections, onUpdateRecipe}: displayIngredientSectionType) => {

    const updateSectionName = (newNameValue: string, sectionIndex: number) => {
        onUpdateRecipe(instructionSections.map((section, index) => {
            if (index === sectionIndex) {
                return { ...section, sectionName: newNameValue }
            }
            return section
        }))
    }

    const removeInstructionSection = (sectionIndex: number) => {
        onUpdateRecipe( instructionSections.filter((_, i) => i !== sectionIndex))
    }

    const addInstructionSection = () => {
        onUpdateRecipe([...instructionSections, new InstructionSectionModel()])
    }

    const updateSectionImageRef = (sectionIndex: number, imageLink: string) => {
        onUpdateRecipe(instructionSections.map((section, index) => {
            if (index === sectionIndex) {
                return { ...section, image: imageLink }
            }
            return section
        }))
    }

    const updateStepInSection = (sectionIndex: number, stepIndex: number, newValue: string) => {
        onUpdateRecipe(instructionSections.map((section, index) => {
            if (index === sectionIndex) {
                    return {
                        ...section,  
                        steps: section.steps.map((step, sIdx) => 
                            sIdx === stepIndex ? newValue : step  
                        )
                    }
                }
            return section
        }))
    }

    const addStepToSection = (sectionIndex: number) => {
        onUpdateRecipe(instructionSections.map((section, index) => {
            if (index === sectionIndex) {
                return {
                    ...section,  
                    steps: [...section.steps, ""]
                }
            }
            return section
        }))
    }

    const removeStepFromSection = (sectionIndex: number, stepIndex: number) => {
        onUpdateRecipe(instructionSections.map((section, index) => {
            if (index === sectionIndex) {
                return {
                    ...section,
                    steps: section.steps.filter((_, stepIdx) => stepIdx !== stepIndex)
                }
            }
            return section
        }))
    }


    return (
         <div className="p-4 h-full overflow-auto">
            <h2 className="pb-3 text-3xl">Instructions</h2> 

            <div className="flex flex-col space-y-3 py-4 h-overflow-y-auto rounded-md p-2 w-full">   
                {
                    instructionSections.map((section: InstructionSectionModel, SIndex: number) => {
                        return (
                            <div key={ SIndex } className="flex flex-col space-y-4 items-center border border-thymeBackdrop rounded-md bg-thymeCard p-2 w-full">
                                <div className="pb-2 relative w-full flex flex-col space-y-2">
                                    <div className="flex justify-between">
                                        <label>Section Name</label>
                                        <div 
                                            onClick={() => removeInstructionSection(SIndex)}
                                            className="bg-red-300 h-1/2 p-1 rounded-md flex items-center justify-center font-bold cursor-pointer">
                                            <img width={15} height={15} src="minus.png" alt="Logo" />
                                        </div>
                                    </div> 
                                    <input
                                        placeholder="Section Name"
                                        value={section.sectionName}
                                        onChange={(e) => updateSectionName(e.target.value, SIndex)} 
                                        className="bg-white border border-1 rounded-md px-1 py-2 w-full" 
                                    />
                                </div>

                                {/* Image Ref and Ingredients*/}
                                <div className="flex flex-row space-x-4 w-full">
                                    <div className="pb-2 relative flex-auto flex flex-col">
                                        <label>Image Reference</label>
                                        <input
                                            value={ section.image ? section.image : ""}
                                            placeholder="Image Link"
                                            onChange={(e) => updateSectionImageRef(SIndex, e.target.value)}
                                            className="bg-white border border-1 rounded-md px-1 py-2 w-full"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold">Ingredients</p>
                                        <div>
                                            {   ingredientSections.length > 0 &&
                                                ingredientSections.map((section: IngredientSectionModel, index: number) => 
                                                    index === SIndex ?
                                                        (
                                                            <ul key={index} className="grid grid-cols-4 gap-4">
                                                                { 
                                                                    section.ingredients.map((ingredient, index: number) => {
                                                                        return (
                                                                            <li className="col-span-1" key={index}>{ ingredient.name }</li>
                                                                        )
                                                                    })
                                                                }
                                                            </ul>
                                                        ) :
                                                        <div hidden key={index}></div>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>

                               

                                {/* Step List */}
                                <div className="pb-2 relative w-full flex flex-col gap-x-4 justify-left">
                                    <label className="font-bold text-lg">Steps</label>

                                    <div className="">
                                        {
                                            section.steps.map((step: string, stepIndex: number) => {
                                                return (
                                                    <div key={ stepIndex } className="flex flex-row items-center my-4">
                                                        <span className="text-lg font-bold">{stepIndex+1}</span>
                                                        <input
                                                            value={step}
                                                            placeholder={`step ${stepIndex+1}`}
                                                            onChange={(e) => updateStepInSection(SIndex, stepIndex, e.target.value)}
                                                            className="bg-white border border-1 rounded-md mx-4 px-1 py-2 w-full" 
                                                        />
                                                        <div 
                                                            onClick={() => removeStepFromSection(SIndex, stepIndex)}
                                                            className="bg-red-300 h-1/2 p-1 rounded-md flex items-center justify-center font-bold cursor-pointer">
                                                            <img width={10} height={10} src="minus.png" alt="Logo" />
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>

                                    <div>
                                        <Button 
                                            message={"Add Step"} 
                                            onClickFn={ () => addStepToSection(SIndex) } 
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            <div className="my-2 flex justify-center">
                <Button 
                    message={"Add Instruction Section"} 
                    onClickFn={ () => addInstructionSection() } 
                />
            </div>

        </div>
    )
}

export default InstructionSectionList