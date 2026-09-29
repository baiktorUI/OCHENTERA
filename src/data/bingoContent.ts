import type { BingoNumber } from './types';

const bingoContent: Record<number, BingoNumber> = {};

// Generate content for numbers 1-90
for (let i = 1; i <= 90; i++) {
  bingoContent[i] = {
    song: `${import.meta.env.BASE_URL}assets/audio/number-${i}.mp3`,
    image: `${import.meta.env.BASE_URL}assets/images/number-${i}.jpg`
  };
}

export { bingoContent };
