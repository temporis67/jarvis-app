// import React from "react";

import {CalculatorIcon} from "@heroicons/react/24/outline";
import React from "react";
import useAnswersStore from "@/app/store/answersStore";
import useQuestionStore from "@/app/store/questionStore";
import useModelStore from "@/app/store/modelStore";
import {AnswerType} from "@/app/store/answersStore";
import {ModelType} from "@/app/store/modelStore";
import useUserStore from "@/app/store/userStore";


const AskButton = ({questionId}: { questionId: string }) => {

    const api_host = "http://127.0.0.1:5000/api";

    // get current question and current model
    const answers = useAnswersStore(state => state.answers);
    const addAnswer = useAnswersStore(state => state.addAnswer);
    const delAnswer = useAnswersStore(state => state.delAnswer);
    const updateAnswer = useAnswersStore(state => state.updateAnswer);

    const questions = useQuestionStore(state => state.questions);
    // @ts-ignore

    const current_model = useModelStore(state => state.current_model);

    const user_uuid = useUserStore.getState().userUuid;
    const user_name = useUserStore.getState().userName;


    const apiFetch = async (slug: string, formData: FormData): Promise<any> => {
        console.log("API fetch() start", slug);

        if (slug === undefined || slug === null) {
            throw new Error('ERROR: apiFetch(): slug not given: ' + slug);
        }

        const api_url = api_host + "/" + slug; // Assuming api_host is defined elsewhere

        try {
            const response = await fetch(api_url, {
                method: "POST",
                body: formData,
                mode: 'cors',
            });
            if (!response.ok) {
                throw new Error('apiFetch Network response was not ok: ' + await response.json());
            }
            const data = await response.json();
            console.log("API fetch() data OK: ", data);

            return data; // Return the whole response data

        } catch (error) {
            console.log("Error fetching data:", error);
        }
    }


    const handleAskQuestion = async (questionId: string) => {

        console.log("handleAskQuestion questionId: " + questionId);
        // @ts-ignore
        const question = questions?.filter((question: any) => question.uuid === questionId)[0].title;
        // @ts-ignore
        const context = questions?.filter((question: any) => question.uuid === questionId)[0].content;
        const prompt = current_model?.default_prompt.replace("{question}", question).replace("{context}", context);
        console.log("handleAskQuestion prompt: " + prompt);

        // add answer to store with status loading
        const newAnswer: AnswerType = {
            uuid: "",
            status: "loading",
            creator: user_uuid,
            username: user_name,
            // @ts-ignore
            source: current_model.uuid,
            time_elapsed: "",

            question: questionId,
            title: "",
            content: "",
            quality: 0,
            trust: 0,
            dateCreated: "",
            dateUpdated: "",
        }
        addAnswer(newAnswer);

        // set form data
        const formData = new FormData();
        formData.append('question_uuid', questionId);
        formData.append('question', JSON.stringify(question));
        // @ts-ignore
        formData.append('model', JSON.stringify(current_model));
        // @ts-ignore
        formData.append('user_uuid', user_uuid);
        // @ts-ignore
        formData.append('answer', JSON.stringify(newAnswer));
        // @ts-ignore
        formData.append('prompt', prompt);

        // fetch answer from api
        const answer = await apiFetch("ask", formData);
        console.log("answer: ", answer);
        newAnswer.title = answer.title;
        newAnswer.content = answer.content;
        newAnswer.status = "loaded";
        updateAnswer(newAnswer);
        // console.log("answer.uuid: ", answer.uuid);
        // update answer in store
    }


    return (

        <CalculatorIcon className="w-5 h-5 text-gray-400"
            // @ts-ignore
                        onClick={() => handleAskQuestion(questionId)}
                        onMouseOver={(e) => e.currentTarget.style.color = 'red'}
                        onMouseOut={(e) => e.currentTarget.style.color = 'gray'} // Setzen Sie hier die ursprüngliche Farbe
                        title={"Model fragen"}

        />

    )
}

export default AskButton;