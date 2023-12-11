import { create } from "zustand";

export type TagType = {
    uuid: string;
    name: string;
}

type TagsType = Array<TagType>

export type TagStoreType = {
    tags: TagsType | []
    setTags: (new_tags: TagsType) => void
    addTag: (tag: TagType) => void
    delTag: (uuid: string) => void
    updateTag: (tag: TagType) => void

    current_tag: TagType | null
    setCurrentTag: (tag: TagType) => void
}

const initialTags: TagsType = [
    {
        uuid: "5e2f3b7a-8810-11ee-a1b8-047c16bbac51",
        name: "Politik",
    },
    {
        uuid: "6a4c88ee-8820-11ee-bf22-047c16bbac51",
        name: "Wirtschaft",
    },
    {
        uuid: "7a4c88ee-8820-11ee-bf22-047c16bbac51",
        name: "Wissenschaft",
    },
    {
        uuid: "8a4c88ee-8820-11ee-bf22-047c16bbac51",
        name: "Kultur",
    },
    {
        uuid: "9a4c88ee-8820-11ee-bf22-047c16bbac51",
        name: "Privates",
    }
]

const tagStore = (set: any): TagStoreType => ({
    tags: [],
    setTags: (new_tags: TagsType) => set({ tags: new_tags }),
    addTag: (tag: TagType) => 
    set((state:any) => ({ 
        tags: [...state.tags, tag] 
    })),

    
    delTag: (uuid: string) => set((state:any) => ({ tags: state.tags.filter((tag:any) => tag.uuid !== uuid) })),
    updateTag: (tag: TagType) => set((state:any) => ({ tags: state.tags.map((tag_:any) => tag_.uuid === tag.uuid ? tag : tag_) })),

    current_tag: null,
    setCurrentTag: (tag: TagType) => set({ current_tag: tag }),
})

const useTagStore = create(tagStore)

export default useTagStore

