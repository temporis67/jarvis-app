import create from 'zustand';

interface UserState {
  userUuid: string | null;
  userName: string | null;
  setUserUuid: (uuid: string | null) => void;
  setUserName: (name: string | null) => void;
}

const useUserStore = create<UserState>(set => ({
  userUuid: null,
  setUserUuid: (uuid: string | null) => set({ userUuid: uuid }),
  userName: null,
  setUserName: (name: string | null) => set({ userName: name })

}));

export default useUserStore;