import React, {Dispatch, SetStateAction, useEffect} from "react";
import clsx from "clsx";
import {QuestionMarkCircleIcon} from "@heroicons/react/24/outline";
import Moment from "moment/moment";
import {useSession} from "next-auth/react";

type MyPropType = {
    user_uuid:string
    questionsItems: object
    setQuestionItems:  Dispatch<SetStateAction<{ uuid: string; creator: string; title: string; content: string; dateCreated: string; dateUpdated: string; tags: string[]; }[]>>
}


const QuestionList:React.FC<MyPropType> = ({user_uuid, questionsItems, setQuestionItems}) => {

    console.log("@/app/dashboard/components/QuestionList start - UUID: " + user_uuid )
    Moment.locale('de');
    const {data: session, status} = useSession(); // now we have a 'session' and session 'status'


    // fetch data *****************************************************************************************************

    const api_host = "http://127.0.0.1:5000/api";
    const api_url = (api_host + "/questions");
    let formData = new FormData();
    //@ts-ignore
    formData.append("user_uuid", user_uuid);

    const fetchData = async () => {
        console.log("questions/page/fetchData() start")

        try {
            const response = await fetch(api_url, {
                method: "POST",
                body: formData,
                mode: 'cors',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const out_items = Object.values(data); // Wandelt das Objekt in ein Array von Werten um
            for (let q of out_items) {
                console.log("Question: " + q);
                // @ts-ignore
                q['creator'] = session?.user?.name;

            }
            // @ts-ignore
            setQuestionItems(out_items);

            console.log("Erstes Element:", data[Object.keys(data)[0]].title, data[Object.keys(data)[0]].uuid);

        } catch (error) {
            console.log("Error fetching data:", error);
        }
    };


    // execute fetch data on page load
    useEffect(() => {
        fetchData();
    }, []);
    // console.log("API fetched Questions Ende: ")


    // Drag & Drop Handling *******************************************************************************

    // save reference for dragItem and dragOverItem
    const dragItem = React.useRef<any>(null);
    const dragOverItem = React.useRef<any>(null);

    // const handle drag sorting
    const handleSort = () => {
        //duplicate items
        // @ts-ignore
        let _questionsItems = [...questionsItems];

        //remove and save the dragged item content
        const draggedItemContent = _questionsItems.splice(dragItem.current, 1)[0];

        //switch the position
        _questionsItems.splice(dragOverItem.current, 0, draggedItemContent);

        //reset the position ref
        dragItem.current = null;
        dragOverItem.current = null;

        //update the actual array
        setQuestionItems(_questionsItems);
    };

    // Main Component *************************************************************************************************
    return (
        <div>
            <h2>QuestionList2</h2>

            {/*Questions*/}

            {
                // @ts-ignore
                questionsItems.map((question, index) => (

                //@ts-ignore
                <div
                    draggable
                    key={index}
                    onDragStart={(e) => (dragItem.current = index)}
                    onDragEnter={(e) => (dragOverItem.current = index)}
                    onDragEnd={handleSort}
                    onDragOver={(e) => e.preventDefault()}
                    className={clsx(
                        'm-1 p-3 flex grow items-center justify-center gap-2 rounded-md bg-gray-50 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
                        {
                            'bg-sky-50 text-blue-600': index === 0,
                        },
                    )}
                >
                    <div className="flex min-w-0 gap-x-4">
                        <QuestionMarkCircleIcon className="w-6 h-6"/>
                        <div className="min-w-0 flex-auto">
                            <p className="text-sm font-semibold leading-6 text-gray-900">{question.creator}: {question.title}</p>
                            <p className="mt-1 truncate text-xs leading-5 text-gray-500">{question.content}</p>
                        </div>
                    </div>
                    <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                        <p className="text-xs leading-6 text-gray-600">
                            {question.tags ? (
                                    question.tags.map((tag:string) => (
                                        <span key={tag}>
                                    #{tag}&nbsp;
                                </span>
                                    ))
                                ):(<span>
                                    #noTag&nbsp;
                                </span>
                            )}
                        </p>
                        {question.dateUpdated ? (
                            <p className="mt-1 text-xs leading-5 text-gray-500">
                                Updated: <time dateTime={question.dateUpdated}>
                                {
                                    Moment(question.dateUpdated).format('DD.MM.yy HH:mm')
                                }
                            </time>
                            </p>
                        ) : (
                            <p className="mt-1 text-xs leading-5 text-gray-500">
                                Created: <time dateTime={question.dateCreated}>{
                                Moment(question.dateCreated).format('DD.MM.yy HH:mm')
                            }</time>
                            </p>
                        )}
                    </div>
                </div>


            ))}




        </div>
    )
}

export default QuestionList;