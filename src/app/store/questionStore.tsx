import {create} from 'zustand';

interface QuestionsState {
  questionItems: [] | null;
  setQuestionItems: (items: [] | null) => void;
}

const useQuestionStore = create<QuestionsState>(set => ({
  questionItems: null,
  setQuestionItems: (items: [] | null) => set({ questionItems: items })
}));

export default useQuestionStore;