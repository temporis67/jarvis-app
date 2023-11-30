// a component that renders a single card
import useModelStore from "@/app/store/modelStore";
import {ModelType} from "@/app/store/modelStore";
import React from "react";
import clsx from "clsx";
import {PencilSquareIcon} from "@heroicons/react/24/outline";

export default function ModelCard({model_uuid, handleClickEditModel}: { model_uuid: string, handleClickEditModel: any } ) {

    const models = useModelStore(state => state.models);
    const setCurrentModel = useModelStore(state => state.setCurrentModel);
    // @ts-ignore
    const currentModel = useModelStore(state => state.current_model);
    // select current_model from models by model_uuid
    const model = models.filter((model: ModelType) => model.uuid === model_uuid)[0]

    // Display full answer
    const showFullPrompt = (event: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => {
        const element = event.currentTarget;
        element.className = element.className.replace('truncate', '');
    };

    const showShortPrompt = (event: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => {
        const element = event.currentTarget;
        // Fügt 'truncate' hinzu, wenn es nicht bereits vorhanden ist
        if (!element.className.includes('truncate')) {
            element.className += ' truncate';
        }
    };

    const handleSelectModel = (event: React.MouseEvent<HTMLElement>) => {
        console.log("handleSelectModel: ", model);
        // @ts-ignore
        console.log("clsx: ", model.uuid, currentModel.uuid)
        setCurrentModel(model);

    }


    if (model !== undefined) {

        return (

            <div className={clsx("bg-white border-1 border-amber-950 overflow-hidden shadow rounded-lg",
                {
                    // @ts-ignore
                    'bg-sky-300': model.uuid === currentModel.uuid,
                })}


                 onClick={(event) => handleSelectModel(event)}
            >
                <div className="px-4 py-5 sm:p-6">
                    <div>
                        <div className="text-sm font-medium text-gray-500 ">
                            <div className="flex flex-row justify-between">
                                <div className={""}>
                                    {model.model_label}
                                </div>
                                <div className={""}>
                                    <PencilSquareIcon className="w-5 h-5 text-gray-400"
                                        // @ts-ignore
                                                      onClick={() => handleClickEditModel(model.uuid)}
                                                      onMouseOver={(e) => e.currentTarget.style.color = 'blue'}
                                                      onMouseOut={(e) => e.currentTarget.style.color = 'gray'} // Setzen Sie hier die ursprüngliche Farbe
                                                      title={"Model bearbeiten"}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-1 text-xs text-gray-600">
                            File: {model.model_filename}
                        </div>
                        <div className="mt-1 truncate text-sm text-gray-900"

                             onMouseOver={showFullPrompt}
                             onMouseOut={showShortPrompt}

                        >
                            Default Prompt: {model.default_prompt}
                        </div>
                    </div>
                </div>
            </div>

        )
    }
    else {
        return (<></>)
    }
}