import { Music, Sound } from 'models';


function play(fileName: string) {
  const soundFile = new Audio(fileName);
  soundFile.play();
}

export function playSound(sound: Sound) {
  play(`./sounds/${sound}.aac`);
}

export function playMusic(music: Music) {
  play(`./musics/${music}.aac`);
}