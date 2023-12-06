import {create} from 'zustand';
import {AnswersStoreType} from "@/app/store/answersStore";

//types
export type QuestionType = {
    uuid: string;
    status: string | null;

    creator_uuid: string | null;
    creator_name: string | null;

    time_elapsed: string | null;

    title: string | null;
    content: string | null;

    date_created: string | null;
    date_updated: string | null;

    rank: number | null;

    answers: AnswersStoreType | null;

}

type QuestionsType = Array<QuestionType>

export type  QuestionStoreType = {
    questions: QuestionsType;
    setQuestions: (new_questions: QuestionsType) => void;

    currentQuestionId: string | null;
    setCurrentQuestionId: (id: string | null) => void;
    currentQuestion: QuestionType | null;
    setCurrentQuestion: (question: QuestionType | null) => void;

    addQuestion: (new_question: QuestionType) => void;
    delQuestion: (uuid: string) => void;
    updateQuestion: (edited_question: QuestionType) => void;

}

const initialQuestions: QuestionsType = [
    {
        uuid: "5e2f3b7a-8810-11ee-a1b8-047c16bbac51",
        status : "ready",
        creator_uuid: "7f81c2e6-7801-11ee-8c55-047c16bbac51",
        creator_name: "Carlos",
        time_elapsed: "01:05:12",
        title: "Die Entwicklung von Galaxien im Universum",
        content: "Galaxien entstanden aus Dichteunterschieden im frühen Universum. Sie entwickelten sich weiter durch Gravitationskräfte, die Gas und Staub zusammenzogen. Über Milliarden Jahre bildeten sich verschiedene Galaxientypen durch Kollisionen und Fusionen.",
        date_created: "11:15:40",
        date_updated: "11:16:05",
        rank: 1,
        answers: null,
    },
    {
        uuid: "6a4c88ee-8820-11ee-bf22-047c16bbac51",
        status : "loading",
        creator_uuid: "9a73ebf2-7835-11ee-9d88-047c16bbac51",
        creator_name: "Amit",
        time_elapsed: "00:40:30",
        title: "Die kosmische Hintergrundstrahlung",
        content: "Die kosmische Hintergrundstrahlung ist das älteste Licht im Universum, ein Überbleibsel aus der Zeit kurz nach dem Urknall. Sie bietet Einblicke in die frühen Bedingungen des Universums und ist ein Beleg für die Urknalltheorie.",
        date_created: "11:15:40",
        date_updated: "11:16:05",
        answers: null,
        rank: 1,
    },
]

const questionStore = (set: any) => ({
    questions: [],
    setQuestions: (new_questions: QuestionsType) => set({questions: new_questions}),

    currentQuestionId: null,
    setCurrentQuestionId: (id: string | null) => set({currentQuestionId: id}),
    currentQuestion: null,
    setCurrentQuestion: (question: QuestionType | null) => set({currentQuestion: question}),

    addQuestion: (new_question: QuestionType) => set((state: QuestionStoreType) => ({questions: [ new_question, ...state.questions]})),
    delQuestion: (uuid: string) => set((state: QuestionStoreType) => ({questions: state.questions.filter(question => question.uuid !== uuid)})),
    updateQuestion: (edited_question: QuestionType) => set((state: QuestionStoreType) => ({questions: state.questions.map(question => question.uuid === edited_question.uuid ? edited_question : question)})),
})

const useQuestionStore = create(questionStore)

export default useQuestionStore
