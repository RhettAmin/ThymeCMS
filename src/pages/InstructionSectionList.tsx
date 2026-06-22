import {Button} from "@/components/button"
import { IngredientSectionModel, InstructionSectionModel, InstructionSteps } from "../models/recipeModels"


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
        onUpdateRecipe(instructionSections.map((section: InstructionSectionModel, index) => {
            if (section.sectionId === sectionIndex) {
                    return {
                        ...section,  
                        steps: section.steps.map((step: InstructionSteps) => 
                            step.sortOrder === stepIndex ? {
                                stepId: index,
                                stepText: newValue,
                                sectionId: sectionIndex,
                                sortOrder: index
                            } : step  
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
                    steps: [...section.steps, {
                        stepId: 0,
                        stepText: "",
                        sectionId: 0,
                        sortOrder: 0
                    }]
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

    const openCloseSection = (SIndex: number) => {
        onUpdateRecipe(instructionSections.map((section, sIndex) => 
            sIndex === SIndex ?
                {
                    ...section,
                    isOpen: !section.isOpen
                } : 
                section
        ))
    }


    return (
         <div className="flex flex-col space-y-4">
            {/* <h2 className="pb-3 text-3xl">Instructions</h2>  */}
            <div className="justify-start">
                <Button 
                    message={"Add Section"} 
                    onClickFn={ () => addInstructionSection() } 
                />
            </div>

            <div className="flex flex-col space-y-4">   
                {
                    instructionSections.map((section: InstructionSectionModel, SIndex: number) => {
                        return (
                            <div key={ SIndex } className="flex flex-col items-center rounded-md bg-surface-card w-full">
                                {/* Section Name and Controls */}
                                <div className="p-2 relative w-full flex flex-row justify-between gap-x-4 bg-brand-soft border border-brand rounded-t-md cursor-pointer">
                                    <div className="flex-1 flex flex-row h-full pb-1">
                                        <label className="text-xl text-text-secondary">Section :</label>
                                        <input
                                            placeholder="Section Name"
                                            value={section.sectionName}
                                            onChange={(e) => updateSectionName(e.target.value, SIndex)}
                                            className="flex-1 outline-none px-1 font-semibold text-xl text-text-secondary focus:bg-surface-input hover:bg-surface-input"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-row space-x-4">
                                        {/* hidden click box */}
                                        <div
                                            onClick={() => openCloseSection(SIndex)}
                                            className="flex-1 bg-brand-soft hover:bg-brand-mid p-2 rounded-md flex items-center justify-center font-bold cursor-pointer">
                                        </div>
                                        <div
                                            onClick={() => removeInstructionSection(SIndex)}
                                            className="bg-status-error-light p-2 border border-text-secondary rounded-md flex items-center justify-center font-bold cursor-pointer">
                                            <img width={15} height={15} src="minus.png" alt="RemoveSection" />
                                        </div>
                                    </div>
                                </div>

                                <div className={`h-full w-full flex flex-col border-l border-r border-b border-brand p-2 rounded-b-md transition-transform
                                    ${ section.isOpen ? '': 'hidden'}
                                `}>
                                    {/* Image Ref and Ingredients*/}
                                    <div className="flex flex-row space-x-4 w-full border-b border-border pb-4">
                                        <div className={`bg-orange-300  ${ section.imageLink ? 'w-[200px] h-[200px]' : 'w-[200px] h-[200px]' }`}>
                                            <img className="w-full h-full object-cover" src={section.imageLink}/>
                                        </div>
                                        <div className="flex-1 flex flex-col space-y-4">
                                            {/* Main Image Links */}
                                            <div className="col-span-2 flex flex-col w-full gap-y-2">
                                                <label className="font-bold text-text-primary">Image Link</label>
                                                <input
                                                    className="border-b-1 outline-none px-2 w-full text-text-secondary bg-surface-input"
                                                    type="text"
                                                    value={section.imageLink}
                                                    onChange={(e) => {updateSectionImageRef(SIndex, e.target.value)}}
                                                />
                                            </div>

                                            <div>
                                                <p className="font-bold border-b border-border pb-2">Ingredients</p>
                                                <div className="flex flex-col h-44 overflow-y-scroll">
                                                    {   ingredientSections.length > 0 &&
                                                        ingredientSections.map((section: IngredientSectionModel, index: number) =>
                                                            index === SIndex ?
                                                                (
                                                                    <ul key={index} className="flex flex-col">
                                                                        {
                                                                            section.ingredients.map((ingredient, index: number) => {
                                                                                return (
                                                                                    <li className={`flex flex-row space-x-4 p-2 rounded-lg
                                                                                        ${
                                                                                            index%2==0 ? 
                                                                                            'bg-table-row-even' : 
                                                                                            'bg-table-row-odd'
                                                                                        }`
                                                                                    } key={index}>
                                                                                        <p className="w-50">{ ingredient.name }</p>
                                                                                        <div className="flex flex-row space-x-2">
                                                                                            <p>{ ingredient.quantity }</p>
                                                                                            <p>{ ingredient.measurement }</p>
                                                                                        </div>
                                                                                    </li>
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
                                    </div>
                                    {/* Step List */}
                                    <div className="py-2 relative w-full flex flex-col gap-x-4 space-y-4 justify-left">
                                        <div className="flex flex-row items-center justify-between border-b border-border pb-2">
                                            <label className="font-bold text-lg">Steps</label>
                                            <Button
                                                message={"Add Step"}
                                                onClickFn={ () => addStepToSection(SIndex) }
                                            />
                                        </div>
                                        <div className="max-h-90 overflow-y-auto flex flex-col">
                                            {
                                                section.steps.map((step: InstructionSteps, index) => {
                                                    return (
                                                        <div key={ step.sortOrder } className={`flex flex-row items-center rounded-lg mx-4 p-2 ${
                                                            index%2==0 ? 
                                                            'bg-table-row-even' : 
                                                            'bg-table-row-odd'
                                                        }`}>
                                                            <span className="text-lg font-bold">{step.sortOrder+1}</span>
                                                            <textarea
                                                                value={step.stepText}
                                                                rows={2}
                                                                placeholder={`step ${step.sortOrder+1}`}
                                                                onChange={(e) => updateStepInSection(SIndex, step.sortOrder, e.target.value)}
                                                                className="bg-white border border-1 rounded-md mx-4 px-1 py-2 w-full"
                                                            />
                                                            <div
                                                                onClick={() => removeStepFromSection(SIndex, step.sortOrder)}
                                                                className="bg-red-300 h-1/2 p-1 rounded-md flex items-center justify-center font-bold cursor-pointer">
                                                                <img width={10} height={10} src="minus.png" alt="Logo" />
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            

        </div>
    )
}

export default InstructionSectionList