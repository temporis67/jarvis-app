import {create} from 'zustand'
import { TagStoreType, TagType } from './tagStore';

//types
export type AnswerType = {
    uuid: string;
    status?: string;

    creator_uuid: string | null;
    creator_name: string | null;

    user_uuid: string | null;
    user_name: string | null;

    source: string | null;
    time_elapsed: string;

    question: string;
    title: string;
    content: string;

    quality: number;
    trust: number;
    rank: number;

    date_created: string;
    date_updated: string;

    tags: string[];

    filter_uuid?: string | null;
}


// Answer List
type AnswersType = Array<AnswerType>

export type AnswersStoreType = {
    answers: AnswersType
    current_answer: AnswerType | null
    setCurrentAnswer: (answer: AnswerType) => void
    setAnswers: (new_answers: AnswersType) => void
    addAnswer: (new_answer: AnswerType) => void
    delAnswer: (uuid: string) => void
    updateAnswer: (edited_answer: AnswerType) => void

}


const initialAnswers: AnswersType = [
    {
        uuid: "5e2f3b7a-8810-11ee-a1b8-047c16bbac51",
        status : "ready",
        creator_uuid: "8f81c2e6-7801-11ee-8c55-047c16bbac51",
        creator_name: "SpiCy",
        user_uuid: "7f81c2e6-7801-11ee-8c55-047c16bbac51",
        user_name: "Carlos",
        source: "7f81c2e6-7801-11ee-8c55-047c16bbac51",
        time_elapsed: "01:05:12",
        question: "df60c21e-8791-11ee-b1a4-047c16bbac51",
        title: "Die Entwicklung von Galaxien im Universum",
        content: "Galaxien entstanden aus Dichteunterschieden im frühen Universum. Sie entwickelten sich weiter durch Gravitationskräfte, die Gas und Staub zusammenzogen. Über Milliarden Jahre bildeten sich verschiedene Galaxientypen durch Kollisionen und Fusionen.",
        quality: 4,
        trust: 65,
        date_created: "11:15:40",
        date_updated: "11:16:05",
        rank: 90,
        tags: []
    },
    {
        uuid: "6a4c88ee-8820-11ee-bf22-047c16bbac51",
        status : "loading",
        creator_uuid: "9a73ebf2-7835-11ee-9d88-047c16bbac51",
        creator_name: "Amit",
        user_uuid: "9a73ebf2-7835-11ee-9d88-047c16bbac51",
        user_name: "Amit",
        source: "9a73ebf2-7835-11ee-9d88-047c16bbac51",
        time_elapsed: "00:40:30",
        question: "df60c21e-8791-11ee-b1a4-047c16bbac51",
        title: "Kosmische Hintergrundstrahlung als Echo des Urknalls",
        content: "Die kosmische Hintergrundstrahlung ist das älteste Licht im Universum, ein Überbleibsel aus der Zeit kurz nach dem Urknall. Sie bietet Einblicke in die frühen Bedingungen des Universums und ist ein Beleg für die Urknalltheorie.",
        quality: 5,
        trust: 70,
        date_created: "12:30:21",
        date_updated: "12:31:10",
        rank: 80,
        tags: []
    },
];


const answersStore = (set: any): AnswersStoreType => ({
    answers: [],
    current_answer: null,
    setCurrentAnswer: (answer: AnswerType) => set({current_answer: answer}),

    setAnswers: (new_answers: AnswersType) => set({answers: new_answers}),
    addAnswer: (answer: AnswerType) => set((state: AnswersStoreType) => ({answers: [answer, ...state.answers]})),
    delAnswer: (uuid: string) => set((state: AnswersStoreType) => ({answers: state.answers.filter(a => a.uuid !== uuid)})),
    updateAnswer: (answer: AnswerType) => set((state: AnswersStoreType) => ({        
        answers: state.answers.map(a => {            
            if (a.uuid === answer.uuid) {
                console.log("answerStore.updateAnswer: ", a.uuid)
                return answer    
            }
            return a;            
        })
    }))
    

})

const useAnswersStore= create(answersStore)


export default useAnswersStore


