import React, {Dispatch, SetStateAction} from "react";

type MyPropType = {
    questionsItems: object
    setQuestionItems:  Dispatch<SetStateAction<{ uuid: string; creator: string; title: string; content: string; dateCreated: string; dateUpdated: string; tags: string[]; }[]>>
}

const NewQuestionForm:React.FC<MyPropType> = ({questionsItems, setQuestionItems}) => {

    // handler for new question
    const [newQuestion, setNewQuestion] = React.useState("");


    // handle name change
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewQuestion(e.target.value);
    };

    // handle new item addition
    const handleNewQuestion = () => {


        const newQuestionFull = {
            id: Object.keys(questionsItems).length + 1,
            creator: 'Peter',
            title: 'Wo liegt New York?',
            content: `Ich möchte die Freiheitsstatue besuchen. Besonders interessiert mich der Central Park.`,
            dateCreated: '2023-10-15T15:22:56.000Z',
            dateUpdated: '2023-12-15T15:22:56.000Z',
            tags: ['New York', 'Freiheitsstatue', 'Central Park'],
        }
        // @ts-ignore
        const _questionsItems = [...questionsItems];
        _questionsItems.unshift(newQuestionFull);
        setQuestionItems(_questionsItems);
    };


    return (
        <div>
            <h2>NewQuestionForm {}</h2>


            {/*Neue Frage*/}
            <div className="flex min-w-0 gap-x-4 mt-6">
                <div className="min-w-0 flex-auto">
                    <p>
                        <label htmlFor="message"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Neue
                            Frage</label>
                        <textarea
                            // @ts-ignore
                            onChange={handleNameChange}
                            id="message"
                            // @ts-ignore
                            rows="4"
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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