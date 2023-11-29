// create a default empty page
// Template: src/app/dashborad/page.tsx
"use client"
import ModelSettings from "@/app/pages/components/ModelSettings";
import ModelCardList from "@/app/pages/components/ModelCardList";

export default function Page() {
    return (
        <div>
            <ModelCardList />
        </div>
    )
}


