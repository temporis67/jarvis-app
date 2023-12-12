// a component that renders a single card
import useModelStore from "@/app/store/modelStore";
import { ModelType } from "@/app/store/modelStore";
import React from "react";
import clsx from "clsx";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function ModelCard({ model_uuid, handleClickEditModel, mode, handleClickDeleteModel }: 
    { model_uuid: string, handleClickEditModel: any, mode: string, handleClickDeleteModel: any }) {

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
        // console.log("clsx: ", model.uuid, currentModel.uuid)
        setCurrentModel(model);

    }


    if (model !== undefined) {

        if (mode === "short") {
            return (
                <div className={clsx("m-1 overflow-hidden shadow rounded-lg",
                    {
                        // @ts-ignore
                        ' bg-gray-600': model.uuid === currentModel?.uuid,
                        // @ts-ignore
                        ' bg-gray-700': model.uuid !== currentModel?.uuid,
                    })}
                    onClick={(event) => handleSelectModel(event)}
                >
                    <div className="p-1">
                        <div>
                            <div className="text-sm font-medium text-gray-300 ">
                                <div className="flex flex-row justify-between">
                                    <div className={"text-xs"}>
                                        {model.model_label}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            )
        }


        return (

            <div className={clsx("w-48 m-2 p-3 overflow-hidden shadow rounded-lg",
                {
                    // @ts-ignore
                    ' bg-gray-500': model?.uuid === currentModel?.uuid,
                    // @ts-ignore
                    ' bg-gray-700': model?.uuid !== currentModel?.uuid,
                })}


                onClick={(event) => handleSelectModel(event)}
            >
                <div className="">
                    <div>
                        <div className="text-sm font-medium">
                            <div className="flex flex-row justify-between">
                                <div className={""} title={model.uuid}>
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
                                    <TrashIcon className="w-5 h-5 text-gray-300"
                                        // @ts-ignore
                                        onClick={() => handleClickDeleteModel(model.uuid)}
                                        onMouseOver={(e) => e.currentTarget.style.color = 'darkred'}
                                        onMouseOut={(e) => e.currentTarget.style.color = 'rgb(209,213,219)'} // Setzen Sie hier die ursprüngliche Farbe
                                        title={"Model löschen"}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-1 text-xs text-gray-400">
                            File: {model.model_filename}
                        </div>
                        <div className="mt-1 truncate text-sm text-gray-300"

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