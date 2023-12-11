// this is a component that is used in the Tags component
import { XCircleIcon } from "@heroicons/react/24/outline";


const Tag = ({name, uuid, removeHandler}: {name: string, uuid:string, removeHandler:any}) =>{
    return (
        <div 
        className="border-[1px] border-gray-400 ml-1 pl-1 pr-1 rounded-md transition delay-200 hover:text-gray-300"
        title={uuid}
        >
            {name} 
            <XCircleIcon className="h-4 w-4 inline-block hover:text-red-800" 
                onClick={() => removeHandler(uuid)}
                title={"Tag entfernen"} />
        </div>
    )
}

export default Tag;