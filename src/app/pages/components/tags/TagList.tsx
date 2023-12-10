// this is a list of tags

import React from 'react';
import Tag  from './Tag';
// import { v1 as uuidv1 } from 'uuid';

import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { TagType } from '@/app/store/TagType';

const TagList = ({object_uuid, tags}: {object_uuid: string, tags: TagType[]}) => {

    const handleAddTag = () => {
        const tag_input = document.getElementById("taginput_" + object_uuid) as HTMLDivElement
        tag_input.style.display = "block"
        console.log("handleAddTag")
    }

    const handleSaveTag = () => {
        console.log("handleSaveTag")
        // get the tag from the input field
        
        const tag_input = document.getElementById("taginput_" + object_uuid) as HTMLInputElement        
        tag_input.style.display = "none"

        const tag:TagType = {name: tag_input.value, uuid: "uuidv1()"}

        console.log("tag: ", tag_input.value)

        // ToDo: save the tag to the database

        // add the tag to the list of tags
        tags.push(tag)

    }

    return (
        <div className="flex relative">
            <div className="absolute top-0 left-0">
                <input type='text' placeholder='Tag hinzufügen' id={"taginput_" + object_uuid}
                className='hidden bg-gray-600 border-[1px] border-gray-400 ml-1 pl-1 pr-1 rounded-md transition delay-200 hover:text-gray-300'
                // when the key enter is pressed, save the tag
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSaveTag()
                    }
                }}
                
                />
            </div>
            {
                tags.map((tag, index) => {
                    return <Tag key={index} name={tag.name} uuid={tag.uuid}/>
                })                
            }
            <PlusCircleIcon 
                className="ml-1 p1 h-4 w-4 inline-block hover:text-gray-300" title={"Tag hinzufügen"}
                onClick={handleAddTag}
            />
        </div>
    )
}

export default TagList;
