// create a default empty page
// Template: src/app/dashborad/page.tsx
"use client"
import ModelCardList from "@/app/pages/components/ModelCardList";

export default function Page() {
    return (
        <div>
            <ModelCardList mode={"long"}/>

            <div className="p-2 mt-6 text-sm text-gray-400">Beim Anlegen eines neuen Models wählen Sie über den <code>Filename</code> 
            &nbsp; eines der vorhandenen Models aus. Damit können Sie 
            verschiedene Prompts für ein Model mit derselben Frage testen. Das enspricht in etwa den personalisierten 'My GPT's von OpenAI.</div>

        </div>
    )
}


