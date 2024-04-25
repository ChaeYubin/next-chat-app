import { create } from "zustand";

interface ActiveListStore {
  members: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  set: (ids: string[]) => void;
}

/**
 * 현재 활동 중인 유저 저장 리스트
 */
const useActiveList = create<ActiveListStore>((set) => ({
  members: [],
  add: (id) => set((state) => ({ members: [...state.members, id] })),
  remove: (id) =>
    set((state) => ({ members: state.members.filter((m) => m !== id) })),
  set: (ids) => set({ members: ids }),
}));

export default useActiveList;
