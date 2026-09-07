/** Keep the final second tied to media time, including seeking, pause and replay. */
export function fadeVolume(currentTime: number, duration: number, baseVolume = 0.5): number {
  if (!Number.isFinite(duration) || duration <= 0) return baseVolume;
  return baseVolume * Math.max(0, Math.min(1, duration - currentTime));
}

export function attachFadeOut(audio: HTMLAudioElement): () => void {
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
