import React, {Dispatch, SetStateAction} from "react";
import {useSession} from "next-auth/react";
import useQuestionStore from "@/app/store/questionStore";
import useUserStore from "@/app/store/userStore";



const NewQuestionForm = () => {

    // now we have a 'session' and 'status'
    const {data: session, status} = useSession();

    // connect variables to zustand store
    const user_uuid = useUserStore(state => state.userUuid);
    // handle questionsItems via zustand store
    const questionsItems = useQuestionStore(state => state.questionItems);
    const setQuestionItems = useQuestionStore(state => state.setQuestionItems);



    // handler for new question
    const [newTitle, setNewTitle] = React.useState("");
    const [newContent, setNewContent] = React.useState("");


    const api_host = "http://127.0.0.1:5000/api";
    const api_url = (api_host + "/new_question");

    const new_question = async () => {
        console.log("New Question API fetch() start")

        let formData = new FormData();
        // @ts-ignore
        formData.append("user_uuid", user_uuid);
        formData.append("title", newTitle);
        formData.append("content", newContent);


        try {
            const response = await fetch(api_url, {
                method: "POST",
                body: formData,
                mode: 'cors',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok', await response.json());
            }
            const data = await response.json();
            console.log("New Question API fetch() data OK: ", data);

            let out_items = {};
            Object.keys(data).forEach(key => {
                // @ts-ignore
                out_items[key] = data[key];
            });
            // @ts-ignore
            out_items['creator'] = session.user.name;

            console.log("New Question API fetch() out_items: ", out_items);

            return out_items;

        } catch (error) {
            console.log("Error fetching data:", error);
        }


    };


    // handle title change
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTitle(e.target.value);
    };

    // handle content change
    const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewContent(e.target.value);
    };

    // handle new item addition
    const handleNewQuestion = () => {

        new_question().then((out_items) => {
            console.log("New Question Items: ", out_items);

            // Überprüfen, ob out_items nicht null oder undefined ist, bevor es zu _questionsItems hinzugefügt wird
            if (out_items) {
                // @ts-ignore
                console.log("XXXX New Question Items: ", out_items);
                // @ts-ignore
                const _questionsItems = questionsItems.slice();
                // @ts-ignore
                _questionsItems.unshift(out_items);

                  console.log("YY Result Items: ", _questionsItems);

                // @ts-ignore
                setQuestionItems(_questionsItems);
            }
        }).catch((error) => {
            console.error("Error in handleNewQuestion: ", error);
        });
    };


    return (
        <div>

                {/*Neue Frage*/}
            <div className="flex min-w-0 gap-x-4 mt-6">
                <div className="min-w-0 flex-auto">
                    <p>
                        <label htmlFor="message"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Neue
                            Frage</label>
                        <textarea
                            // @ts-ignore
                            onChange={handleTitleChange}
                            id="message"
                            // @ts-ignore
                            rows="4"
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Schreiben Sie hier..."
                            defaultValue="Was ist ein Ball?"
                        ></textarea>
                    </p>
                    <p>
                        <label htmlFor="content"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Neue
                            Frage</label>
                        <textarea
                            // @ts-ignore
                            onChange={handleContentChange}
                            id="content"
                            // @ts-ignore
                            rows="4"
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            defaultValue={"Ein rundes Objekt"}
                            placeholder="Schreiben Sie hier..."></textarea>
                    </p>
                    <p className={'text-right mt-2'}>
                        <button
                            onClick={handleNewQuestion}
                            className="text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Fragen
                        </button>
                    </p>
                </div>

            </div>


        </div>
    )
}

export default NewQuestionForm;