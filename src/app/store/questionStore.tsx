import {create} from 'zustand';

// TODO: add type QuestionType

interface QuestionsState {
    questions: [] | null;
    setQuestions: (items: [] | null) => void;

    currentQuestionId: string | null;
    setCurrentQuestionId: (id: string | null) => void;

}

const useQuestionStore = create<QuestionsState>(set => ({
    questions: null,
    setQuestions: (items: [] | null) => set({questions: items}),

    currentQuestionId: null,
    setCurrentQuestionId: (id: string | null) => set({currentQuestionId: id}),

}));

export default useQuestionStore;