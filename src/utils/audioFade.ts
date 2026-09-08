/** Media-time envelope: 0.8s fade in and 1s fade out, including seek and replay. */
export function fadeVolume(currentTime: number, duration: number, baseVolume = 0.5): number {
  const fadeIn = Math.max(0, Math.min(1, currentTime / 0.8));
  const fadeOut = Number.isFinite(duration) && duration > 0
    ? Math.max(0, Math.min(1, duration - currentTime)) : 1;
  return baseVolume * Math.min(fadeIn, fadeOut);
}

export function attachAudioFades(audio: HTMLAudioElement): () => void {
  let frame: number | null = null;
  const update = () => { audio.volume = fadeVolume(audio.currentTime, audio.duration); };
  const stop = () => { if (frame !== null) cancelAnimationFrame(frame); frame = null; };
  const tick = () => {
    update();
    if (!audio.paused && !audio.ended) frame = requestAnimationFrame(tick);
    else frame = null;
  };
  const play = () => { stop(); tick(); };
  const pause = () => { stop(); update(); };
  audio.addEventListener('play', play);
  audio.addEventListener('pause', pause);
  audio.addEventListener('ended', pause);
  for (const event of ['timeupdate', 'seeking', 'seeked', 'loadedmetadata']) audio.addEventListener(event, update);
  update();
  return () => {
    stop();
    audio.removeEventListener('play', play);
    audio.removeEventListener('pause', pause);
    audio.removeEventListener('ended', pause);
    for (const event of ['timeupdate', 'seeking', 'seeked', 'loadedmetadata']) audio.removeEventListener(event, update);
  };
}
