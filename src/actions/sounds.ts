import { Music, Sound } from 'models';

interface PlayOptions {
  volume?: number;
  standalone?: boolean;
}

const standAlonePlayer = new Audio();

function play(fileName: string, options: PlayOptions = {}) {
  const {
    volume = 1,
    standalone = false
  } = options;
  try {
    let soundPlayer: any;
    if (standalone) {
      soundPlayer = standAlonePlayer;
      soundPlayer.src = fileName;
    } else {
      soundPlayer = new Audio(fileName);
    }
    soundPlayer.volume = volume;
    soundPlayer.play();
  } catch (e) {}
}

export function playSound(sound: Sound) {
  play(`./sounds/${sound}.aac`);
}

export function playMusic(music: Music) {
  play(`./musics/${music}.aac`, {
    volume: 0.3,
    standalone: true
  });
}