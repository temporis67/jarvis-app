"use client"
import useUserStore from "@/app/store/userStore";

export default function Page() {
  //   console.log("Root Page Start :", process.env.GITHUB_SECRET);
    return(
        <div>

                        <p>
                            In diesem Demonstrator können Sie das Verhalten von Large Language Models (LLM) testen und
                            dabei das &quot;Hintergrundwissen&quot; des Modells um eigene Daten ergänzen (Kontext)
                            sowie das Verhalten des Models über Anweisungen (Prompt) steuern.
                            Beginnen Sie, indem Sie in den Bereich Fragen wechseln und dort eine Frage stellen.
                        </p>
            </div>
    )
}