// this is a component that renders a list of cards
"use client"
import useModelStore from "@/app/store/modelStore";
import {ModelType} from "@/app/store/modelStore";

import ModelCard from "@/app/pages/components/ModelCard";


const ModelCardList = () =>{

    const models = useModelStore(state => state.models);

    return (
        <div className={"mt-2"}>
            <h2>Model List</h2>
            <p>Models go here ...</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {models.map((model: ModelType) => (
                    <ModelCard key={model.uuid} model_uuid={model.uuid} />
                ))}
            </div>
        </div>
    )
}

export default ModelCardList;
