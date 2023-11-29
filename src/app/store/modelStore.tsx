import {create} from 'zustand'

export type ModelType = {
    uuid: string;
    model_filename: string;
    model_label: string;
    model_type: string;
    default_prompt: string;
    default_max_length: number;
}

type ModelsType = Array<ModelType>

export type ModelStoreType = {
    models: ModelsType | []
    setModels: (new_models: ModelsType) => void
    addModel: (model: ModelType) => void
    delModel: (uuid: string) => void
    updateModel: (model: ModelType) => void

    current_model: ModelType | null
    setCurrentModel: (model: ModelType) => void


}

const initialModels: ModelsType = [
    {
        uuid: "5e2f3b7a-8810-11ee-a1b8-047c16bbac51",
        model_filename: "spicyboros-13b-2.2.Q5_K_M.gguf",
        model_label: "SpiCyBoRoS 13b Q5_K_M",
        model_type: "local",
        default_prompt: "A chat.\n" +
            "USER: For your information: {context} " +
            "Now I have a question: {question}\n" +
            "ASSISTANT: ",

        default_max_length: 200,
    },
    {
        uuid: "6a4c88ee-8820-11ee-bf22-047c16bbac51",
        model_filename: "gpt3",
        model_label: "GPT-3",
        model_type: "remote",
        default_prompt: "Zur Deiner Information: {context} Nun habe ich folgender Frage: {question}\n",
        default_max_length: 100,
    },
    {
        uuid: "7a4c88ee-8820-11ee-bf22-047c16bbac51",
        model_filename: "bart",
        model_label: "BART",
        model_type: "remote",
        default_prompt: "Zur Deiner Information: {context} Nun habe ich folgender Frage: {question}\n",
        default_max_length: 100,
    },
    {
      uuid: "8a4c88ee-8820-11ee-bf22-047c16bbac51",
        model_filename: "t5",
        model_label: "T5",
        model_type: "remote",
        default_prompt: "Zur Deiner Information: {context} Nun habe ich folgender Frage: {question}\n",
        default_max_length: 100,
    },
    ]

const modelStore = (set: any):ModelStoreType => ({
    models: [],
    setModels: (new_models: ModelsType) => set({ models: new_models }),

    current_model: initialModels[0],
    setCurrentModel: (model: ModelType) => set({ current_model: model }),

    addModel: (model: ModelType) =>
        set((state: any) => ({
            models: [...state.models, model],
        })),
    delModel: (uuid: string) =>
        set((state: any) => ({
            models: state.models.filter((model: ModelType) => model.uuid !== uuid),
        })),
    updateModel: (model: ModelType) =>
        set((state: any) => ({
            models: state.models.map((t: ModelType) =>
                t.uuid === model.uuid ? model : t
            ),
        })),
})

const useModelStore = create(modelStore)

export default useModelStore
