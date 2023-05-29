import { KeyboardControls } from 'models';
import { useStore } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createStore } from 'zustand/vanilla';

interface SettingsStoreState  {
  keyboardControls1: KeyboardControls;
  keyboardControls2: KeyboardControls;
  musicVolume: number;
  soundEffectsVolume: number;

  setKeyboardControls1: (keyboardControls: KeyboardControls) => void;
  setKeyboardControls2: (keyboardControls: KeyboardControls) => void;
  setMusicVolume: (volume: number) => void;
  setSoundEffectsVolume: (volume: number) => void;
}

export const SettingsStore = createStore(
  persist(
    immer<SettingsStoreState>((set) => ({
      keyboardControls1: {
        downKeyCode: 'KeyS',
        leftKeyCode: 'KeyA',
        rightKeyCode: 'KeyD',
        rotateKeyCode: 'KeyW'
      },
      keyboardControls2: {
        downKeyCode: 'ArrowDown',
        leftKeyCode: 'ArrowLeft',
        rightKeyCode: 'ArrowRight',
        rotateKeyCode: 'ArrowUp'
      },
      musicVolume: 0.3,
      soundEffectsVolume: 1,

      setKeyboardControls1(keyboardControls: KeyboardControls) {
        set((state: SettingsStoreState) => {
          state.keyboardControls1 = keyboardControls;
        });
      },

      setKeyboardControls2(keyboardControls: KeyboardControls) {
        set((state: SettingsStoreState) => {
          state.keyboardControls2 = keyboardControls;
        });
      },

      setMusicVolume(volume: number) {
        set((state: SettingsStoreState) => {
          state.musicVolume = volume;
        });
      },

      setSoundEffectsVolume(volume: number) {
        set((state: SettingsStoreState) => {
          state.soundEffectsVolume = volume;
        });
      }
    })),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export const useSettingsStore = (selector: (state: SettingsStoreState) => any) => useStore(SettingsStore, selector);
