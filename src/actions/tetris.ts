import { goToGameRoomPage } from 'actions/routing';
import { RankingSlot } from 'models';
import { RankingsStore } from 'stores';

export function startNewGame() {
  goToGameRoomPage();
}

export function publishGameResult (slot: RankingSlot) {
  RankingsStore.getState().addRankingSlot(slot);
}