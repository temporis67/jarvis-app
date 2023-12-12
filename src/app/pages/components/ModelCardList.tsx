// this is a component that renders a list of cards
import useModelStore from "@/app/store/modelStore";
import { ModelType } from "@/app/store/modelStore";

import ModelCard from "@/app/pages/components/ModelCard";
import React, { useEffect, useState } from "react";
import ModalDialog from "@/app/components/ModalDialog";
import { PlusCircleIcon } from "@heroicons/react/24/outline";



const ModelCardList = ({ mode }: { mode: string }) => {

    const api_host = process.env.NEXT_PUBLIC_JARVIS_API_HOST;
    const default_model_id = "mistral-7b-openorca.Q5_K_M.gguf";

    const models = useModelStore(state => state.models);
    const setModels = useModelStore(state => state.setModels);
    const setCurrentModel = useModelStore(state => state.setCurrentModel);
    const currentModel = useModelStore(state => state.current_model);
    const updateModel = useModelStore(state => state.updateModel);
    const addModel = useModelStore(state => state.addModel);
    const delModel = useModelStore(state => state.delModel);

    // Update Model ModalDialog *******************************************************************************
    // Zustand für das Anzeigen des Dialogs
    const [showDialog, setShowDialog] = useState(false);
    const [modalHeader, setModalHeader] = useState(''); // Zustand für Modal-Header
    const [modalTitle, setModalTitle] = useState(''); // Zustand für Modal-Titel
    const [modalContent, setModalContent] = useState(''); // Zustand für Modal-Inhalt
    const [modalFileName, setModalFileName] = useState(''); // Zustand für Modal-Inhalt

    console.log("ModelCardList Start: ", models);

    const apiFetch = async (slug: string, formData: FormData): Promise<any> => {
        //  console.log("API fetch() start", slug);

        if (slug === undefined || slug === null) {
            throw new Error('ERROR: apiFetch(): slug not given: ' + slug);
        }

        const api_url = api_host + "/" + slug; // Assuming api_host is defined elsewhere

        try {
            const response = await fetch(api_url, {
                method: "POST",
                body: formData,
                mode: 'cors',
            });
            if (!response.ok) {
                throw new Error('apiFetch Network response was not ok: ' + await response.json());
            }
            const data = await response.json();
            console.log("ModelCardList.apiFetch() data OK: ", data);

            return data; // Return the whole response data

        } catch (error) {
            console.log("Error fetching data:", error);
        }
    }

    const apiFetchModels = async () => {
        const formData = new FormData();
        formData.append("action", "list_models");
        const data = await apiFetch("get_models", formData);
        //  console.log("apiFetchModels() data: ", data);
        const new_models: any = Object.values(data);
        setModels(new_models);
        const default_model = new_models.filter((model: ModelType) => model.model_filename === default_model_id)[0];
        setCurrentModel(default_model as ModelType);
        // return data;
    }


    if (models === undefined || models === null || models.length === 0) {
        apiFetchModels();

    }

    const onClose = () => {
        //   console.log("Modal has closed")
        setShowDialog(false); // ModalDialog schließen
    }

    // handle title change
    const handleModalTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setModalTitle(e.target.value);
    };

    // handle content change
    const handleModalContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setModalContent(e.target.value);
    };

    const api_add_model = async (model: ModelType | null) => {
        const formData = new FormData();
        formData.append("action", "add_model");
        formData.append("model", JSON.stringify(model));
        const data = await apiFetch("add_model", formData);
        console.log("api_add_model() data: ", data);
        // const new_models: any = Object.values(data);
        // setModels(new_models);
        return data;
    }

    const handleClickUpdateModel = () => {
        console.log("handleClickUpdateModel was clicked: ", currentModel, " # ",
            modalTitle, " # ", modalContent, " # ", modalFileName)


        if (currentModel === null) {
            console.log("handleClickUpdateModel: add new model");

            let new_model_type = "local";
            if (modalFileName.includes("gpt")) {
                new_model_type = "remote";
            }


            const newModel: ModelType = {
                uuid: "",
                model_filename: modalFileName,
                model_label: modalTitle,
                model_type: new_model_type,
                default_prompt: modalContent,
                default_max_length: 200,
            }

            api_add_model(newModel).then((filled_model: ModelType) => {
                console.log("**** api_add_model() new_uuid: ", filled_model['uuid']);
                newModel.uuid = filled_model['uuid'];
                addModel(newModel);
                setCurrentModel(newModel);
            })
        }
        else {
            // @ts-ignore
            currentModel.model_label = modalTitle;
            // @ts-ignore
            currentModel.default_prompt = modalContent;
            api_update_model(currentModel);
            updateModel(currentModel as ModelType);
        }

        setShowDialog(false); // ModalDialog schließen
    }

    const api_update_model = async (model: ModelType | null,) => {
        const formData = new FormData();
        formData.append("action", "update_model");
        formData.append("model", JSON.stringify(model));
        const data = await apiFetch("update_model", formData);
        console.log("api_update_model() data: ", data);
        // const new_models: any = Object.values(data);
        // setModels(new_models);
        // return data;
    }

    const api_delete_model = async (model: ModelType | null,) => {
        const formData = new FormData();
        formData.append("action", "delete_model");
        formData.append("model", JSON.stringify(model));
        const data = await apiFetch("delete_model", formData);
        console.log("api_delete_model() data: ", data);
        // const new_models: any = Object.values(data);
        // setModels(new_models);
        // return data;
    }

    const handleClickDeleteModel = (modelId: string) => {
        console.log("handleClickDeleteModel start for model ID: ", modelId);

        // Bestätigungsdialog
        const isConfirmed = window.confirm("Sind Sie sicher, dass Sie diese Konfiguration löschen möchten?");

        if (!isConfirmed) {
            return;
        }

        // @ts-ignore
        const model = models.filter((model: ModelType) => model.uuid === modelId)[0]
        if (model) {
            // @ts-ignore
            console.log("handleClickDeleteModel: ", model.model_label);
            api_delete_model(model);
            delModel(modelId);
        }
    }

    const handleClickEditModel = (modelId: string) => {
        console.log("handleClickEditModel start for model ID: ", modelId);
        // @ts-ignore
        const model = models.filter((model: ModelType) => model.uuid === modelId)[0]
        if (model) {
            setModalHeader("Model bearbeiten"); // Setze den Titel des Dialogs
            // @ts-ignore
            setModalTitle(model.model_label); // Setze den Titel der Frage
            // @ts-ignore
            setModalContent(model.default_prompt); // Setze den Inhalt der Frage
            setCurrentModel(model); // Speichere die aktuelle Frage-ID
        }
        setShowDialog(true); // ModalDialog anzeigen
    }

    const handleClickNewModel = () => {
        console.log("handleClickNewModel start");
        setModalHeader("Neues Model anlegen"); // Setze den Titel des Dialogs
        setModalTitle(""); // Setze den Titel der Frage
        setModalContent(""); // Setze den Inhalt der Frage
        setCurrentModel(null); // Speichere die aktuelle Frage-ID
        setShowDialog(true); // ModalDialog anzeigen

    }


    if (models !== undefined && models !== null && models.length > 0) {
        models.sort((a, b) => a.model_label.localeCompare(b.model_label));
    }

    return (
        <div className={""}>

            {/********* ModalDialog Popup *********/}
            {showDialog && (
                <ModalDialog
                    title={modalHeader}
                    onClose={onClose}
                    onOk={handleClickUpdateModel}
                    showDialog={showDialog}
                >

                    <div className="col-span-full">


                        {
                            currentModel === null ? (
                                <>
                                    <label htmlFor="modal-filename" className="block text-sm font-medium leading-6">
                                        Model Filename
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="modal-filename"
                                            name="modal-filename"
                                            // @ts-ignore
                                            onChange={(e) => setModalFileName(e.target.value)}
                                            className="bg-gray-700 p-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6"
                                            defaultValue={modalFileName}
                                        />
                                    </div>
                                </>
                            ) : null
                        }



                        <label htmlFor="modal-title" className="block text-sm font-medium leading-6">
                            Model Label
                        </label>
                        <div className="mt-2">
                            <textarea
                                id="modal-title"
                                name="modal-title"
                                // @ts-ignore
                                onChange={handleModalTitleChange}
                                rows={2}
                                className="bg-gray-700 p-2 block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6"
                                defaultValue={modalTitle}
                            />
                        </div>
                    </div>

                    <div className="col-span-full mt-4">
                        <label htmlFor="modal-content" className="block text-sm font-medium leading-6">
                            Prompt:
                        </label>
                        <div className="mt-2">
                            <textarea
                                id="modal-content"
                                name="modal-content"
                                // @ts-ignore
                                onChange={handleModalContentChange}
                                rows={6}
                                className="bg-gray-700 p-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6"
                                defaultValue={modalContent}
                            />
                            <div className="mt-3 block text-sm">Bei lokalen Models können oder müssen die Platzhalter {"{question}"} und {"{context}"} benutzt werden.</div>
                            <div className="mt-3 block text-sm">Bei den externen Models werden Question und Context später an die richtige Stelle Prompt platziert.</div>
                        </div>


                    </div>


                </ModalDialog>
            )}


            {mode !== "short" && (
            <div className="flex">
            <h1 className={"m-2"}>Models</h1>
            <PlusCircleIcon className="w-5 h-5 text-gray-400"
                onClick={() => handleClickNewModel()}
                onMouseOver={(e) => e.currentTarget.style.color = 'blue'}
                onMouseOut={(e) => e.currentTarget.style.color = 'gray'} // Setzen Sie hier die ursprüngliche Farbe
                title={"Neues Model anlegen"}
            />
            </div>
            )}
            <div className="flex flex-wrap">
                {models.map((model: ModelType) => (
                    <ModelCard
                        key={model.uuid}
                        model_uuid={model.uuid}
                        handleClickEditModel={handleClickEditModel}
                        mode={mode}
                        handleClickDeleteModel={handleClickDeleteModel}

                    />
                ))}
            </div>
        </div>
    )
}

export default ModelCardList;
