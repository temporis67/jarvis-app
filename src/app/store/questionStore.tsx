import {create} from 'zustand';

interface QuestionsState {
    questionItems: [] | null;
    setQuestionItems: (items: [] | null) => void;

    currentQuestionId: string | null;
    setCurrentQuestionId: (id: string | null) => void;

}

const useQuestionStore = create<QuestionsState>(set => ({
    questionItems: null,
    setQuestionItems: (items: [] | null) => set({questionItems: items}),

    currentQuestionId: null,
    setCurrentQuestionId: (id: string | null) => set({currentQuestionId: id}),

}));

export default useQuestionStore;