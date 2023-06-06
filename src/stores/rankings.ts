import { RankingSlot } from 'models';
import { useStore } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createStore } from 'zustand/vanilla';

interface RankingsStoreState  {
  rankings: Array<RankingSlot>;

  addRankingSlot: (result: RankingSlot) => void;
}

export const RankingsStore = createStore(
  persist(
    immer<RankingsStoreState>((set) => ({
      rankings: [],

      addRankingSlot(slot: RankingSlot) {
        set((state: RankingsStoreState) => {
          state.rankings.push(slot);
          state.rankings.sort((s1, s2) => s1.result.score - s2.result.score);
          state.rankings.splice(10);
        });
      }
    })),
    {
      name: 'rankings-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export const useRankingsStore = (selector: (state: RankingsStoreState) => any) => useStore(RankingsStore, selector);
