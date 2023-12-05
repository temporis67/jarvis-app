"use client"
import useUserStore from "@/app/store/userStore";


const is_client = typeof window !== "undefined";

export default function Page() {
    console.log("Root Page Start :", process.env.GITHUB_SECRET);

    if (is_client) {
        console.log("Root Page Client :", process.env.REACT_APP_JARVIS_API_HOST);
    }

    return (
        <div className="p-2 text-gray-200">
            <h1 className="p-2 text-2xl">
                Jarvis
            </h1>
            <div className="p-2">

            </div>
            <div className="p-2">
                Im Folgenden wird die grundlegende Architektur eines autark funktionierenden und erweiterbaren Large Language Models vorgestellt und demonstriert.
            </div>
            <div className="p-2">
                Gehen Sie auf den Bereich "Fragen", 
                schreiben Sie eine neue Frage über das Plus-Symbol 
                und lassen Sie dann das oben ausgewählte Model eine Antwort berechnen über das Taschenrechner-Symbol.            
            </div>

            <hr className="mt-3"/>

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

            </div>
            <div className="p-2">
                Vorreiter ist GPT von OpenAI.com - verschiedene Entwicklungsstufen sind im Demonstrator angebunden. Leider ist die Nutzung dieser API kostenpflichtig.
            </div>
            <div className="p-2">
                Das israelische Ai21.com ist frei verf&uuml;gbar und kann (wahrscheinlich) angebunden werden.
            </div>
            <div className="p-2">
                Das chinesische Alibaba.com T5 ist verf&uuml;gbar und kann (wahrscheinlich) angebunden werden.
            </div>
            <div className="p-2">
                Google.com BARD/PaLM2 ist in Europa aus Datenschutzgr&uuml;nden nicht zug&auml;nglich.
            </div>
            <div className="p-2">
                Das Berliner DeepL.com hat ein eigenes, das aber nur f&uuml;r &Uuml;bersetzungen angeboten wird.
            </div>
            <div className="p-2">
                Andere europ&auml;ische (&ouml;ffentliche) Angebote gibt es derzeit nicht.
            </div>
            <div className="p-2">

            </div>
            <div className="p-2">
                Facebook und andere
                jedoch haben
                &nbsp;MODELs unter Open Source Lizenzen ver&ouml;ffentlicht, die seitdem weltweit weiterentwickelt werden. Zahlreiche dieser MODELs sind als 5-20 GB gro&szlig;e Bin&auml;r-Dateien &uuml;ber huggingface.com mit freien Lizenzen verf&uuml;gbar, auch solche von Microsoft oder eben Facebook, zahlreicher jedoch Weiterentwicklungen und iterative Ableitungen der jeweils erfolgreichsten Vorg&auml;nger in vielf&auml;ltigen Spezialisierungen und Themenbereichen.
            </div>
            <div className="p-2">

            </div>
            <div className="p-2">
                Im vorliegenden Demonstrator wird aktuell das MODEL &ldquo;Spicyboros 13B 2.2 - GGUF&rdquo; lokal auf einem regul&auml;ren Linux-Server betrieben. Es ist ein entfernter Nachkomme von Facebooks Llama2 MODEL. &nbsp;Jedes der zahlreichen MODELs auf Huggingface.com kann parallel oder in Reihe (z.B. Frage &rarr; Antwort &rarr; Schlagworte) angebunden werden - sollte die Hardware reichen.
            </div>
            <div className="p-2">

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