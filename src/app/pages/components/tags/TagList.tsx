// this is a list of tags

import React, { useState } from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

import Tag  from './Tag';
import { TagType } from '@/app/store/tagStore';
import useTagStore, { TagStoreType } from "@/app/store/tagStore";


const TagList = ({object_uuid, setTagListLoaded}: {object_uuid: string, setTagListLoaded:any}) => {

    const api_host = process.env.NEXT_PUBLIC_JARVIS_API_HOST;

    const [tags, setTags] = useState<TagType[]>([]);

    const [isLoaded, setIsLoaded] = useState(false);
    const [loadCount, setLoadCount] = useState(0);

    const addTag =(tag: TagType) => {
        
        setTags([...tags, tag]);
    }

    const delTag =(tag_uuid: string) => {
        const newTags = tags.filter((tag) => tag.uuid !== tag_uuid);
        setTags(newTags);
    }

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
              // console.log("TagList.apiFetch() data OK: ", data);
  
              return data; // Return the whole response data
  
          } catch (error) {
              console.log("Error fetching data:", error);
          }
      }

    if (!isLoaded) {
        // get all tags from the database
        const formData = new FormData();
        formData.append("object_uuid", object_uuid);
        apiFetch("get_tags_for_object", formData).then((my_tags) => {
            setTags(my_tags);
            
            setIsLoaded(true);
            setTagListLoaded(true);
            setLoadCount(loadCount + 1);
            // console.log("loadCount API: ", loadCount )

        }).catch((error) => {
            console.log("ERROR: TagList: ", error)
        })
    }
    // console.log("loadCount: ", loadCount )

    const handleAddTag = () => {
        const tag_input = document.getElementById("taginput_" + object_uuid) as HTMLDivElement
        tag_input.style.display = "block"
        console.log("handleAddTag")
    }

    // this function adds a tag to the object of object_uuid in the database
    const api_add_tag_to_object = async (tag: TagType): Promise<any> => {

        console.log("api_add_tag_to_object(): ", tag)
        const formData = new FormData();
        formData.append("tag", JSON.stringify(tag));
        formData.append("object_uuid", object_uuid);

        apiFetch("add_tag_to_object", formData).then((my_tag) => {
            return my_tag;
        }).catch((error) => {
            console.log("ERROR: api_add_tag_to_object(): ", error)
        })

    }

    const handleSaveTag = () => {
        console.log("handleSaveTag")
        // get the tag from the input field
        
        const tag_input = document.getElementById("taginput_" + object_uuid) as HTMLInputElement        
        tag_input.style.display = "none"

        const tag:TagType = {name: tag_input.value, uuid: "uuidv1()"}        

        // ToDo: save the tag to the database
        const formData = new FormData();
        formData.append("tag", JSON.stringify(tag));
        apiFetch("get_tag_by_name", formData).then((my_tag) => {
           api_add_tag_to_object(my_tag)
           console.log("my_tag: ", my_tag)

           // add the tag to the list of tags
            addTag(my_tag)
           console.log("tags: ", tags)

        }).catch((error) => {
            console.log("ERROR: handleSaveTag(): ", error)
        })
        tag_input.value = "";


    }

    // this function removes a tag from thE list and from the object in the database
    const handleRemoveTag = (tag_uuid: string) => {
        console.log("handleRemoveTag: ", tag_uuid)
        
        // remove the tag from the object in the database
        const formData = new FormData();
        formData.append("tag_uuid", JSON.stringify(tag_uuid));
        formData.append("object_uuid", object_uuid);
        apiFetch("remove_tag_from_object", formData).then((my_tag) => {

            // remove the tag from the list of tags
            delTag(tag_uuid)
            return my_tag;
        }).catch((error) => {
            console.log("ERROR: handleRemoveTag(): ", error)
        })
    }

    // ToDo: TagList gets call too often?
    // console.log("*** TagList: ", tags)

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
                // @ts-check
                tags.map((tag, index) => {
                    return <Tag key={index} name={tag.name} uuid={tag.uuid} removeHandler={handleRemoveTag}/>
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
