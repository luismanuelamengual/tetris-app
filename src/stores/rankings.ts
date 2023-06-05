import { MatchResult } from 'models';
import { useStore } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createStore } from 'zustand/vanilla';

interface RankingsStoreState  {
  rankings: Array<MatchResult>;

  addResult: (result: MatchResult) => void;
}

export const RankingsStore = createStore(
  persist(
    immer<RankingsStoreState>((set) => ({
      rankings: [],

      addResult(result: MatchResult) {
        set((state: RankingsStoreState) => {
          state.rankings.push(result);
          state.rankings.sort((r1, r2) => r1.score - r2.score);
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
