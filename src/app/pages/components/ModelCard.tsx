// a component that renders a single card
import useModelStore from "@/app/store/modelStore";
import {ModelType} from "@/app/store/modelStore";

export default function ModelCard({model_uuid}: {model_uuid: string}) {

    const models = useModelStore(state => state.models);
    // select current_model from models by model_uuid
    const model = models.filter((model: ModelType) => model.uuid === model_uuid)[0]


    return (
        <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                        Model Name {model.model_label}
                    </dt>

                    <dd className="mt-1 text-sm text-gray-900">
                        Model ID: {model.model_id}
                    </dd>


                    <dd className="mt-1 text-sm text-gray-900">
                        Model UUID: {model_uuid}
                    </dd>
                    <dd className="mt-1 text-sm text-gray-900">
                        Default Prompt: {model.default_prompt}
                    </dd>
                </dl>
            </div>
        </div>
    )
}