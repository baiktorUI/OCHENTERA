import { useCallback, useEffect, useRef, useState } from 'react';
import { Disc3, Pause, Play } from 'lucide-react';
import { bingoContent } from '../data/bingoContent';
interface Props {
    currentNumber: number | null;
    paused: boolean;
}
export function MediaPanel({ currentNumber, paused }: Props) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [error, setError] = useState('');
    const [imageError, setImageError] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [time, setTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const content = currentNumber === null ? null : bingoContent[currentNumber];
    const toggle = useCallback(() => {
        const audio = audioRef.current;
        if (!audio || paused)
            return;
        if (audio.paused)
            void audio.play().catch(() => setError('No es pot reproduir l’àudio. Comprova el fitxer o la connexió.'));
        else
            audio.pause();
    }, [paused]);
    useEffect(() => {
        const audio = audioRef.current;
        setError('');
        setImageError(false);
        setTime(0);
        setDuration(0);
        setPlaying(false);
        if (!audio || !content)
            return;
        let active = true;
        audio.volume = .5;
        void audio.play().catch((reason: unknown) => {
            if (active)
                setError(reason instanceof DOMException && reason.name === 'NotAllowedError' ? 'Prem P per escoltar la cançó.' : 'No es pot carregar l’àudio. Comprova el fitxer o la connexió.');
        });
        return () => { active = false; audio.pause(); };
    }, [content]);
    useEffect(() => { if (paused)
        audioRef.current?.pause(); }, [paused]);
    useEffect(() => {
        const onKey = (event: KeyboardEvent) => {
            if (event.repeat || event.ctrlKey || event.metaKey || event.altKey || event.key.toLowerCase() !== 'p' || (event.target instanceof HTMLElement && event.target.closest('input,textarea,select,[contenteditable="true"]')))
                return;
            event.preventDefault();
            toggle();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [toggle]);
    const formatTime = (value: number) => `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`;
    return <section className="media-card" aria-label="Reproductor musical"><div className="media-art">{content && !imageError ? <img key={content.image} src={content.image} alt={`Imatge de la cançó del número ${currentNumber}`} onError={() => setImageError(true)}/> : <div className="record"><Disc3 /><span>ELS TEMES DE SEMPRE.</span></div>}</div><span className="media-badge">{currentNumber ? `CANÇÓ ${String(currentNumber).padStart(2, '0')}` : 'LA BANDA SONORA DE LA FESTA'}</span><div className="audio-controls"><button className="audio-toggle" onClick={toggle} disabled={!content || paused} aria-label={playing ? 'Pausa' : 'Reproduir'}>{playing ? <Pause /> : <Play />}</button><input type="range" aria-label="Posició de la cançó" min={0} max={duration || 0} step="0.1" value={time} disabled={!duration || paused} onChange={event => { const value = Number(event.target.value); if (audioRef.current)
        audioRef.current.currentTime = value; setTime(value); }}/><span>{formatTime(time)} / {formatTime(duration)}</span><kbd>P</kbd></div>{error && <p className="audio-error" role="status">{error}</p>}{content && <audio key={content.song} ref={audioRef} src={content.song} preload="metadata" onPlay={() => { if (paused)
        audioRef.current?.pause();
    else {
        setPlaying(true);
        setError('');
    } }} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onTimeUpdate={event => setTime(event.currentTarget.currentTime)} onLoadedMetadata={event => setDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0)} onError={() => setError('No es pot carregar l’àudio. Comprova el fitxer o la connexió.')}/>}</section>;
}
