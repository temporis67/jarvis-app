// create a default empty page
// Template: src/app/dashborad/page.tsx
import ModelSettings from "@/app/dashboard/components/ModelSettings";

export default function Page() {
    return (
        <div>
            <h1>Settings</h1>
            <p>Explore the universe ... with widgets :)</p>
            <ModelSettings/>

        </div>
    )
}


