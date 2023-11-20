import create from 'zustand'

//types
export type AnswerType = {
    uuid: string;
    creator: string;
    source: string;
    time_elapsed: string;

    question: string;
    title: string;
    content: string;

    quality: number;
    trust: number;

    dateCreated: string;
    dateUpdated: string;
}
type AnswersType = Array<AnswerType>

export type AnswersStoreType = {
    answers: AnswersType
    setAnswers: (new_answers: AnswersType) => void
    addAnswer: (todo: AnswerType) => void
    delAnswer: (uuid: string) => void
    updateAnswer: (todo: AnswerType) => void

}

const initialAnswers: AnswersType = [
    {
        uuid: "3db7759c-8790-11ee-97f4-047c16bbac51",
        creator: "c382bc64-7817-11ee-b70f-047c16bbac51",
        source: "c382bc64-7817-11ee-b70f-047c16bbac51",

        time_elapsed: "00:50:08",

        question: "cf50b26c-878f-11ee-a0aa-047c16bbac51",

        title: "Der Urknall markiert den Beginn des Universums.",
        content: "Der Urknall, vor etwa 13,8 Milliarden Jahren, markiert den Beginn des Universums. Ursprünglich extrem heiß und dicht, begann das Universum zu expandieren und abzukühlen. Diese Ausdehnung führte zur Bildung der ersten subatomaren Teilchen und später Atome. Mit der Zeit entstanden Sterne und Galaxien. Die Urknalltheorie wird durch Beobachtungen wie die .....",
        quality: 3,
        trust: 50,

        dateCreated: "10:50:33",
        dateUpdated: "10:50:33",
    },

    {
        uuid: "5e2f3b7a-8810-11ee-a1b8-047c16bbac51",
        creator: "7f81c2e6-7801-11ee-8c55-047c16bbac51",
        source: "7f81c2e6-7801-11ee-8c55-047c16bbac51",
        time_elapsed: "01:05:12",
        question: "df60c21e-8791-11ee-b1a4-047c16bbac51",
        title: "Die Entwicklung von Galaxien im Universum",
        content: "Galaxien entstanden aus Dichteunterschieden im frühen Universum nach dem Urknall. Durch die Gravitationskraft zogen sich Gas und Staub zusammen, was zur Bildung der ersten Galaxien führte. Über Milliarden von Jahren entwickelten sie sich weiter, kollidierten und fusionierten, wodurch verschiedene Galaxientypen entstanden.",
        quality: 4,
        trust: 65,
        dateCreated: "11:15:40",
        dateUpdated: "11:16:05",
    },

    {
        uuid: "6a4c88ee-8820-11ee-bf22-047c16bbac51",
        creator: "9a73ebf2-7835-11ee-9d88-047c16bbac51",
        source: "9a73ebf2-7835-11ee-9d88-047c16bbac51",
        time_elapsed: "00:40:30",
        question: "ef70d540-8792-11ee-97e2-047c16bbac51",
        title: "Kosmische Hintergrundstrahlung als Echo des Urknalls",
        content: "Die kosmische Hintergrundstrahlung ist das älteste Licht im Universum, ein Überbleibsel aus der Zeit kurz nach dem Urknall. Diese Strahlung bietet Einblicke in die Bedingungen des frühen Universums und ist ein entscheidender Beleg für die Urknalltheorie.",
        quality: 5,
        trust: 70,
        dateCreated: "12:30:21",
        dateUpdated: "12:31:10",
    },

    {
        uuid: "7c8daefe-8830-11ee-ba32-047c16bbac51",
        creator: "bc64dafe-7859-11ee-a5b7-047c16bbac51",
        source: "bc64dafe-7859-11ee-a5b7-047c16bbac51",
        time_elapsed: "00:35:47",
        question: "ff804672-8793-11ee-bba3-047c16bbac51",
        title: "Elemententstehung in den ersten Minuten des Universums",
        content: "In den ersten Minuten nach dem Urknall entstanden die ersten Elemente. Durch Prozesse wie die Nukleosynthese bildeten sich Wasserstoff, Helium und geringe Mengen an Lithium. Diese Elemente sind die Grundbausteine für alles weitere im Universum.",
        quality: 4,
        trust: 60,
        dateCreated: "13:45:55",
        dateUpdated: "13:46:20",
    },

    {
        uuid: "8e1fc210-8840-11ee-cd44-047c16bbac51",
        creator: "de55f3a4-7883-11ee-bd66-047c16bbac51",
        source: "de55f3a4-7883-11ee-bd66-047c16bbac51",
        time_elapsed: "01:15:03",
        question: "0f90a8a4-8795-11ee-acf1-047c16bbac51",
        title: "Die Rolle der Dunklen Materie im Universum",
        content: "Dunkle Materie, eine unsichtbare Form von Materie, ist entscheidend für das Verständnis der Struktur und Dynamik des Universums. Sie beeinflusst die Gravitationskräfte in Galaxien und Galaxienhaufen und ist ein Schlüsselelement zur Erklärung der beobachteten Verteilung und Bewegung der sichtbaren Materie.",
        quality: 3,
        trust: 55,
        dateCreated: "14:10:33",
        dateUpdated: "14:11:07",
    },

]

const answersStore = (set: any): AnswersStoreType => ({
    answers: initialAnswers,
    setAnswers: (new_answers: AnswersType) => set({answers: new_answers}),
    addAnswer: (answer: AnswerType) => set((state: AnswersStoreType) => ({answers: [answer, ...state.answers]})),
    delAnswer: (uuid: string) => set((state: AnswersStoreType) => ({answers: state.answers.filter(a => a.uuid !== uuid)})),
    updateAnswer: (answer: AnswerType) => set((state: AnswersStoreType) => ({
        answers: state.answers.map(a => {
            let _answer = answer
            if (a.uuid === answer.uuid) {
                _answer = answer
            }
            return _answer
        })
    }))

})

const useAnswersStore= create(answersStore)


export default useAnswersStore

