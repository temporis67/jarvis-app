import {create} from 'zustand';
import {AnswersStoreType} from "@/app/store/answerStore";

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

    rank: number;

    answers: AnswersStoreType | null;

    filter_uuid: string | null;

}

export type QuestionsType = Array<QuestionType>

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


const emptyQuestions: QuestionsType = []

const questionStore = (set: any) => ({
    questions: emptyQuestions,
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
