import {create} from 'zustand';

interface UserState {
  userUuid: string | null;
  setUserUuid: (uuid: string | null) => void;
}

const useUserStore = create<UserState>(set => ({
  userUuid: null,
  setUserUuid: (uuid: string | null) => set({ userUuid: uuid })
}));

export default useUserStore;