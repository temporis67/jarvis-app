"use client"
import useQuestionStore from "../store/questionStore";
import useUserStore from "../store/userStore";
import {
    PlusCircleIcon, CalculatorIcon, SparklesIcon, FunnelIcon
} from "@heroicons/react/24/outline";


const is_client = typeof window !== "undefined";

export default function Page(request: any) {
    // console.log("/app/pages/page.tsx Start");

    const is_client = typeof window !== "undefined";
    // console.log("app/pages/page.tsx is_client: " + is_client);

    // console.log("/app/pages/page.tsx request: " + JSON.stringify(request));
    const searchParams = request["searchParams"];
    const user_uuid = searchParams["uuid"];


    const setUserUuid = useUserStore(state => state.setUserUuid);
    // const setQuestions = useQuestionStore(state => state.setQuestions);


    if (is_client) {
        // console.log("/app/pages/page.tsx setUserUuid: " + JSON.stringify(user_uuid));
        setUserUuid(user_uuid);
        // setQuestions([]);
        // console.log("/app/pages/page.tsx is CLIENT");
    }

    return (

        <div className="p-2 text-gray-200">
            <h1 className="p-2 text-2xl">
                Preussen Ki
            </h1>
            <div className="p-2">

            </div>
            <div className="p-2">
                Im Folgenden wird die grundlegende Architektur eines autark funktionierenden und erweiterbaren Large Language Models vorgestellt und demonstriert.
            </div>
            <div className="p-2">
                Im Demonstrator können Sie Antworten lokaler Models (Mistral 7B, Spicy 13B) mit externen Models von OpenAI.com (GPT-x) vergleichen.
                Über Prompt, Context und Question kann das Verhalten der Models bestimmt und zusätzliche Fakten können eingebunden werden.
            </div>
            <div className="p-2">
                <span className="font-bold">Zum Demo:</span>
                <ul className="list-disc ml-8">
                    <li>Gehen Sie links auf den Bereich "Fragen"</li>
                    <li><div className="flex">Schreiben Sie eine neue Frage über das &nbsp; <PlusCircleIcon className="w-[20px] text-green-600" />-Symbol</div></li>
                    <li><div className="flex">Berechnen Sie eine Antwort über das grüne &nbsp; <CalculatorIcon className="w-[20px]" />-Symbol.</div></li>
                    <li><div className="flex">Wählen Sie ein anderes Model und/oder geben Sie Context zur Frage ein.</div></li>
                    <li><div className="flex">Berechnen Sie eine zweite Antwort über das &nbsp; <CalculatorIcon className="w-[20px]" />-Symbol.</div></li>
                    <li><div className="flex text-xs text-gray-400">Fragen und Antworten können auch manuell erstellt und bearbeitet/verbessert werden.</div></li>
                    <li><div className="flex">Vergleichen und sortieren (bewerten) Sie die Antworten mit Drag&Drop.</div></li>
                    <li><div className="flex">Berechnen Sie Tags für eine Antwort über das &nbsp; <SparklesIcon className="w-[20px]" />-Symbol.</div></li>
                    <li><div className="flex text-xs text-gray-400">Um Tags für eine Frage zu berechnen muss ihr Context gefüllt sein.</div></li>
                    <li><div className="flex">Klicken Sie einen Tag an, um ihn als Filter zu setzen.</div></li>
                    <li><div className="flex">Klicken Sie auf das  &nbsp; <FunnelIcon className="w-[20px]" />-Symbol um Filter ein- und auszuschalten.</div></li>
                </ul>
            </div>

            <hr className="mt-3" />

            <div className="p-2 text-xl mt-4">Abstract</div>
            <div className="p-2">

            </div>
            <div className="p-2">
                Gezeigt werden die Antworten verschiedener Large Language Models.<br/>
                Mehrere dieser Models werden lokal betrieben und können als WebServices mit internen Daten verbunden werden.<br/>
                Ihr Verhalten und Informationsstand kann durch Context und Prompts manipuliert und getestet werden.<br/>
                Mit der Frage & Antwort UI wird die Bewertung von Ergebnissen für ein RLHF Training ermöglicht.<br/>
                Neben den größeren lokalen Models und OpenAI e.a. läuft im Hintergund parallel 
                ein (noch untraininertes) TinyLlama Model, das die automatische Verschlagwortung übernimmt.<br/>
                Durch einfachen Datei-Upload (des Admins) können ein weitere lokale Modelle im GGUF Format hinzugefügt und getestet werden.<br/>
            </div>

            <hr className="mt-3" />

            <div className="p-2 text-xl mt-4">Hintergrund</div>

            <div className="p-2">

            </div>
            <div className="p-2">
                Wesentlich f&uuml;r das Verst&auml;ndnis der GPT &auml;hnlichen Systeme sind vier Konzepte:
            </div>
            <ol className="p-2 ml-20 list-decimal">
                <li className="p-2">
                    Das MODEL
                </li>
                <li className="p-2">
                    Die EMBEDDINGS
                </li>
                <li className="p-2">
                    Die TRAININGSDATEN
                </li>
                <li className="p-2">
                    Die APP
                </li>
            </ol>
            <div className="p-2">

            </div>
            <div className="p-2">
                <div className="p-2">
                    <h2 className="p-2 text-xl">
                        Das MODEL
                    </h2>
                </div>
            </div>
            <div className="p-2">

            </div>
            <div className="p-2">
                Das MODEL ist die bin&auml;re Repr&auml;sentation eines Gehirnzustandes. Es bestimmt die Qualit&auml;t der Denkf&auml;higkeit und das Basiswissen inklusive Weltwissen, Sprachen und Fachbereiche. Ebenso gibt es spezielle MODELs f&uuml;r Sehen (Image Recognition), H&ouml;ren (Speech-to-Text), Reden (Text-to-Speech) etc. .
            </div>



            <div className="p-2">
                Im vorliegenden Demonstrator werden aktuell

                <ul className="list-disc m-5">
                    <li>das MODEL <span className="font-bold"><a href="https://huggingface.co/jondurbin/spicyboros-13b-2.2?not-for-all-audiences=true">Spicyboros 13B 2.2 - GGUF</a></span> </li>
                    <li>und das MODEL <span className="font-bold"><a className="decoration-solid" href="https://huggingface.co/mistralai/Mistral-7B-v0.1">Mistral 7B - GGUF</a></span></li>
                </ul>

                mit einer Gr&ouml;&szlig;e von 13 bzw. 7 Milliarden Parametern
                lokal auf einem regul&auml;ren Linux-Server betrieben. 
                Sie werden zur Laufzeit geladen, wenn der Nutzer im UI ein anderes Model ausw&auml;hlt.


            </div>
            <div className="p-2">
                Zusätzlich wird als Hintergrund-Prozess ein lokales <span className="font-bold"><a href="https://huggingface.co/TinyLlama/TinyLlama-1.1B-Chat-v0.6">TinyLlama Model</a></span> mit 1 Mrd Parametern benutzt, das die automatische Verschlagwortung übernimmt.
            </div>

            <div className="p-2">
                Jedes der zahlreichen MODELs auf Huggingface.com kann parallel
                oder in Reihe (z.B. Frage &rarr; Antwort &rarr; Schlagworte) angebunden werden - sollte die Hardware reichen.
            </div>

            <div className="p-2">

            </div>


            <div className="p-2">
                Vorreiter ist GPT von <span className="font-bold">OpenAI.com</span> - verschiedene Entwicklungsstufen sind im Demonstrator angebunden. Leider ist die Nutzung dieser API kostenpflichtig.
            </div>
            <div className="p-2 text-sm">
                Das israelische Ai21.com ist frei verf&uuml;gbar und kann (wahrscheinlich) angebunden werden.
            </div>
            <div className="p-2  text-sm">
                Das chinesische Alibaba.com T5 ist verf&uuml;gbar und kann (wahrscheinlich) angebunden werden.
            </div>
            <div className="p-2  text-sm">
                Google.com BARD/PaLM2 ist in Europa aus politischen Gründen derzeit nicht zug&auml;nglich.
            </div>
            <div className="p-2">
                Das Berliner DeepL.com hat ein eigenes, das aber nur f&uuml;r &Uuml;bersetzungen angeboten wird.
            </div>
            <div className="p-2">

            </div>
            <div className="p-2 font-bold">
                <span>Facebook</span> hat das Model Llama2 entwickelt und als <span>Open Source</span> bereitgestellt.
            </div>
            <div className="p-2">
                Llama2 und andere bilden die Grundlage für eine welweite Weiterentwicklung und Evolution der Models.
                Zahlreiche dieser MODELs sind als 5-20 GB gro&szlig;e Bin&auml;r-Dateien &uuml;ber <a href="https://huggingface.co/">huggingface.com</a>
                mit freien Lizenzen verf&uuml;gbar, auch solche von Microsoft oder eben Facebook,
                zahlreicher jedoch Weiterentwicklungen und iterative Ableitungen der jeweils
                erfolgreichsten Vorg&auml;nger in vielf&auml;ltigen Spezialisierungen und Themenbereichen.
            </div>
            <div className="p-2">

            </div>


            <div>
                Über die Konfiguration der Prompts als WebServices können sowohl die lokalen als auch die externen Models Spezialaufgaben
                ausführen wie Verschlagwortung oder Übersetzung. Bspw. "GPT-4 Pirat" und beim automatischen Tagging.
            </div>







            <div className="p-2">
                <div className="p-2">
                    <div className="p-2 text-xl">
                        Die EMBEDDINGS
                    </div>
                </div>
            </div>
            <div className="p-2">

            </div>
            <div className="p-2">
                Die EMBEDDINGS sind Schablonen des MODELs, mit denen Wissen eine bin&auml;re Form transformiert wird, die zu genau diesem MODEL kompatibel ist. Bevor also z.B. eine Frage verarbeitet wird, wird sie aus Text &uuml;ber Embeddings in einen mehrdimensionalen Pfeil (Tensor) &uuml;bersetzt, der im Raum des Wissens die Richtung der Antwort vorgibt.
            </div>
            <div className="p-2">

            </div>
            <div className="p-2">
                Will man nun neues Wissen
                kurzfristig
                in das System bringen, kann dies durch EMBEDDINGS zur Laufzeit &uuml;ber den Kontext und das Prompt erfolgen. Das Prompt ist dabei eine direkte Verhaltensaufforderung an das System (zB. &ldquo;Sei freundlich. Antworte auf Deutsch oder Japanisch.&rdquo;) w&auml;hrend der Kontext/Hintergrund zus&auml;tzliche Informationen einbringt, die f&uuml;r die Antwort ber&uuml;cksichtigt werden. Beides ist im Demonstrator direkt steuerbar und beeinflusst zusammen mit der Formulierung der Frage die Antwort ma&szlig;geblich.
            </div>
            <div className="p-2">

            </div>
            <div className="p-2">
                Will man zus&auml;tzliches Wissen (wie z.B. Fakten) &nbsp;
                langfristig
                zur Verf&uuml;gung stellen, bietet sich ein mehrstufiges System an, das sch&uuml;tzenswerte lokale Daten nach Aufbereitung (siehe 3.) als dauerhafte EMBEDDINGS in einer Datenbank speichert und zur Laufzeit mit dem jeweiligen Basis MODEL kombiniert. Dabei k&ouml;nnen deterministische Regeln angewendet werden, die im Rahmen der eingebrachten Daten Zuverl&auml;ssigkeit herstellen und dabei die Verbindung zur internen Datenquelle dynamisch halten. Was zu testen und zu beweisen w&auml;re.
            </div>
            <div className="p-2">

            </div>
            <div className="p-2">
                Will man schlussendlich einem MODEL neues Wissen oder Verhalten
                dauerhaft
                beibringen, wie zB. das Verst&auml;ndnis preu&szlig;ischer Sprache oder die Beziehungen am Hofe, dann kann mit den TRAININGSDATEN als Verhaltensmuster und den EMBEDDINGS als Fakten aus einem Basis MODEL ein erweiterte Version erstellt werden, die dann f&uuml;r die APP oder weitere Lernprozesse zur Verf&uuml;gung steht.
            </div>
            <div className="p-2">

            </div>
            <div className="p-2">
                <div className="p-2">
                    <div className="p-2 text-xl">
                        Die TRAININGSDATEN
                    </div>
                </div>
            </div>
            <div className="p-2">

            </div>
            <div className="p-2">
                Soll ein MODEL neue F&auml;higkeiten beherrschen, wie z.B. aus dem Eintrag
            </div>
            <div className="p-2">

            </div>
            <div className="p-2 italic text-gray-400 text-sm">
                &ldquo;
                Um 12 Uhr 40 Minuten hatte K&ouml;nig Friedrich Wilhelm IV ausgelitten. Sr. Majest&auml;t der nun regierende K&ouml;nig Wilhelm geleiteten die

                K&ouml;nigin Wittwe

                , nachdem Allerh&ouml;chstdiese das Beileid der Kgl. Familie empfangen hatte, aus dem Sterbezimmer, versammelten dann die Umgebungen des hochseligen K&ouml;nigs um Sich, und dr&uuml;ckten denselben in der tiefsten Bewegung Allerh&ouml;chstihre ganze Anerkennung f&uuml;r die dem verstorbenen Bruder geleisteten treuen Dienste aus.&rdquo;
            </div>
            <div className="p-2">

            </div>
            <div className="p-2">
                die Antwort zu erzeugen
            </div>
            <div className="p-2">

            </div>
            <div className="p-2 italic text-gray-400 text-sm">
                &ldquo;Nachdem der Tod von K&ouml;nig Friedrich Wilhelm IV. um 12:40 Uhr eingetreten war, empfing Elisabeth von Bayern das Beileid der Familie und verlie&szlig; anschlie&szlig;end mit dem Thronfolger K&ouml;nig Wilhelm I. das Sterbezimmer und trafen sich f&uuml;r Ehrenbekundungen mit den Mitgliedern des Hofes.&rdquo;
            </div>
            <div className="p-2">

            </div>
            <div className="p-2">
                oder eine Frage wie <span className="italic text-gray-400 text-sm">
                    &ldquo;Wer war bei Friedrich Wilhelm dem IV., als er starb?&rdquo;</span>
                zu beantworten, dann braucht es Beispiele, anhand derer es lernen kann.
            </div>
            <div className="p-2">
                Je mehr, desto besser, desto genauer. Das sind die TRAININGSDATEN.
            </div>
            <div className="p-2">
                Wie bei jedem Lernen ist dabei das zu erlernende Grundverst&auml;ndnis, das &lsquo;Know How&rsquo;, wesentlich: wie sollen Informationen dieser Art behandelt werden? . &Auml;hnliche Fakten gleicher Form k&ouml;nnen dann auch &uuml;ber die EMBEDDINGS zur Laufzeit eingebunden werden. Die F&auml;higkeit, sie richtig zu verstehen (und die in den Trainingsdaten enthaltenen Fakten, wenn man sie nicht bereinigt) werden durch das Training des neuen MODELs Teil von dessen Hirnstruktur.
            </div>
            <div className="p-2">

            </div>
            <div className="p-2">
                Daher m&uuml;ssen f&uuml;r spezielle Anwendungen TRAININGSDATEN neu erzeugt werden, die dem erw&uuml;nschten Szenario entsprechen. Was durch kompetente Menschen erfolgen muss.
            </div>
            <div className="p-2">
                F&uuml;r konversationsorientierte Modelle wie Llama sind das zumeist Q&amp;A Paare, Fragen und Antworten, die zus&auml;tzlich nach einigen Parametern (Adjektiven) gewichtet werden (Gut/schlecht, lustig, anst&ouml;&szlig;ig etc.) .
            </div>
            <div className="p-2">

            </div>
            <div className="p-2">
                Im Demonstrator ist eine rudiment&auml;re Verwaltung entsprechender Daten angelegt.
            </div>
            <div className="p-2">

            </div>
            <div className="p-2">
                <div className="p-2">
                    <div className="p-2 text-xl">
                        Die &nbsp;APP
                    </div>
                </div>
            </div>
            <div className="p-2">

            </div>
            <div className="p-2">
                Das hypothetische Anwendungsszenario des Demonstrators ist das folgende:
            </div>
            <div className="p-2">

            </div>
            <div className="p-2">
                Die XML kompatiblen Quellen des Projektes &ldquo;Praktiken der Monarchie&rdquo; k&ouml;nnen von interessierten Wissenschaftlern mit Fragen in moderner Sprache durchsucht werden. Zusammenh&auml;nge und Fakten werden deterministisch ermittelt und mit Quellen belegt.
            </div>
            <div className="p-2">
                Daf&uuml;r wird ein lokales MODEL erweitert und betrieben, die Daten der Akademie werden nicht an externe Systeme gegeben.
            </div>
            <div className="p-2">

            </div>
            <div className="p-2">
                Die APP dient der Evaluation und Bewertung der verschiedenen Basis MODELs, der koordinierten Einbindung der internen Daten &uuml;ber EMBEDDINGS sowie der Erstellung von Frage/Antwort Paaren als TRAININGSDATEN.
            </div>
            <div className="p-2">

            </div>
            <div className="p-2">
                Viel Spa&szlig;! &#x1f642;
            </div>
            <div className="p-2">

            </div>
            <div className="p-2">

            </div>
            <div className="p-2">

            </div>


        </div>
    )
}