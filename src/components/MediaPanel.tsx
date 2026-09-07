import { useEffect, useRef, useState } from 'react';
import { Disc3, Music2 } from 'lucide-react';
import { bingoContent } from '../data/bingoContent';
interface Props {
    currentNumber: number | null;
    paused: boolean;
}
export function MediaPanel({ currentNumber, paused }: Props) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [error, setError] = useState('');
    const [imageError, setImageError] = useState(false);
    const content = currentNumber === null ? null : bingoContent[currentNumber];
    useEffect(() => {
        const audio = audioRef.current;
        setError('');
        setImageError(false);
        if (!audio || !content)
            return;
        let active = true;
        audio.volume = 0.5;
        audio.play().catch((reason: unknown) => { if (active)
            setError(reason instanceof DOMException && reason.name === 'NotAllowedError' ? 'Pulsa reproducir para escuchar la canción.' : 'No se ha podido cargar el audio. Comprueba el archivo o tu conexión.'); });
        return () => { active = false; audio.pause(); };
    }, [content]);
    useEffect(() => { if (paused)
        audioRef.current?.pause(); }, [paused]);
    return <section className="media-card" aria-label="Reproductor musical"><div className="media-art">{content && !imageError ? <img key={content.image} src={content.image} alt={`Imagen de la canción del número ${currentNumber}`} onError={() => setImageError(true)}/> : <div className="record"><Disc3 size={94} strokeWidth={0.7}/></div>}<span className="media-badge"><Music2 size={13}/>BINGO MUSICAL</span></div><div className="media-info"><p className="eyebrow">{content ? 'LA CANCIÓN DEL NÚMERO' : 'DALE AL PLAY A LOS RECUERDOS'}</p><h2>{currentNumber ? `Temazo ${String(currentNumber).padStart(2, '0')}` : 'La próxima canción te espera'}</h2>{content ? <audio key={content.song} ref={audioRef} src={content.song} controls preload="metadata" onPlay={() => { if (paused)
        audioRef.current?.pause();
    else
        setError(''); }} onError={() => setError('No se ha podido cargar el audio. Comprueba el archivo o tu conexión.')} aria-label={`Reproducir canción ${currentNumber}`}/> : <p>Sortea un número para descubrirla.</p>}{error && <p className="audio-error" role="status">{error}</p>}{paused && <p className="audio-error">Música en pausa durante la celebración.</p>}</div></section>;
}
