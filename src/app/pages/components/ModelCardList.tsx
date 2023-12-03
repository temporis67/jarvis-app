// this is a component that renders a list of cards
import useModelStore from "@/app/store/modelStore";
import {ModelType} from "@/app/store/modelStore";

import ModelCard from "@/app/pages/components/ModelCard";
import React, {useEffect, useState} from "react";
import ModelStore from "@/app/store/modelStore";
import ModalDialog from "@/app/components/ModalDialog";
import {JARVIS_API_HOST} from "../../../../env_vars";


const ModelCardList = ({mode}: {mode: string}) => {

    const api_host = JARVIS_API_HOST;

    const models = useModelStore(state => state.models);
    const setModels = useModelStore(state => state.setModels);
    const setCurrentModel = useModelStore(state => state.setCurrentModel);
    const currentModel = useModelStore(state => state.current_model);
    const updateModel = useModelStore(state => state.updateModel);

    // Update Model ModalDialog *******************************************************************************
    // Zustand für das Anzeigen des Dialogs
    const [showDialog, setShowDialog] = useState(false);
    const [modalHeader, setModalHeader] = useState(''); // Zustand für Modal-Header
    const [modalTitle, setModalTitle] = useState(''); // Zustand für Modal-Titel
    const [modalContent, setModalContent] = useState(''); // Zustand für Modal-Inhalt

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
            console.log("AnswerList.apiFetch() data OK: ", data);

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
        // return data;
    }

    useEffect(() => {
        if (models.length === 0) { // Überprüfen, ob models leer ist
            apiFetchModels(); // Models abrufen, wenn models leer ist
        }
    }, []);

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


    const handleClickUpdateModel = () => {
        // console.log("handleClickUpdateModel was clicked: ", currentModel, " # ", modalTitle, " # ", modalContent)

        // update DB via API


        // @ts-ignore
        currentModel.model_label = modalTitle;
        // @ts-ignore
        currentModel.default_prompt = modalContent;

        api_update_model(currentModel, modalTitle, modalContent);

        updateModel(currentModel as ModelType);

        setShowDialog(false); // ModalDialog schließen
    }

    const api_update_model = async (model: ModelType | null, model_label: string, default_prompt: string) => {
        const formData = new FormData();
        formData.append("action", "update_model");
        formData.append("model", JSON.stringify(model));
        const data = await apiFetch("update_model", formData);
        console.log("api_update_model() data: ", data);
        // const new_models: any = Object.values(data);
        // setModels(new_models);
        // return data;
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
                        <label htmlFor="modal-title" className="block text-sm font-medium leading-6 text-gray-900">
                            Model Label
                        </label>
                        <div className="mt-2">
                                <textarea
                                    id="modal-title"
                                    name="modal-title"
                                    // @ts-ignore
                                    onChange={handleModalTitleChange}
                                    rows={2}
                                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    defaultValue={modalTitle}
                                />
                        </div>
                    </div>

                    <div className="col-span-full">
                        <label htmlFor="modal-content" className="block text-sm font-medium leading-6 text-gray-900">
                            Prompt:
                        </label>
                        <div className="mt-2">
                                <textarea
                                    id="modal-content"
                                    name="modal-content"
                                    // @ts-ignore
                                    onChange={handleModalContentChange}
                                    rows={6}
                                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    defaultValue={modalContent}
                                />
                            <p>Je nach Model können oder müssen die Platzhalter {"{question}"} und {"{content}"} benutzt werden.</p>
                        </div>


                    </div>


                </ModalDialog>
            )}


            { mode !== "short" && (<h1 className={"m-2"}>Models</h1>) }

            <div className="flex flex-wrap">
                {models.map((model: ModelType) => (
                    <ModelCard
                        key={model.uuid}
                        model_uuid={model.uuid}
                        handleClickEditModel={handleClickEditModel}
                        mode={mode}

                    />
                ))}
            </div>
        </div>
    )
}

export default ModelCardList;
